<template>
  <div class="mainHolderDeluxChangeThislater">
    <navigationBar title="Menuggest"
    >

    </navigationBar>
      <menuBased>

      </menuBased>


  </div>

</template>

<script>
  /* eslint-disable no-alert, no-console */
  import navigationBar from '../components/navigationBar'
  import menuBased from '../components/menuBased'

  export default {
    data () {
      return {
        dismissSecs: 10,
        dismissCountDown: 0,
        showDismissibleAlert: false
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
    }
  }
</script>

<style>
  .maxContainer {
    margin: 0 auto;
    height: 100%;
    display: flex;
    overflow: hidden;
    width: 100%;
  }

  .mainHolderDeluxChangeThislater {
    overflow: hidden;
  }

  .title {
    font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: #35495e;
    letter-spacing: 1px;
  }

  .subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
  }

  .links {
    padding-top: 15px;
  }
</style>
