import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import './assets/style.css';
import VeeValidate from 'vee-validate';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faHome,
  faUser,
  faUserPlus,
  faSignInAlt,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'

Vue.use(FloatingVue)

const options = {
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  transition: "Vue-Toastification__bounce",
  maxToasts: 20,
  newestOnTop: true
};

Vue.use(Toast, options);

library.add(faHome, faUser, faUserPlus, faSignInAlt, faSignOutAlt);

Vue.config.productionTip = false;

Vue.use(VeeValidate);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');