<template>
  <div class="navbar" >
    <div class="d-flex justify-content-between flex-grow-1">
      <div>
        <span class="title-1">АнтиПлагиат</span>
        <span class="title-2"> им. Марка Марковича </span>
      </div>
      <b-button-group>
        <b-button @click="showStatistics" class="custom-button mr-2">
          <img src="../../assets/tableIcon.svg"/>
        </b-button>
        <b-button class="custom-button mr-2">
          <img src="../../assets/chartIcon.svg"/>
        </b-button>
        <b-button @click="download" class="custom-button mr-2">
          <img src="../../assets/downloadIcon.svg"/>
        </b-button>
        <b-button @click="exportData" class="custom-button">
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
    this.$router.push({name: 'statistics'})
  }

  private download() {
    downloadData()
  }

  private exportData() {
    exportData()
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