<template>
  <div class="dealItems" v-for=" items in dealItems">
    <p>{{items.item}}</p>

  </div>
</template>

<script>
  export default {
    name: 'dealItem',
    data () {
      return {
        dealItems: [
          {
            type: 'rund',
            item: 'Runderhaas',
            price: 25,
            currency: 'euro',
            profit: 'good',
            margin: '1-3'
          },
          {
            type: 'rund',
            item: 'muis',
            price: 10,
            currency: 'euro',
            profit: 'good',
            margin: '1-3'
          },
          {
            type: 'rund',
            item: 'Runder muis',
            price: 20,
            currency: 'euro',
            profit: 'bad',
            margin: '0.5'
          },
          {
            type: 'rund',
            item: 'Pianostuk',
            price: 20,
            currency: 'euro',
            profit: 'bad',
            margin: '0.5'
          },
          {
            type: 'rund',
            item: 'Flank',
            price: 30,
            currency: 'euro',
            profit: 'good',
            margin: '5'
          },
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dealItems {
    margin: 10px;
  }
</style>
