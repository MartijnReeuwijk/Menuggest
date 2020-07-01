<template>
  <b-list-group>
<!--  Active moet met var  -->
    <b-list-group-item @click="clickEvent(item)"  v-for="item in items"  :key="item.message"  href="#"  class="customStyle flex-column align-items-start">
      <div class="clickThrough d-flex w-100 justify-content-between ">
        <transition name="fade" v-enter>
           <div class="profit-colour" v-show="suggestionMode===true" v-bind:class="`${item.profit}`">
           </div>
       </transition>
        <h5 class="mb-1">
          {{ item.message }}
          <b-badge v-if="(suggestionMode===true) && (item.prime) " variant="success">Primeur</b-badge>
        </h5>
      </div>
      <p class="clickThrough mb-1">
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
      clickEvent(item) {
        // Event dep, maar zegt niks in de docs
        if(event.target.classList.contains("active")){
          event.target.classList.remove("active")
        } else {
          event.target.classList.add("active")
          }
        // this.$emit('sendToMenu', item)
        // return this.$store.state.isSettings
        // this.$store.('updatecreatedMenu',item)
        this.$store.commit('createdMenu/add', item)
      }
    },
  }
</script>

<style lang="scss" scoped>
  .clickThrough{
    /*click whole element*/
    pointer-events: none;
  }
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
