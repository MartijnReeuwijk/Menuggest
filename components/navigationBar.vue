<template>
  <!--  Maak dynamic paging  -->
  <div>
    <b-navbar toggleable="lg" type="dark" variant="dark">
      <b-navbar-brand href="/">{{title}}</b-navbar-brand>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="/">Inkoop lijst</b-nav-item>
          <b-nav-item href="/menu">Menukaart maken</b-nav-item>
          <b-nav-item href="/archive">Archief</b-nav-item>

          <b-nav-item href="/insights">Verkoop inzicht</b-nav-item>
          <!--          <b-nav-item href="/control">Beheer paneel</b-nav-item>-->

          <b-nav-item href="/editMenu">Gerecht toevoegen</b-nav-item>

        </b-navbar-nav>







        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <b-avatar variant="light"></b-avatar>
            </template>
            <b-dropdown-item href="#">Profile</b-dropdown-item>
            <b-dropdown-item href="login">Loguit</b-dropdown-item>
          </b-nav-item-dropdown>
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
  .dropdown-toggle::after{
    display: none;
  }

</style>
