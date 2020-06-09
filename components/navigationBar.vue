<template>
<!--  Maak dynamic paging  -->
  <div>
    <b-navbar toggleable="lg"  type="dark" variant="dark">
      <b-navbar-brand href="/" >{{title}}</b-navbar-brand>


      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="/test/">Deallijst</b-nav-item>
          <b-nav-item href="/">Menukaart maken</b-nav-item>
          <b-nav-item href="/archive">Menukaart archief</b-nav-item>
          <b-nav-item href="/control">Beheer paneel</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>
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
.nav-item{
  margin: 0 15px;
}
</style>
