<template>
  <section>
    <navigationBar title="Menuggest"></navigationBar>

    <main class="holder">
      <!--      todo: dit is een standaart ding maak dit een standaart element met slots-->

      <!--   Maak info button   -->

      <div class="sizeAligner">
        <div class="centerHolder">

          <div class="card customCard">

            <div>
              <b-form @submit="onSubmit" @reset="onReset" v-if="show">

                <b-form-group id="input-group-2" label="Gerechts naam:" label-for="input-2">
                  <b-form-input
                    id="input-2"
                    v-model="form.name"
                    required
                    placeholder="Bijv: Rode curry"
                  ></b-form-input>
                </b-form-group>

                <b-form-group id="foodDescGroup" label="Gerechts omschrijving:" label-for="foodDesc">
                  <b-form-textarea
                    id="textarea"
                    v-model="form.desc"
                    placeholder="Bijv: Rode curry met tofu of kip in saus"
                    rows="3"
                    max-rows="6"
                  ></b-form-textarea>
                </b-form-group>

                <div class="formStyleSelect">
                  <b-form-group class="customSize" id="menuTypeGroup" label="Seizoens type" label-for="menuType">
                    <b-form-select
                      id="menuType"
                      v-model="form.season"
                      :options="seasons"
                      required
                    ></b-form-select>
                  </b-form-group>
                  <b-form-group class="customSize" id="input-group-3" label="Soort" label-for="input-3">
                    <b-form-select
                      id="input-3"
                      v-model="form.food"
                      :options="foods"
                      required
                    ></b-form-select>
                  </b-form-group>
                </div>

                <h5>Prijs en margins</h5>
                <div class="profitRelated">

                  <div class="extraPadding">
                    <b-input-group class="" size="md" prepend="€">
                      <b-form-input type="number" v-model="form.price" placeholder="Verkoop prijs">
                      </b-form-input>
                    </b-input-group>
                  </div>

                  <div class="extraPadding">
                    <b-input-group size="md" prepend="€">
                      <b-form-input type="number" v-model="form.userAssignedProfit" placeholder="Geschate winst">
                      </b-form-input>
                    </b-input-group>
                  </div>

                  <div class="ingredients">
                    <h5>Ingredienten</h5>
                    <b-form-group id="ingredientSelectGroup" class="text-capitalize" label-for="ingredientSelect">
                      <b-form-checkbox-group v-model="form.ingredients" id="ingredientSelect">
                        <div v-for="items in apiListedIngredients">
                          <h5>{{items.mainMenu}}</h5>
                          <div class="ingredientListHolder">
                            <div v-for="item in items.subMenu">
                              <b-form-checkbox :value="item" >{{item}}</b-form-checkbox>
                            </div>
                          </div>
                        </div>

                      </b-form-checkbox-group>
                    </b-form-group>

                  </div>
                </div>

                <b-form-group id="input-group-4" label="Extra gerechten infomatie" label-for="input-4">
                  <b-form-checkbox-group v-model="form.extraFoodData" id="checkboxes-4">
                    <b-form-checkbox value="vegetarisch">vegetarisch</b-form-checkbox>
                    <b-form-checkbox value="vegan">vegan</b-form-checkbox>
                    <b-form-checkbox value="noten">noten</b-form-checkbox>
                    <b-form-checkbox value="luxe">luxe product</b-form-checkbox>
                    <b-form-checkbox value="primeur">primeur</b-form-checkbox>
                  </b-form-checkbox-group>
                </b-form-group>

                <b-button type="submit" variant="primary">Submit</b-button>
                <b-button type="reset" variant="danger">Reset</b-button>
                <b-button type="info" variant="info">Uitleg</b-button>
              </b-form>


            </div>

          </div>

        </div>

      </div>



      <!--      <transition-group name="list" tag="div">-->

      <transition name="fade">
        <div class="contextFloater text-capitalize"  v-show="this.form.ingredients.length > 0">
          <h4>Ingredienten lijst</h4>
          <hr>
          <transition-group tag="ul"  name="list">
            <!--            met groups add een key-->
            <li v-for="items in this.form.ingredients" :key="items">
              {{items}}
            </li>
          </transition-group>

        </div>
      </transition>

      <RightsideHolder title="Gerechten"></RightsideHolder>
    </main>


  </section>
</template>

