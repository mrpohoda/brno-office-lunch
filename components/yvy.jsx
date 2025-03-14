import * as cheerio from 'cheerio';
import {loadData} from "../utils/load";
import {markTomato} from "../utils/tomato";

async function getResult() {
    const urlYvy = 'https://www.yvy.cz/denni-menu/';
    const yvyData = await loadData(urlYvy)
    const $yvy = cheerio.load(yvyData)

    let result = {}
    const dayIndex = new Date().getDay() - 1;
    const days = ['Pondělí', 'Uterý', 'Středa', 'Čtvrtek', 'Pátek']

    const currentDayEl = $yvy(":contains(" + days[dayIndex] + ")").closest('tr')
    const soupEL = currentDayEl.next().next()
    result.soup = soupEL.children('td').eq(1).text()

    const menu1El = soupEL.next()
    result.menu1 = menu1El.children('td').eq(1).text()
    result.price1 = menu1El.children('td').eq(3).text()
    const menu2El = menu1El.next()
    result.menu2 = menu2El.children('td').eq(1).text()
    result.price2 = menu2El.children('td').eq(3).text()
    const menu3El = menu2El.next()
    result.menu3 = menu3El.children('td').eq(1).text()
    result.price3 = menu3El.children('td').eq(3).text()

    markTomato(result)

    return result
}

export async function Yvy() {
    const result = await getResult()

    return (
        <div className="col-md-6">
            <div className="card">
                <div className="card-header">
                    <div className="container">
                        <div className="row justify-content-start">
                            <div className="col-4">
                                YVY
                            </div>
                            <div className="col-8">
                                <div className="text-end">775 140 931 - <a
                                    href="https://www.yvy.cz/denni-menu/" target="_blank">web</a></div>
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
                        { result.menu3 ?
                            <tr>
                                <td>{result.menu3}</td>
                                <td>{result.price3}</td>
                            </tr> : null
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
