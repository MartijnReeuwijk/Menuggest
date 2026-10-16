<template>
  <div class="dataElement">
    <p>{{title}}</p>
    <div class="dataElementData">

      <ol v-if="Array.isArray(summeryData)">
        <li :key="item.message" v-for="item in summeryData">
          {{ item }}
        </li>
      </ol>

      <p class="biggerText success" v-bind:class="{ lowProfit: randomValue }" v-else>{{summeryData}}</p>

    </div>
  </div>

</template>

<script>
  export default {
    name: 'dataElementData',
    props: {
      title: {
        type: String,
        default: 'Data inzicht'
      },
      summeryData: {
        default: 'Data inzicht'
      }
    },
    data () {
      return {
        randomValue: true
      }
    },

    methods: {
      random () {
        const a = Math.random() < 0.5
        console.log(a)
        this.randomValue = a
        // return a
      }
    },
    mounted () {
      this.random()
    },
  }
</script>

<style lang="scss" scoped>
  .success {
    color: var(--success);
  }

  .lowProfit {
    color: var(--danger);
  }

  .biggerText {
    font-size: 1.6em;
  }

  .dataElement {
    width: 250px;
    min-height: 125px;
    padding: 10px;
    align-self: auto;
    border-radius: 5px;
    background-color: white;
    text-transform: capitalize;
  }

  .dataElement p {
    margin: 0;
  }

  .dataElementData {
    width: 100%;
    height: 100%;
    padding: 10px;
    border-top: #47494e solid 1px;
    display: flex;
    justify-content: space-evenly;
  }

  .dataElementData ol {
    padding: 5px;
    margin: 0px;
  }

</style>
