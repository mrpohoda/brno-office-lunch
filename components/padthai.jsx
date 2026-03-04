import * as cheerio from 'cheerio';
import {loadData} from "../utils/load";
import {markTomato} from "../utils/tomato";
import {ErrorCard} from "./error-card";

async function getResult() {
  const dayIndex = new Date().getDay() // 1=Po, 2=Út, ... 5=Pá

  const urlPadThai = 'https://padthairestaurace.cz/denni-menu'
  const html = await loadData(urlPadThai)
  if (!html) return null

  const $padThai = cheerio.load(html)

  let dataMenu = null
  $padThai('script').each((i, el) => {
    if (dataMenu) return
    const content = $padThai(el).html() || ''
    if (!content.includes('dataMenu')) return

    const startIdx = content.indexOf('const dataMenu =')
    if (startIdx === -1) return
    const objStart = content.indexOf('{', startIdx)
    if (objStart === -1) return

    let depth = 0, endIdx = -1
    for (let j = objStart; j < content.length; j++) {
      if (content[j] === '{') depth++
      else if (content[j] === '}') { depth--; if (depth === 0) { endIdx = j; break } }
    }
    if (endIdx === -1) return

    try {
      dataMenu = new Function('return ' + content.substring(objStart, endIdx + 1))()
    } catch {}
  })

  if (!dataMenu || !dataMenu[dayIndex]) return { polevka: '', dishes: [] }

  const day = dataMenu[dayIndex]
  const polevka = day.Polevka?.name || ''
  const dishes = (day.HlavniChody || []).map(item => ({
    name: item.name,
    price: item.price + ',-'
  }))

  const result = { polevka, dishes }
  markTomato(result)
  return result
}

export async function PadThai() {
  let result
  try {
    result = await getResult()
  } catch {
    return <ErrorCard name="Pad Thai" />
  }
  if (!result) return <ErrorCard name="Pad Thai" />
  if (result.dishes.length === 0) return <ErrorCard name="Pad Thai" message="Menu pro dnešní den není dostupné" url="https://padthairestaurace.cz/denni-menu" />

  return (
      <div className="col-md-6">
        <div className="border-start border-3 border-info ps-3 mb-4">
          <div className="d-flex justify-content-between align-items-baseline mb-1">
            <strong>Pad Thai</strong>
            <span className="text-muted small"><a href="https://padthairestaurace.cz/denni-menu" target="_blank" rel="noopener noreferrer">web</a></span>
          </div>
          <hr className="mt-0 mb-2" />
          {result.polevka && <div className="text-muted small mb-2">Polévka: {result.polevka}</div>}
          {result.dishes.map((dish, i) => (
            <div key={i} className="d-flex justify-content-between gap-2 mb-1">
              <span>{dish.name}</span>
              <span className="text-nowrap flex-shrink-0">{dish.price}</span>
            </div>
          ))}
        </div>
      </div>
  )
}
