<template>
  <section class="rightSideHolder">
    <div>

      <div class="titelHolder">
        <h2>
          {{ title }}
          <!--        {{ menuOptionsSelected }}-->
        </h2>
        <hr/>
        <filterHolder></filterHolder>
      </div>

      <div class="padding">
      <menuDataHolder
        v-on:sendToMenu="addtomenu"
        :sideMenuData="sideMenuData"
        :suggestionMode="this.suggestionMode"
      >
      </menuDataHolder>
      </div>
    </div>

  </section>
</template>

<script>
  /* eslint-disable no-alert, no-console */
  import menuDataHolder from './menuDataHolder'
  import filterHolder from './filterHolder'
  export default {
    data () {
      return {
      }
    },
    props:{
      sideMenuData:[],
      title:{
        Type: String,
        default: null
      },
      suggestionMode:{
        type: Boolean,
        default: false
      },
        menuOptionsSelected:{
        },
        selectedCourse:{
        },
      },
    methods: {
      addtomenu(item) {
        this.$emit('sendToMenu', item)
      }
    },
    name: 'RightsideHolder',
    components: {
      menuDataHolder,
      filterHolder
    },

  }
</script>

<style lang="scss" scoped>
  .padding{
    padding: 0 10px;
  }
  hr{
    margin: 10px 0;
  }
  .rightSideHolder{
    width: 500px;
    height: auto;
    background-color: #F7F8FB;

  }
  h2 {
    text-align: center;
    padding: 5px;
    margin: 0px;
  }
  .titelHolder{
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  }
</style>
