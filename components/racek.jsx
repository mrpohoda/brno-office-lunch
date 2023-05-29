import cheerio from "cheerio";
import {loadData} from "../utils/load";
import {markTomato} from "../utils/tomato";

async function getResult() {
  const urlRacek = 'https://www.restauraceracek.cz/tydenni-menu/';
  const racekData = await loadData(urlRacek)
  const $racek = cheerio.load(racekData)

  let result = {}
  const dayIndex = new Date().getDay() - 1;
  const days = ['Pondělí', 'ÚTERÝ', 'STŘEDA', 'ČTVRTEK', 'PÁTEK']

  const currentDayTr = $racek(":contains(" + days[dayIndex] + ")").closest('tr')
  const polevkaTr = currentDayTr.next().next()
  result.polevka = polevkaTr.text()
  const jidlo1Tr = polevkaTr.next().next()
  result.jidlo1 = jidlo1Tr.children('td').eq(1).text()
  result.cena1 = jidlo1Tr.children('td').eq(2).text()
  const jidlo2Tr = jidlo1Tr.next()
  result.jidlo2 = jidlo2Tr.children('td').eq(1).text()
  result.cena2 = jidlo2Tr.children('td').eq(2).text()
  const jidlo3Tr = jidlo2Tr.next()
  result.jidlo3 = jidlo3Tr.children('td').eq(1).text()
  result.cena3 = jidlo3Tr.children('td').eq(2).text()
  const jidlo4Tr = jidlo3Tr.next()
  result.jidlo4 = jidlo4Tr.children('td').eq(1).text()
  result.cena4 = jidlo4Tr.children('td').eq(2).text()

  markTomato(result)

  return result
}


export async function Racek() {
  const result = await getResult()

  return (
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <div className="container">
              <div className="row justify-content-start">
                <div className="col-4">
                  Racek
                </div>
                <div className="col-8">
                  <div className="text-end">774 052 002 - <a
                      href="https://www.restauraceracek.cz/tydenni-menu/" target="_blank">web</a></div>
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
                <td>{result.cena1}</td>
              </tr>
              <tr>
                <td>{result.jidlo2}</td>
                <td>{result.cena2}</td>
              </tr>
              <tr>
                <td>{result.jidlo3}</td>
                <td>{result.cena3}</td>
              </tr>
              <tr>
                <td>{result.jidlo4}</td>
                <td>{result.cena4}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  )
}
