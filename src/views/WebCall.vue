<template>
  <div class="video-call">
    <div class="video-container">
      <div>
        <h3>Local Stream</h3>
        <video ref="videoEl" autoplay playsinline></video>
      </div>
      <div>
        <h3>Remote Stream</h3>
        <video ref="video1El" autoplay playsinline></video>
      </div>
    </div>
    <div class="btn-contaier">
      <button @click="hangup">Hangup</button>
    </div>
  </div>
</template>

<script>
import firebase from "firebase";
import { ref, onMounted } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  setup() {
    const servers = {
      iceServers: [
        {
          urls: [
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
          ],
        },
      ],
      iceCandidatePoolSize: 10,
    };
    const pc = new RTCPeerConnection(servers);
    const localStream = ref(null);
    const remoteStream = ref(null);
    const callInput = ref(null);
    const router = useRouter();
    const db = ref(firebase.firestore());
    const store = useStore();
    const videoEl = ref(null);
    const video1El = ref(null);
    const user = ref(firebase.auth().currentUser);

    onMounted(() => {
      webcam();
    });
    const webcam = async () => {
      localStream.value = await navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .catch(console.log);
      remoteStream.value = new MediaStream();
      if (localStream.value) {
        // Push tracks from local stream to peer connection
        localStream.value.getTracks().forEach((track) => {
          pc.addTrack(track, localStream.value);
        });

        pc.ontrack = (event) => {
          event.streams[0].getTracks().forEach((track) => {
            remoteStream.value.addTrack(track);
          });
        };

        videoEl.value.srcObject = localStream.value;
        video1El.value.srcObject = remoteStream.value;
        if (user.value.uid === store.getters.getCurrentDoc) {
          answer();
        } else {
          call();
        }
      } else {
        router.push("/");
      }
    };
    const hangup = () => {
      console.log("ending Call");
      videoEl.value.srcObject = null;
      video1El.value.srcObject = null;
      const callId = store.getters.getCurrentDoc;
      db.value.collection("calls").doc(callId).delete();
      pc.close();
      router.push("/");
    };

    const call = async () => {
      // Reference db.value collections for signaling
      const callDoc = db.value
        .collection("calls")
        .doc(store.getters.getCurrentDoc);
      const offerCandidates = callDoc.collection("offerCandidates");
      const answerCandidates = callDoc.collection("answerCandidates");

      // Get candidates for caller, save to db
      pc.onicecandidate = (event) => {
        event.candidate && offerCandidates.add(event.candidate.toJSON());
      };

      // Create offer
      const offerDescription = await pc.createOffer();
      await pc.setLocalDescription(offerDescription);
      const offer = {
        sdp: offerDescription.sdp,
        type: offerDescription.type,
        id: store.getters.getCurrentDoc,
        callerID: user.value.uid,
      };

      await callDoc.set({ offer });

      // Listen for remote answer
      callDoc.onSnapshot((snapshot) => {
        const data = snapshot.data();
        if (!pc.currentRemoteDescription && data?.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);
          pc.setRemoteDescription(answerDescription);
        }
      });

      // When answered, add candidate to peer connection
      answerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const candidate = new RTCIceCandidate(change.doc.data());
            pc.addIceCandidate(candidate);
          }
        });
      });
    };

    // 3. Answer the call with the unique ID
    const answer = async () => {
      const callId = store.getters.getCurrentDoc;
      const callDoc = db.value.collection("calls").doc(callId);
      const answerCandidates = callDoc.collection("answerCandidates");
      const offerCandidates = callDoc.collection("offerCandidates");

      pc.onicecandidate = (event) => {
        event.candidate && answerCandidates.add(event.candidate.toJSON());
      };

      const callData = (await callDoc.get()).data();

      const offerDescription = callData.offer;
      await pc.setRemoteDescription(
        new RTCSessionDescription(offerDescription)
      );

      const answerDescription = await pc.createAnswer();
      await pc.setLocalDescription(answerDescription);

      const answer = {
        type: answerDescription.type,
        sdp: answerDescription.sdp,
      };

      await callDoc.update({ answer });

      offerCandidates.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          console.log(change);
          if (change.type === "added") {
            let data = change.doc.data();
            pc.addIceCandidate(new RTCIceCandidate(data));
          }
        });
      });
    };
    return {
      webcam,
      call,
      answer,
      videoEl,
      video1El,
      callInput,
      user,
      hangup,
    };
  },
};
</script>

<style lang="scss">
.video-call {
  height: 100vh;
  background: linear-gradient(135deg, #111 2.8%, #172368 100%);
  h3 {
    color: white;
    text-align: center;
  }
  button {
    height: 40px;
    width: 200px;
    border: none;
    color: white;
    border-radius: 12px;
    background-color: red;
    margin: auto 0;
    cursor: pointer;
  }
}
video {
  width: 100%;
}

.video-container {
  padding: 0 12px;
  display: flex;
  div {
    flex-basis: 50%;
  }
}

.btn-contaier {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
