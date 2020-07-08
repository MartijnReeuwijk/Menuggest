<template>
  <div>

    <menuNameComponent>

    </menuNameComponent>


    <section class="menukaartPaper" id="section-to-print" ref="menukaartPaper">
      <!--    split this up-->
      <shadowOverlay v-if="active"></shadowOverlay>

<!--Dit beter-->
      <div v-if="(menuCardDataStore.length > 0 && menuCardDataStore[0].options) && (control) ">
        <b-list-group>
          <b-list-group-item
            v-b-hover="mouseOver"
            v-for="(item, index) in menuCardDataStore[0].options"
            v-b-popover.hover="{title:item.profitInsight.title, content:item.profitInsight.content}"
            :key="item.id"
            href="#"
            class="hover customStyle flex-column align-items-start"
          >
            <div class="d-flex w-100 justify-content-between ">
              <!--     Moet dit afvangen bij de backend        -->
              <h5 class="mb-1">
                {{ item.message }}
              </h5>
            </div>
            <p class="mb-1">
              {{ item.desc }}
            </p>
          </b-list-group-item>
        </b-list-group>
      </div>



      <div v-if="(menuCardDataStore.length > 0 && menuCardDataStore[0].options) && (!control)">
        <b-list-group>
          <!--  verander de remove function      -->

          <b-list-group-item
            @click="removeItem(index)"
            v-for="(item, index) in menuCardDataStore[0].options"
            :key="item.id"
            href="#"
            class="customStyle flex-column align-items-start"
          >
            <div class="d-flex w-100 justify-content-between ">
              <!--     Moet dit afvangen bij de backend        -->
              <h5 class="mb-1">
                {{ item.message }}
              </h5>
            </div>
            <p class="mb-1">
              {{ item.desc }}
            </p>
          </b-list-group-item>
        </b-list-group>
      </div>



      <div v-else>
        <b-list-group>

          <b-list-group-item @click="removeItem(index)" v-for="(item, index) in menuCardDataStore"  :key="item.id"   href="#"  class="customStyle  flex-column align-items-start">

            <div class="d-flex w-100 justify-content-between ">
              <h5 class="mb-1">
                {{ item.message }}
              </h5>
            </div>
            <p class="mb-1">
              {{ item.desc }}
            </p>

          </b-list-group-item>
        </b-list-group>
      </div>



    </section>
  </div>
</template>

<script>
  import shadowOverlay from './shadow'
  import menuNameComponent from './menuNameComponent'
  export default {
    name: 'menukaartA4',
    props:['menuCardData'],
    components:{
      shadowOverlay,
      menuNameComponent
    },
    data () {
      return {
        active: false,
        menudataTest:[]
      }
    },
    // watch:{
    //   menuCardDataStore: function(){
    //     return this.$store.state.createdMenu.createdMenu
    //   }
    // },

    computed:{
      control: function () {
        return this.$route.name === "control";
      },
      menuCardDataStore: function(){
        this.menudataTest.push([])
        return this.$store.state.createdMenu.createdMenu
      }
    },
    methods:{
      removeItem(index){
        this.$store.commit('createdMenu/removeMenu',index)
      },
      mouseOver: function(){
        this.active = !this.active;
      }
    }
  }
</script>

<style lang="scss" scoped>
  .hover:hover{
    z-index: 10;
  }
  .customStyle{
    border: 0;
    text-align: center;
  }
  .customStyle h5 {
    width: 100%;
  }
  .menukaartPaper{
    width: 595px;
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
.customAnime{
  opacity: 0;
  animation: fadein 0.3s;
}
    @keyframes fadein {
      from { opacity: 0; }
      to   { opacity: 1; }
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
