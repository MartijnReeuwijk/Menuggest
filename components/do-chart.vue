<script>
  import { Doughnut } from 'vue-chartjs'

  export default {
    extends: Doughnut,
    props: ['data', 'options'],
    mounted () {
      this.renderChart(this.data, this.options)
    },
    watch: {
      data: function() {
        // Smooth update ipv rerender

        // this.renderChart.destroy();
        //this.renderChart(this.data, this.options);
        this.renderChart(this.data, this.options)
        // this.$data._chart.update()
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
