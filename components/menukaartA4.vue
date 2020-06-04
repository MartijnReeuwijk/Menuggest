<template>
  <section class="menukaartPaper">

    <b-list-group>
      <!--  Active moet met var  -->
      <b-list-group-item @click="removeItem(item)" v-for="item in menuCardData"  :key="item.message"  href="#"  class="customStyle flex-column align-items-start">
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

  </section>
</template>

<script>
  export default {
    name: 'menukaartA4',
    props:['menuCardData'],
    data () {
      return {


      }
    },
    methods:{
      removeItem(item){
          this.menuCardData.splice(item, 1);
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
  height: 842px;
  padding: 20px;
  background-color: white;
  border: 1px solid gray;
  margin: 10px auto;

}
</style>
