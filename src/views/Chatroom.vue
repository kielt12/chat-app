<template>
  <div class="sectionb">
    <div class="topbar">
      <span> Room {{ router.currentRoute.value.params.name }} </span>
      <div @click="logout">
        <img :src="user.photoURL" />
      </div>
    </div>
    <div class="messagechat">
      <div
        v-for="(msg, index) in messages"
        :key="'index-' + index"
        :class="['message', sentOrReceived(msg.userUID)]"
      >
        <img :src="msg.photoURL" :alt="msg.displayName" />
        <p>{{ msg.text }}</p>
      </div>

      <div ref="scrollable"></div>
    </div>
    <div class="botbar">
      <input
        v-model="message"
        type="text"
        placeholder="Enter your message!"
        @keydown.enter="sendMessage"
      />
      <button @click="sendMessage"></button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { useRouter } from "vue-router";
import { ref, onMounted, computed, onUpdated } from "vue";
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const scrollable = ref(null);
    const db = ref(firebase.firestore());
    const user = ref(firebase.auth().currentUser);
    const messages = ref({});
    const message = ref("");
    const newMsgReceived = ref(true);
    const collection = ref("Room" + router.currentRoute.value.params.name);

    onUpdated(() => {
      if (newMsgReceived.value) {
        scrollable.value.scrollIntoView();
        newMsgReceived.value = false;
      }
    });

    onMounted(() => {
      db.value
        .collection(collection.value)
        .orderBy("createdAt")
        .onSnapshot((querySnap) => {
          messages.value = querySnap.docs.map((doc) => doc.data());
          newMsgReceived.value = true;
        });
    });

    const sendMessage = async () => {
      if (message.value !== "") {
        const messageInfo = {
          userUID: user.value.uid,
          photoURL: user.value.photoURL,
          text: message.value,
          createdAt: Date.now(),
        };
        await db.value.collection(collection.value).add(messageInfo);

        message.value = "";
        scrollable.value.scrollIntoView({ behavior: "smooth" });
      }
    };

    const logout = async () => {
      await firebase.auth().signOut();
      db.value
        .collection("users")
        .doc(user.value.uid)
        .delete()
        .catch(console.log);
    };

    const sentOrReceived = (userUID) => {
      return userUID === user.value.uid ? "sent" : "received";
    };

    return {
      user,
      scrollable,
      db,
      message,
      messages,
      sentOrReceived,
      sendMessage,
      collection,
      router,
      logout,
      store,
      currentUser: computed(() => store.getters.getUser),
    };
  },
};
</script>

<style lang="scss">
.sectionb {
  height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #111 2.8%, #172368 100%);
}
.topbar {
  display: flex;
  height: 47px;
  padding-left: 10px;
  padding-right: 10px;

  justify-content: space-between;
  border-bottom: 1px solid rgba(0, 0, 0, 0.144);

  img {
    height: 25px;
    margin-top: 10px;
    border-radius: 12px;
    cursor: pointer;
  }
  span {
    padding-top: 12px;
    color: #fff;
    font-size: 25px;
    font-family: Akronim;
  }
}

.messagechat {
  overflow-y: scroll;
  scrollbar-width: none;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #111 2.8%, #172368 100%);
  height: 87%;
}

.messagechat::-webkit-scrollbar {
  overflow-y: scroll;
}

.botbar {
  padding-left: 20px;
  width: 94%;
  display: flex;
  input {
    width: 100%;
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    border: none;
    background: rgba(255, 255, 255, 0.07);
    height: 40px;
    padding-left: 25px;
    color: white;
    line-height: 12px;

    font-size: 16px;
  }
  button {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    height: 42px;
    cursor: pointer;
    width: 40px;
    background: rgba(255, 255, 255, 0.07);
    border: none;
    background-size: 17px;
    background-image: url("../assets/Subtract2.png");
    background-repeat: no-repeat;
    background-position: center;
  }
}
.message {
  display: flex;
  align-items: center;
  &.received {
    p {
      background: #a7a3a3;
      color: #000;
      overflow-wrap: break-word;
      text-align: left;
    }
  }

  &.sent {
    flex-direction: row-reverse;

    p {
      text-align: left;
      color: #fff;
      background: #0b93f6;
      align-self: flex-end;
      overflow-wrap: break-word;
    }
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 2px 5px;
  }

  p {
    max-width: 500px;
    margin-bottom: 12px;
    line-height: 24px;
    padding: 10px 20px;
    border-radius: 15px;
    position: relative;
    color: #fff;
    text-align: center;
  }
}

@media only screen and (max-width: 800px) {
  .message {
    p {
      max-width: 250px;
    }
  }
}
@media only screen and (max-width: 520px) {
  .botbar {
    padding-left: 20px;
    width: 90%;
    display: flex;
  }
  .message {
    p {
      max-width: 100px;
    }
  }
}
</style>
