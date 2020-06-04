<template>
 <div class="pageHolder">
   <pageHolder v-bind:menuCardData="menuCardData">
<!--     Add picks-->
   </pageHolder>
     <RightsideHolder v-on:sendToMenu="updatePicks">
     </RightsideHolder>
 </div>

</template>

<script>
  import RightsideHolder from '../components/RightsideHolder'
  import pageHolder from '../components/pageHolder'
  export default {
    data () {
      return {
        menuCardData:[]
      }
    },
    name: 'menuBased',
    components: {
      RightsideHolder,
      pageHolder
    },
    methods:{
      updatePicks(item){
        console.log('Data in menubase', item)
        this.menuCardData.push(item)
        console.log('this.menuCardData', this.menuCardData)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .pageHolder{
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: darkgray;
    display: flex;
  }
</style>
