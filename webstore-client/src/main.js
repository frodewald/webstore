import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSweetalert2 from 'vue-sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css';
import Pagination from 'vue-pagination-2';
import { register } from 'swiper/element/bundle';
register();

Vue.use(VueSweetalert2);

Vue.config.productionTip = false
Vue.component('pagination', Pagination);

// Register currencyFormat as a global filter
Vue.filter('currencyFormat', function (value) {
  if (!value) return '';
  return 'Rp' + Number(value).toLocaleString('id-ID', { minimumFractionDigits: 0 });
});

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
