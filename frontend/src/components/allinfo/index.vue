<template>
    <div>
      <header class="d-flex justify-content-between">
        <div class="title-1 title mr-3">Статистика</div>
      </header>
      <b-container fluid>
        <div class="w-50">
          <Bar :options="chartOptions" :data="chartData" />
        </div>
      </b-container>
    </div>
  </template>
  
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator'
  import { mapActions, mapGetters, mapMutations } from "vuex";
  import { fetchAllInfo } from '@/components/allinfo/helpers/requests'
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

  ChartJS.register( Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale )

  @Component({
    components: {
      Bar
    }
  })
  export default class AllInfo extends Vue {
    public items = []
    public repoNames: any[] = []
    public repoStats: any[] = []
    public chartColors: string[] = [
      "#590D22",
      "#800F2F",
      "#A4133C",
      "#C9184A",
      "#FF4D6D",
      "#FF758F",
      "#FF8FA3",
      "#FFB3C1",
      "#FFCCD5",
      "#FFF0F3"
    ]
    public chartData: any = { datasets: [], labels: [] }
    public chartOptions = {
      
      responsive: true
    }

    async beforeCreate() {
      this.items = await fetchAllInfo()
      const reposInfo: any = {}
      let item: any;
      let repo: string;
      for ( item of this.items )
      {
        const key: string = item.repoName;
        if ( !( key in reposInfo ) )
        {
          reposInfo[ key ] = []
        }
        reposInfo[ key ].push( item.matchPercent )
      }
      let i = 0;
      for ( repo in reposInfo )
      {
        const sum = reposInfo[ repo ].reduce( ( a: number, b: number ) => a + b, 0 );
        const average = reposInfo[ repo ].length ? ( sum / reposInfo[ repo ].length ) : 0;
        this.repoNames.push( repo )
        this.repoStats.push( {
          label: repo,
          backgroundColor: this.chartColors[ i++ % this.chartColors.length ],
          data: [ average ]
        } )
      }
      this.chartData = {
        datasets: this.repoStats,
        labels: ['Репозитории']
      }
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
  .repoName {
    color: #7375A5;
  }
  .dirName {
    color: #9D9D9D;
  }
  .fileName {
    color: #5A5A5A;
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
  