<template>
  <div>
    <div class="filterHolder">
      <!--    buttons maken als comp-->
      <!--  Met slots  -->
      <div class="customButton">
        <img alt="" class="swing animate" src="@/assets/sort.png">
        <p>Soort</p>
      </div>
      <div @click="tool_kit" class="customButton ">
        <img alt="" class="search animate" src="@/assets/search.png">
        <p>Zoeken</p>
      </div>
      <div class="customButton">
        <img alt="" class="filter animate" src="@/assets/filter.png">
        <p>Filter</p>
      </div>
      <div class="customButton">
        <img alt="" class="copy animate" src="@/assets/copy.png">
        <p>Copy</p>
      </div>
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
