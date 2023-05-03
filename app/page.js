import cheerio from 'cheerio'
import axios from 'axios'
import {decode} from 'iconv-lite'
import 'bootstrap/dist/css/bootstrap.css'

export const revalidate = 0

const loadData = async (url, responseEncoding = 'utf8', responseType = 'text') => {
    const {data} = await axios.get(url, {
        responseEncoding,
        responseType
    })

    return data;
};

export async function getResult() {
    let result = {
        racek: {},
        opice: {},
        klub: {},
        spravne: {},
        nepal: {}
    };

    let days = []
    let dayIndex = new Date().getDay() - 1;

    ///////////////////////////////////////
    // racek //////////////////////////////
    ///////////////////////////////////////
    const urlRacek = 'https://www.restauraceracek.cz/tydenni-menu/';
    const racekData = await loadData(urlRacek)
    const $racek = cheerio.load(racekData)
    days = ['PONDĚLÍ', 'ÚTERÝ', 'STŘEDA', 'ČTVRTEK', 'PÁTEK']

    const currentDayTr = $racek(":contains(" + days[dayIndex] + ")").closest('tr')
    const polevkaTr = currentDayTr.next().next()
    result.racek.polevka = polevkaTr.text()
    const jidlo1Tr = polevkaTr.next().next()
    result.racek.jidlo1 = jidlo1Tr.children('td').eq(1).text()
    result.racek.cena1 = jidlo1Tr.children('td').eq(2).text()
    const jidlo2Tr = jidlo1Tr.next()
    result.racek.jidlo2 = jidlo2Tr.children('td').eq(1).text()
    result.racek.cena2 = jidlo2Tr.children('td').eq(2).text()
    const jidlo3Tr = jidlo2Tr.next()
    result.racek.jidlo3 = jidlo3Tr.children('td').eq(1).text()
    result.racek.cena3 = jidlo3Tr.children('td').eq(2).text()
    const jidlo4Tr = jidlo3Tr.next()
    result.racek.jidlo4 = jidlo4Tr.children('td').eq(1).text()
    result.racek.cena4 = jidlo4Tr.children('td').eq(2).text()


    ///////////////////////////////////////
    // opice //////////////////////////////
    ///////////////////////////////////////
    const urlOpice = 'https://www.u3opic.cz/denni-menu/';
    const opiceData = await loadData(urlOpice, 'binary', 'arraybuffer')
    const $opice = cheerio.load(decode(opiceData, 'win1250'))

    const menuItemsEl = $opice(".menu-items")
    result.opice.polevka = menuItemsEl.children('div:nth-child(2)').text()
    result.opice.jidlo1 = menuItemsEl.children('div:nth-child(3)').find('h4').text()
    result.opice.cena1 = menuItemsEl.children('div:nth-child(3)').find('.price').text().replace(' Kč', ',-')
    result.opice.jidlo2 = menuItemsEl.children('div:nth-child(4)').find('h4').text()
    result.opice.cena2 = menuItemsEl.children('div:nth-child(4)').find('.price').text().replace(' Kč', ',-')
    result.opice.jidlo3 = menuItemsEl.children('div:nth-child(5)').find('h4').text()
    result.opice.cena3 = menuItemsEl.children('div:nth-child(5)').find('.price').text().replace(' Kč', ',-')

    ///////////////////////////////////////
    // klub ///////////////////////////////
    ///////////////////////////////////////
    const urlKlub = 'https://www.klubcestovatelubrno.cz/denni-menu/';
    const klubData = await loadData(urlKlub)
    const $klub = cheerio.load(klubData)
    days = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek']

    const klubCurrentDay = $klub("h3:contains(" + days[dayIndex] + ")")
    result.klub.polevka = klubCurrentDay.next().text()
    result.klub.jidlo1 = klubCurrentDay.next().next().children(':nth-child(1)').text()
    result.klub.jidlo2 = klubCurrentDay.next().next().children(':nth-child(2)').text()
    result.klub.jidlo3 = klubCurrentDay.next().next().children(':nth-child(3)').text()

    ///////////////////////////////////////
    // správné místo //////////////////////
    ///////////////////////////////////////
    const urlSpravneMisto = 'https://www.spravnemisto.cz/denni-menu';
    const spravneData = await loadData(urlSpravneMisto)
    const $spravne = cheerio.load(spravneData)
    days = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek']

    const spravneCurrentDay = $spravne("h2:contains(" + days[dayIndex] + ")").closest('.elementor-widget-wrap')
    result.spravne.polevka1 = spravneCurrentDay.children(':nth-child(3)').find('li:nth-child(1)').text()
    result.spravne.polevka2 = spravneCurrentDay.children(':nth-child(3)').find('li:nth-child(2)').text()
    result.spravne.jidlo1 = spravneCurrentDay.children(':nth-child(4)').find('li:nth-child(1)').find('.elementor-price-list-description').text()
    result.spravne.cena1 = spravneCurrentDay.children(':nth-child(4)').find('li:nth-child(1)').find('.elementor-price-list-price').text().replace(' Kč', ',-')
    result.spravne.jidlo2 = spravneCurrentDay.children(':nth-child(4)').find('li:nth-child(2)').find('.elementor-price-list-description').text()
    result.spravne.cena2 = spravneCurrentDay.children(':nth-child(4)').find('li:nth-child(2)').find('.elementor-price-list-price').text().replace(' Kč', ',-')
    result.spravne.jidlo3 = spravneCurrentDay.children(':nth-child(4)').find('li:nth-child(3)').find('.elementor-price-list-description').text()
    result.spravne.cena3 = spravneCurrentDay.children(':nth-child(4)').find('li:nth-child(3)').find('.elementor-price-list-price').text().replace(' Kč', ',-')
    result.spravne.jidlo4 = spravneCurrentDay.children(':nth-child(4)').find('li:nth-child(4)').find('.elementor-price-list-description').text()
    result.spravne.cena4 = spravneCurrentDay.children(':nth-child(4)').find('li:nth-child(4)').find('.elementor-price-list-price').text().replace(' Kč', ',-')

    ///////////////////////////////////////
    // nepal //////////////////////////////
    ///////////////////////////////////////
    const urlNepal = 'https://nepalbrno.cz/weekly-menu/';
    const nepalData = await loadData(urlNepal)
    const $nepal = cheerio.load(nepalData)
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

    const nepalCurrentDay = $nepal("span:contains(" + days[dayIndex] + ")").closest('tr')
    result.nepal.polevka = nepalCurrentDay.next().text().replace('Polévka: ', '')
    result.nepal.jidlo1 = nepalCurrentDay.next().next().find('td:nth-child(1)').text().replace('1.', '')
    result.nepal.cena1 = nepalCurrentDay.next().next().find('td:nth-child(2)').text().replace('Kč', ',-')
    result.nepal.jidlo2 = nepalCurrentDay.next().next().next().find('td:nth-child(1)').text().replace('2.', '')
    result.nepal.cena2 = nepalCurrentDay.next().next().next().find('td:nth-child(2)').text().replace('Kč', ',-')
    result.nepal.jidlo3 = nepalCurrentDay.next().next().next().next().find('td:nth-child(1)').text().replace('3.', '')
    result.nepal.cena3 = nepalCurrentDay.next().next().next().next().find('td:nth-child(2)').text().replace('Kč', ',-')
    result.nepal.jidlo4 = nepalCurrentDay.next().next().next().next().next().find('td:nth-child(1)').text().replace('4.', '')
    result.nepal.cena4 = nepalCurrentDay.next().next().next().next().next().find('td:nth-child(2)').text().replace('Kč', ',-')

    Object.entries(result.racek).forEach(([key, value]) => {
        if (value.toLowerCase().includes('raj')) {
            result.racek[key] = value + ' 🍅';
        }
    })
    Object.entries(result.opice).forEach(([key, value]) => {
        if (value.toLowerCase().includes('raj')) {
            result.opice[key] = value + ' 🍅';
        }
    })
    Object.entries(result.spravne).forEach(([key, value]) => {
        if (value.toLowerCase().includes('raj')) {
            result.spravne[key] = value + ' 🍅';
        }
    })
    Object.entries(result.klub).forEach(([key, value]) => {
        if (value.toLowerCase().includes('raj')) {
            result.klub[key] = value + ' 🍅';
        }
    })
    Object.entries(result.nepal).forEach(([key, value]) => {
        if (value.toLowerCase().includes('raj')) {
            result.nepal[key] = value + ' 🍅';
        }
    })

    return result
}

