<template>
  <div class="login-container">
    <button @click="loginSubmit"
    @mouseover="hover = false"
    @mouseleave="hover = true"
    >
      
      <span v-if="hover">
        Login with Google!
      </span>
      <img v-else src="../assets/google.png" alt="">
      
      </button>
  </div>
</template>

<script>
import firebase from "firebase";
import { useRouter } from "vue-router";
import { ref } from 'vue';
export default {
  setup() {
    const router = useRouter();
    const hover = ref(true)
    const loginSubmit = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider).catch(console.log);
    };

    return {
      loginSubmit,
      router,
      hover
      
    };
  },
};
</script>

<style lang="scss">
.login-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(226.42deg, #1B4963 8.93%, #09152F 110.98%);
  text-align: center;
  button {
    margin-top: 50px;
    width: 50%;
    background: linear-gradient(135deg, #111 2.8%, #172368 100%);
    color: white;
    font-weight: bold;
    font-size: 18pt;
    padding: 20px;
    border-radius: 15px;
    border: none;
    box-shadow: #00000040 0px 5px 10px;
    cursor: pointer;

    &:hover {
      background: #fff;
      color: transparent;
    }
    span{
      height: 100%;
    }
    img{
      height: 24px;
    }
  }
}
</style>
