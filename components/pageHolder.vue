<template>
  <section class="pageHolder">
    <menukaartA4></menukaartA4>
  </section>
</template>

<script>
  import menukaartA4 from './menukaartA4'
  export default {
    name: 'pageHolder',
    components:{
      menukaartA4
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
