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
                  v-model="desc"
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
                  {{this.form.ingredients}}
                </div>

<!--                <b-form-group  class="customSize" id="price" label="verkoop prijs" label-for="userProfits">-->
<!--                  <b-form-input type="number" v-model="form.price" placeholder="€0">-->
<!--                  </b-form-input>-->
<!--                </b-form-group>-->

<!--                <b-form-group class="customSize" id="menuUserProfits" label="geschatte winst" label-for="userProfits">-->
<!--                  <b-form-input type="number" v-model="form.userAssignedProfit" placeholder="€0">-->
<!--                  </b-form-input>-->
<!--                </b-form-group>-->

              </div>

              <b-form-group id="input-group-4" label="Extra gerechten infomatie" label-for="input-4">
                <b-form-checkbox-group v-model="form.checked" id="checkboxes-4">
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

      <RightsideHolder title="Gerechten"></RightsideHolder>
    </main>


  </section>
</template>

<script>
  import navigationBar from '../components/navigationBar'
  import RightsideHolder from '../components/RightsideHolder'
  import leftbar from '../components/leftbar'
  import seasons from '../assets/season.json'
  // import ingredients from '../assets/ingredients.json'


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
        form: {
          name: '',
          food: null,
          season: null,
          checked: [],
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
        show: true
      }
    },
    mounted(){
      this.seasonsTest.forEach(item => {
        this.seasons.push(item.season)
      })
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault()
        alert(JSON.stringify(this.form))
      },
      onReset(evt) {
        evt.preventDefault()
        // Reset our form values
        this.form.name = ''
        this.form.food = null
        this.form.checked = []
          this.form.season= null
          this.form.checked= []
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




</style>
