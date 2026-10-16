<template>
  <div>

    <menuNameComponent>

    </menuNameComponent>
    <section v-for="(item,value) in menuCardDataStore">
      <div :id="value" class="menukaartPaper">
        <!--    split this up-->
        <shadowOverlay v-if="active"></shadowOverlay>
        <b-list-group>
          <b-list-group-item :key="item.id" @click="removeItem(index)"
                             class="customStyle  flex-column align-items-start"
                             href="#" v-for="(items) in item">

            <div class="d-flex w-100 justify-content-between ">
              <h5 class="mb-1 text-capitalize">
                {{ items.name }}
              </h5>
            </div>
            <p class="mb-1">
              {{ items.desc }}
            </p>
          </b-list-group-item>
        </b-list-group>
      </div>
    </section>

    <div class="pusher">

    </div>
  </div>
</template>

<script>
  import shadowOverlay from './shadow'
  import menuNameComponent from './menuNameComponent'

  export default {
    name: 'menukaartA4',
    props: ['menuCardData'],
    components: {
      shadowOverlay,
      menuNameComponent
    },
    data () {
      return {
        active: false,
      }
    },
    computed: {
      // control: function () {
      //   return this.$route.name === 'control'
      // },
      menuCardDataStore: function () {
        return this.$store.state.createdMenu.menu
      },
    },
    methods: {
      removeItem (index) {
        this.$store.commit('createdMenu/removeMenu', index)
      },
      mouseOver: function () {
        this.active = !this.active
      }
    }
  }
</script>

<style lang="scss" scoped>
  .hover:hover {
    z-index: 10;
  }

  .pusher {
    height: 50px;
  }

  .customStyle {
    border: 0;
    font-size: larger;
    text-align: center;
  }

  .customStyle h5 {
    width: 100%;
  }


  .menukaartPaper {
    width: 795px;
    /*A4 size hoe dit in verhouding*/
    min-height: 842px;
    height: auto;
    padding: 20px;
    background-color: white;
    border: 1px solid gray;
    margin: 10px auto;
  }

  @media print {
    #section-to-print, #section-to-print * {
      visibility: visible;
    }
    #section-to-print {
      width: 595px;
      height: 100%;
      position: absolute;
      border: none;
      margin: 0 auto;
      /*text-decoration: none;*/
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
    }
    .customAnime {
      opacity: 0;
      animation: fadein 0.3s;
    }
    @keyframes fadein {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    /*Effects global*/
    .fade-in-enter-active {
      transition: all 0.5s ease;
    }

    .fade-in-leave-active {
      transition: all 0.5s ease;
    }

    .fade-in-enter, .fade-in-leave-to {
      position: absolute; /* add for smooth transition between elements */
      opacity: 1;
    }
  }
</style>
