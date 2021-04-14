<template>
  <div class="container">
    <div class="sectiona">
      <div class="rooms">
        <ul
          v-for="(room, index) in Rooms"
          :key="index"
          @click="chooseRooms(index + 1)"
        >
          <router-link
            :to="{
              name: 'Chatroom',
              params: { id: 'room' + index + 1, name: index + 1 },
            }"
          >
            <li>
              {{ room }}
            </li>
            <img v-show="currentRoom == index + 1" src="../assets/Star.png" />
            <img v-show="currentRoom != index + 1" src="../assets/Star1.png" />
          </router-link>
        </ul>
      </div>
      <div class="online-users" v-for="users in onlineUsers" :key="users">
        <img @click="call(users.userID)" :src="users.photo" />
      </div>
    </div>
    <router-view :key="$route.path" />
  </div>
</template>

<script>
import { onMounted, ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import firebase from "firebase";
export default {
  setup() {
    const messages = ref({});
    const message = ref("");
    const user = ref(firebase.auth().currentUser);
    const db = ref(firebase.firestore());
    const router = useRouter();
    const onlineUsers = ref({});
    const videoCall = ref([]);
    const currentRoom = ref("1");
    const Rooms = ref(["Room 1", "Room 2", "Room 3", "Room 4"]);
    const scrollable = ref(null);

    onMounted(() => {
      console.log(currentRoom.value);
      currentRoom.value = router.currentRoute.value.params.name;
      db.value.collection("users").onSnapshot((querySnap) => {
        onlineUsers.value = querySnap.docs.map((doc) => doc.data());
        console.log(onlineUsers.value);
      });
    });

    const chooseRooms = (room) => {
      currentRoom.value = room;
    };

    const call = (user) =>{
      console.log(user)
    }

    onBeforeMount(() => {
      let paramName = 1;
      if (router.currentRoute.value.params.name !== undefined) {
        paramName = router.currentRoute.value.params.name;
      }
      router.push({
        name: "Chatroom",
        params: {
          id: "room" + paramName,
          name: paramName,
        },
      });
    });

    return {
      messages,
      message,
      scrollable,
      user,
      Rooms,
      currentRoom,
      chooseRooms,
      router,
      db,
      videoCall,
      onlineUsers,
      call
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

      border-bottom: 1px solid black;
    }
    img {
      height: 17px;
      margin-right: 17px;
    }
    li {
      margin-bottom: 10px;
      color: #fff;
    }
    a {
      display: flex;
      width: 100%;
      text-decoration: none;
      justify-content: space-between;
    }
  }
  .online-users {
    margin-left: 1.2rem;

    display: inline;
    img {
      border-radius: 12px;
      height: 24px;
      margin-bottom: 0.7rem;
      cursor: pointer;
    }
  }
  @media only screen and (max-width: 840px) {
    .sectiona {
      li {
        display: none;
      }
      img{
        margin-bottom: 0.7rem;
      }
      .online-users {
        img {
          margin-left: 0.9rem;
        }
      }
    }
  }
}


</style>