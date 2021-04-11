<template>
 <div class="sectionb">
  <div class="topbar">
      <span>
          Room {{router.currentRoute.value.params.name}}
      </span>
    <div @click="logout">
      <img :src="user.photoURL" />
    </div>
  </div>
  <div class="messagechat">
    <div
      v-for="(msg, index) in messages"
      v-bind:key="'index-' + index"
      :class="['message', sentOrReceived(msg.userUID)]"
    >
      <img :src="msg.photoURL" :alt="msg.displayName" />
      <p>{{ msg.text }}</p>
    </div>

    <div ref="scrollable"></div>
  </div>
  <span class="botbar">
    <input
      v-model="message"
      type="text"
      placeholder="Enter your message!"
      @keydown.enter="sendMessage(event)"
    />
  </span>
  </div>
</template>

<script>
import firebase from "firebase";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

export default {
  setup() {
    const router = useRouter()
    const scrollable = ref(null);
    const db = ref(firebase.firestore());
    const user = ref(firebase.auth().currentUser);
    const messages = ref({});
    const message = ref("");
    const collection = ref('Room'+router.currentRoute.value.params.name)
    

    onMounted(  () => {
      db.value
        .collection(collection.value)
        .orderBy("createdAt")
        .onSnapshot((querySnap) => {
          messages.value = querySnap.docs.map((doc) => doc.data());
        });       
    });


    const sendMessage = async () => {
        
      if (message.value !== "") {
        const messageInfo = {
          userUID: user.value.uid,
          displayName: user.value.displayName,
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
      window.location.reload();
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
    };
  },
};
</script>

<style lang="scss">
.sectionb {
    height: 100vh;
    width: 100%;
    background: #37393f;
  }
  .topbar {
    display: flex;
    height: 47px;
    padding-left: 10px;
    padding-right: 10px;
    background: #37393f;
    justify-content: space-between;
    border-bottom: 1px solid rgba(0, 0, 0, 0.144);
    div {
      color: blanchedalmond;
    }
    img {
      height: 25px;
      margin-top: 10px;
      border-radius: 12px;
      cursor: pointer;
    }
    span{
        padding-top:12px ;
        color: #fff;
        font-size: 25px;
        font-family: Akronim;
    }
  }

  .messagechat {
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    background: #37393f;
    height: 87%;
  }

  .botbar {
    padding-left: 20px;
    input {
      width: 95%;
      border-radius: 8px;
      border: none;
      background: #2e3036;
      height: 40px;
      padding-left: 25px;
      color: white;
      line-height: 12px;
      font-size: 16px;
    }
  }
  .message {
    display: flex;
    align-items: center;
  
    &.received {
      p {
        background: #e5e5ea;
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
      border-radius: 25px;
      position: relative;
      color: #fff;
      text-align: center;
    }
  }

</style>