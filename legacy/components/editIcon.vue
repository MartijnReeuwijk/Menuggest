<template>
  <svg class="bi bi-pencil" fill="currentColor" height="1em" viewBox="0 0 16 16" width="1em"
       xmlns="http://www.w3.org/2000/svg">
    <path d="M11.293 1.293a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1 0 1.414l-9 9a1 1 0 0 1-.39.242l-3 1a1 1 0 0 1-1.266-1.265l1-3a1 1 0 0 1 .242-.391l9-9zM12 2l2 2-9 9-3 1 1-3 9-9z"
          fill-rule="evenodd"/>
    <path d="M12.146 6.354l-2.5-2.5.708-.708 2.5 2.5-.707.708zM3 10v.5a.5.5 0 0 0 .5.5H4v.5a.5.5 0 0 0 .5.5H5v.5a.5.5 0 0 0 .5.5H6v-1.5a.5.5 0 0 0-.5-.5H5v-.5a.5.5 0 0 0-.5-.5H3z"
          fill-rule="evenodd"/>
  </svg>
</template>

<script>
  export default {
    name: 'editIcon'
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
</style>
