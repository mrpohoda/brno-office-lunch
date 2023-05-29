import cheerio from "cheerio";
import {loadData} from "../utils/load";
import {markTomato} from "../utils/tomato";
import {normalize} from "../utils/normalize";

async function getResult() {
  let result = {}
  const dayIndex = new Date().getDay() - 1;
  const days = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek']

  const urlKlub = 'https://www.klubcestovatelubrno.cz/denni-menu/';
  const klubData = await loadData(urlKlub)
  const $klub = cheerio.load(klubData)

  const klubCurrentDay = $klub("h3:contains(" + days[dayIndex] + ")")
  result.polevka = normalize(klubCurrentDay.next().text())
  result.jidlo1 = klubCurrentDay.nextAll('ol').first().children(':nth-child(1)').text()
  result.jidlo2 = klubCurrentDay.nextAll('ol').first().children(':nth-child(2)').text()
  result.jidlo3 = klubCurrentDay.nextAll('ol').first().children(':nth-child(3)').text()

  markTomato(result)

  return result
}

export async function Klub() {
  const result = await getResult()

  return (
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <div className="container">
              <div className="row justify-content-start">
                <div className="col-4">
                  Klub cestovatelů
                </div>
                <div className="col-8">
                  <div className="text-end">774 048 589 - <a
                      href="https://www.klubcestovatelubrno.cz/denni-menu/" target="_blank">web</a></div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-body">
            <h6 className="ms-2">
              <small className="text-muted">{result.polevka}</small>
            </h6>
            <table className="table table-hover card-1 p-4">
              <thead>
              <tr>
                <td scope="col">
                  <span className="ml-8 small">Název</span>
                </td>
                <td scope="col">
                  <span className="ml-4 small">Cena</span>
                </td>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>{result.jidlo1}</td>
                <td>149,-</td>
              </tr>
              <tr>
                <td>{result.jidlo2}</td>
                <td>154,-</td>
              </tr>
              <tr>
                <td>{result.jidlo3}</td>
                <td>159,-</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  )
}
