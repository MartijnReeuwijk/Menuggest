<template>
  <section class="dealItems">
    <b-form-group id="input-group-2" class="deallistFilter" label="Zoek leverancier data" label-for="input-2">
      <div class="buttonHandeler">
        <b-form-input
          id="input-2"
          v-model="form.name"
          @change="filterSearch"
          required
          placeholder="Zoeken"
        >
        </b-form-input>
        <b-button variant="info" onclick.native="filterSearch">
          Zoeken
        </b-button>
      </div>
    </b-form-group>

    <b-list-group>
      <transition-group name="list" tag="div">
        <b-list-group-item
          :key="item.name"
          @click="clickEvent(item)"
          class="customStyle card-1 flex-column align-items-start" href="#"
          v-for="item in deal">

          <div class=" d-flex justify-content-between">
            <div class="profit-colour" v-bind:class="`${item.profit}`"></div>

            <div class="iconHolder">
              <h5>
                {{ item.name }}
                <b-badge v-show="item.prime" variant="success">Primeur</b-badge>
              </h5>
              <div>
              <p>Type: {{item.type}}</p>
              <p>Leverancier: {{item.supplier}}</p>
              </div>
            </div>



            <div class="iconHolderMargin">
              <b-badge class="profitBadge larger" v-bind:class="`${item.profit}`" variant="success">€ {{item.price}}</b-badge>
              <p> Marge: {{item.margin}}%
              </p>
              <p>Gewicht: {{item.amount}}G</p>
            </div>
          </div>


        </b-list-group-item>
      </transition-group>
    </b-list-group>

  </section>
</template>

<script>
  export default {
    name: 'dealComponent',
    data () {
      return {
        form: {
          name: '',
        },
        deal: [
          {
            type: 'rund',
            supplier:"Sligro",
            name: 'Runderhaas',
            price: 25,
            currency: 'euro',
            profit: 'good',
            amount:'500',
            margin: '5'
          },
          {
            type: 'rund',
            supplier:"Sligro",
            name: 'muis',
            price: 10,
            currency: 'euro',
            profit: 'good',
            amount:'500',
            margin: '4'
          },
          {
            type: 'rund',
            supplier:"Makro",
            name: 'Runder muis',
            price: 20,
            currency: 'euro',
            profit: 'bad',
            margin: '0.5',
            amount:'500',
            prime: true,
          },
          {
            type: 'rund',
            supplier:"Sligro",
            name: 'Pianostuk',
            price: 20,
            currency: 'euro',
            profit: 'bad',
            amount:'500',
            margin: '0.5'
          },
          {
            type: 'rund',
            name: 'Flank',
            supplier:"Sligro",
            price: 30,
            currency: 'euro',
            profit: 'good',
            amount:'500',
            margin: '5'
          },
          {
            type: 'tomaat',
            margin: '5',
            currency: 'euro',
            supplier:"Bidfood & Sligro",
            name: 'vlees tomaat',
            price: 10,
            profit: 'good',
            amount:'1000',
          },
          {
            type: 'tomaat',
            margin: '2.5',
            currency: 'euro',
            supplier:"Bidfood",
            name: 'cherry tomaat',
            price: 13,
            profit: 'avg',
            amount:'1000',
            prime: true,
          },
          {
            type: 'tomaat',
            margin: '0',
            currency: 'euro',
            supplier:"Bidfood",
            name: 'tross tomaat',
            price: 18,
            amount:'1000',
            profit: 'bad'
          },
          {
            type: 'tomaat',
            margin: '30',
            supplier:"Bidfood",
            currency: 'euro',
            name: 'tomaat',
            price: 18,
            profit: 'good',
            amount:'1000',
          },
          {
            type: 'Vis',
            margin: '2',
            supplier:"Bidfood",
            currency: 'euro',
            name: 'Bot',
            price: 18,
            profit: 'bad',
            amount:'2000'
          },
          {
            type: 'Vis',
            margin: '10',
            supplier:"Makro",
            currency: 'euro',
            name: 'Forel',
            price: 18,
            profit: 'good',
            amount:'2000',
          },
          {
            type: 'Vis',
            margin: '2',
            supplier:"Makro",
            currency: 'euro',
            name: 'Geep',
            price: 18,
            profit: 'bad',
            amount:'500'
          },
          {
            type: 'gevogelte',
            margin: '12',
            supplier:"Makro & Sligro",
            currency: 'euro',
            name: 'fazant',
            price: 14,
            profit: 'good',
            amount:'500',
          },
          {
            type: 'gevogelte',
            margin: '7',
            supplier:"Makro & Bidfood",
            currency: 'euro',
            name: 'eend',
            prime: true,
            price: 23,
            profit: 'good',
            amount:'500',
          },
          {
            type: 'Sause',
            margin: '200',
            supplier:"Bidfood",
            currency: 'euro',
            name: 'Pesto',
            price: 10,
            profit: 'good',

            amount:'500',          },
          {
            type: 'Sause',
            margin: '7',
            currency: 'euro',
            supplier:"Makro & Bidfood",
            name: 'Mosterdsauze',
            price: 2,
            profit: 'avg',
            amount:'500'
          }
        ]
      }
    },
    methods: {
      clickEvent: function (item) {
      },
        filterSearch () {
          const data = this.deal
          const newDataArray = []
          data.filter(item => {
            if (item.name.toLowerCase().indexOf(this.form.name.toLowerCase()) > -1) {
              newDataArray.unshift(item)
            } else {
              newDataArray.push(item)
            }
          })
          this.deal = newDataArray
        }


    }
  }
</script>

<style lang="scss" scoped>
  h5, p {
    margin: 0;
  }
  .buttonHandeler{
    display: flex;
  }
  .form-control{
    width: calc(100% - 100px);
  }
  .btn{
    width: 90px;
    margin: 0 0 0 10px;
  }
  .iconHolderMargin{
    text-align: right;
  }

  .deallistFilter{
    background-color: white;
    padding: 7px;
    border-radius: 5px;
    margin: 0;
  }
  .iconHolder p{
    margin: 0 7px 0 0;
  }

  .profitBadge {
    align-self: center;
    margin: 0 0 0 10px;
    padding: 7px;
    font-size: 12px;
  }

  .dealItems {
    margin: 10px;
  }

  .customStyle {
    margin: 5px 0;
    text-transform: capitalize;
    border-radius: 0.25rem;
    border: 1px darkgray solid;
    position: relative;
    overflow: hidden;
  }


  .card-1 {
    margin: 10px 0;
    transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
  }

  .card-1:hover {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }

  .profit-colour {
    background-color: transparent;
    width: 10px;
    height: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .good {
    background-color: var(--success);
  }

  .avg {
    background-color: var(--warning);
  }

  .bad {
    background-color: var(--danger);
  }

  .fade-enter-active, .fade-leave-active {
    transition: 0.3s ease;
    -webkit-transition: 0.3s ease;
    -moz-transition: 0.3s ease;
    left: 0;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    transition: 0.3s ease;
    -webkit-transition: 0.3s ease;
    -moz-transition: 0.3s ease;
    left: -10px;
  }
</style>
