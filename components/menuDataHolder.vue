<template>
  <b-list-group>
<!--  Active moet met var  -->
    <b-list-group-item @click="addtomenu(item)"  v-for="item in items"  :key="item.message"  href="#"  class="customStyle flex-column align-items-start">
      <div class="d-flex w-100 justify-content-between ">
        <transition name="fade" v-enter>
           <div class="profit-colour" v-show="suggestionMode===true" v-bind:class="`${item.profit}`"></div>
       </transition>
        <h5 class="mb-1">
          {{ item.message }}
        </h5>
      </div>
      <p class="mb-1">
        {{ item.desc }}
      </p>
    </b-list-group-item>
  </b-list-group>
</template>

<script>
  /* eslint-disable no-alert, no-console */

  export default {
    name: 'menuDataHolder',
    data () {
      return {
        // Get acctual data
        items: this.sideMenuData
      }
    },
    props:{
      sideMenuData:[],
      suggestionMode: {
        type: Boolean,
        default: false
      },
    },

    methods: {
      addtomenu(item) {
        this.$emit('sendToMenu', item)
      }
    },
  }
</script>

<style lang="scss" scoped>
  .customStyle{
    margin: 5px 0;
    border-radius: 0;
    border: 1px darkgray solid;
    position: relative;
    overflow: hidden;
  }
  .profit-colour{
    background-color: transparent;
    width: 10px;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .good{
    background-color: var(--success);
  }
  .avg{
    background-color: var(--warning);
  }
  .bad{
    background-color: var(--danger);
  }

  .fade-enter-active, .fade-leave-active {
    transition:0.3s ease;
    -webkit-transition:0.3s ease;
    -moz-transition:0.3s ease;
    left: 0;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    transition:0.3s ease;
    -webkit-transition:0.3s ease;
    -moz-transition:0.3s ease;
    left: -10px;

  }

</style>
