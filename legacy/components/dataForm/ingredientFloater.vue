<template>
  <div class="contextFloater text-capitalize">
    <h4>{{title}}</h4>
    <hr>
    <transition-group name="list" tag="ul">
      <li :key="items" v-for="items in data">
        {{items}}
      </li>
    </transition-group>

  </div>

</template>

<script>
  export default {
    name: 'ingredientFloater',
    props: {
      data: Array,
      title: String
    }
  }
</script>

<style lang="scss" scoped>

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
