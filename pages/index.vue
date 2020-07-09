<template>
  <div>
  <navigationBar title="Menuggest">
  </navigationBar>

  <leftbar></leftbar>
  </div>

</template>

<script>
  import navigationBar from '../components/navigationBar'
  import leftbar from '../components/leftbar'
  export default {
    name: 'deals',
    components:{
      navigationBar,
      leftbar
    }
  }
</script>

<style lang="scss" scoped>

</style>
