import {fetchRepoByName} from "@/components/main-page/helpers/requests";

export default {
    namespaced: true,
    state: {
        repo: [],
        repoName: "",
        branchName: ""
    },
    getters: {
        repo: (state: any) => state.repo,
        repoName: (state: any) => state.repoName,
        branchName: (state: any) => state.branchName
    },
    mutations: {
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
        async fetchRepo({commit, getters}: {commit: any, getters: any}) {
            commit("setRepo", await fetchRepoByName(getters.repoName, getters.branchName))
        }
    }
}