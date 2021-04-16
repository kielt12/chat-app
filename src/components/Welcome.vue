<template>
  <div class="hello">
    <img src="../assets/logo2.png">
    <h1>Welcome to My ChatRoom App</h1>
    <p>
      For a guide on how to use this app ,<br />
      check out the
      <a href="https://github.com/kielt12/ChatApp" target="_blank" rel="noopener"
        >chatroom app documentation</a
      >.
    </p>
    <h3>Some of the tecknolgoys used</h3>
    <ul>
      <li>
        <a href="https://router.vuejs.org" target="_blank" rel="noopener"
          >vue-router</a
        >
      </li>
      <li>
        <a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a>
      </li>
      <li>
        <a
          href="https://github.com/vuejs/vue-devtools#vue-devtools"
          target="_blank"
          rel="noopener"
          >vue-devtools</a
        >
      </li>
      <li>
        <a href="https://firebase.google.com/" target="_blank" rel="noopener"
          >firebase</a
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Welcome",
};
</script>

<style lang="scss" scoped>
.hello {
  margin-top: 12px;
  width: 90%;
  text-align: center;
  color: #fff;
  h3 {
    margin: 40px 0 0;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
}


@media only screen and (max-width: 800px) {
  img{
      
      width:400px
  }
}

@media only screen and (max-width: 520px) {
  img{
      
      width:300px
  }
}
</style>
