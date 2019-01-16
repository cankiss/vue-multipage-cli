import Vue from 'vue'
import App from './app'

import '@/assets/css/normalize.css'
import '@/assets/css/common.less'
import '@/assets/css/variable.less'

Vue.config.productionTip = false
Vue.prototype.$prefix = process.env.assetsRoot

new Vue({
    el: "#app",
    render: h => h(App)
})