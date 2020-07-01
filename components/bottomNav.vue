<template>
  <section class="bottom-nav">

    <div class="button-holder">
      <div class="buttons-space">
        <div class="button-holder-inner">
          <b-button variant="outline-primary">Voor</b-button>
          <b-button variant="primary">Hoofd</b-button>
          <b-button variant="outline-primary">Na</b-button>
        </div>
      </div>
      <div class="suggestion-box" v-if="suggestionModeAllowed">
        <b-button  @click="suggestionMode" :pressed.sync="myToggle" >Suggesties</b-button>
        <b-button  @click="save" >Save</b-button>
        <b-button  @click="printMenu" >Print</b-button>
      </div>
    </div>

  </section>

</template>

<script>
  export default {
    name: 'bottom-nav',
    data() {
      return {
        myToggle: false,
      }
    },
    methods:{
      suggestionMode() {
        this.$emit('suggestionMode', this.myToggle)
      },
      printMenu(){
        // menukaartPaper
        window.print()
        // var printThis =  this.$parent.$children[0].$refs["menukaartPaper"]
        // console.log('printThis', printThis)
        // console.log('window', window)
      },
      save() {
        this.$emit('suggestionMode', this.myToggle)
      }
    },
    computed:{
      suggestionModeAllowed: function () {
        return this.$route.name === "menu";
      }
        //this.$route.query.page

      }

  }

</script>

<style lang="scss" scoped>

  .bottom-nav{
    height: 75px;
    background-color: #F7F8FB;
    display: flex;
    position: fixed;
    justify-content: center;
    bottom: 0;
    align-items: center;
  }
  .button-holder{
    width: 100%;
    display: flex;
    height: fit-content;
    justify-items: center;
    justify-content: center;
  }
  .button-holder .suggestion-box{
    position: absolute;
    right: 10px;
  }

  .button-holder-inner{
    width: 250px;
    display: flex;
    justify-content: space-evenly;;
  }
  .suggestion-box{
    width: auto;
    display: flex;
    justify-content: center;
    height: fit-content;
  }
  .suggestion-box button{
    margin: 0 5px;
  }
</style>