<script>
  import navigationBar from '../components/navigationBar'
  import RightsideHolder from '../components/RightsideHolder'
  import leftbar from '../components/leftbar'
  import seasons from '../assets/season.json'
  import ingredients from '../assets/apiFilterMenu.json'
  // import menukaart from '../assets/menukaart.json'

  export default {
    name: 'editMenu',
    components:{
      navigationBar,
      RightsideHolder,
      leftbar,
    },
    data() {
      return {
        seasonsTest:seasons,
        ingredientsList:ingredients,
        form: {
          name: '',
          food: null,
          season: null,
          extraFoodData: [],
          profit:"avg",
          userAssignedProfit:"",
          desc:"",
          time:"",
          luxe:"",
          course:"",
          price:Number,
          currency:"euro",
          foodType:"",
          ingredients:[]
        },
        foods: [{ text: 'Opties', value: null }, 'Rund', 'Zalm', 'Tonijn', 'Lam','Kalf','Varken','Schaap','Schol','Tong','Bot','Tarbot','Kreeft', 'Krab','Schaaldier', 'Overig'],
        seasons : [{ text: 'Opties', value: null }],
        apiListedIngredients : [],
        show: true
      }
    },
    mounted(){
      this.seasonsTest.forEach(item => {
        this.seasons.push(item.season)
      })
      // speed this up by using the API/Premade data
      this.ingredientsList.forEach(items => {
        this.apiListedIngredients.push(items)
      })
    },
    methods: {
      // todo: Connect dit naar een database
      onSubmit(evt) {
        evt.preventDefault()
        const posOutlook =  this.form
        this.$store.commit('createdMenu/addMenucardItem', posOutlook)

        if(localStorage.getItem('MenuggestDB_menuKaart')){
          let newItem = JSON.stringify(this.form)
          let oldItem = localStorage.getItem('MenuggestDB_menuKaart')
          let olditemArray = [JSON.parse(oldItem)]
          console.log('olditemArray', olditemArray)

          olditemArray.forEach(item =>{
            console.log(item)
          })
          let setNewData = []

        }
        else{
          localStorage.setItem('MenuggestDB_menuKaart', JSON.stringify(this.form))
        }

        // alert(JSON.stringify(this.form))

      },
      onReset(evt) {
        evt.preventDefault()
        // Reset our form values
        this.form.name = ''
        this.form.food = null
        this.form.extraFoodData = []
        this.form.season= null
        this.form.profit="avg"
        this.form.userAssignedProfit=''
        this.form.desc=""
        this.form.time=""
        this.form.luxe=""
        this.form.course=""
        this.form.price=Number
        this.form.currency="euro"
        this.form.foodType=""
        this.form.ingredients= null
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .sizeAligner {
    width: 100%;
    display: flex;
  }
  .holder {
    display: flex;
    justify-content: space-between;
    background-color: darkgray;
  }
  .centerHolder {
    width: 100%;
    height:  calc(100vh - 56px);
    overflow-y:scroll;
  }

  .customCard{
    max-width: 500px;
    margin: 10px auto;
    padding: 10px;
  }
  .customSize{
    min-width: 150px;
    width: 50%;
    text-transform: capitalize;
  }
  .formStyleSelect{
    display: flex;
    justify-content: space-between;
  }
  .profitRelated{
    padding: 0 0 5px 0 ;
  }
  .extraPadding{
    padding: 5px 0 0 0;

  }

  .ingredientListHolder{
    display: flex;
    width: 100%;
    overflow: hidden;
    flex-wrap: wrap;
    justify-content: space-between;
    text-transform: capitalize;
    padding: 10px 0;
  }
  .ingredientListHolder div{
    min-width: 200px;
    max-width: 50%;
    width: 33%;
    align-self: flex-start;
  }
  .contextFloater{
    min-width: 200px;
    height: fit-content;
    opacity: 1;
    padding: 5px;
    border: 5px;
    background-color: white;
    position: fixed;
    border-radius: 5px;
    margin: 5px 0;
    left: 10px;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }


  .fade-enter-active, .fade-leave-active {
    transition: 0.3s ease;
    -webkit-transition: 0.3s ease;
    -moz-transition: 0.3s ease;
    left: 10px;
    opacity: 1;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    transition: 0.3s ease;
    -webkit-transition: 0.3s ease;
    -moz-transition: 0.3s ease;
    left: -10px;
    opacity: 0;
  }


  /*Based on */
  /*https://codepen.io/ktsn/pen/vJgYxB*/
  /*De groeps kreeg ik steeds niet aan de praat maar dit werkt ik zie nu in dat je de transform beter moet doen zo dat je geen pop krijgt */
  .list-enter-active,
  .list-leave-active,
  .list-move {
    transition: 0.3s cubic-bezier(0.59, 0.12, 0.34, 0.95);
    transition-property: opacity, transform;
  }

  .list-enter {
    opacity: 0;
    transform: translateX(-10px) scaleY(0.5);
  }

  .list-enter-to {
    opacity: 1;
    transform: translateX(0) scaleY(1);
  }

  .list-leave-active {
    position: absolute;
  }

  .list-leave-to {
    opacity: 0;
    transform: scaleY(0);
    transform-origin: center top;
  }



</style>
