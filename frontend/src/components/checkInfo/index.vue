<template>
  <div>
    <div class="title-1 mb-2">{{ fileCheck?.fileName }}</div>
    <b-col sm="7" md="6" class="my-1">
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          size="sm"
          class="my-0"
        ></b-pagination>
      </b-col>
    <b-table
      :items="fileCheck?.checks[0].matches"
      :fields="fields"
      :filter="filter"
      :filter-included-fields="filterOn"
      :current-page="currentPage"
      :per-page="perPage"
      :sort-by.sync="sortBy"
      :sort-desc.sync="sortDesc"
      :sort-direction="sortDirection"
      stacked="md"
      show-empty
      small
    >
      <template #cell(actions)="row">
        <b-button size="sm" @click="showDetails(row)">
          {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
        </b-button>
      </template>

      <template #row-details="row">
        <b-card>
            <b-table
            :items="row.item.matchedLines"
            :fields="fieldsInSubtable"
            :sort-by.sync="sortBy"
            :sort-desc.sync="sortDesc"
            sort-icon-left
            responsive="sm"
            ></b-table>
        </b-card>
      </template>
    </b-table>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { FileCheck } from '@/types/check';
import { getFileCheckInfo } from '../main-page/helpers/requests';

@Component
export default class FileInfo extends Vue {
    public fileCheck: FileCheck | null = null

    public fields = [
        { key: 'fileName', label: 'Название', sortable: true, sortDirection: 'desc' },
        { key: 'matchPercent', label: 'Совпадение', sortable: true, class: 'text-center' },
        {
        key: 'pushDate',
        label: 'Дата пуша',
        formatter: (value: number) => {
            return new Date(value*1000).toLocaleDateString()
        },
        sortable: true,
        sortByFormatted: true,
        filterByFormatted: true
        },
        { key: 'author', label: 'Авторы', sortable: true },
        { key: 'actions', label: '' }
    ]
    public fieldsInSubtable = [
        { key: 'initial', label: 'Название', sortDirection: 'desc' },
        { key: 'outer', label: 'Совпадение' },
    ]
    public sortBy = ''
    public sortDesc = false
    public sortDirection = 'asc'
    public filter = ''
    public filterOn = []
    public totalRows = 1
    public currentPage = 1
    public perPage = 15

    public showDetails(row: any) {
        console.log('row in show Details: ', row)
        row.toggleDetails()
    }

    private async created() {
        this.fileCheck = (await getFileCheckInfo(this.$route.params.id)).data
        console.log('this.fileCheck: ', this.fileCheck)

        this.totalRows = this.fileCheck?.checks[0].matches?.length || 0
        console.log('this.totalRows: ', this.totalRows)
    }
}
</script>

<style scoped>
* {
    color: black
}
</style>