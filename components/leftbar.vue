<template>
  <section class="sideMenuDeals">
    <div class="sideMenuPlacer">
      <b-nav vertical>
        <div v-for="items in filterMenuItems">
          <h5 class="title">{{items.mainMenu}}</h5>
          <div class="menuItem" v-for="items in items.subMenu">
            <b-nav-item :value="items" @click="hide">{{items}}</b-nav-item>
          </div>
        </div>
      </b-nav>
    </div>
    <b-button class="customButton" variant="primary">
      Favorite
    </b-button>
  </section>
</template>

<script>
  export default {
    name: 'leftbar',
    data () {
      return {
        filterMenuItems: [
          {
            mainMenu: 'Vlees',
            subMenu: [
              'rund', 'varken', 'kip'
            ]
          },
          {
            mainMenu: 'Vis',
            subMenu: [
              'Zalm', 'tonijn', 'schol'
            ]
          },
          {
            mainMenu: 'groente',
            subMenu: [
              'tomaat', 'komkomer'
            ]
          }
        ],
      }
    },
  }
</script>

<style lang="scss" scoped>
  .menuItem {
    border: 1px solid black;
    border-radius: 5px;
    margin: 2px 0;
    background-color: white;
    text-transform: capitalize;
  }

  .sideMenuPlacer {
    padding: 10px 0;
  }

  .title {
    display: block;
    padding: 0 1rem;
    margin: 0;
  }

  .sideMenuDeals {
    background-color: #F7F8FB;
    width: 250px;
    position: relative;
    padding: 5px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
    height: calc(100vh - 56px);
  }

  .customButton {
    width: calc(100% - 10px);
    position: absolute;
    bottom: 5px;
  }
</style>
