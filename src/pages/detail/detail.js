import Vue from 'vue'
import App from './app'

import '@/utils/rem'
import '@/assets/css/normalize.css'
import '@/assets/css/common.css'

import 'babel-polyfill'

import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
    routes: [{
            path: '/',
            component: () =>
                import ('./viewOne.vue')
        },
        {
            path: '/two',
            component: () =>
                import ('./viewTwo.vue')
        }
    ]
})


Vue.config.productionTip = false

new Vue({
    ...App,
    router
}).$mount('#app')