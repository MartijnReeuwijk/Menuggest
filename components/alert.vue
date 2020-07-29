<template>
  <transition name="fade">
  <div class="alert-fixed" v-show="alert">
    <b-alert show variant="info">
        <b-spinner small></b-spinner>
        <span class="sr-only">Opslaan Opslaan naar de database</span>
      Opslaan naar de database
    </b-alert>
  </div>
  </transition>
</template>

<script>
  export default {
    name: 'alert',
    data() {
      return {
        dismissSecs: 5,
        dismissCountDown: 0
      }
    },
    computed: {
      alert(){
        return this.$store.state.createdMenu.saveAlert
      }
    },
    methods: {
      countDownChanged(dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      }
    }
  }
</script>

<style lang="scss" scoped>
.alert-fixed{
  position: fixed;
  width: 250px;
  margin: 0 auto;
  top: 10px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
}


.fade-enter-active, .fade-leave-active {
  transition: 0.3s ease;
  -webkit-transition: 0.3s ease;
  -moz-transition: 0.3s ease;
  top: 10px;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
{
  transition: 0.3s ease;
  -webkit-transition: 0.3s ease;
  -moz-transition: 0.3s ease;
  top: -10px;
}
</style>
