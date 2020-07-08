<template>
  <b-list-group>
    <!--  Active moet met var  -->
    <!-- De transision moet van buiten het scherm komen -->

    <b-list-group-item @click="clickEvent(item)"  v-for="item in items"  :key="item.message"  href="#"  class="customStyle card-1 flex-column align-items-start">

      <div class="clickThrough d-flex w-100 justify-content-between ">
        <transition name="fade" >
          <div class="profit-colour" v-show="suggestions" v-bind:class="`${item.profit}`"></div>
        </transition>
        <h5 class="mb-1">
          {{ item.message }}
          <transition name="fade" >
            <b-badge v-show="(suggestions) && (item.prime) " variant="success">Primeur</b-badge>
          </transition>
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
  import myFile from '../assets/menukaart.json'
  export default {
    name: 'menuDataHolder',
    data () {
      return {
        items: this.$store.state.createdMenu.menuItems,
      }
    },
    created: function () {
      this.$store.commit('createdMenu/addMenucardItem', myFile)
    },
    computed: {
      suggestions: function () {
        return this.$store.state.createdMenu.suggestionMode
      }
    },
    methods: {
      clickEvent(item) {
        // maak dit op store base
        if(event.target.classList.contains("active")){
          event.target.classList.remove("active")
        } else {
          event.target.classList.add("active")
        }
        this.$store.commit('createdMenu/addMenu', item)
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

  .card-1{
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  }
  .card-1:hover {
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
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
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    transition: 0.3s ease;
    -webkit-transition: 0.3s ease;
    -moz-transition: 0.3s ease;
    left: -10px;
  }


</style>
