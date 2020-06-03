<template>
  <section class="rightSideHolder">
    <div>
      <h2>
        {{ menuOptionsSelected }} {{selectedCourse}}</h2>
      <menuDataHolder>
      </menuDataHolder>
    </div>

  </section>
</template>

<script>
  /* eslint-disable no-alert, no-console */
  import menuDataHolder from './menuDataHolder'
  export default {
    data () {
      return {
        menuOptionsSelected: 'Menu options - ',
        selectedCourse: 'main'
      }
    },
    name: 'RightsideHolder',
    components: {
      menuDataHolder
    },

  }
</script>

<style lang="scss" scoped>
  .rightSideHolder{
    width: 350px;
    height: 100%;
    background-color: #F7F8FB;
    align-self: flex-end;
    padding: 0 10px;
  }
  h2 {
    text-align: center;
  }
</style>
