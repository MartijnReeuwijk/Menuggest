<template>
  <section class="courses-nav">
    <b-button href="#appetizer" variant="light">Voor gerecht</b-button>
    <b-button href="#main" variant="light">Hoofd gerecht</b-button>
    <b-button href="#after" variant="light">Na gerecht</b-button>
  </section>
</template>

<script>
  export default {
    name: 'courseSelector',
    computed: {
      withPlacer () {
        return withofItem + 10
      }
    }
  }
</script>

<style lang="scss" scoped>
  .courses-nav {
    z-index: 10;
    height: 150px;
    width: 150px;
    background-color: transparent;
    position: fixed;
    right: 320px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }

  .courses-nav a {
    width: 100%;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }
</style>
