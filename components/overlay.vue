<template>
  <div class="overlayHolder" v-show="showOverlay">
    <div @click="closeOverlay" class="overlay"></div>
    <div class="overlayInteract">
      <b-card title="Zeker weten?">
        <div class="betterSpace">
          <b-button @click="closeOverlay" variant="danger">Ja</b-button>
          <b-button @click="closeOverlay" variant="primary">Nee</b-button>
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'overlay',
    computed: {
      showOverlay () {
        return this.$store.state.createdMenu.showOverlay
      }
    },
    methods: {
      closeOverlay () {
        this.$store.commit('createdMenu/showOverlay', false)
      },
    }
  }

</script>

<style lang="scss" scoped>

</style>
