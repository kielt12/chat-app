const state = {
  currentDoc: null,
};
const getters = {
  getCurrentDoc: (state) => state.currentDoc,
};
const actions = {};
const mutations = {
  setCurrentDoc: (state, doc) => (state.currentDoc = doc),
};

export default {
  state,
  actions,
  mutations,
  getters,
};