export default async function Home() {
    const result = await getResult()

    return (
        <div className="container">
            <div className="row mb-3 mt-4">
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
                                            href="https://www.restauraceracek.cz/tydenni-menu/">web</a></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <h6 className="ms-2">
                                <small className="text-muted">{result.racek.polevka}</small>
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
                                    <td>{result.racek.jidlo1}</td>
                                    <td>{result.racek.cena1}</td>
                                </tr>
                                <tr>
                                    <td>{result.racek.jidlo2}</td>
                                    <td>{result.racek.cena2}</td>
                                </tr>
                                <tr>
                                    <td>{result.racek.jidlo3}</td>
                                    <td>{result.racek.cena3}</td>
                                </tr>
                                <tr>
                                    <td>{result.racek.jidlo4}</td>
                                    <td>{result.racek.cena4}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
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
                                <small className="text-muted">{result.opice.polevka}</small>
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
                                    <td>{result.opice.jidlo1}</td>
                                    <td>{result.opice.cena1}</td>
                                </tr>
                                <tr>
                                    <td>{result.opice.jidlo2}</td>
                                    <td>{result.opice.cena2}</td>
                                </tr>
                                <tr>
                                    <td>{result.opice.jidlo3}</td>
                                    <td>{result.opice.cena3}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mb-3">
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
                                            href="https://www.klubcestovatelubrno.cz/denni-menu/">web</a></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <h6 className="ms-2">
                                <small className="text-muted">{result.klub.polevka}</small>
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
                                    <td>{result.klub.jidlo1}</td>
                                    <td>149,-</td>
                                </tr>
                                <tr>
                                    <td>{result.klub.jidlo2}</td>
                                    <td>154,-</td>
                                </tr>
                                <tr>
                                    <td>{result.klub.jidlo3}</td>
                                    <td>159,-</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <div className="container">
                                <div className="row justify-content-start">
                                    <div className="col-4">
                                        Správné místo
                                    </div>
                                    <div className="col-8">
                                        <div className="text-end">515 542 979 - <a
                                            href="https://www.spravnemisto.cz/denni-menu">web</a></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <h6 className="ms-2">
                                <small className="text-muted">{result.spravne.polevka1}</small>
                                <br/>
                                <small className="text-muted">{result.spravne.polevka2}</small>
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
                                    <td>{result.spravne.jidlo1}</td>
                                    <td>{result.spravne.cena1}</td>
                                </tr>
                                <tr>
                                    <td>{result.spravne.jidlo2}</td>
                                    <td>{result.spravne.cena2}</td>
                                </tr>
                                <tr>
                                    <td>{result.spravne.jidlo3}</td>
                                    <td>{result.spravne.cena3}</td>
                                </tr>
                                <tr>
                                    <td>{result.spravne.jidlo4}</td>
                                    <td>{result.spravne.cena4}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>


            <div className="row mb-3">
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
                                <small className="text-muted">{result.nepal.polevka}</small>
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
                                    <td>{result.nepal.jidlo1}</td>
                                    <td>{result.nepal.cena1}</td>
                                </tr>
                                <tr>
                                    <td>{result.nepal.jidlo2}</td>
                                    <td>{result.nepal.cena2}</td>
                                </tr>
                                <tr>
                                    <td>{result.nepal.jidlo3}</td>
                                    <td>{result.nepal.cena3}</td>
                                </tr>
                                <tr>
                                    <td>{result.nepal.jidlo4}</td>
                                    <td>{result.nepal.cena4}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">

                </div>
            </div>
        </div>
    )
}
