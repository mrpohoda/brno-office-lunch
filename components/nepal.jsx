import * as cheerio from 'cheerio';
import {loadData} from "../utils/load";
import {markTomato} from "../utils/tomato";

async function getResult() {
  let result = {}
  const dayIndex = new Date().getDay() - 1;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  const urlNepal = 'https://nepalbrno.cz/poledni.php';
  const nepalData = await loadData(urlNepal)
  const $nepal = cheerio.load(nepalData)

  const nepalCurrentDay = $nepal("h2:contains(" + days[dayIndex] + ")").closest('div')
  result.polevka = nepalCurrentDay.children('div').eq(2).find('.menu-item').find('h3').text()
  result.jidlo1 = nepalCurrentDay.children('div').eq(0).find('.menu-item').eq(0).find('h3').text()
  result.cena1 = nepalCurrentDay.children('div').eq(0).find('.menu-item').eq(0).find('span').text().replace('Kč', ',-')
  result.jidlo2 = nepalCurrentDay.children('div').eq(0).find('.menu-item').eq(1).find('h3').text()
  result.cena2 = nepalCurrentDay.children('div').eq(0).find('.menu-item').eq(1).find('span').text().replace('Kč', ',-')
  result.jidlo3 = nepalCurrentDay.children('div').eq(1).find('.menu-item').eq(0).find('h3').text()
  result.cena3 = nepalCurrentDay.children('div').eq(1).find('.menu-item').eq(0).find('span').text().replace('Kč', ',-')
  result.jidlo4 = nepalCurrentDay.children('div').eq(1).find('.menu-item').eq(1).find('h3').text()
  result.cena4 = nepalCurrentDay.children('div').eq(1).find('.menu-item').eq(1).find('span').text().replace('Kč', ',-')
  result.jidlo5 = nepalCurrentDay.children('div').eq(1).find('.menu-item').eq(2).find('h3').text()
  result.cena5 = nepalCurrentDay.children('div').eq(1).find('.menu-item').eq(2).find('span').text().replace('Kč', ',-')
  result.jidlo6 = nepalCurrentDay.children('div').eq(1).find('.menu-item').eq(3).find('h3').text()
  result.cena6 = nepalCurrentDay.children('div').eq(1).find('.menu-item').eq(3).find('span').text().replace('Kč', ',-')
  result.jidlo7 = nepalCurrentDay.children('div').eq(3).find('.menu-item').eq(0).find('h3').text()
  result.cena7 = nepalCurrentDay.children('div').eq(3).find('.menu-item').eq(0).find('span').text().replace('Kč', ',-')
  result.jidlo8 = nepalCurrentDay.children('div').eq(3).find('.menu-item').eq(1).find('h3').text()
  result.cena8 = nepalCurrentDay.children('div').eq(3).find('.menu-item').eq(1).find('span').text().replace('Kč', ',-')
  // result.cena1 = nepalCurrentDay.next().next().find('td:nth-child(2)').text().replace('Kč', ',-')
  // result.jidlo2 = nepalCurrentDay.next().next().next().find('td:nth-child(1)').text().replace('2.', '')
  // result.cena2 = nepalCurrentDay.next().next().next().find('td:nth-child(2)').text().replace('Kč', ',-')
  // result.jidlo3 = nepalCurrentDay.next().next().next().next().find('td:nth-child(1)').text().replace('3.', '')
  // result.cena3 = nepalCurrentDay.next().next().next().next().find('td:nth-child(2)').text().replace('Kč', ',-')
  // result.jidlo4 = nepalCurrentDay.next().next().next().next().next().find('td:nth-child(1)').text().replace('4.', '')
  // result.cena4 = nepalCurrentDay.next().next().next().next().next().find('td:nth-child(2)').text().replace('Kč', ',-')
  // result.jidlo5 = nepalCurrentDay.next().next().next().next().next().next().find('td:nth-child(1)').text().replace('4.', '')
  // result.cena5 = nepalCurrentDay.next().next().next().next().next().next().find('td:nth-child(2)').text().replace('Kč', ',-')
  // result.jidlo6 = nepalCurrentDay.next().next().next().next().next().next().next().find('td:nth-child(1)').text().replace('4.', '')
  // result.cena6 = nepalCurrentDay.next().next().next().next().next().next().next().find('td:nth-child(2)').text().replace('Kč', ',-')
  // result.jidlo7 = nepalCurrentDay.next().next().next().next().next().next().next().next().find('td:nth-child(1)').text().replace('4.', '')
  // result.cena7 = nepalCurrentDay.next().next().next().next().next().next().next().next().find('td:nth-child(2)').text().replace('Kč', ',-')
  // result.jidlo8 = nepalCurrentDay.next().next().next().next().next().next().next().next().next().find('td:nth-child(1)').text().replace('4.', '')
  // result.cena8 = nepalCurrentDay.next().next().next().next().next().next().next().next().next().find('td:nth-child(2)').text().replace('Kč', ',-')


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
                      href="https://nepalbrno.cz/weekly-menu/" target="_blank">web</a></div>
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
              <tr>
                <td>{result.jidlo5}</td>
                <td>{result.cena5}</td>
              </tr>
              <tr>
                <td>{result.jidlo6}</td>
                <td>{result.cena6}</td>
              </tr>
              <tr>
                <td>{result.jidlo7}</td>
                <td>{result.cena7}</td>
              </tr>
              <tr>
                <td>{result.jidlo8}</td>
                <td>{result.cena8}</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  )
}
