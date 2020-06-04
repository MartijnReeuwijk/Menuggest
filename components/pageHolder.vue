<template>
  <section class="a4holder">
    <menukaartA4 :menuCardData="menuCardData"></menukaartA4>
  </section>
</template>

<script>
  import menukaartA4 from './menukaartA4'
  export default {
    name: 'pageHolder',
    props:['menuCardData'],
    components:{
      menukaartA4
    }
  }
</script>

<style lang="scss" scoped>
.a4holder{
  width: 100%;
}
</style>
