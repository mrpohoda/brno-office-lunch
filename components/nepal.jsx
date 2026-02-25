import * as cheerio from 'cheerio';
import {loadData} from "../utils/load";
import {markTomato} from "../utils/tomato";
import {ErrorCard} from "./error-card";

async function getResult() {
  const dayIndex = new Date().getDay() - 1;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  const urlNepal = 'https://nepalbrno.cz/NepalBrno/poledni.php';
  const nepalData = await loadData(urlNepal)
  if (!nepalData) return null
  const $nepal = cheerio.load(nepalData)

  const nepalCurrentDay = $nepal(".day-title:contains(" + days[dayIndex] + ")").closest('.day-section')

  const polevkaGroup = nepalCurrentDay.find('.category-group').filter((i, el) => {
    return $nepal(el).find('.category-name').text().trim() === 'POLEVKA'
  })
  const polevka = polevkaGroup.find('.menu-item h3').first().text().replace('Polévka:', '').trim()

  const dishes = []
  nepalCurrentDay.find('.category-group').each((i, categoryGroup) => {
    if ($nepal(categoryGroup).find('.category-name').text().trim() === 'POLEVKA') return
    $nepal(categoryGroup).find('.menu-item').each((j, item) => {
      dishes.push({
        name: $nepal(item).find('h3').text().trim(),
        price: Math.round(parseFloat($nepal(item).find('span').text())) + ',-',
      })
    })
  })

  const result = { polevka, dishes }
  markTomato(result)

  return result
}


export async function Nepal() {
  let result
  try {
    result = await getResult()
  } catch {
    return <ErrorCard name="Nepal" />
  }
  if (!result) return <ErrorCard name="Nepal" />
  if (result.dishes.length === 0) return <ErrorCard name="Nepal" message="Menu pro dnešní den není dostupné" phone="774 184 422" url="https://nepalbrno.cz/NepalBrno/poledni.php" />

  return (
      <div className="col-md-6">
        <div className="border-start border-3 border-warning ps-3 mb-4">
          <div className="d-flex justify-content-between align-items-baseline mb-1">
            <strong>Nepal</strong>
            <span className="text-muted small">774 184 422 · <a href="https://nepalbrno.cz/NepalBrno/poledni.php" target="_blank">web</a></span>
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
