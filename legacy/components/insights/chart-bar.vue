<template>
  <div class="card">
    <div class="card-body">
      <h2 class="card-title">Bar</h2>
    </div>
    <div class="card-img-bottom">

    </div>
  </div>
</template>

<script>
  import { Bar } from 'vue-chartjs'

  const {reactiveProp} = mixins

  export default {
    extends: Bar,
    mixins: [reactiveProp],
    props: ['chartdata', 'options'],
    mounted () {
      this.renderChart(this.chartdata, this.options)
    },
    data () {
      return {}
      // ,
      // computed:{
      //   test: function (){
      //     const newData = this.$store.state.createdMenu.dataVisualA
      //     newData.forEach(items => {
      //       console.log('items', items["FIELD4"])
      //       this.data.push(items["FIELD4"])
      //     })
      //     console.log('newData', newData)
      //   },
    }
  }
</script>
