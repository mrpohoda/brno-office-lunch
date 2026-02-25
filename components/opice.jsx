import * as cheerio from 'cheerio';
import {loadData} from "../utils/load";
import {decode} from "iconv-lite";
import {markTomato} from "../utils/tomato";
import {ErrorCard} from "./error-card";

async function getResult() {
  const urlOpice = 'https://www.u3opic.cz/denni-menu/';
  const opiceData = await loadData(urlOpice, 'binary', 'arraybuffer')
  if (!opiceData) return null
  const $opice = cheerio.load(decode(opiceData, 'win1250'))

  const dayIndex = new Date().getDay() - 1;
  const dayNames = ['pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek']

  let inCurrentDay = false, polevka = ''
  const dishes = []

  $opice('.menu-items .menu-item').each((i, item) => {
    const h2 = $opice(item).find('h2')
    if (h2.length) {
      if (h2.text().toLowerCase().includes(dayNames[dayIndex])) { inCurrentDay = true }
      else if (inCurrentDay) return false  // příští den — stop
      return
    }
    if (!inCurrentDay) return
    const name = $opice(item).find('h4').text().trim()
    const price = $opice(item).find('.price').text().trim().replace(' Kč', ',-')
    if (name && !price && !polevka) { polevka = name; return }
    if (name && price) dishes.push({ name: removeFirst(name), price })
  })

  const result = { polevka, dishes }
  markTomato(result)

  return result
}

function removeFirst(text) {
  return text.substring(text.indexOf(" ") + 1);
}

export async function Opice() {
  let result
  try {
    result = await getResult()
  } catch {
    return <ErrorCard name="U 3 opic" />
  }
  if (!result) return <ErrorCard name="U 3 opic" />
  if (result.dishes.length === 0) return <ErrorCard name="U 3 opic" message="Menu pro dnešní den není dostupné" phone="774 959 555" url="https://www.u3opic.cz/denni-menu/" />

  return (
      <div className="col-md-6">
        <div className="border-start border-3 border-primary ps-3 mb-4">
          <div className="d-flex justify-content-between align-items-baseline mb-1">
            <strong>U 3 opic</strong>
            <span className="text-muted small">774 959 555 · <a href="https://www.u3opic.cz/denni-menu/" target="_blank">web</a></span>
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
