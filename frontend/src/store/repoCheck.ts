import { checkFilesInRepo } from "@/components/main-page/helpers/requests"

export default {
    namespaced: true,
    state: {
        docTypes: [],
        repos: [],
        filesToCheck: []
    },
    getters: {
        checkSettingsEmpty: (state: any) => !state.docTypes.length || !state.repos.length || !state.filesToCheck.length  
    },
    mutations: {
        setDocTypes(state: any, payload: any) {
            if (state.docTypes.find((d: any) => d === payload)) {
                const index = state.docTypes.findIndex((d: any) => d === payload)
                state.docTypes.splice(index, 1)
                console.log('state in if: ', state.docTypes)
            } else {
                state.docTypes.push(payload)
                console.log('state in else: ', state.docTypes)
            }
        },
        setRepos(state: any, payload: any) {
            console.log('payload: ', payload)
            if (state.repos.find((d: any) => d.id === payload.id)) {
                const index = state.repos.findIndex((d: any) => d.id === payload.id)
                if (state.repos[index].branches.includes(payload.branches[0])) {
                    state.repos[index].branches.filter((b: any) => b != payload.branches[0])
                } else {
                    state.repos[index].branches.push(payload.branches[0])
                }
                if (!state.repos[index].branches.length) {
                    state.repos.splice(index, 1)
                }
                console.log('state in if: ', state.repos)
            } else {
                state.repos.push(payload)
                console.log('state in else: ', state.repos)
            }
        },
        setFilesToCheck(state: any, payload: any) {
            if (state.filesToCheck.find((d: any) => d === payload)) {
                const index = state.filesToCheck.findIndex((d: any) => d === payload)
                state.filesToCheck.splice(index, 1)
                console.log('state in if: ', state.filesToCheck)
            } else {
                state.filesToCheck.push(payload)
                console.log('state in else: ', state.filesToCheck)
            }
        },
    },
    actions: {
        async checkFiles({ state, rootGetters }: {state: any, rootGetters: any}) {
            console.log('rootGetters: ', rootGetters['repo/repoId'])

            await checkFilesInRepo(rootGetters['repo/repoId'], { 
                docTypes: state.docTypes,
                compareWith: {
                    repos: state.repos
                },
                filesToCheck: state.filesToCheck
            })
        }
    }
}