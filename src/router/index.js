import { createRouter, createWebHistory } from "vue-router";
 import firebase from "firebase";
//import Store from "../store/index";

const routes = [
  
  {
    path: "/login",
    name: "Login",
    component: () =>
      import(/* webpackChunkName: "about" */ "../components/Login.vue"),
  },
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
          import(/* webpackChunkName: "Chat.vue*" */ "../views/Home.vue"),
      },
      {
        path: "/videoCall",
        name: "Test",
        component: () =>
          import(/* webpackChunkName: "about" */ "../views/Test.vue"),
      },

    ],
  },
];


const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  firebase
});
router.beforeResolve((to, from,next) =>{
  next()
})
export default router;
