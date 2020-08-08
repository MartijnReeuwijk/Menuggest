<template>
  <div class="cardWrapper">
    <b-card :title=title :sub-title=type>
      <b-card-text>
       {{desc}}
      </b-card-text>

      <b-card-text>{{profit}}</b-card-text>

      <div class="buttonHolder">
        <b-button href="#" variant="primary">Open menu</b-button>
        <b-button href="#" variant="light">Delete</b-button>
      </div>

    </b-card>
  </div>

</template>

<script>
  export default {
    name: 'tile',
    props: {
      title: String,
      desc:{
        type: String,
        default: ''
      },
      type:{
        type: String,
        default: 'Geen seizoen'
      },
      profit:{
        type: String,
        default: 'Geen data'
      }
    }
  }
</script>

<style lang="scss" scoped>
.cardWrapper{
  width: 350px;
  /*height: 350px;*/
  margin: 10px;
}
  .buttonHolder{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
</style>
