<template>
  <div class="mainHolderDeluxChangeThislater">
    <navigationBar title="Menuggest">
    </navigationBar>

    <menuBased
      :sideMenuData="data"
      title="Menukaart maken"
      selectedCourse="Hoofgerecht">
    </menuBased>

  </div>

</template>

<script>
  /* eslint-disable no-alert, no-console */
  import navigationBar from '../components/navigationBar'
  import menuBased from '../components/menuBased'
  import myFile from '../assets/menukaart.json'

  export default {
    data () {
      return {
        dismissSecs: 10,
        dismissCountDown: 0,
        showDismissibleAlert: false,
        data:myFile
      }
    },
    components: {
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
    },
  }
</script>

<style>
  .mainHolderDeluxChangeThislater {
    overflow: hidden;
  }
</style>
