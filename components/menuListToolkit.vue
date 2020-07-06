<template>
  <div>
  <search-function class="list-item ">
  </search-function>
  </div>
</template>

<script>
  import SearchFunction from './searchFunction'
  export default {
    name: 'menuListToolkit',
    components: {SearchFunction}
  }
</script>

<style lang="scss" scoped>
  .list-item {
    margin-right: 10px;
  }
  .list-enter-active, .list-leave-active {
    transition: all 1s;
  }
  .list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */ {
    opacity: 0;
    transform: translateY(30px);
  }

</style>
