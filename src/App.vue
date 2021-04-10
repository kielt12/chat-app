<template>
  <div id="app"> 
    <Login v-if="!user"></Login>
    <div v-if="user">
      <router-view/>
    </div>
  </div>
  
</template>

<script>
import Login from './components/Login'
import firebase from './fireBase'

import {ref} from 'vue'
export default {
  components:{Login},
  setup() {
    let user = ref(firebase.auth().currentUser)
    return{user}
  },
}
</script>

<style>
  body {
    
    background-color: #313131;
  }
</style>