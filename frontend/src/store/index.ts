import Vue from "vue";
import Vuex from "vuex";
import repo from "@/store/repo"
import repoCheck from "@/store/repoCheck"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    repo,
    repoCheck
  },
});
