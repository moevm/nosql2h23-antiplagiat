import { fetchRepoByName } from "@/components/main-page/helpers/requests";

export default {
    namespaced: true,
    state: {
        repo: [],
        repoName: "",
        repoId: null,
        branchName: ""
    },
    getters: {
        repo: (state: any) => state.repo,
        repoId: (state: any) => state.repoId,
        repoName: (state: any) => state.repoName,
        branchName: (state: any) => state.branchName
    },
    mutations: {
        setRepoId(state: any, payload: any) {
            state.repoId = payload
        },
        setRepoName(state: any, payload: any) {
            state.repoName = payload
        },
        setBranchName(state: any, payload: any) {
            state.branchName = payload
        },
        setRepo(state: any, payload: any) {
            state.repo = payload
        }
    },
    actions: {
        async fetchRepo({commit, getters}: {commit: any, getters: any}, payload: any) {
            commit("setRepo", await fetchRepoByName(getters.repoId, getters.branchName, payload?.sortBy, payload?.sortOrder))
        }
    }
}