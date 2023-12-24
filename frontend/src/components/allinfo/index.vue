<template>
    <div>
      <header class="d-flex justify-content-between">
        <div class="title-1 title mr-3">Статистика</div>
      </header>
      <b-container fluid class="row">
        <div class="col-9">
          <Bar :options="chartOptions" :data="chartData" />
        </div>
        <div class="col-3">
          <div class="title">Расширение файлов</div>
          <div v-for="docType in documentTypes" :key="docType.id" class="form-check">
            <input type="checkbox" class="form-check-input" id="exampleCheck1" :value="docType.type" @change="addDocTypesForCheck" />
            <label class="form-check-label" for="exampleCheck1">
              {{ docType.type }}
            </label>
          </div>
          <hr />
          <div class="form-group">
            <label class="title" for="dateFrom">
              Дата от
            </label>
            <input id="dateFrom" type="text" class="form-control" @change="dateFromChanged" />
          </div>
          <div class="form-group">
            <label class="title" for="dateTo">
              Дата до
            </label>
            <input id="dateTo" type="text" class="form-control" @change="dateToChanged" />
          </div>
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
    private repoNames: any[] = []
    private repoStats: any[] = []
    private chartColors: string[] = [
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
    private selectedDocTypes: string[] = []
    private dateFrom = 0
    private dateTo = 0
    public chartData: any = { datasets: [], labels: [] }
    public chartOptions = {
      responsive: true
    }

    async updateChartData()
    {
      this.items = await fetchAllInfo( this.selectedDocTypes, this.dateFrom, this.dateTo )
      const reposInfo: any = {}
      let item: any
      let repo: string
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
      console.log( this.chartData )
    }

    async created() {
      await this.updateChartData();
    }

    private addDocTypesForCheck( event: any ) {
      const selected = event.target.value
      const index = this.selectedDocTypes.indexOf( selected )
      if ( -1 != index )
      {
        this.selectedDocTypes.splice( index, 1 )
      }
      else
      {
        this.selectedDocTypes.push( selected )
      }
      this.updateChartData()
    }

    private dateFromChanged( event: any ) {
      this.dateFrom = new Date( event.target.value ).getTime() / 1000
      console.log( this.dateFrom )
      this.updateChartData()
    }

    private dateToChanged( event: any ) {
      this.dateTo = new Date( event.target.value ).getTime() / 1000
      console.log( this.dateTo )
      this.updateChartData()
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
  .fileName, .form-check {
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
  