<template>
  <section class="rightSideHolder">
    <div>

      <div class="titelHolder">
        <h2>
          {{ title }}
        </h2>
        <filterHolder></filterHolder>
      </div>

      <transition name="slide-fade">
        <menu-list-toolkit v-if="toolkit.toolkit">

        </menu-list-toolkit>
      </transition>

      <div class="innerScroll">
        <menuDataHolder :editAble="editAble">
        </menuDataHolder>
      </div>
    </div>

  </section>
</template>

<script>
  /* eslint-disable no-alert, no-console */
  import menuDataHolder from './menuDataHolder'
  import filterHolder from './filterHolder'
  import MenuListToolkit from './menuListToolkit'

  export default {
    data () {
      return {}
    },
    props: {
      editAble:{
        Type: Boolean,
        default: false
      },
      title: {
        Type: String,
        default: null
      },
      menuOptionsSelected: {},
      selectedCourse: {},
    },
    computed: {
      toolkit: function () {
        return this.$store.state.createdMenu
      }
    },
    name: 'RightsideHolder',
    components: {
      MenuListToolkit,
      menuDataHolder,
      filterHolder
    },

  }
</script>

<style lang="scss" scoped>
  .innerScroll {
    padding: 0 10px;
    height: calc(100vh - 135px);
    overflow: scroll;
    z-index: -1;
    overflow-x: hidden;
  }

  .innerScroll::-webkit-scrollbar {
    display: none;
  }


  hr {
    margin: 10px 0;
  }

  h2 {
    text-align: center;
    padding: 5px;
    margin: 0px;
  }

  .rightSideHolder {
    width: 400px;
    height: auto;
    background-color: #F7F8FB;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }

  .titelHolder {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
  }


  .slide-fade-enter-active {
    transition: all .3s ease;
  }

  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */
  {
    transform: translateY(-10px);
    opacity: 0;
  }
</style>
