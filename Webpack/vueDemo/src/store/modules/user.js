const state = {
  name: "",
};

const mutations = {
  SET_NAME: (state, name) => {
    state.name = name;
  },
};

const actions = {
  // user login
  login({ commit, state, dispatch }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(username, password);
      }, 5 * 1000);
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
