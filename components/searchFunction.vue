<template>
  <div class="input-group padding">
    <input aria-describedby="basic-addon2" aria-label="Zoeken" class="form-control" placeholder="Zoeken" type="text">
    <div class="input-group-append">
      <button class="btn btn-outline-secondary" type="button">Zoeken</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'searchFunction'
  }
</script>

<style lang="scss" scoped>
  .padding {
    padding: 5px 10px;
  }
</style>
