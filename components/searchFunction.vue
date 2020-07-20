<template>
  <div class="input-group padding">
    <input @change="filterSearch" aria-describedby="basic-addon2" aria-label="Zoeken" class="form-control"
           placeholder="Zoeken" type="text" v-model="search">
    <div class="input-group-append">
      <button @click="filterSearch" class="btn btn-outline-secondary" type="button">Zoeken</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'searchFunction',
    data () {
      return {
        search: ''
      }
    },
    methods: {
      filterSearch () {
        const data = this.$store.state.createdMenu.menuItems
        const newDataArray = []
        data.filter(item => {
          // return item.message.toLowerCase().indexOf(this.search.toLowerCase()) > -1
          if (item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1) {
            newDataArray.unshift(item)
          } else {
            newDataArray.push(item)
          }
        })
        console.log('filteredData', newDataArray)
        this.$store.commit('createdMenu/addMenucardItem', newDataArray)
      }
    }

  }

</script>

<style lang="scss" scoped>
  .padding {
    padding: 5px 10px;
  }
</style>
