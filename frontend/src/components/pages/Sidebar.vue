<template>
  <div class="sidebar">
    <div class="input-group mb-3 search-form d-flex align-items-center">
      <input type="text" class="form-control">
      <div class="input-group-append search">
        <i class="fas fa-search"></i>
      </div>
    </div>
    <div class="repo-list">
      <div v-for="repo in repoList" :key="repo._id">
        <span class="title-2 bold">{{ repo.name }}</span>
        <ul>
          <li class="branch" v-for="branch in repo.branches" :key="branch" @click="openRepo(repo._id, branch, repo.name)">{{ branch }}</li>
        </ul>
      </div>
    </div>
    <div class="d-flex justify-content-center">
      <b-button @click="$bvModal.show('add-repo-modal')" class="custom-button">
        Добавить репозиторий
      </b-button>
    </div>
    <AddRepoModal @addRepo="updateRepos"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Repo } from '@/types/repo'
import AddRepoModal from '@/components/pages/AddRepoModal.vue'
import {fetchReposAll} from "@/components/pages/helpers/requests";
import {fetchRepoByName} from "@/components/main-page/helpers/requests";
import {mapActions, mapMutations} from "vuex";

const Mappers = Vue.extend({
  methods: {
    ...mapMutations('repo', ['setRepoName', 'setBranchName', 'setRepoId']),
    ...mapActions('repo', ['fetchRepo'])
  }
})
@Component({
  methods: {fetchRepoByName},
  components: {
    AddRepoModal
  }
})
export default class Sidebar extends Mappers {
  private repoList: Repo[] = []

  private openRepo(repoId: string, branchName: string, repoName: string) {
    this.setRepoId(repoId)
    this.setRepoName(repoName)
    this.setBranchName(branchName)
    this.fetchRepo()
    setTimeout( () => {
      this.updateRepos()
    }, 5000 );
  }

  private async updateRepos() {
    this.repoList = await fetchReposAll()
  }

  async created() {
    await this.updateRepos()
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  padding: 5px 10px;
  background: #F9F9F9;
}
.search-form {
  margin-top: 10px;
  border-bottom: 2px solid black;

  .form-control {
    background: transparent;
    border: none;
    outline: none !important;
    box-shadow: none;
  }
  .search {
    color: #0F0049;
  }
}

.repo-list {
  color: #000000;
}

.branch {
  cursor: pointer;
}

</style>