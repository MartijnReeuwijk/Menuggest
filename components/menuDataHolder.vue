<template>
  <b-list-group>
<!--  Active moet met var  -->
    <b-list-group-item @click="addtomenu(item)"  v-for="item in items"  :key="item.message"  href="#"  class="customStyle flex-column align-items-start">
      <div class="d-flex w-100 justify-content-between ">
        <div class="profit-colour" v-if="suggestionMode" v-bind:class="`${item.profit}`"></div>
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
        // Get acctual data
        items: [
          {
            id:1,
            message: 'Runder-ribeye 350',
            profit:'good',
            desc:'Voor de vleesliefhebber 350g van de grill met pepersause'
          },
          {
            id:2,
            message: 'Zalmfilet',
            profit:'good',
            desc:'Zalmfilet op de huid gebakken met sause van mosterd en basilicum'
          },
          {
            id:3,
            message: 'Eendenborst',
            profit:'avg',
            desc:'Zuurkool en aardappelpuree'
          },
          {
            id:4,
            message: 'sate van varkenshaas',
            profit:'bad',
            desc:'rose gebakken met een saus van gorgonzolakaas'
          },
        ]
      }
    },
    props:{
      suggestionMode: {
        type: Boolean,
        default: false
      },
    },

    methods: {
      addtomenu(item) {
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
    position: relative;
  }
  .profit-colour{
    background-color: transparent;
    width: 10px;
    height: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    transition: ease-in-out;
  }
  .good{
    background-color: var(--success);
  }
  .avg{
    background-color: var(--warning);
  }
  .bad{
    background-color: var(--danger);

  }

</style>
