<template>
  <section>
    <navigationBar title="Menuggest">
    </navigationBar>
    <div class="holder">

      <div class="sizeAligner">
        <leftbar
          title="Zoeken bij de leverancier">
        </leftbar>
        <legenda></legenda>

<!--TODO:: Tooltip-->
        <div class="centerHolder">
          <deal-component/>
        </div>
      </div>

      <RightsideHolder
        title="Gebruikt in de gerechten"
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
  import Legenda from '../components/legenda'

  export default {
    name: 'deals',
    components: {
      Legenda,
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
