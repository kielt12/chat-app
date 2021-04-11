import { createRouter, createWebHistory } from "vue-router";


const routes = [
  {
  path: "/ee",
  name: "Test",
  component: () =>
    import(/* webpackChunkName: "about" */ "../views/Test.vue")
},

  {
    path: "/",
    name: "Chat",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/Chat.vue"),
      children:[
        {
          path: "room:name",
          
          // meta: { requiresAuth: true },
          name: "Chatroom",
          component: () =>
            import(
              /* webpackChunkName: "Chat.vue*" */ "../views/Home.vue"
            ),
        },
      ]
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
