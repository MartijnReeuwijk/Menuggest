<template>
  <section class="dealItems">
    <b-list-group>
      <!--  Active moet met var  -->
      <!-- De transision moet van buiten het scherm komen -->
      <transition-group name="list" tag="div">
        <b-list-group-item
          :key="item.name"
          @click="clickEvent(item)"
          class="customStyle card-1 flex-column align-items-start" href="#"
          v-for="item in deal">

          <div class=" d-flex justify-content-between">
            <div class="profit-colour" v-bind:class="`${item.profit}`"></div>
            <h5>
              {{ item.name }}
              <b-badge v-show="item.prime" variant="success">Primeur</b-badge>
            </h5>
            <div>
              <p> Winstmarge: {{item.margin}}% </p>
              <b-badge class="profitBadge" v-bind:class="`${item.profit}`" variant="success">€ {{item.price}}</b-badge>
            </div>
          </div>
          <div class="iconHolder">
            <p>Type: {{item.type}}</p>
            <p>Leverancier: {{item.supplier}}</p>
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
        deal: [
          {
            type: 'rund',
            supplier:"Sligro",
            name: 'Runderhaas',
            price: 25,
            currency: 'euro',
            profit: 'good',
            margin: '5'
          },
          {
            type: 'rund',
            supplier:"Sligro",
            name: 'muis',
            price: 10,
            currency: 'euro',
            profit: 'good',
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
            prime: true,
          },
          {
            type: 'rund',
            supplier:"Sligro",
            name: 'Pianostuk',
            price: 20,
            currency: 'euro',
            profit: 'bad',
            margin: '0.5'
          },
          {
            type: 'rund',
            name: 'Flank',
            supplier:"Sligro",
            price: 30,
            currency: 'euro',
            profit: 'good',
            margin: '5'
          },
          {
            type: 'tomaat',
            margin: '5',
            currency: 'euro',
            supplier:"Bidfood & Sligro",
            name: 'vlees tomaat',
            price: 10,
            profit: 'good'
          },
          {
            type: 'tomaat',
            margin: '2.5',
            currency: 'euro',
            supplier:"Bidfood",
            name: 'cherry tomaat',
            price: 13,
            profit: 'avg',
            prime: true,
          },
          {
            type: 'tomaat',
            margin: '0',
            currency: 'euro',
            supplier:"Bidfood",
            name: 'tross tomaat',
            price: 18,
            profit: 'bad'
          },
          {
            type: 'tomaat',
            margin: '30',
            supplier:"Bidfood",
            currency: 'euro',
            name: 'tomaat',
            price: 18,
            profit: 'good'
          },
          {
            type: 'Vis',
            margin: '2',
            supplier:"Bidfood",
            currency: 'euro',
            name: 'Bot',
            price: 18,
            profit: 'bad'
          },
          {
            type: 'Vis',
            margin: '10',
            supplier:"Makro",
            currency: 'euro',
            name: 'Forel',
            price: 18,
            profit: 'good'
          },
          {
            type: 'Vis',
            margin: '2',
            supplier:"Makro",
            currency: 'euro',
            name: 'Geep',
            price: 18,
            profit: 'bad'
          },
          {
            type: 'gevogelte',
            margin: '12',
            supplier:"Makro & Sligro",
            currency: 'euro',
            name: 'fazant',
            price: 14,
            profit: 'good'
          },
          {
            type: 'gevogelte',
            margin: '7',
            supplier:"Makro & Bidfood",
            currency: 'euro',
            name: 'eend',
            prime: true,
            price: 23,
            profit: 'good'
          },
          {
            type: 'Sause',
            margin: '200',
            supplier:"Bidfood",
            currency: 'euro',
            name: 'Pesto',
            price: 10,
            profit: 'good'
          },
          {
            type: 'Sause',
            margin: '7',
            currency: 'euro',
            supplier:"Makro & Bidfood",
            name: 'Mosterdsauze',
            price: 2,
            profit: 'avg'
          }
        ]
      }
    },
    methods: {
      clickEvent: function (item) {
        console.log('item', item)
      }
    }
  }
</script>

<style lang="scss" scoped>
  h5, p {
    margin: 0;
  }

  .iconHolder p{
    margin: 0 7px 0 0;
  }

  .profitBadge {
    align-self: center;
    margin: 0 0 0 10px;
    padding: 5px;
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

  .customStyle div {
    display: flex;
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
