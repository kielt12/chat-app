<template>
  <div class="container">
    <div class="sectiona">
      <div class="rooms">
        <ul v-for="(room, index) in Rooms" :key="index" @click="chooseRooms(index+1)">
        <li :id="index" :style="{color: user.uid !== store.state.chatstore.a  ? '': 'red'}">{{ room }}</li>
          <img v-show="currentRoom == (index+1)" src="../assets/Star.png" alt="" />
          <img v-show="currentRoom != (index+1)" src="../assets/Star1.png" alt="" />
        </ul>
      </div>
       
    </div>
      <router-view :key="$route.path" />
   
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRouter, } from "vue-router";
import firebase from "firebase";
import { useStore } from 'vuex'
// import * as io from 'socket.io-client'
//   window.io = io
export default {
  setup() {

    let messages = ref({});
    let message = ref("");
    let user = ref(firebase.auth().currentUser);
    let router = useRouter()
    let currentRoom = ref("1");
    let Rooms = ref(["Room 1", "Room 2", "Room 3", "Room 4"]);
    let scrollable = ref(null);
    const store = useStore()
    onMounted(()=>{
      currentRoom.value = router.currentRoute.value.params.name
      console.log(store.state.chatstore.a)
    })

   

    const chooseRooms = (room) => {
      currentRoom.value = room;
      router.push({
        name: "Chatroom",
        params: {
          id: "room"+room,
          name: room
        },
      });
    };

   

    
    return {
      messages,
      message,
      scrollable,
      user,
      Rooms,
      currentRoom,
      chooseRooms,
      router,
      store
    };
  },
};
</script>



<style lang="scss">
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
}

*,
*:focus,
*:hover {
  outline: none;
}

.container {
  display: flex;
  .sectiona {
    flex-basis: 25%;
    height: 100vh;
    background: #2e3036;

    .rooms {
      cursor: pointer;
    }
    ul {
      list-style: none;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid black;
    }
    img {
      height: 17px;
      margin-right: 17px;
      color: saddlebrown;
      
    }
    li {
      margin-bottom: 10px;
      color: #fff;
    }
  }
}
</style>