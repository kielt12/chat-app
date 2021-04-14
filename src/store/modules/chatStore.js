import FB from '@/fireBase'
const state = {
    db : FB.firestore(),
    currentDoc : null,
    user: null,
    allMessage: [],
    route:["room1", "room2", "room3", "room4"],
    auth: false
}
const getters = {
    db :(state) => state.db,
    getUser:(state) => state.user,
    getAuth:(state) => state.auth,
    getCurrentDoc:(state) => state.currentDoc,
    getRoute : (state) => state.route
}
const actions = {
    addMessage({ commit }, message) {
        commit("add",message);
      },

      getMessage({ commit }) {
        commit("getMessage");
      },
      
}
const mutations = {
    add (state,message){
        console.log(message)
        state.db.collection("chat").add({
            message : message
        })
    },
    getMessage(state) {
        let allMessage=[];
        state.db.collection('chat').get().then((querySnapshot)=>{
            querySnapshot.forEach(doc => {
                allMessage.push(doc.data)
            });
        })
        //return allMessage
    },
    setUser:(state,user) => state.user = user,
        
    setCurrentDoc:(state,doc) => state.currentDoc = doc,
    setAuth:(state) => state.auth = false
}

export default {
    state,
    actions,
    mutations,
    getters,
  };

