<template>
  <div>
    <h2>1. Start your Webcam</h2>
    <div class="videos">
      <span>
        <h3>Local Stream</h3>
        <video ref="videoEl" autoplay playsinline></video>
      </span>
      <span>
        <h3>Remote Stream</h3>
        <video ref="video1El" autoplay playsinline></video>
      </span>
    </div>

    <button @click="webcam">Start webcam</button>
    <h2>2. Create a new Call</h2>
    <button @click="call">Create Call (offer)</button>

    <h2>3. Join a Call</h2>
    <p>Answer the call from a different browser window or device</p>

    <input v-model="callInput" />
    <button @click="answer">Answer</button>

    <h2>4. Hangup</h2>

    <button @click="hangup">Hangup</button>
  </div>
</template>

<script>
import firebase from "firebase";
import { ref } from "vue";
export default {
  setup() {
    const firestore = firebase.firestore();
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

    // Global State
    const pc = new RTCPeerConnection(servers);
    const localStream = ref(null);
    const remoteStream = ref(null);
    const callInput = ref(null);

    const videoEl = ref(null);
    const video1El = ref(null);

    const webcam = async () => {
      localStream.value = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      remoteStream.value = new MediaStream();

      // Push tracks from local stream to peer connection
      localStream.value.getTracks().forEach((track) => {
        pc.addTrack(track, localStream.value);
      });

      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.value.addTrack(track);
        });
      };
      console.log(videoEl);
      videoEl.value.srcObject = localStream.value;
      video1El.value.srcObject = remoteStream.value;
    };
    const call = async () => {
      // Reference Firestore collections for signaling
      const callDoc = firestore.collection("calls").doc();
      const offerCandidates = callDoc.collection("offerCandidates");
      const answerCandidates = callDoc.collection("answerCandidates");

      callInput.value = callDoc.id;
      console.log(callDoc.id);

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

      //   hangupButton.disabled = false;
    };

    // 3. Answer the call with the unique ID
    const answer = async () => {
      const callId = callInput.value;
      const callDoc = firestore.collection("calls").doc(callId);
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
    };
  },
};
</script>

<style>
video {
  height: 200px;
  width: 200px;
}
</style>