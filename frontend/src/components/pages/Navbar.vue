<template>
  <div class="navbar" >
    <div class="d-flex justify-content-between flex-grow-1">
      <div @click="showMainPage">
        <span class="title-1">АнтиПлагиат</span>
        <span class="title-2"> им. Марка Марковича </span>
      </div>
      <b-button-group>
        <b-button @click="showStatistics" class="custom-button mr-2" v-b-tooltip title="Сводная таблица">
          <img src="../../assets/tableIcon.svg"/>
        </b-button>
        <b-button @click="showAllinfo" class="custom-button mr-2" v-b-tooltip title="Статистика">
          <img src="../../assets/chartIcon.svg"/>
        </b-button>
        <input id="importFile" type="file" @change="importFile" hidden>
        <b-button @click="download" class="custom-button mr-2" v-b-tooltip title="Массовый импорт">
          <img src="../../assets/downloadIcon.svg"/>
        </b-button>
        <b-button @click="exportData" class="custom-button" v-b-tooltip title="Массовый экспорт">
          <img src="../../assets/exportIcon.svg"/>
        </b-button>
      </b-button-group>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { downloadData, exportData } from '@/components/pages/helpers/requests'

@Component
export default class Navbar extends Vue {
  private showStatistics() {
    if (!(this.$router.currentRoute.name == 'statistics')) {
      this.$router.push({name: 'statistics'})
    }
  }

  private showAllinfo() {
    if (!(this.$router.currentRoute.name == 'allInfo')) {
      this.$router.push({name: 'allInfo'})
    }
  }

  private importFile( event: any ) {
    downloadData( event.target.files[ 0 ] )
  }

  private download() {
    document.getElementById( 'importFile' )?.click();
  }

  private exportData() {
    exportData()
  }

  private showMainPage() {
    if (!(this.$router.currentRoute.name == 'aboutRepo')) {
      this.$router.push({name: 'aboutRepo'})
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 65px;
  background: #0F0049;
}
.custom-button {
  background: transparent;
  padding: 0;
}

</style>