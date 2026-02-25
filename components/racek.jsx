import * as cheerio from 'cheerio';
import {loadData} from "../utils/load";
import {markTomato} from "../utils/tomato";
import {ErrorCard} from "./error-card";

async function getResult() {
  const urlRacek = 'https://www.restauraceracek.cz/tydenni-menu/';
  const racekData = await loadData(urlRacek)
  if (!racekData) return null

  const $racek = cheerio.load(racekData)

  const dayIndex = new Date().getDay() - 1;
  const days = ['PONDĚLÍ', 'ÚTERÝ', 'STŘEDA', 'ČTVRTEK', 'PÁTEK']

  let inCurrentDay = false, soupFound = false, polevka = ''
  const dishes = []

  $racek('tr').each((i, tr) => {
    const c = $racek(tr).children('td')
    const col0 = c.eq(0).text().trim()
    const col1 = c.eq(1).text().trim()
    const col2 = c.eq(2).text().trim()

    if (col1 === days[dayIndex] && col0 === '' && col2 === '') { inCurrentDay = true; return }
    if (!inCurrentDay) return
    if (days.includes(col1) && col0 === '' && col2 === '') return false  // příští den — stop

    if (!soupFound && col1 && col0 === '' && col2 === '') { polevka = col1; soupFound = true; return }
    if (col0 && col1 && col2) dishes.push({ name: col1, price: col2 })
  })

  const result = { polevka, dishes }
  markTomato(result)

  return result
}


export async function Racek() {
  let result
  try {
    result = await getResult()
  } catch {
    return <ErrorCard name="Racek" />
  }
  if (!result) return <ErrorCard name="Racek" />
  if (result.dishes.length === 0) return <ErrorCard name="Racek" message="Menu pro dnešní den není dostupné" phone="774 052 002" url="https://www.restauraceracek.cz/tydenni-menu/" />

  return (
      <div className="col-md-6">
        <div className="border-start border-3 border-danger ps-3 mb-4">
          <div className="d-flex justify-content-between align-items-baseline mb-1">
            <strong>Racek</strong>
            <span className="text-muted small">774 052 002 · <a href="https://www.restauraceracek.cz/tydenni-menu/" target="_blank">web</a></span>
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
