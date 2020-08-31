<template>
  <div class="dataElement">
    <p>{{title}}</p>
    <div class="dataElementData">






      <ol v-if="Array.isArray(summeryData)">
        <li v-for="item in summeryData" :key="item.message">
          {{ item }}
        </li>
      </ol>
      <p v-else>{{summeryData}}</p>

    </div>
  </div>

</template>

<script>
  export default {
    name: 'dataElementData',
    props:{
      title:{
        type: String,
        default:"Data inzicht"
      },
      summeryData:{
        default:"Data inzicht"
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dataElement{
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
  .dataElementData{
    width: calc(100% - 10px);
    height: auto;
    /*background-color: orangered;*/
    border-top: #47494e solid 1px;
    display: flex;
    justify-content: space-evenly;
  }
  .dataElementData ol {
    padding: 5px;
    margin: 0px;
  }
</style>
