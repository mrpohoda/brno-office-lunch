import styles from '../styles/Home.module.css';
import cheerio from 'cheerio'
import axios from 'axios'
import {decode} from 'iconv-lite'

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
    spravne: {}
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
  const jidlo2Tr = jidlo1Tr.next()
  result.racek.jidlo2 = jidlo2Tr.children('td').eq(1).text()
  const jidlo3Tr = jidlo2Tr.next()
  result.racek.jidlo3 = jidlo3Tr.children('td').eq(1).text()
  const jidlo4Tr = jidlo3Tr.next()
  result.racek.jidlo4 = jidlo4Tr.children('td').eq(1).text()


  ///////////////////////////////////////
  // opice //////////////////////////////
  ///////////////////////////////////////
  const urlOpice = 'https://www.u3opic.cz/denni-menu/';
  const opiceData = await loadData(urlOpice, 'binary', 'arraybuffer')
  const $opice = cheerio.load(decode(opiceData, 'win1250'))

  const menuItemsEl = $opice(".menu-items")
  result.opice.polevka = menuItemsEl.children('div:nth-child(2)').text()
  result.opice.jidlo1 = menuItemsEl.children('div:nth-child(3)').find('h4').text()
  result.opice.jidlo2 = menuItemsEl.children('div:nth-child(4)').find('h4').text()
  result.opice.jidlo3 = menuItemsEl.children('div:nth-child(5)').find('h4').text()

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
  result.spravne.jidlo2 = spravneCurrentDay.children(':nth-child(4)').find('li:nth-child(2)').find('.elementor-price-list-description').text()
  result.spravne.jidlo3 = spravneCurrentDay.children(':nth-child(4)').find('li:nth-child(3)').find('.elementor-price-list-description').text()

  return {
    props: result,
    revalidate: 1, // rerun after X seconds
  }
}

export default function Home(props) {
  return (
    <div className={styles.container}>
      <main>
        <p><a href="https://www.restauraceracek.cz/tydenni-menu/">Racek</a></p>
        <p>polévka: {props.racek.polevka}</p>
        <p>{props.racek.jidlo1}</p>
        <p>{props.racek.jidlo2}</p>
        <p>{props.racek.jidlo3}</p>
        <p>{props.racek.jidlo4}</p>

        <p><a href="https://www.u3opic.cz/denni-menu/">U 3 opic</a></p>
        <p>polévka: {props.opice.polevka}</p>
        <p>{props.opice.jidlo1}</p>
        <p>{props.opice.jidlo2}</p>
        <p>{props.opice.jidlo3}</p>

        <p><a href="https://www.klubcestovatelubrno.cz/denni-menu/">Klub cestovatelů</a></p>
        <p>polévka: {props.klub.polevka}</p>
        <p>{props.klub.jidlo1}</p>
        <p>{props.klub.jidlo2}</p>
        <p>{props.klub.jidlo3}</p>

        <p><a href="https://www.spravnemisto.cz/denni-menu">Správné místo</a></p>
        <p>polévka 1: {props.spravne.polevka1}</p>
        <p>polévka 2: {props.spravne.polevka2}</p>
        <p>{props.spravne.jidlo1}</p>
        <p>{props.spravne.jidlo2}</p>
        <p>{props.spravne.jidlo3}</p>
      </main>

      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  )
}
