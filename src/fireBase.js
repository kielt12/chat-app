import firebase from "firebase";

var firebaseConfig = {
    apiKey: "AIzaSyA7bzVZ7beCihvWh3mh3nOic_zdvkiCBBc",
    authDomain: "vuechat-20ac9.firebaseapp.com",
    databaseURL: "https://vuechat-20ac9-default-rtdb.firebaseio.com",
    projectId: "vuechat-20ac9",
    storageBucket: "vuechat-20ac9.appspot.com",
    messagingSenderId: "71464288203",
    appId: "1:71464288203:web:79bee8b89d4fbd66c0404e",
    measurementId: "G-50LZNDR8F9"
};
var FB = firebase.initializeApp(firebaseConfig);

export default FB;
