<template>
  <b-card :title=title footer-tag="footer" header-tag="header">
    <template v-slot:header>
      <h6 class="mb-0">{{type}}</h6>
      <h6 class="mb-0">Verkocht: {{sold}}</h6>
    </template>
    <b-card-text>{{desc}}</b-card-text>
    <div class="betterSpace">
      <b-button href="/menuArchive" variant="primary">Menu inzien</b-button>
      <b-button @click="deleteItem" variant="light">Delete</b-button>
    </div>
    <template v-slot:footer>
      <em>{{datum}}</em>
    </template>
  </b-card>

  <!--  </div>-->

</template>

<script>
  export default {
    name: 'tile',
    props: {
      title: String,
      desc: {
        type: String,
        default: ''
      },
      datum: {
        type: String,
        default: '10-12-2019'
      },
      type: {
        type: String,
        default: ''
      },
      profit: {
        type: String,
        default: 'Geen data'
      },
      sold: {
        type: Number,
        default: 0
      }
    },
    methods: {
      deleteItem () {
        this.$store.commit('createdMenu/showOverlay', true)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .betterSpace {
    justify-content: space-between;
    display: flex;
  }

  .cardButtonHolder {
    width: 100%;
    padding: 10px;
    display: flex;
    margin: 10px;
    justify-content: space-between;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
  }

  .card {
    min-width: 300px;
    margin: 10px;
    transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
  }

  .card:hover {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }

</style>
