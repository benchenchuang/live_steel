// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import '@/plugins/dialogDrag.js'
import divDrag from "@/plugins/drag.js"
Vue.directive("divDrag", divDrag)

import less from 'less'
Vue.use(less)

Vue.config.productionTip = false
Vue.use(ElementUI);
/* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>'
// })

new Vue({
  router,
  render: h => h(App)
}).$mount("#app")
