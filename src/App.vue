<template>
  <div id="app">
    <div>
      <router-view />
    </div>
  </div>
</template>

<script>
import firebase from "./fireBase";
import { useRouter, useRoute } from "vue-router";
import { ref } from "vue";
export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const entered = ref(false);
    const db = ref(firebase.firestore());
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (route.name === "Login") {
          if (!entered.value) {
            entered.value = true;
            let currentUser = {
              photo: user.photoURL,
              userID: user.uid,
              displayName: user.displayName,
            };
            db.value.collection("users").doc(user.uid).set(currentUser);
          }
          router.push({
            name: "Chat",
          });
        }
      } else {
        entered.value = false;
        router.push({
          name: "Login",
        });
      }
    });

    return { router };
  },
};
</script>

<style>
*,
*:focus,
*:hover {
  outline: none;
}
body {
  background: linear-gradient(135deg, #111 2.8%, #172368 100%);
  margin: 0;
  padding: 0;
}
</style>
