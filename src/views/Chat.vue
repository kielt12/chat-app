<template>
  <div class="container">
    <Modal
      v-if="modalToggle"
      :modalData="modalData"
      :rightButtonFunction="declineCall"
      :leftButtonFunction="videoCall"
    />
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
        <img
          v-if="users.userID !== user.uid"
          @click="call(users)"
          :src="users.photo"
        />
      </div>
    </div>
    <router-view :key="$route.path" />
  </div>
</template>

<script>
import { onMounted, ref, onBeforeMount, reactive } from "vue";
import { useRouter } from "vue-router";
import firebase from "firebase";
import Modal from "../components/Modal";
import { useStore } from "vuex";
export default {
  components: { Modal },
  setup() {
    const messages = ref({});
    const message = ref("");
    const user = ref(firebase.auth().currentUser);
    const db = ref(firebase.firestore());
    const router = useRouter();
    const onlineUsers = ref({});
    const displayName = ref("");
    const receiverID = ref(null);
    const store = useStore();
    const currentRoom = ref("1");
    const Rooms = ref(["Room 1", "Room 2", "Room 3", "Room 4"]);
    const scrollable = ref(null);
    const modalToggle = ref(false);
    const modalData = reactive({
      photo: null,
      title: "Video Call",
      text: null,
      yesBtnText: "Call",
      noBtnText: "Exit",
    });

    onMounted(() => {
      currentRoom.value = router.currentRoute.value.params.name;
      db.value.collection("users").onSnapshot((querySnap) => {
        onlineUsers.value = querySnap.docs.map((doc) => doc.data());
      });
      db.value.collection("calls").onSnapshot((querySnap) => {
        if (!querySnap.empty) {
          querySnap.forEach((doc) => {
            if (doc.data().offer.id === user.value.uid) {
             
              let caller = onlineUsers.value.find(
                (userData) => userData.userID === doc.data().offer.callerID
              );
              modalData.yesBtnText = "Ansewer";
              modalData.noBtnText = "Decline";
              modalData.photo = caller.photo;
              modalData.text = caller.displayName;
              receiverID.value = doc.data().offer.id;
              console.log(receiverID.value)
               toggle();
            }
          });
        }
      });
    });

    const chooseRooms = (room) => {
      currentRoom.value = room;
    };

    const call = (user) => {
      modalData.photo = user.photo;
      modalData.text = user.displayName;
      displayName.value = user.photo;
      store.commit("setCurrentDoc", user);
      toggle()
    };

    const toggle = () => {
      modalToggle.value = modalToggle.value ? false : true;
    };

    const declineCall = () =>{
      toggle()
      store.commit("setCurrentDoc", null)
      if (receiverID.value === user.value.uid) {
        console.log('dd')
        db.value
          .collection("calls")
          .doc(user.value.uid)
          .delete()
          .catch(console.log);
      }
    }

    const videoCall = () => {
      router.push("/videoCall");
      modalToggle.value = modalToggle.value ? false : true;
    };

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
      call,
      displayName,
      modalData,
      toggle,
      modalToggle,
      receiverID,
       declineCall
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
      img {
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