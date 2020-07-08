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
        <b-button variant="out-line"  @click="suggestionMode" :pressed.sync="myToggle" >Suggesties</b-button>

        <b-button variant="out-line" @click="printMenu" >
          Print
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-printer" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 2H5a1 1 0 0 0-1 1v2H3V3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h-1V3a1 1 0 0 0-1-1zm3 4H2a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1v1H2a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1z"/>
            <path fill-rule="evenodd" d="M11 9H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zM5 8a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H5z"/>
            <path d="M3 7.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
          </svg>
        </b-button>

        <b-button variant="primary" @click="save" >
          Opslaan
          <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-download" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" d="M.5 8a.5.5 0 0 1 .5.5V12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5a.5.5 0 0 1 1 0V12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8.5A.5.5 0 0 1 .5 8z"/>
            <path fill-rule="evenodd" d="M5 7.5a.5.5 0 0 1 .707 0L8 9.793 10.293 7.5a.5.5 0 1 1 .707.707l-2.646 2.647a.5.5 0 0 1-.708 0L5 8.207A.5.5 0 0 1 5 7.5z"/>
            <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0v-8A.5.5 0 0 1 8 1z"/>
          </svg>
        </b-button>
      </div>
    </div>

  </section>

</template>

<script>
  import myFile from '../assets/archive.json'

  export default {
    name: 'bottom-nav',
    data() {
      return {
        myToggle: false,
        timerCount: 60,
        archive:myFile
      }
    },
    methods:{
      suggestionMode() {
        this.$store.commit('createdMenu/switchIndex')
        this.$store.commit('createdMenu/switchSuggestionMode')
      },
      printMenu(){
        window.print()
        // var printThis =  this.$parent.$children[0].$refs["menukaartPaper"]
      },
      save() {
        // Fix dit
        const data = JSON.stringify(this.$store.state.createdMenu.createdMenu)

        //Dit is 2x
        // Dit moet naar actions? of iedergeval de backend
        const date = new Date()
        const prefixName = this.$store.state.createdMenu.preMenuName
        const monthNames = this.$store.state.createdMenu.monthNames
        const prefixMonth = monthNames[date.getMonth()]
        const prefixYear = date.getFullYear()


        let name = this.$store.state.createdMenu.menuName
        if (name === '') {
          name = `${prefixName}-${prefixMonth}-${prefixYear}.json`
        }




        // const
        //   blob = new Blob([data], { type: 'application/binary' }),
        //   nameAnchor = document.createElement('a');
        // nameAnchor.download = name;
        // nameAnchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
        // nameAnchor.dataset.downloadurl = ['application/binary', nameAnchor.download, nameAnchor.href].join(':');
        // nameAnchor.click();
      }
    },
    computed:{
      suggestionModeAllowed: function () {
        return this.$route.name === "menu";
      }
        //this.$route.query.page
      },

    watch: {
      timerCount: {
        handler(value) {
          if (value > 0) {
            setTimeout(() => {
              this.timerCount--;
            }, 1000);
          } else {
            // this.save()
            this.timerCount = 30
          }
        },
        immediate: true
      }
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
