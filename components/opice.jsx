import cheerio from "cheerio";
import {loadData} from "../utils/load";
import {decode} from "iconv-lite";
import {markTomato} from "../utils/tomato";

async function getResult() {
  const urlOpice = 'https://www.u3opic.cz/denni-menu/';
  const opiceData = await loadData(urlOpice, 'binary', 'arraybuffer')
  const $opice = cheerio.load(decode(opiceData, 'win1250'))

  let result = {}

  const menuItemsEl = $opice(".menu-items")
  result.polevka = menuItemsEl.children('div:nth-child(2)').text()
  result.jidlo1 = menuItemsEl.children('div:nth-child(3)').find('h4').text()
  result.cena1 = menuItemsEl.children('div:nth-child(3)').find('.price').text().replace(' Kč', ',-')
  result.jidlo2 = menuItemsEl.children('div:nth-child(4)').find('h4').text()
  result.cena2 = menuItemsEl.children('div:nth-child(4)').find('.price').text().replace(' Kč', ',-')
  result.jidlo3 = menuItemsEl.children('div:nth-child(5)').find('h4').text()
  result.cena3 = menuItemsEl.children('div:nth-child(5)').find('.price').text().replace(' Kč', ',-')

  markTomato(result)

  return result
}


export async function Opice() {
  const result = await getResult()

  return (
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <div className="container">
              <div className="row justify-content-start">
                <div className="col-4">
                  U 3 opic
                </div>
                <div className="col-8">
                  <div className="text-end">774 959 555 - <a
                      href="https://www.u3opic.cz/denni-menu/">web</a></div>
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
  )
}
