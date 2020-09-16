<template>
  <div class="mainHolderDeluxChangeThislater">
    <navigationBar title="Menuggest">
    </navigationBar>
<alert></alert>
    <menuBased
      title="Menukaart maken"
      >
    </menuBased>

  </div>

</template>

<script>
  /* eslint-disable no-alert, no-console */
  import navigationBar from '../components/navigationBar'
  import menuBased from '../components/menuBased'
  import myFile from '../assets/menukaart.json'
  import Alert from '../components/alert'

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
      Alert,
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
    height: 100vh;
    overflow: hidden;
  }
  @media print {
    body * {
      visibility: hidden;
    }
  }
</style>
