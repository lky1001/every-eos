import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { IntlProvider, addLocaleData } from 'react-intl'
import initLocale, { getUserLocale } from 'react-intl-locale'
import en from 'react-intl/locale-data/en'
import ko from 'react-intl/locale-data/ko'
import locale from './locales/locale'

import * as Utils from './utils/Utils'
import * as Values from './constants/Values'

import 'bootstrap/dist/css/bootstrap.css'
import 'ionicons/css/ionicons.css'

import eosAgent from './EosAgent'
import eosioStore from './stores/eosioStore'
import accountStore from './stores/accountStore'
import marketStore from './stores/marketStore'
import tradeStore from './stores/tradeStore'

import App from './App'
import './index.scss'

initLocale('en-US', Values.supportLanguage.slice())
addLocaleData([...en, ...ko])

const lang = Utils.getJsonFromUrl().lang

console.log(lang)

let i18nLang

if (lang) {
  i18nLang = lang.split('-')[0]
  localStorage.setItem('locale', lang)
} else {
  const savedLocale = localStorage.getItem('locale')

  if (savedLocale) {
    i18nLang = savedLocale.split('-')[0]
  } else {
    const userLocale = getUserLocale()
    i18nLang = userLocale.split('-')[0]
  }
}

const stores = {
  eosioStore,
  accountStore,
  marketStore,
  tradeStore
}

document.addEventListener('scatterLoaded', async scatterExtension => {
  console.log('scatterloaded')

  if (window.scatter) {
    eosAgent.initScatter(window.scatter)

    if (window.scatter.identity) {
      //eosAgent.initEosAgent(window.scatter.identity)
      await accountStore.login()
    }
  }
})

ReactDOM.render(
  <Provider {...stores}>
    <IntlProvider key={i18nLang} locale={i18nLang} messages={locale[i18nLang]}>
      <App />
    </IntlProvider>
  </Provider>,
  document.getElementById('app')
)
