<template>
<!--  <div class="cardWrapper">-->
<!--    <b-card :title=title :sub-title=type>-->
<!--      <b-card-text>-->
<!--       {{desc}}-->
<!--      </b-card-text>-->

<!--      <b-card-text>{{profit}}</b-card-text>-->

<!--      <div class="abc">-->
<!--        <b-button href="#" variant="primary">Open menu</b-button>-->
<!--        <b-button href="#" variant="light">Delete</b-button>-->
<!--      </div>-->
<!--      <div class="card-footer text-muted">-->
<!--        2 days ago-->
<!--      </div>-->
<!--    </b-card>-->

    <div :title=title :sub-title=type class="card">
      <div class="card-body">
        <h5 class="card-title">{{title}}</h5>
        <p class="card-text">
          {{desc}}
        </p>

        <p class="card-text">
          {{profit}}
        </p>
      </div>
      <div class="abc">
        <a href="#" class="btn btn-primary">Open</a>
        <a href="#" class="btn btn-outline-danger">Delete</a>
      </div>

      <div class="card-footer">
        <small class="text-muted">Gemaakt op [Datum]</small>
      </div>
    </div>

<!--  </div>-->

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
  .abc{
    width: 100%;
    padding: 10px;
    display: flex;
    justify-content: space-between;
  }
.card{
  transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
}
.card:hover {
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
}

</style>
