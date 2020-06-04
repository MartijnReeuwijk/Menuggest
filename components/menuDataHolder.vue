<template>
  <b-list-group>
<!--  Active moet met var  -->
    <b-list-group-item @click="addtomenu(item)"  v-for="item in items"  :key="item.message"  href="#"  class="customStyle flex-column align-items-start">
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
</template>

<script>
  /* eslint-disable no-alert, no-console */

  export default {
    data () {
      return {
        items: [
          { message: 'Runder-ribeye 350',
            desc:'Voor de vleesliefhebber 350g van de grill met pepersause'
          },
          { message: 'Zalmfilet',
            desc:'Zalmfilet op de huid gebakken met sause van mosterd en basilicum'
          },
          { message: 'Eendenborst',
            desc:'Zuurkool en aardappelpuree'
          },
          { message: 'sate van varkenshaas',
            desc:'rose gebakken met een saus van gorgonzolakaas'
          },
        ]
      }
    },
    methods: {
      addtomenu(item) {
        console.log("Data holder",item)
        this.$emit('sendToMenu', item)
      }
    },
    name: 'menuDataHolder'

  }
</script>

<style lang="scss" scoped>
  .customStyle{
    margin: 5px 0;
    border-radius: 0;
    border: 1px darkgray solid;
  }

</style>
