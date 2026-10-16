<template>
  <section class="shadowOverlay">

  </section>
</template>

<script>
  export default {
    name: 'shadowOverlay'
  }
</script>

<style lang="scss" scoped>
  .shadowOverlay {
    top: 0;
    left: 0;
    pointer-events: none;
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.25);
    z-index: 10;
  }
</style>
