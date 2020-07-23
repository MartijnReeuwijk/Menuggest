<template>
 <section>

   <navigation-bar
     title="Menuggest"
   />

<!--   TODO slots-->
<section class="holder">
  <leftbar/>

  <section class="insight_holder">
<demo></demo>

  </section>



   </section>

 </section>
</template>

<script>
  import NavigationBar from '../components/navigationBar'
  import Leftbar from '../components/leftbar'
  import axios from 'axios'
  import Demo from '../components/insights/demo'

  export default {
    name: 'insights',
    data(){
      return{
        posts:{},
        testData:[
          {
            "field1": "Ice tea green",
            "field2": "7",
            "field3": "Ice tea green",
            "field4": "78",
            "field5": "2,50",
            "field6": "195,00",
            "field7": "184,08",
            "field8": "1",
            "field9": "6%",
            "field10": "0,00",
            "field11": "0,00",
            "field12": "1",
            "field13": "Frisdrank Meierij"
          },
          {
            "field1": "Tonic ",
            "field2": "8",
            "field3": "Tonic ",
            "field4": "60",
            "field5": "2,50",
            "field6": "150,00",
            "field7": "141,60",
            "field8": "1",
            "field9": "6%",
            "field10": "0,00",
            "field11": "0,00",
            "field12": "1",
            "field13": "Frisdrank Meierij"
          },
          {
            "field1": "Ginger ale",
            "field2": "9",
            "field3": "Ginger ale",
            "field4": "5",
            "field5": "2,50",
            "field6": "12,50",
            "field7": "11,80",
            "field8": "1",
            "field9": "6%",
            "field10": "0,00",
            "field11": "0,00",
            "field12": "1",
            "field13": "Frisdrank Meierij"
          },
          {
            "field1": "Bitter lemon",
            "field2": "10",
            "field3": "Bitter lemon",
            "field4": "49",
            "field5": "2,50",
            "field6": "122,50",
            "field7": "115,64",
            "field8": "1",
            "field9": "6%",
            "field10": "0,00",
            "field11": "0,00",
            "field12": "1",
            "field13": "Frisdrank Meierij"
          },
          {
            "field1": "Appelsap",
            "field2": "11",
            "field3": "Appelsap",
            "field4": "69",
            "field5": "2,50",
            "field6": "172,50",
            "field7": "162,84",
            "field8": "1",
            "field9": "6%",
            "field10": "0,00",
            "field11": "0,00",
            "field12": "1",
            "field13": "Frisdrank Meierij"
          },
          {
            "field1": "Sinas",
            "field2": "12",
            "field3": "Sinas",
            "field4": "55",
            "field5": "2,50",
            "field6": "137,50",
            "field7": "129,80",
            "field8": "1",
            "field9": "6%",
            "field10": "0,00",
            "field11": "0,00",
            "field12": "1",
            "field13": "Frisdrank Meierij"
          },
          {
            "field1": "Cassis",
            "field2": "13",
            "field3": "Cassis",
            "field4": "36",
            "field5": "2,50",
            "field6": "90,00",
            "field7": "84,96",
            "field8": "1",
            "field9": "6%",
            "field10": "0,00",
            "field11": "0,00",
            "field12": "1",
            "field13": "Frisdrank Meierij"
          },
          {
            "field1": "Rivella",
            "field2": "14",
            "field3": "Rivella",
            "field4": "13",
            "field5": "2,50",
            "field6": "32,50",
            "field7": "30,68",
            "field8": "1",
            "field9": "6%",
            "field10": "0,00",
            "field11": "0,00",
            "field12": "1",
            "field13": "Frisdrank Meierij"
          },
          {
            "field1": "Chocomel",
            "field2": "15",
            "field3": "Chocomel",
            "field4": "10",
            "field5": "2,50",
            "field6": "25,00",
            "field7": "23,60",
            "field8": "1",
            "field9": "6%",
            "field10": "0,00",
            "field11": "0,00",
            "field12": "1",
            "field13": "Frisdrank Meierij"
          },
        ]
      }
    },
    // async asyncData ({ params }) {
    //   const data  = await axios.get(`http://192.168.2.16:5000/kassa`)
    //   console.log('data', data)
    //   return data
    // },
    components: {Demo, Leftbar, NavigationBar}
  }
</script>

<style lang="scss" scoped>
  .holder{
    display: flex
  }
  .insight_holder{
    width: 100%;
  }
</style>
