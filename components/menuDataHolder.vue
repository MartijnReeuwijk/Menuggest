<template>
  <b-list-group>
    <!--  Active moet met var  -->
    <!-- De transision moet van buiten het scherm komen -->
    <transition-group name="list" tag="div">
      <b-list-group-item :key="item.name" @click="clickEvent(item)"
                         class="customStyle card-1 flex-column align-items-start" href="#"
                         v-for="item in datashow">

        <div class="clickThrough d-flex w-100 justify-content-between ">
          <transition name="fade">
            <div class="profit-colour" v-bind:class="`${item.profit}`" v-show="suggestions"></div>
          </transition>
          <h5 class="mb-1">
            {{ item.name }}
            <transition name="fade">
              <b-badge v-show="(suggestions) && (item.prime) " variant="success">Primeur</b-badge>
            </transition>
          </h5>
        </div>
        <p class="clickThrough mb-1">
          {{ item.desc }}
        </p>

      </b-list-group-item>
    </transition-group>
    <div class="pusher"></div>
  </b-list-group>
</template>

<script>
  /* eslint-disable no-alert, no-console */
  import myFile from '../assets/menukaart.json'

  export default {
    name: 'menuDataHolder',
    data () {
      return {
        // items:
      }
    },
    created: function () {
      const menuKaartNoIng = []
      myFile.forEach(item => {
        if (item.ingredient === false) {
          menuKaartNoIng.push(item)
        }
      })
      this.$store.commit('createdMenu/addMenucardItem', menuKaartNoIng)
    },
    computed: {
      suggestions: function () {
        return this.$store.state.createdMenu.suggestionMode
      },
      datashow: function () {
        return this.$store.state.createdMenu.menuItems
      }
    },
    methods: {
      clickEvent (item) {
        // maak dit op store base
        if (event.target.classList.contains('active')) {
          event.target.classList.remove('active')
        } else {
          event.target.classList.add('active')
        }
        this.$store.commit('createdMenu/addMenu', item)
      }
    },
  }
</script>

<style lang="scss" scoped>
  h5 {
    text-transform: capitalize;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  .pusher {
    height: 60px;
  }

  .clickThrough {
    /*click whole element*/
    pointer-events: none;
  }

  .customStyle {
    margin: 5px 0;
    text-transform: capitalize;
    border-radius: 0.25rem;
    border: 1px darkgray solid;
    position: relative;
    overflow: hidden;
  }

  .card-1 {
    transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
  }

  .card-1:hover {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }


  .profit-colour {
    background-color: transparent;
    width: 10px;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .good {
    background-color: var(--success);
  }

  .avg {
    background-color: var(--warning);
  }

  .bad {
    background-color: var(--danger);
  }

  .fade-enter-active, .fade-leave-active {
    transition: 0.3s ease;
    -webkit-transition: 0.3s ease;
    -moz-transition: 0.3s ease;
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
