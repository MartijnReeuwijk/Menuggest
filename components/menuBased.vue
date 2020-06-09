<template>
  <div class="pageHolder" ref="menukaartPaper">

    <pageHolder
      v-on:suggestionMode="updateSuggestion"
    :menuCardData="menuCardData">
    </pageHolder>

    <RightsideHolder
      v-on:sendToMenu="updatePicks"
      :suggestionMode="this.suggestionMode"
    >
    </RightsideHolder>
  </div>

</template>

<script>
  import RightsideHolder from '../components/RightsideHolder'
  import pageHolder from '../components/pageHolder'
  export default {
    data () {
      return {
        menuCardData:[],
        suggestionMode:"",
      }
    },
    name: 'menuBased',
    components: {
      RightsideHolder,
      pageHolder
    },
    methods:{
      updateSuggestion(item) {
        this.suggestionMode = item
      },
      updatePicks(item){
        this.menuCardData.push(item)
        this.overflow()
      },
      overflow(){
        //  Ja dit moet wel anders de logic zit in het verkeerde component
        let height = this.$refs.menukaartPaper.clientHeight;
        if(height > 862) {
          alert("Je menu is nu meer dan 1 page (Dit is een tijdelijke error)")
        }
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
