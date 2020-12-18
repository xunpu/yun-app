import Vue from 'vue'
import App from './App'

import uView from 'uview-ui'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
  uView
})
app.$mount()
