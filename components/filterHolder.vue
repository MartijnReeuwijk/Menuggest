<template>
  <div>
    <div class="filterHolder">
      <!--    buttons maken als comp-->
      <!--  Met slots  -->
      <b-button @click="filterMenuData" variant="light">
        <svg class="bi bi-sort-numeric-up" fill="currentColor" height="1.5em" viewBox="0 0 16 16" width="1.5em"
             xmlns="http://www.w3.org/2000/svg">
          <path d="M4 14a.5.5 0 0 0 .5-.5v-11a.5.5 0 0 0-1 0v11a.5.5 0 0 0 .5.5z" fill-rule="evenodd"/>
          <path
            d="M6.354 4.854a.5.5 0 0 0 0-.708l-2-2a.5.5 0 0 0-.708 0l-2 2a.5.5 0 1 0 .708.708L4 3.207l1.646 1.647a.5.5 0 0 0 .708 0z"
            fill-rule="evenodd"/>
          <path
            d="M12.438 7V1.668H11.39l-1.262.906v.969l1.21-.86h.052V7h1.046zm-2.84 5.82c.054.621.625 1.278 1.761 1.278 1.422 0 2.145-.98 2.145-2.848 0-2.05-.973-2.688-2.063-2.688-1.125 0-1.972.688-1.972 1.836 0 1.145.808 1.758 1.719 1.758.69 0 1.113-.351 1.261-.742h.059c.031 1.027-.309 1.856-1.133 1.856-.43 0-.715-.227-.773-.45H9.598zm2.757-2.43c0 .637-.43.973-.933.973-.516 0-.934-.34-.934-.98 0-.625.407-1 .926-1 .543 0 .941.375.941 1.008z"/>
        </svg>
        <p>Soort</p>
      </b-button>

      <b-button @click="tool_kit" variant="light">
        <svg class="bi bi-search" fill="currentColor" height="1.5em" viewBox="0 0 16 16" width="1.5em"
             xmlns="http://www.w3.org/2000/svg">
          <path d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"
                fill-rule="evenodd"/>
          <path d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"
                fill-rule="evenodd"/>
        </svg>
        <p>Zoeken</p>
      </b-button>

      <b-button variant="light">
        <svg class="bi bi-filter" fill="currentColor" height="1.5em" viewBox="0 0 16 16" width="1.5em"
             xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
            fill-rule="evenodd"/>
        </svg>
        <p>Filter</p>
      </b-button>

      <b-button variant="light">
        <svg class="bi bi-files" fill="currentColor" height="1.5em" viewBox="0 0 16 16" width="1.5em"
             xmlns="http://www.w3.org/2000/svg">
          <path
            d="M3 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3z"
            fill-rule="evenodd"/>
          <path
            d="M5 0h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2v-1a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1H3a2 2 0 0 1 2-2z"/>
        </svg>
        <p>Copy</p>
      </b-button>

    </div>

  </div>
</template>

<script>
  import SearchFunction from './searchFunction'

  export default {
    name: 'filterHolder',
    components: {SearchFunction},
    methods: {
      tool_kit () {
        this.$store.commit('createdMenu/switchToolKit')
      },
      filterMenuData: function () {
        const data = this.$store.state.createdMenu.menuItems

        // Dit is onhandig veel
        const goodArray = []
        const avgArray = []
        const badArray = []

        data.forEach(item => {
          if (item.profit == 'good') {
            goodArray.push(item)
          }
          if (item.profit == 'avg') {
            avgArray.push(item)
          }
          if (item.profit == 'bad') {
            badArray.push(item)
          }
        })
        const newDataArray = goodArray.concat(avgArray, badArray)

        this.$store.commit('createdMenu/addMenucardItem', newDataArray)
        this.$store.commit('createdMenu/switchIndex', true)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .animate {
    -webkit-transition: -webkit-transform .3s ease-in-out;
    -ms-transition: -ms-transform .3s ease-in-out;
    transition: transform .3s ease-in-out;
  }

  .search:hover {
    transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
  }

  .swing:hover {
    -webkit-animation: swing 1s ease-in-out;
    animation: swing 1s ease-in-out;
    -webkit-animation-iteration-count: 1;
    animation-iteration-count: 1;
  }

  .filter:hover {
    -webkit-animation: scale 1s ease-in-out;
    animation: scale 1s ease-in-out;
    -webkit-animation-iteration-count: 1;
    animation-iteration-count: 1;
  }


  .filterHolder {
    width: 100%;
    display: flex;
    padding: 5px;
    height: 70px;
    justify-content: space-around;
  }

  .customButton {
    width: 50px;
    height: 50px;
    text-align: center;
    display: table;
    cursor: pointer;
  }

  .customButton p {
    margin: 0;
  }

  .customButton img {
    width: 30px;
    height: auto;
  }


  @keyframes swing {
    15% {
      -webkit-transform: translateY(3px);
      transform: translateY(3px);
    }
    30% {
      -webkit-transform: translateY(-3px);
      transform: translateY(-3px);
    }
    50% {
      -webkit-transform: translateY(1px);
      transform: translateY(1px);
    }
    65% {
      -webkit-transform: translateY(-1px);
      transform: translateY(-1px);
    }
    80% {
      -webkit-transform: translateY(0px);
      transform: translateY(0px);
    }
    100% {
      -webkit-transform: translateY(0);
      transform: translateY(0);
    }
  }

  @keyframes scale {
    0% {
      transform: scale(1, 1);
      -ms-transform: scale(1, 1);
      -webkit-transform: scale(1, 1);
    }
    100% {
      transform: scale(1.5, 0.5);
      -ms-transform: scale(1.5, 0.5);
      -webkit-transform: scale(1.5, 0.5);
    }
  }

</style>
