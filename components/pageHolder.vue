<template>
  <section class="a4holder" ref="a4holder">

  <buttonHolder v-if="salesInfo">
  </buttonHolder>

    <menukaartA4
      :menuCardData="menuCardData">
    </menukaartA4>

    <bottomNav
      v-on:suggestionMode="suggestionMode"
      :style="{ width: myWidth + 'px' }"
      class="smooth"
    >
    </bottomNav>
  </section>
</template>

<script>
  import menukaartA4 from './menukaartA4'
  import bottomNav from './bottomNav'
  import buttonHolder from './buttonHolder'

  export default {
    name: 'pageHolder',
    props:{
      menuCardData:{
      //  add defaults if needed
      }
    },
    data() {
      return {
        myWidth: '1250'
      }
    },
    components:{
      menukaartA4,
      bottomNav,
      buttonHolder
    },
    methods: {
      getWindowWidth () {
        this.myWidth = this.$refs.a4holder.clientWidth;
      },
      suggestionMode (item) {
        this.$emit('suggestionMode', item)
      }
    },
    computed:{
      salesInfo: function () {
        return this.$route.name === "control";
      }
      //this.$route.query.page

    },
    mounted()
    {
      this.myWidth = this.$refs.a4holder.clientWidth;
      this.$nextTick(function() {
        window.addEventListener('resize', this.getWindowWidth);
        this.getWindowWidth()
      })
    }
  }
</script>

<style lang="scss" scoped>
  .a4holder{
    width: 100%;
    position: relative;
  }
  .smooth {
    transition: ease-in-out 0.2s;
  }
</style>
