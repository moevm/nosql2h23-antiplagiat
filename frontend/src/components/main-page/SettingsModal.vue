<template>
  <b-modal title="Настройки репозитория" id="repo-settings" centered>
    <div class="form-group d-flex flex-direction-column check-group">
      <div title-2>Расширение файлов</div>
      <div v-for="docType in documentTypes" :key="docType.id" class="form-check">
        <input type="checkbox" class="form-check-input" id="exampleCheck1" :value="docType.type" @change="addDocTypesForCheck" />
        <label class="form-check-label" for="exampleCheck1">
          {{ docType.type }}
        </label>
      </div>
      <div>Проверка относительно</div>
      <div class="repo-list">
      <div v-for="repo in repoList" :key="repo._id">
        <span class="title-2 bold">{{ repo.name }}</span>
        <ul>
          <li class="branch" v-for="branch in repo.branches" :key="branch" @click="addRepoForCheck(repo._id, branch)">{{ branch }}</li>
        </ul>
      </div>
    </div>
    </div>
    <template v-slot:modal-footer="{ ok, cancel }">
      <b-button
        variant="primary"
        class="custom-button small mr-3"
        @click="cancel"
      >
        Отмена
      </b-button>
      <b-button @click="ok" variant="primary" class="custom-button">
        Добавить
      </b-button>
    </template>
  </b-modal>
</template>

<script lang="ts">
import { Repo } from '@/types/repo';
import { Component, Vue } from 'vue-property-decorator'
import { mapMutations } from 'vuex';
import { fetchReposAll } from '../pages/helpers/requests';

const Mappers = Vue.extend({
  methods: {
    ...mapMutations('repoCheck', ['setRepos', 'setDocTypes'])
  }
})
@Component
export default class SettingsModal extends Mappers {
  private repoList: Repo[] = []

  private documentTypes = [
    {
      id: 0,
      type: 'md',
    },
    {
      id: 1,
      type: 'js',
    },
    {
      id: 2,
      type: 'h',
    },
    {
      id: 3,
      type: 'cpp',
    },
    {
      id: 4,
      type: 'c',
    },
    {
      id: 5,
      type: 'txt',
    },
  ]

  private addRepoForCheck(id: string, branches: string) {
    this.setRepos({
      id, branches: [ branches ]
    })
  }

  private addDocTypesForCheck(event: any) {
    this.setDocTypes(event.target.value)
  }

  private async created() {
    this.repoList = await fetchReposAll()
  }
}
</script>

<style scoped>
.check-group {
  flex-direction: column;
}
</style>
