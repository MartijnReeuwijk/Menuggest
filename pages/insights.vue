<template>
 <section>

   <navigation-bar
     title="Menuggest"
   />

   <!-- Dit doe ik in meerderen onderdelen kan dit als page/prop/iets -->
<!-- Zoals slots ez gimma  -->
<!--   TODO slots-->
<section class="holder">
  <leftbar/>

  <section class="insight_holder">
    <data-card>

    </data-card>
  </section>



   </section>

 </section>
</template>

<script>
  import NavigationBar from '../components/navigationBar'
  import Leftbar from '../components/leftbar'
  import DataCard from '../components/insights/dataCard'
  export default {
    name: 'insights',
    components: {DataCard, Leftbar, NavigationBar}
  }
</script>

<style lang="scss" scoped>
  .holder{
    display: flex
  }
  .insight_holder{
    width: 100%;
  }
</style>
