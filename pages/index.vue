<template>
  <section>
    <navigationBar title="Menuggest">
    </navigationBar>
    <div class="holder">

      <div class="sizeAligner">
        <leftbar>
        </leftbar>

        <div class="centerHolder">
          <deal-component/>
        </div>
      </div>

      <RightsideHolder
        title="Ingredient voor"
      >
      </RightsideHolder>

    </div>

  </section>

</template>

<script>
  import navigationBar from '../components/navigationBar'
  import leftbar from '../components/leftbar'
  import RightsideHolder from '../components/RightsideHolder'
  import DealComponent from '../components/dealpage/dealComponent'

  export default {
    name: 'deals',
    components: {
      DealComponent,
      navigationBar,
      leftbar,
      RightsideHolder
    }
  }
</script>

<style lang="scss" scoped>
  .sizeAligner {
    width: 100%;
    display: flex;
  }

  .holder {
    display: flex;
    justify-content: space-between;
    background-color: darkgray;
  }

  .centerHolder {
    width: 100%;
  }

</style>
