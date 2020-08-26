<template>
  <section>
    <tile v-for="item in dataBase"></tile>
  </section>
</template>

<script>
  import Tile from './tile'
  export default {
    name: 'ArchiveGrid',
    components: {Tile}
  }
</script>

<style lang="scss" scoped>

</style>
