import {getRedis} from '../utils/redis'
import {revalidatePath} from 'next/cache'
import Anthropic from '@anthropic-ai/sdk'
import axios from 'axios'

const PROMPT = `Přečti týdenní jídelníček z tohoto obrázku.
Vrať POUZE validní JSON v tomto formátu (bez markdown bloku, bez komentářů):
{"1":{"polevka":"název polévky nebo prázdný řetězec","dishes":[{"name":"název jídla","price":"149,-"}]},"2":{},"3":{},"4":{},"5":{}}
Klíče 1–5 odpovídají po–pá. Ceny formátuj jako "149,-". Pokud den nemá polévku, použij prázdný řetězec.`

async function updateMenu(formData) {
    'use server'
    const imageUrl = formData.get('url')?.trim()
    if (!imageUrl) return

    try {
        // Facebook blokuje přímý přístup z Anthropic — stáhneme obrázek sami
        const imageResponse = await axios.get(imageUrl, {responseType: 'arraybuffer', timeout: 15000})
        const imageBase64 = Buffer.from(imageResponse.data).toString('base64')
        const mediaType = imageResponse.headers['content-type']?.split(';')[0] || 'image/jpeg'

        const client = new Anthropic({apiKey: process.env.ANTHROPIC_API_KEY})
        const response = await client.messages.create({
            model: 'claude-opus-4-5',
            max_tokens: 2048,
            messages: [{
                role: 'user',
                content: [
                    {type: 'image', source: {type: 'base64', media_type: mediaType, data: imageBase64}},
                    {type: 'text', text: PROMPT}
                ]
            }]
        })

        const text = response.content[0].text.trim()
        console.log('[Camel] Claude raw response:', text)

        // Claude někdy obalí JSON do ```json...``` i přes instrukci — odstraníme wrapper
        const jsonStr = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/m, '').trim()
        const parsed = JSON.parse(jsonStr)
        parsed.updatedAt = new Date().toISOString()

        const redis = getRedis()
        await redis.set('camel-menu', JSON.stringify(parsed), 'EX', 8 * 24 * 60 * 60)
        revalidatePath('/')
        console.log('[Camel] Menu uloženo do Redis')
    } catch (err) {
        console.error('[Camel] updateMenu selhal:', err)
    }
}

async function clearMenu() {
    'use server'
    const redis = getRedis()
    await redis.del('camel-menu')
    revalidatePath('/')
}

export async function Camel() {
    let menu = null
    try {
        const redis = getRedis()
        const raw = redis ? await redis.get('camel-menu') : null
        menu = raw ? JSON.parse(raw) : null
    } catch {
        // Redis není dostupný (lokální vývoj bez env proměnných)
    }

    const dayIndex = new Date().getDay()
    const todayMenu = menu?.[dayIndex]

    return (
        <div className="col-md-6">
            <div className="border-start border-3 border-secondary ps-3 mb-4">
                <div className="d-flex justify-content-between align-items-baseline mb-1">
                    <strong>Camel</strong>
                    <span className="text-muted small">
                        {menu?.updatedAt && (
                            <span className="me-2 opacity-50" style={{fontSize: '0.7rem'}}>
                                aktualizováno {new Date(menu.updatedAt).toLocaleDateString('cs-CZ')}
                            </span>
                        )}
                        <a href="https://www.facebook.com/CamelRestauraceBrno" target="_blank" rel="noopener noreferrer">web</a>
                    </span>
                </div>
                <hr className="mt-0 mb-2"/>

                {todayMenu ? (
                    <>
                        {todayMenu.polevka && (
                            <div className="text-muted small mb-2">Polévka: {todayMenu.polevka}</div>
                        )}
                        {(todayMenu.dishes || []).map((dish, i) => (
                            <div key={i} className="d-flex justify-content-between gap-2 mb-1">
                                <span>{dish.name}</span>
                                <span className="text-nowrap flex-shrink-0">{dish.price}</span>
                            </div>
                        ))}
                        <form action={clearMenu} className="mt-3">
                            <button type="submit" className="btn btn-link btn-sm p-0 text-muted opacity-50"
                                    style={{fontSize: '0.75rem'}}>
                                Aktualizovat menu
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <div className="text-muted small mb-2">
                            Vlož URL obrázku týdenního menu z Facebooku:
                        </div>
                        <form action={updateMenu} className="d-flex gap-2 flex-wrap">
                            <input
                                name="url"
                                type="url"
                                placeholder="https://..."
                                className="form-control form-control-sm"
                                style={{minWidth: 0, flex: 1}}
                                required
                            />
                            <button type="submit" className="btn btn-sm btn-outline-secondary flex-shrink-0">
                                Načíst
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}
