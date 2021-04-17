import { createRouter, createWebHistory } from "vue-router";
import firebase from "firebase";
import store from "../store/index";

const routes = [
  {
    path: "",
    name: "Chat",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Chat.vue"),
    children: [
      {
        path: "room:name",
        name: "Chatroom",
        component: () =>
          import(/* webpackChunkName: "Chat*" */ "../views/Chatroom.vue"),
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "login" */ "../components/Login.vue"),
  },
  {
    name: "webCall",
    component: () =>
      import(/* webpackChunkName: "wewbcall" */ "../views/WebCall.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.afterEach((to, from) => {
  if (to.name === "Chat" && from.name === "webCall") {
    const callId = store.getters.getCurrentDoc;
    firebase.firestore().collection("calls").doc(callId).delete();
    window.location.reload();
  }
});

export default router;
