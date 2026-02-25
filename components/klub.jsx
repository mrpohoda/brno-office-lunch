import * as cheerio from 'cheerio';
import {loadData} from "../utils/load";
import {markTomato} from "../utils/tomato";
import {normalize} from "../utils/normalize";
import {ErrorCard} from "./error-card";

async function getResult() {
  const dayIndex = new Date().getDay() - 1;
  const days = ['pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek']

  const urlKlub = 'https://www.klubcestovatelubrno.cz/denni-menu/';
  const klubData = await loadData(urlKlub)
  if (!klubData) return null
  const $klub = cheerio.load(klubData)

  const tydenni = $klub('strong:contains("Týdenní nabídka")').closest('p')
  let tydenNazev = '', tydenCena = ''
  if (tydenni.length) {
    const strongy = tydenni.find('strong')
    tydenNazev = strongy.first().text().replace('Týdenní nabídka:', '').trim()
    tydenCena = strongy.last().text().trim()
  }

  const klubCurrentDay = $klub("h3:contains(" + days[dayIndex] + ")")
  const polevka = normalize(klubCurrentDay.next().text())

  const dishes = []
  klubCurrentDay.nextAll('ol').first().find('li').each((i, li) => {
    dishes.push($klub(li).text().trim())
  })

  const result = { polevka, dishes, tydenNazev, tydenCena }
  markTomato(result)

  return result
}

export async function Klub() {
  let result
  try {
    result = await getResult()
  } catch {
    return <ErrorCard name="Klub cestovatelů" />
  }
  if (!result) return <ErrorCard name="Klub cestovatelů" />
  if (result.dishes.length === 0) return <ErrorCard name="Klub cestovatelů" message="Menu pro dnešní den není dostupné" phone="774 048 589" url="https://www.klubcestovatelubrno.cz/denni-menu/" />

  return (
      <div className="col-md-6">
        <div className="border-start border-3 border-success ps-3 mb-4">
          <div className="d-flex justify-content-between align-items-baseline mb-1">
            <strong>Klub cestovatelů</strong>
            <span className="text-muted small">774 048 589 · <a href="https://www.klubcestovatelubrno.cz/denni-menu/" target="_blank">web</a></span>
          </div>
          <hr className="mt-0 mb-2" />
          {result.polevka && <div className="text-muted small mb-2">Polévka: {result.polevka}</div>}
          {result.tydenNazev && (
            <div className="d-flex justify-content-between gap-2 mb-1 text-muted fst-italic">
              <span><small>Týdenní:</small> {result.tydenNazev}</span>
              <span className="text-nowrap flex-shrink-0">{result.tydenCena}</span>
            </div>
          )}
          {result.dishes.map((dish, i) => (
            <div key={i} className="d-flex justify-content-between gap-2 mb-1">
              <span>{dish}</span>
              <span className="text-nowrap flex-shrink-0">{['149,-', '154,-', '159,-'][i] ?? ''}</span>
            </div>
          ))}
        </div>
      </div>
  )
}
