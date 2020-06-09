<template>
  <section class="rightSideHolder">
    <div>
      <h2>{{ menuOptionsSelected }} {{selectedCourse}}</h2>
      <menuDataHolder v-on:sendToMenu="addtomenu" :suggestionMode="false">
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
    methods: {
      addtomenu(item) {
        console.log("Right side",item)
        this.$emit('sendToMenu', item)
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
    width: 375px;
    height: auto;
    background-color: #F7F8FB;
    padding: 0 10px;
  }
  h2 {
    text-align: center;
    margin: 5px 0;
  }
</style>
