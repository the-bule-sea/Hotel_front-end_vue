import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import router from './router';

Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
  router,//重点重点！这里一定要引入，不然路由失效
  render: h => h(App),
}).$mount('#app')
