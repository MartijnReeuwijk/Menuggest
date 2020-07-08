<template>
  <!--  Maak dynamic paging  -->
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="/">{{title}}</b-navbar-brand>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="/">Deallijst</b-nav-item>
          <b-nav-item href="/menu">Menukaart maken</b-nav-item>
          <b-nav-item href="/archive">Archief</b-nav-item>

          <b-nav-item href="/insights">Verkoop insights</b-nav-item>
<!--          <b-nav-item href="/control">Beheer paneel</b-nav-item>-->
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
  export default {
    name: 'navigationBar',
    props: ['title']
  }
</script>

<style lang="scss" scoped>
  .nav-item {
    margin: 0 15px;
  }
</style>
