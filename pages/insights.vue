<template>
 <section>
   <navigation-bar
     title="Menuggest"
   />

<section class="holder">

  <section class="insight_holder">
    <section class="topDataHolder">

      <data-element-data title="Totaal verkoop" :summeryData=totalProductsSold  ></data-element-data>
      <data-element-data title="Hardlopers" :summeryData=highSaleRateResently  ></data-element-data>
      <data-element-data title="Gemidelde omzet marge" :summeryData=avgMargin  ></data-element-data>
      <data-element-data title="Meest verkochte product" :summeryData=popDish  ></data-element-data>

    </section>
    <section class="centerDataHolder">
      <section class="left DataHolder">
        <div class="titleHolder">
          <p>Overzicht:</p>
        </div>
        <b-card no-body>
          <b-tabs card>
<!--      Dit kan ik dynamic maken maar dat is evne dneken en heb ik n even geen zin in, want het heeft best veel factors
       Eerst in de data filter Meierij, bok en terras onderscheiden. dan die verder onderscheiden in soort voor/hoofd/na
       dan plaatsen bij de correcten tab die ook synamic moet van de drie main.
       Het is voor nu niet heel erg maar ga ik wel oplossen als het meer compleet is
       -->
            <b-tab title="Meierij" active>
              <div class="itemsHolder">
                <b-list-group>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" data-filterValue="Voorgerechten Meierij" @click="filterJson">Voorgerechten
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" data-filterValue="Hoofgerechten Meierij" @click="filterJson">Hoofdgerechten
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" data-filterValue="Nagerechten Meierij" @click="filterJson">Na gerechten
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" data-filterValue="Maandmenu Meierij" @click="filterJson">Seizoens gerechten
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" data-filterValue="drank Meierij" @click="filterJson">Drank totaal
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" data-filterValue="Warme dranken Meierij" @click="filterJson">Koffie / Warmen dranken
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" data-filterValue="Frisdrank Meierij" @click="filterJson">Fris
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" data-filterValue="Bieren Meierij" @click="filterJson">Bier
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" data-filterValue="Wijnen Meierij" @click="filterJson">Wijnen
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" data-filterValue="gedestilleerd Meierij" @click="filterJson">Gedestilleerd
                  </b-list-group-item>
                </b-list-group>
              </div>
            </b-tab>
            <b-tab title="Bokkesteeg">
              <div class="itemsHolder">
                <b-list-group>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" @click="filterJson">Voorgerechten
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" @click="filterJson">Hoofdgerechten
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" @click="filterJson">Na gerechten
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" @click="filterJson">Seizoens gerechten
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" @click="filterJson">Drank totaal
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" @click="filterJson">Koffie
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" @click="filterJson">Fris
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" @click="filterJson">Bier
                  </b-list-group-item>
                </b-list-group>
              </div>
            </b-tab>
            <b-tab title="Terras">
              <div class="itemsHolder">
                <b-list-group>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" @click="filterJson">Voorgerechten
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" @click="filterJson">Hoofdgerechten
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" @click="filterJson">Na gerechten
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" @click="filterJson">Seizoens gerechten
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" @click="filterJson">Drank totaal
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" @click="filterJson">Koffie
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" @click="filterJson">Fris
                  </b-list-group-item>
                  <b-list-group-item class="d-flex justify-content-between align-items-center" @click="filterJson">Bier
                  </b-list-group-item>
                </b-list-group>
              </div>
            </b-tab>
          </b-tabs>
        </b-card>

      </section>
      <section class="right DataHolder">
        <div class="titleHolder d-flex flex-row">
          <p>Data breakdown:</p>
          <b-dropdown id="dropdown-1" text="Dropdown Button" class="m-md-2 test">
            <b-dropdown-item>Bar chart</b-dropdown-item>
            <b-dropdown-item>Line chart</b-dropdown-item>
            <b-dropdown-item>Donought chart</b-dropdown-item>
          </b-dropdown>
        </div>
        <div class="dataVisualHolder">
          <client-only>
            <DoChart :data="filteredDataForVisual" :options="{ maintainAspectRatio: true }"></DoChart>
          </client-only>
        </div>

      </section>
    </section>

    <section class="bottomDataHolder">
      <div class="titleHolder">
        <p>Totale verkoop 2020: <i>(Maandmenu en Diverse samengevoegd)</i></p>
      </div>
      <div class="barholder">
      <client-only>
        <BarChart :data="totalValues" :options="{ maintainAspectRatio: false }"></BarChart>
      </client-only>
      </div>
    </section>


  </section>
   </section>
 </section>
</template>

