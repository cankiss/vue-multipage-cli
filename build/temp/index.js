import Vue from 'vue'
import App from './app'

import '@/utils/rem'
import '@/assets/css/normalize.css'
import '@/assets/css/common.css'

import 'babel-polyfill'

Vue.config.productionTip = false

new Vue({
    ...App
}).$mount('#app')