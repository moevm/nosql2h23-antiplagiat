<template>
  <div v-if="!!repoName">
    <header class="d-flex justify-content-between">
      <div class="d-flex">
        <div class="title-1 title mr-3">{{repoName}}/{{branchName}}</div>
        <b-button
          @click="$bvModal.show('repo-settings')"
          class="custom-button custom-button-icon"
        >
          <img src="../../assets/gearIcon.svg" />
        </b-button>
      </div>
      <b-button class="custom-button">Проверить</b-button>
    </header>
    <main class="mt-3">
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col"></th>
            <th scope="col">Название</th>
            <th scope="col">Статус</th>
            <th scope="col">% совпадения</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in repo" :key="row._id">
            <th scope="row">
              <div class="form-check">
                <input
                  type="checkbox"
                  class="form-check-input"
                  id="exampleCheck1"
                />
              </div>
            </th>
            <td>{{ row.name }}</td>
            <td>{{ row.checks.length ? 'Проверено' : 'Не проверено'}}</td>
            <td>{{ row.checks.length ? row.checks[row.checks.length - 1].result : '-' }}</td>
            <td>
              <b-button class="custom-button custom-button-icon">
                <img class="file-icon" src="../../assets/fileIcon.svg" />
              </b-button>
            </td>
          </tr>
        </tbody>
      </table>
    </main>
    <SettingsModal />
  </div>
  <div class="title-1 title alter-title" v-else>
    Выберите ветку репозитория для проверки
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SettingsModal from '@/components/main-page/SettingsModal.vue'
import {mapActions, mapGetters, mapMutations} from "vuex";

const Mappers = Vue.extend({
  methods: {
    ...mapMutations('repo', ['setRepoName', 'setBranchName']),
    ...mapActions('repo', ['fetchRepo'])
  },
  computed: {
    ...mapGetters('repo', ['repo', 'repoName', 'branchName'])
  }
})
@Component({
  components: {
    SettingsModal
  }
})
export default class RepoInfo extends Mappers {
  async created() {
    await this.fetchRepo()
  }
}
</script>

<style lang="scss" scoped>
.thead-dark {
  background: #0f0049 !important;
}
.title {
  color: #000000;
}
.custom-button-icon {
  background: transparent;
  box-shadow: none;
  padding: 0;
}
.file-icon {
  width: 20px;
  height: 20px;
}
.alter-title {
  text-align: center;
}
</style>
