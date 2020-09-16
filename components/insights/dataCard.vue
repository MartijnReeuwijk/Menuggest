<template>
  <div class="card">
    <data-object
      :data=data>
    </data-object>
  </div>
</template>

<script>
  import DataObject from './dataObject'

  export default {
    name: 'dataCard',
    data () {
      return {}
    },
    components: {DataObject}
  }
</script>

<style lang="scss" scoped>
  .card {
    width: 250px;
    height: 250px;
    border: 1px solid black;
    margin: 10px;
    padding: 10px;
    transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
  }

  .card:hover {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }

</style>
