<template>
  <section class="menukaartPaper" ref="menukaartPaper">
<shadowOverlay></shadowOverlay>
    <div v-if="(menuCardData.length > 0 && menuCardData[0].options) && (control) ">
        <b-list-group>
          <b-list-group-item
            @click="removeItem(index)"
            @mouseover="mouseOver"
            v-for="(item, index) in menuCardData[0].options"
            v-b-popover.hover="{title:item.profitInsight.title, content:item.profitInsight.content}"
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

    <div v-if="menuCardData.length > 0 && menuCardData[0].options">
      <b-list-group>
        <b-list-group-item
          @click="removeItem(index)"
          v-for="(item, index) in menuCardData[0].options"
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
      <b-list-group-item @click="removeItem(index)" v-for="(item, index) in menuCardData"  :key="item.id"   href="#"  class="customStyle flex-column align-items-start">
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
</template>

<script>
  import shadowOverlay from './shadow'
  export default {
    name: 'menukaartA4',
    props:['menuCardData'],
    components:{
      shadowOverlay
    },
    data () {
      return {
        active: false
      }
    },
    computed:{
      control: function () {
        return this.$route.name === "control";
      }
    },
    methods:{
      removeItem(index){
        this.menuCardData.splice(index, 1);
      },
      mouseOver: function(){
        console.log('active', this.active)
        this.active = !this.active;
      }
    }
  }
</script>

<style lang="scss" scoped>
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
