<template>
  <div class="filterHolder">
<!--    buttons maken als comp-->
<!--  Met slots  -->
    <div class="customButton">
      <img src="@/assets/sort.png" alt="">
     <p>Soort</p>
    </div>
    <div class="customButton">
      <img src="@/assets/search.png" alt="">
      <p>Zoeken</p>
    </div>
    <div class="customButton">
      <img src="@/assets/filter.png" alt="">
      <p>Filter</p>
    </div>
    <div class="customButton">
      <img src="@/assets/copy.png" alt="">
      <p>Copy</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'filterHolder'
  }
</script>

<style lang="scss" scoped>
.filterHolder{
  width: 100%;
  display: flex;
  padding: 5px;
  justify-content: space-around;
}
  .customButton{
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
    width:30px;
    height: auto;
  }
</style>
