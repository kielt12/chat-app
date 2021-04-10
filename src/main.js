import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import fireBase from "./fireBase"
import store from './store'
import WebRTC from 'vue-webrtc'

let app;

fireBase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App).use(router).use(store).use(WebRTC).mount('#app')

  }
})
