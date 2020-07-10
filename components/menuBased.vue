<template>
  <div class="pageHolder" ref="menukaartPaper">

    <pageHolder>
    </pageHolder>

    <RightsideHolder
      :menuOptionsSelected="menuOptionsSelected"
      :selectedCourse="selectedCourse"
      :title="title"
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
        window: {
          width: 0,
          height: 0
        }
      }
    },
    props: {
      title: String,
    },
    components: {
      RightsideHolder,
      pageHolder
    },
    mounted () {
      window.addEventListener('resize', this.handleResize)
      this.handleResize()
    },
    destroyed () {
      window.removeEventListener('resize', this.handleResize)
    },
    methods: {
      updateSuggestion (item) {
        this.suggestionMode = item
        if (item === true) {
          //  Naamgeving,Propchain en Dynamic moet anders
          this.menuOptionsSelected = 'Suggestie mode'
        } else {
          this.menuOptionsSelected = 'Menu options:'
        }
      },
      updatePicks (item) {
        this.menuCardData.push(item)
        this.overflow()
      },
      overflow () {
        //  Ja dit moet wel anders de logic zit in het verkeerde component
        let height = this.$refs.menukaartPaper.clientHeight
        if (height > 862) {
          alert('Je menu is nu meer dan 1 page (Dit is een tijdelijke error)')
        }
      },
      handleResize () {
        this.window.width = window.innerWidth
        this.window.height = window.innerHeight
      }
    }
  }
</script>

<style lang="scss" scoped>
  .pageHolder {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-color: darkgray;
    display: flex;
  }
</style>