<script>
  import NavigationBar from '../components/navigationBar'
  import Leftbar from '../components/leftbar'
  import DataCard from '../components/insights/dataCard'
  import kassaData from '../assets/csvjson.json'
  import BarChart from '~/components/bar-chart'
  import DoChart from '../components/do-chart'
  import DataElementData from '../components/insights/dataElementData'

  export default {
    name: 'insights',
    components: {
      DataElementData,
      DoChart,
      DataCard,
      Leftbar,
      BarChart,
      NavigationBar,
    },
    data () {
      return {
        showKassaData: kassaData,
        defaultSelected:"Voorgerechten",
        totalProductsSold:1200,
        highSaleRateResently:[],
        avgMargin:"240%",
        popDish:"Sate",
        datacollection: [],
        labelsA:[],
        dataA:[],
        totalValues:{

        },
        filteredDataForVisual:{

        }
      }
    },
    mounted () {
     this.splitData(this.showKassaData)
    },
    computed:{


    },
    methods:{
      splitData(data){
        const usable_data_array_total = {
          const_a_labels:  [],
          constPrice:  [],
          backgroundColor:[],
          quantity:  [],
          location:[]
        }
        let totalSale = null;
        const usefulldata = []
        data.forEach(items => {
          usefulldata.push(
            {
              name: items["Artikelen"],
              quantity: items["FIELD4"],
              price: items["FIELD5"],
              location: items["FIELD13"]
            }
          )
        })
        usefulldata.forEach(item => {
          if (Number.isFinite(item.quantity) && !item.location.includes('feestweek') ) {
            usable_data_array_total.const_a_labels.push(item.name)
            usable_data_array_total.constPrice.push(item.price)
            usable_data_array_total.quantity.push(item.quantity)
            usable_data_array_total.location.push(item.location)
          }
        })
      this.totalValues = {
          labels: usable_data_array_total.const_a_labels,
            datasets: [
          {
            label: 'Meierij',
            backgroundColor: '#41B38A',
            barPercentage: 0.5,
            barThickness: 6,
            maxBarThickness: 8,
            minBarLength: 2,
            data:  usable_data_array_total.quantity
          }
        ]
        }
        this.totalProductsSold = Math.floor(totalSale)
        this.$store.commit('createdMenu/dataVisualUseable', usefulldata)


        this.makeDon(this.defaultSelected)
        this.populairDish()
        this.highSaleRate()
      },
      allocateData(items){

      },
      makeDon(filter){

        const FunctionArray = this.$store.state.createdMenu.dataVisualUseable
        const usable_data_array = {
          const_a_labels:  [],
          constPrice:  [],
          backgroundColor:
            ["#8dd3c7","#ffffb3","#bebada","#fb8072","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd","#ccebc5","#ffed6f"]          ,
          quantity:  [],
          location:[]
        }

        FunctionArray.forEach(item => {
          if (Number.isFinite(item.quantity) && item.location.includes(filter)   ) {
            usable_data_array.const_a_labels.push(item.name)
          usable_data_array.constPrice.push(item.price)
          usable_data_array.quantity.push(item.quantity)
          usable_data_array.backgroundColor.push(
            this.generateColour(12340982)
          )
          }
        })

        this.filteredDataForVisual = {
          labels: usable_data_array.const_a_labels,
          datasets: [
            {
              label: 'Meierij',
              backgroundColor:  usable_data_array.backgroundColor,
              data:  usable_data_array.quantity
            }
          ]
        }

      },
      generateColour(number){
        return `${'#'+Math.floor(Math.random()*number).toString(16)}`
      },
      filterJson(e){
        this.makeDon(e.currentTarget.getAttribute('data-filterValue'))
      },
      populairDish(){
        const data = this.$store.state.createdMenu.dataVisualUseable
        const max = data.reduce(function(prev, current) {
          return (prev.quantity > current.quantity) ? prev : current
        }) //returns object
        this.popDish = max.name
      },
      highSaleRate(){
        const FunctionArray = this.$store.state.createdMenu.dataVisualUseable
        const FAKEITEMSPOP = []
        for (var i = 0; i < 3; i++) {
          const item = FunctionArray[Math.floor(Math.random() * FunctionArray.length)];
          FAKEITEMSPOP.push(item.name)
        }
        this.highSaleRateResently = FAKEITEMSPOP
      },
    }
  }


</script>

<style lang="scss" scoped>
  .barholder{
    width: 100%;
  }
  .holder{
    background-color: ghostwhite;
    overflow: hidden;
  }
  .test{
    position: absolute;
    top: -1px;
    right: 5px;
  }
  .insight_holder{
    padding: 10px;
    margin: 0 auto;
    max-width: 1250px;
    background-color: transparent;
  }
  .topDataHolder{
    width: 100%;
    height: 150px;
    display: flex;
    justify-content: space-evenly;
  }
  .centerDataHolder{
    display: flex;
  }


.titleHolder{
  width: 100%;
  border-bottom: 1px solid gray;
  margin: 5px 0;
  text-transform: capitalize;
}
.DataHolder{
  width: calc(50% - 20px);
  position: relative;
  padding: 5px;
  background-color: white;
  border-radius: 5px;
  margin: 10px;
}
.bottomDataHolder{
  position: relative;
  padding: 5px;
  background-color: white;
  border-radius: 5px;
  margin: 10px;
}

  .holder{
    display: flex
  }
  .insight_holder{
    width: 100%;
  }
</style>
