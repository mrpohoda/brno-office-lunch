import cheerio from "cheerio";
import {loadData} from "../utils/load";
import {markTomato} from "../utils/tomato";

async function getResult() {
  let result = {}
  const dayIndex = new Date().getDay() - 1;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  const urlNepal = 'https://nepalbrno.cz/weekly-menu/';
  const nepalData = await loadData(urlNepal)
  const $nepal = cheerio.load(nepalData)

  const nepalCurrentDay = $nepal("span:contains(" + days[dayIndex] + ")").closest('tr')
  result.polevka = nepalCurrentDay.next().text().replace('Polévka: ', '')
  result.jidlo1 = nepalCurrentDay.next().next().find('td:nth-child(1)').text().replace('1.', '')
  result.cena1 = nepalCurrentDay.next().next().find('td:nth-child(2)').text().replace('Kč', ',-')
  result.jidlo2 = nepalCurrentDay.next().next().next().find('td:nth-child(1)').text().replace('2.', '')
  result.cena2 = nepalCurrentDay.next().next().next().find('td:nth-child(2)').text().replace('Kč', ',-')
  result.jidlo3 = nepalCurrentDay.next().next().next().next().find('td:nth-child(1)').text().replace('3.', '')
  result.cena3 = nepalCurrentDay.next().next().next().next().find('td:nth-child(2)').text().replace('Kč', ',-')
  result.jidlo4 = nepalCurrentDay.next().next().next().next().next().find('td:nth-child(1)').text().replace('4.', '')
  result.cena4 = nepalCurrentDay.next().next().next().next().next().find('td:nth-child(2)').text().replace('Kč', ',-')

  markTomato(result)

  return result
}


export async function Nepal() {
  const result = await getResult()

  return (
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <div className="container">
              <div className="row justify-content-start">
                <div className="col-4">
                  Nepal
                </div>
                <div className="col-8">
                  <div className="text-end">774 184 422 - <a
                      href="https://nepalbrno.cz/weekly-menu/">web</a></div>
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
