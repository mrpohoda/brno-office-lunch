import {loadData} from "../utils/load";
import {markTomato} from "../utils/tomato";
import {getCachedMenu} from "../utils/menuCache";
import {ErrorCard} from "./error-card";
import {VoteSection} from "./vote-section";


async function getResult() {
  const dayIndex = new Date().getDay() // 1=Po, 2=Út, ... 5=Pá

  const jsonText = await loadData('https://padthairestaurace.cz/data.json')
  if (!jsonText) return null

  let json
  try {
    json = typeof jsonText === 'string' ? JSON.parse(jsonText) : jsonText
  } catch {
    return null
  }

  const day = json.days?.[String(dayIndex)]
  if (!day) return { polevka: '', dishes: [], weeklySpecials: [] }

  const polevka = day.polevka?.cs?.name || ''
  const dishes = (day.hlavniChody || []).map(h => ({
    name: h.cs?.name || '',
    desc: h.cs?.desc || '',
    price: h.price + ',-'
  }))
  const specials = (json.weeklySpecials || []).map(s => ({
    name: s.cs?.name || '',
    desc: s.cs?.desc || '',
    price: s.price + ',-'
  }))

  const result = { polevka, dishes, weeklySpecials: specials }
  markTomato(result)
  return result
}

export async function PadThai() {
  let result
  try {
    result = await getCachedMenu('padthai-menu', getResult)
  } catch {
    return <ErrorCard name="Pad Thai" />
  }
  if (!result) return <ErrorCard name="Pad Thai" />
  if (result.dishes.length === 0) return <ErrorCard name="Pad Thai" message="Menu pro dnešní den není dostupné" url="https://padthairestaurace.cz/denni-menu" />

  return (
      <div className="col-md-6">
        <div className="border-start border-3 border-info ps-3 mb-4" style={{background: 'rgba(13,202,240,0.07)', borderRadius: '0 6px 6px 0', padding: '10px 10px 10px 12px'}}>
          <div className="d-flex justify-content-between align-items-baseline mb-1">
            <strong>Pad Thai</strong>
            <span className="text-muted small"><a href="https://padthairestaurace.cz/denni-menu" target="_blank" rel="noopener noreferrer">web</a></span>
          </div>
          <hr className="mt-0 mb-2" />

          {result.weeklySpecials.length > 0 && (
            <div className="mb-3">
              <div className="text-muted small fst-italic mb-1">Týdenní speciální nabídka</div>
              {result.weeklySpecials.map((dish, i) => (
                <div key={i} className="mb-1">
                  <div className="d-flex justify-content-between gap-2">
                    <span>{dish.name}</span>
                    <span className="text-nowrap flex-shrink-0">{dish.price}</span>
                  </div>
                  {dish.desc && <div className="text-muted small">{dish.desc}</div>}
                </div>
              ))}
              <hr className="mt-2 mb-2" />
            </div>
          )}

          {result.polevka && <div className="text-muted small mb-2">Polévka: {result.polevka}</div>}
          {result.dishes.map((dish, i) => (
            <div key={i} className="mb-1">
              <div className="d-flex justify-content-between gap-2">
                <span>{dish.name}</span>
                <span className="text-nowrap flex-shrink-0">{dish.price}</span>
              </div>
              {dish.desc && <div className="text-muted small">{dish.desc}</div>}
            </div>
          ))}
          <VoteSection restaurantKey="padthai" />
        </div>
      </div>
  )
}
