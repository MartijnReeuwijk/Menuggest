<template>
  <div class="mainHolderDeluxChangeThislater">
    <navigationBar title="Menuggest">
    </navigationBar>
<!--
"id":1,
      "profit":"good",
      "message": "Menukaart - Maart 2020",
      "desc":"",-->
    <section>
      <div class="gridArchive">
      <tile v-for="(item, value) in this.data"
            :title="item.message"
            :desc="item.desc"
            :profit="item.profitUserText"
            :type="item.seizoen"
      >
      </tile>
      </div>
    </section>


  </div>

</template>

<script>
  /* eslint-disable no-alert, no-console */
  import navigationBar from '../components/navigationBar'
  import menuBased from '../components/menuBased'
  import archive from '../assets/archive.json'
  import Tile from '../components/archief/tile'
  import ArchiveGrid from '../components/archief/ArchiveGrid'

  export default {
    data () {
      return {
        dismissSecs: 10,
        dismissCountDown: 0,
        showDismissibleAlert: false,
        data:archive
      }
    },
    components: {
      ArchiveGrid,
      Tile,
      navigationBar,
      menuBased
    },
    methods: {
      countDownChanged (dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },
      showAlert () {
        this.dismissCountDown = this.dismissSecs
      }
    }
  }
</script>

<style>
  .mainHolderDeluxChangeThislater {
    overflow: hidden;
    height: 100vh;
  }
  .gridArchive{
    width: 100%;

    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>
