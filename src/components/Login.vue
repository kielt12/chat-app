<template>
  <div class="login-container">
    <div class="btns-container">
      <button
        @click="googleLoginSubmit"
        @mouseover="googleHover = false"
        @mouseleave="googleHover = true"
      >
        <span v-if="googleHover"> Login with Google </span>
        <img v-else src="../assets/google.png" alt="" />
      </button>
      <div>
        <button
          @click="githubLoginSubmit"
          @mouseover="githubHover = false"
          @mouseleave="githubHover = true"
        >
          <span v-if="githubHover"> Login with GitHub </span>
          <img v-else src="../assets/github.png" alt="" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { useRouter } from "vue-router";
import { ref } from "vue";
export default {
  setup() {
    const router = useRouter();
    const googleHover = ref(true);
    const githubHover = ref(true);
    const googleLoginSubmit = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .catch((error) => {
          console.log(error);
          alert(error.message);
        });
    };

    const githubLoginSubmit = () => {
      const provider = new firebase.auth.GithubAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .catch((error) => {
          console.log(error);
          alert(error.message);
        });
    };

    return {
      googleLoginSubmit,
      router,
      googleHover,
      githubLoginSubmit,
      githubHover,
    };
  },
};
</script>

<style lang="scss">
.login-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(226.42deg, #1b4963 8.93%, #09152f 110.98%);
  text-align: center;
  .btns-container {
    padding-top: 10%;
  }
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
    span {
      height: 100%;
    }
    img {
      height: 24px;
    }
  }
  @media only screen and (max-width: 1200px) {
    .btns-container {
      padding-top: 40%;
    }
  }
}
</style>
