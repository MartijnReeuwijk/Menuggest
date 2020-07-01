<template>
  <div>

    <menuNameComponent></menuNameComponent>


    <section class="menukaartPaper" ref="menukaartPaper">
      <!--    split this up-->
      <shadowOverlay v-if="active"></shadowOverlay>
      <div v-if="(menuCardDataStore.createdMenu.length > 0 && menuCardDataStore.createdMenu[0].options) && (control) ">
        <b-list-group>
          <b-list-group-item
            v-b-hover="mouseOver"
            v-for="(item, index) in menuCardDataStore.createdMenu[0].options"
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

      <div v-if="(menuCardDataStore.createdMenu.length > 0 && menuCardDataStore.createdMenu[0].options) && (!control)">
        <b-list-group>
          <!--  verander de remove function      -->
          <b-list-group-item
            @click="removeItem(index)"
            v-for="(item, index) in menuCardDataStore.createdMenu[0].options"
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
          <b-list-group-item @click="removeItem(index)" v-for="(item, index) in menuCardDataStore.createdMenu"  :key="item.id"   href="#"  class="customStyle flex-column align-items-start">
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
        active: false
      }
    },
    computed:{
      control: function () {
        return this.$route.name === "control";
      },
      menuCardDataStore: function(){
        return this.$store.state.createdMenu
      }
    },
    methods:{
      removeItem(index){
        this.menuCardData.splice(index, 1);
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
</style>
