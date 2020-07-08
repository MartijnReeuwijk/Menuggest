<template>
  <section class="menu_holder" ref="menu_holder">

    <buttonHolder v-if="salesInfo">
    </buttonHolder>

    <legenda></legenda>

    <menukaartA4>
    </menukaartA4>

    <bottomNav
      :style="{ width: myWidth + 'px' }"
      class="smooth"
    >
    </bottomNav>

    <div class="bottom_navigation_pusher"></div>
  </section>
</template>

<script>
  import menukaartA4 from './menukaartA4'
  import bottomNav from './bottomActionBar'
  import buttonHolder from './buttonHolder'
  import legenda from './legenda'

  export default {
    name: 'pageHolder',
    props: {
      menuCardData: {
        //  add defaults if needed
      }
    },
    data () {
      return {
        myWidth: '1250'
      }
    },
    components: {
      menukaartA4,
      bottomNav,
      buttonHolder,
      legenda
    },
    methods: {
      getWindowWidth () {
        this.myWidth = this.$refs.menu_holder.clientWidth
      },
      suggestionMode (item) {
        this.$emit('suggestionMode', item)
      }
    },
    computed: {
      salesInfo: function () {
        return this.$route.name === 'control'
      }
      //this.$route.query.page
    },
    mounted () {
      this.myWidth = this.$refs.menu_holder.clientWidth
      this.$nextTick(function () {
        window.addEventListener('resize', this.getWindowWidth)
        this.getWindowWidth()
      })
    }
  }
</script>

<style lang="scss" scoped>
  .menu_holder {
    width: 100%;
    position: relative;
    padding: 10px 0;
  }

  .smooth {
    transition: ease-in-out 0.2s;
  }

  .bottom_navigation_pusher {
    height: 75px;
  }
</style>
