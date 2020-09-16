<template>
  <section class="sideMenuDeals">
    <b-nav vertical>

      <div class="titelHolder">
        <h2>
          {{ title }}
        </h2>
        <leftfilter></leftfilter>

        <div class="buttonHolder">
          <b-button block variant="primary" class="text-capitalize">
            gerecht zoeken
          </b-button>

          <b-button block @click="reset" variant="danger" class="text-capitalize">
            Reset
          </b-button>
        </div>
        <!--    Wil dit eigelijk per click maar mega items is slow        -->


      </div>

      <b-card class="mb-1" no-body>
        <div v-for="(items, index) in apiListedIngredients">
          <b-card-header class="p-1" header-tag="header" role="tab">
            <!--                        `v-b-toggle.accordion-${{index}}`-->
            <b-button block class="text-capitalize" v-b-toggle="'accordion-' + index" variant="info">
              {{items.mainMenu}}
            </b-button>
          </b-card-header>

          <b-collapse :id="'accordion-' + index" accordion="my-accordion" role="tabpanel">
            <b-card-body class="ingredientListHolder">
              <div class="click" v-for="item in items.subMenu">
                <b-form-checkbox @change.native="match" :value="item" v-model="search.ingredients">
                  {{item}}
                </b-form-checkbox>
              </div>
            </b-card-body>
          </b-collapse>
        </div>
      </b-card>
    </b-nav>
  </section>
</template>

<script>
  import ingredients from '../assets/apiFilterMenu.json'
  import Leftfilter from './apiIngredentFilter/leftFilter'

  export default {
    name: 'leftbar',
    data () {
      return {
        preFilter:[],
        ingredientsList: ingredients,
        apiListedIngredients: [],
        search:{
          ingredients:[]
        }
      }
    },
    props: {
      title: {
        Type: String,
        default: null
      },
    },
    components:{
      Leftfilter
    },
    mounted () {
      this.preFilter = this.$store.state.createdMenu.menuItems

      this.ingredientsList.forEach(items => {
        this.apiListedIngredients.push(items)
      })
    },
    methods:{
      reset(){

      },
      match(){
        const preFilter = this.preFilter
        const selectedIngredient = this.search.ingredients
        let containsSelected = []
        // Ingredenten match alles naar lowercase zo dat de user fouten niet uitmaken
        if (selectedIngredient.length > 0){
          preFilter.forEach(item =>{
            item.ingredients.forEach(ingredientsArray =>{
              selectedIngredient.forEach(selectedIngredientCheck => {
                const lowerCase = ingredientsArray.toLowerCase()
                const lowerCaseSelected = selectedIngredientCheck.toLowerCase()
                // Dit moet omdat ik niet de API van de makro of sligro bestuur of heb
                // Anders had ik dit op die API geplaatst en altijd Lowercase terug gegeven
                if(lowerCase === lowerCaseSelected){
                  containsSelected.push(item)
                }
                else{
                  return false
                }
              })
            })
          })
          // if(containsSelected.length == 0){
          //   containsSelected = [{
          //     name: "Geen resultaat gevonden"
          //   }]
          // }
          this.$store.commit('createdMenu/addMenucardItem', containsSelected)
        }
        else {
          console.log('preFilter', preFilter)
          this.$store.commit('createdMenu/addMenucardItem', preFilter)
        }
        console.log('containsSelected', containsSelected)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .menuItem {
    border: 1px solid black;
    border-radius: 5px;
    margin: 2px 0;
    background-color: white;
    text-transform: capitalize;
  }

  .title {
    display: block;
    padding: 0 1rem;
    margin: 0;
  }
  .titelHolder{
    margin-bottom: 5px;
    /*<!--box-shadow: 0 4px 2px -2px gray;-->*/
    box-shadow:  0 4px 2px -2px rgba(0, 0, 0, 0.12),
     0 4px 2px -2px rgba(0, 0, 0, 0.24);
  }
  .titelHolder h2 {
    text-align: center;
  }
  .buttonHolder{
    width: 100%;
    display: flex;
    justify-content:space-between;
  }
  .buttonHolder button{
    margin: 5px;
  }
  .sideMenuDeals {
    width: 100%;
    max-width: 300px;
    background-color: #F7F8FB;
    position: relative;
    padding: 5px 0;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }

  .customButton {
    width: calc(100% - 10px);
    position: absolute;
    bottom: 5px;
  }
  .custom-control{
    cursor: pointer;

  }
</style>
