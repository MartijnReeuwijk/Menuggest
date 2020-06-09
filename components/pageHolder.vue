<template>
  <section class="a4holder" ref="a4holder">
    <menukaartA4 :menuCardData="menuCardData"></menukaartA4>
    <bottomNav :style="{ width: myWidth + 'px' }"></bottomNav>
  </section>
</template>

<script>
  import menukaartA4 from './menukaartA4'
  import bottomNav from './bottomNav'

  export default {
    name: 'pageHolder',
    props:['menuCardData'],
    data() {
      return {
        myWidth: '750'
      }
    },
    components:{
      menukaartA4,
      bottomNav
    },
    methods: {
      getWindowWidth () {
        this.myWidth = this.$refs.a4holder.clientWidth;
      }
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
  }
</style>
