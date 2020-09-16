<template>
  <div class="mainHolderDeluxChangeThislater">
    <navigationBar title="Menuggest">
    </navigationBar>

<overlay></overlay>


    <div>
      <b-card-group deck>
      <tile v-for="(item, value) in this.data"
            :title="item.message"
            :desc="item.desc"
            :datum="item.datum"
            :profit="item.profitUserText"
            :type="item.seizoen"
            :sold="item.sold"

      >
      </tile>
      </b-card-group>
    </div>

  </div>

</template>

<script>
  /* eslint-disable no-alert, no-console */
  import navigationBar from '../components/navigationBar'
  import menuBased from '../components/menuBased'
  import archive from '../assets/archive.json'
  import Tile from '../components/archief/tile'
  import ArchiveGrid from '../components/archief/ArchiveGrid'
  import Model from '../components/model'
  import Overlay from '../components/overlay'

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
      Overlay,
      Model,
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
      },
    }
  }
</script>

<style>
  .mainHolderDeluxChangeThislater {
    overflow: hidden;
    height: 100vh;
  }
  .overlayHolder{
    position: fixed;
    width: 100%;
    height: 100vh;
    display: flex;
    z-index: 100;
    justify-content: space-around;
    justify-items: center;
    top: 0;
  }
  .overlayInteract{
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    width: 200px;
    height: 120px;
  }
  .overlay{
    position: fixed;
    width: 100%;
    height: 100vh;
    background-color: rgba(0,0,0,.75);
    transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
    cursor: pointer;
  }
  .overlay:hover{
    background-color: rgba(0,0,0,.5);
  }
  .betterSpace{
    justify-content: space-between;
    display: flex;
  }
  .card-deck{
    margin: 10px;
  }
</style>
