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
      <b-button class="custom-button" :disabled="checkSettingsEmpty" @click="checkFiles">Проверить</b-button>
    </header>
    <b-col lg="6" class="my-1">
      <b-form-group
        label="Filter"
        label-for="filter-input"
        label-cols-sm="1"
        label-align-sm="right"
        label-size="sm"
        class="mb-0"
      >
        <b-input-group size="sm">
          <b-form-input
            id="filter-input"
            v-model="filter"
            type="search"
            placeholder="Введите запрос"
          ></b-form-input>

          <b-input-group-append>
            <b-button :disabled="!filter" @click="filter = ''">Очистить</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
    </b-col>
    <b-table
      :items="repo.files"
      :fields="fields"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      :filter="filter"
      :filter-included-fields="filterOn"
      stacked="md"
      show-empty
      small
    >
      <template #cell(selection)="row">
        <b-form-checkbox v-model="row.selection" @change="addFilesForCheck(row)" />
      </template>
      <template #cell(checkStatus)="row">
        <span v-bind:class="[row.item.checkStatus ? 'greenText' : 'redText']">
          {{row.item.checkStatus ? 'Проверено' : 'Не проверено'}}
        </span>
      </template>
      <template #cell(matchPercent)="row">
        <span v-bind:class="[row.item.matchPercent < 25 ? 'redText' :
        (row.item.matchPercent > 65 ? 'greenText' : 'greyText')]">
          {{row.item.matchPercent}}
        </span>
      </template>
      <template #cell(showInfo)="row">
        <b-button class="custom-button custom-button-icon" @click="showCheckInfo(row)">
          <img class="file-icon" src="../../assets/fileIcon.svg" />
        </b-button>
      </template>
    </b-table>
    <SettingsModal />
  </div>
  <div class="title-1 title alter-title" v-else>
    Выберите ветку репозитория для проверки
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import SettingsModal from '@/components/main-page/SettingsModal.vue'
import { mapActions, mapGetters, mapMutations } from "vuex";
import { getFileCheckInfo } from '@/components/main-page/helpers/requests'
import {computed} from "vue";

const Mappers = Vue.extend({
  methods: {
    ...mapMutations('repo', ['setRepoName', 'setBranchName']),
    ...mapActions('repo', ['fetchRepo']),
    ...mapMutations('repoCheck', ['setFilesToCheck']),
    ...mapActions('repoCheck', ['checkFiles'])
  },
  computed: {
    ...mapGetters('repo', ['repo', 'repoName', 'branchName']),
    ...mapGetters('repoCheck', ['checkSettingsEmpty'])
  }
})
@Component({
  components: {
    SettingsModal
  }
})
export default class RepoInfo extends Mappers {
  public fields = [
    { key: 'selection', label: ''},
    { key: 'fileName', label: 'Название', sortable: true},
    {
      key: 'checkStatus',
      label: 'Статус',
      sortable: true,
      sortByFormatted: true
    },
    { key: 'matchPercent', label: '% совпадения', sortable: true },
    { key: 'showInfo', label: ''}
  ]
  public sortBy = ''
  public sortDesc = false
  public sortDirection = 'asc'
  public filter = ''
  public filterOn = []
  public addFilesForCheck(rowInfo: any) {
    this.setFilesToCheck(rowInfo.item.fileId)
  }
  public async showCheckInfo(rowData: any) {
    await getFileCheckInfo(rowData.item.fileId)
  }
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
.greenText {
  color: #00830d;
}
.redText {
  color: #A10000;
}
.greyText {
  color: #5A5A5A
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
