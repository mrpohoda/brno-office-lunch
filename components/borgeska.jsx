import cheerio from "cheerio";
import {loadData} from "../utils/load";
import {markTomato} from "../utils/tomato";
import {normalizePrice} from "../utils/normalize";
import {normalize} from "../utils/normalize";

async function getResult() {
    const urlBorgeska = 'https://menubrno.cz/restaurace/0295-restaurace-borgeska';
    const borgeskaData = await loadData(urlBorgeska)
    const $borgeska = cheerio.load(borgeskaData)

    let result = {}
    const menuDiv = $borgeska("#home > div > section > div > div > table > tbody").closest("tbody")
    const soupEL = menuDiv.children("tr")

    result.soup = normalize(soupEL.children('td').eq(0).text())

    const menu1El = soupEL.next()
    result.menu1 = normalize(removeFirst(menu1El.children('td').eq(0).text()))
    result.price1 = normalizePrice(fixPrice(menu1El.children('td').eq(1).text()))
    const menu2El = menu1El.next()
    result.menu2 = normalize(removeFirst(menu2El.children('td').eq(0).text()))
    result.price2 = normalizePrice(fixPrice(menu2El.children('td').eq(1).text()))
    const menu3El = menu2El.next()
    result.menu3 = normalize(removeFirst(menu3El.children('td').eq(0).text()))
    result.price3 = normalizePrice(fixPrice(menu3El.children('td').eq(1).text()))
    const menu4El = menu3El.next()
    result.menu4 = normalize(removeFirst(menu4El.children('td').eq(0).text()))
    result.price4 = normalizePrice(fixPrice(menu4El.children('td').eq(1).text()))

    markTomato(result)

    return result
}

function removeFirst(text) {
    return text.substring(text.indexOf(" ") + 1);
}

function fixPrice(text) {
    text = text.trim()
    return text.substring(0, text.lastIndexOf(" ")) + ",-";
}

export async function Borgeska() {
    const result = await getResult()

    return (
        <div className="col-md-6">
            <div className="card">
                <div className="card-header">
                    <div className="container">
                        <div className="row justify-content-start">
                            <div className="col-4">
                                Borgeska
                            </div>
                            <div className="col-8">
                                <div className="text-end">702 180 560 - <a
                                    href="https://restauraceborgeska.cz/?lang=cs" target="_blank">web</a></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card-body">
                    <h6 className="ms-2">
                        <small className="text-muted">{result.soup}</small>
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
                            <td>{result.menu1}</td>
                            <td>{result.price1}</td>
                        </tr>
                        <tr>
                            <td>{result.menu2}</td>
                            <td>{result.price2}</td>
                        </tr>
                        <tr>
                            <td>{result.menu3}</td>
                            <td>{result.price3}</td>
                        </tr>
                        <tr>
                            <td>{result.menu4}</td>
                            <td>{result.price4}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
