import styles from '../styles/Home.module.css';
import cheerio from 'cheerio'
import axios from 'axios'
import {decode} from 'iconv-lite'

import Head from "next/head";
import 'bootstrap/dist/css/bootstrap.css'

const loadData = async (url, responseEncoding = 'utf8', responseType = 'text') => {
  const { data } = await axios.get(url, {
    responseEncoding,
    responseType
  })

  return data;
};

export async function getStaticProps() {
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

  const currentDayTr = $racek(":contains("+days[dayIndex]+")").closest('tr')
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

  const klubCurrentDay = $klub("h3:contains("+days[dayIndex]+")")
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

  const spravneCurrentDay = $spravne("h2:contains("+days[dayIndex]+")").closest('.elementor-widget-wrap')
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

  const nepalCurrentDay = $nepal("span:contains("+days[dayIndex]+")").closest('tr')
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

  return {
    props: result,
    revalidate: 1, // rerun after X seconds
  }
}

export default function Home(props) {
  return (
    <>
      <Head>
         <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container">
        <div className="row mb-3 mt-4">
          <div className="col-md-6">
            <div class="card">
              <div class="card-header">
                <div class="container">
                  <div class="row justify-content-start">
                    <div class="col-4">
                      Racek
                    </div>
                    <div class="col-8">
                      <div class="text-end">774 052 002 - <a href="https://www.restauraceracek.cz/tydenni-menu/">web</a></div>
                    </div>
                  </div>
                </div>                
              </div>
              <div class="card-body">
                <h6 class="ms-2">
                  <small class="text-muted">{props.racek.polevka}</small>
                </h6>
                <table class="table table-hover card-1 p-4">
                  <thead>
                    <tr>
                      <td scope="col">
                        <span class="ml-8 small">Název</span>
                      </td>
                      <td scope="col">
                        <span class="ml-4 small">Cena</span>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{props.racek.jidlo1}</td>
                      <td>{props.racek.cena1}</td>
                    </tr>
                    <tr>
                      <td>{props.racek.jidlo2}</td>
                      <td>{props.racek.cena2}</td>
                    </tr>
                    <tr>
                      <td>{props.racek.jidlo3}</td>
                      <td>{props.racek.cena3}</td>
                    </tr>
                    <tr>
                      <td>{props.racek.jidlo4}</td>
                      <td>{props.racek.cena4}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div class="card">
              <div class="card-header">
                <div class="container">
                  <div class="row justify-content-start">
                    <div class="col-4">
                      U 3 opic
                    </div>
                    <div class="col-8">
                      <div class="text-end">774 959 555 - <a href="https://www.u3opic.cz/denni-menu/">web</a></div>
                    </div>
                  </div>
                </div>                
              </div>
              <div class="card-body">
                <h6 class="ms-2">
                  <small class="text-muted">{props.opice.polevka}</small>
                </h6>
                <table class="table table-hover card-1 p-4">
                  <thead>
                    <tr>
                      <td scope="col">
                        <span class="ml-8 small">Název</span>
                      </td>
                      <td scope="col">
                        <span class="ml-4 small">Cena</span>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{props.opice.jidlo1}</td>
                      <td>{props.opice.cena1}</td>
                    </tr>
                    <tr>
                      <td>{props.opice.jidlo2}</td>
                      <td>{props.opice.cena2}</td>
                    </tr>
                    <tr>
                      <td>{props.opice.jidlo3}</td>
                      <td>{props.opice.cena3}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <div class="card">
              <div class="card-header">
                <div class="container">
                  <div class="row justify-content-start">
                    <div class="col-4">
                      Klub cestovatelů
                    </div>
                    <div class="col-8">
                      <div class="text-end">774 048 589 - <a href="https://www.klubcestovatelubrno.cz/denni-menu/">web</a></div>
                    </div>
                  </div>
                </div>                
              </div>
              <div class="card-body">
                <h6 class="ms-2">
                  <small class="text-muted">{props.klub.polevka}</small>
                </h6>
                <table class="table table-hover card-1 p-4">
                  <thead>
                    <tr>
                      <td scope="col">
                        <span class="ml-8 small">Název</span>
                      </td>
                      <td scope="col">
                        <span class="ml-4 small">Cena</span>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{props.klub.jidlo1}</td>
                      <td>149,-</td>
                    </tr>
                    <tr>
                      <td>{props.klub.jidlo2}</td>
                      <td>154,-</td>
                    </tr>
                    <tr>
                      <td>{props.klub.jidlo3}</td>
                      <td>159,-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div class="card">
              <div class="card-header">
                <div class="container">
                  <div class="row justify-content-start">
                    <div class="col-4">
                      Správné místo
                    </div>
                    <div class="col-8">
                      <div class="text-end">515 542 979 - <a href="https://www.spravnemisto.cz/denni-menu">web</a></div>
                    </div>
                  </div>
                </div>                
              </div>
              <div class="card-body">
                <h6 class="ms-2">
                  <small class="text-muted">{props.spravne.polevka1}</small>
                  <br />
                  <small class="text-muted">{props.spravne.polevka2}</small>
                </h6>
                <table class="table table-hover card-1 p-4">
                  <thead>
                    <tr>
                      <td scope="col">
                        <span class="ml-8 small">Název</span>
                      </td>
                      <td scope="col">
                        <span class="ml-4 small">Cena</span>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{props.spravne.jidlo1}</td>
                      <td>{props.spravne.cena1}</td>
                    </tr>
                    <tr>
                      <td>{props.spravne.jidlo2}</td>
                      <td>{props.spravne.cena2}</td>
                    </tr>
                    <tr>
                      <td>{props.spravne.jidlo3}</td>
                      <td>{props.spravne.cena3}</td>
                    </tr>
                    <tr>
                      <td>{props.spravne.jidlo4}</td>
                      <td>{props.spravne.cena4}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      

        <div className="row mb-3">
          <div className="col-md-6">
            <div class="card">
              <div class="card-header">
                <div class="container">
                  <div class="row justify-content-start">
                    <div class="col-4">
                      Nepal
                    </div>
                    <div class="col-8">
                      <div class="text-end">774 184 422 - <a href="https://nepalbrno.cz/weekly-menu/">web</a></div>
                    </div>
                  </div>
                </div>                
              </div>
              <div class="card-body">
                <h6 class="ms-2">
                  <small class="text-muted">{props.nepal.polevka}</small>
                </h6>
                <table class="table table-hover card-1 p-4">
                  <thead>
                    <tr>
                      <td scope="col">
                        <span class="ml-8 small">Název</span>
                      </td>
                      <td scope="col">
                        <span class="ml-4 small">Cena</span>
                      </td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{props.nepal.jidlo1}</td>
                      <td>{props.nepal.cena1}</td>
                    </tr>
                    <tr>
                      <td>{props.nepal.jidlo2}</td>
                      <td>{props.nepal.cena2}</td>
                    </tr>
                    <tr>
                      <td>{props.nepal.jidlo3}</td>
                      <td>{props.nepal.cena3}</td>
                    </tr>
                    <tr>
                      <td>{props.nepal.jidlo4}</td>
                      <td>{props.nepal.cena4}</td>
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
    </>
  )
}
