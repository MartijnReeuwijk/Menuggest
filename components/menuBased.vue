<template>
  <div class="pageHolder" ref="menukaartPaper">

    <pageHolder
      v-on:suggestionMode="updateSuggestion"
      :menuCardData="menuCardData">
    </pageHolder>

    <RightsideHolder
      v-on:sendToMenu="updatePicks"
      :title="title"
      :sideMenuData="sideMenuData"
      :suggestionMode="this.suggestionMode"
      :menuOptionsSelected="menuOptionsSelected"
      :selectedCourse="selectedCourse"
    >
    </RightsideHolder>
  </div>

</template>

<script>
  import RightsideHolder from '../components/RightsideHolder'
  import pageHolder from '../components/pageHolder'

  export default {
    name: 'menuBased',
    data () {
      return {
        menuCardData:[],
        suggestionMode: false,
        // Dit is niet helemaal lekker de dynamiek moet uit de data komen en niet mn if statement

      }
    },
    props:{
      sideMenuData:[],
      title:String,
      menuOptionsSelected:String,
      selectedCourse:String
    },
    components: {
      RightsideHolder,
      pageHolder
    },
    methods:{
      updateSuggestion(item) {
        this.suggestionMode = item
        if(item === true){
        //  Naamgeving,Propchain en Dynamic moet anders
        this.menuOptionsSelected = "Suggestie mode"
        } else {
          this.menuOptionsSelected =  'Menu options:'
        }
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
