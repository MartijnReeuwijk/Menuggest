<template>
  <div class="buttons-space">
    <div class="button-holder-inner">
      <b-button variant="outline-primary">Voor</b-button>
      <b-button variant="primary">Hoofd</b-button>
      <b-button variant="outline-primary">Na</b-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'verticalActionBar',
    data () {
      return {}
    }
  }

</script>

<style lang="scss" scoped>
  .bottom-nav {
    height: 75px;
    background-color: #F7F8FB;
    display: flex;
    position: fixed;
    justify-content: center;
    bottom: 0;
    align-items: center;
  }

  .button-holder {
    width: 100%;
    display: flex;
    height: fit-content;
    justify-items: center;
    justify-content: center;
  }

  .button-holder-inner {
    width: 250px;
    display: flex;
    justify-content: space-evenly;
  }
</style>
