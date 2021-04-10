import FB from '@/fireBase'
const state = {
    db : FB.firestore(),
    allMessage: [],
    a: undefined
}
const getters = {
    db :(state) => state.db,
    getMessage(state) {
        let allMessage=[];
        state.db.collection('chat').get().then((querySnapshot)=>{
            querySnapshot.forEach(doc => {
                allMessage.push(doc.data)
            });
        })
        //return allMessage
    }
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
    }
}

export default {
    state,
    actions,
    mutations,
    getters,
  };

