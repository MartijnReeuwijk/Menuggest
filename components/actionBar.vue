<template>
  <div class="vertical-nav suggestion-box" v-if="suggestionModeAllowed">
    <b-button :pressed.sync="myToggle" @click="suggestionMode" variant="light">Suggesties</b-button>
    <b-button @click="printMenu" variant="light">
      Print
      <svg class="bi bi-printer" fill="currentColor" height="1em" viewBox="0 0 16 16" width="1em"
           xmlns="http://www.w3.org/2000/svg">
        <path
          d="M11 2H5a1 1 0 0 0-1 1v2H3V3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h-1V3a1 1 0 0 0-1-1zm3 4H2a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h1v1H2a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1z"/>
        <path
          d="M11 9H5a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1zM5 8a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H5z"
          fill-rule="evenodd"/>
        <path d="M3 7.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"/>
      </svg>
    </b-button>

    <b-button @click="checkData" variant="primary">
      Opslaan
      <svg class="bi bi-download" fill="currentColor" height="1em" viewBox="0 0 16 16" width="1em"
           xmlns="http://www.w3.org/2000/svg">
        <path
          d="M.5 8a.5.5 0 0 1 .5.5V12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8.5a.5.5 0 0 1 1 0V12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V8.5A.5.5 0 0 1 .5 8z"
          fill-rule="evenodd"/>
        <path
          d="M5 7.5a.5.5 0 0 1 .707 0L8 9.793 10.293 7.5a.5.5 0 1 1 .707.707l-2.646 2.647a.5.5 0 0 1-.708 0L5 8.207A.5.5 0 0 1 5 7.5z"
          fill-rule="evenodd"/>
        <path d="M8 1a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0v-8A.5.5 0 0 1 8 1z" fill-rule="evenodd"/>
      </svg>
    </b-button>
  </div>
</template>

<script>
  import myFile from '../assets/archive.json'

  export default {
    name: 'actionBar',
    data () {
      return {
        myToggle: false,
        timerCount: 60,
        archive: myFile
      }
    },
    methods: {
      suggestionMode () {
        this.$store.commit('createdMenu/switchIndex')
        this.$store.commit('createdMenu/switchSuggestionMode')
      },
      printMenu () {
        window.print()
        // var printThis =  this.$parent.$children[0].$refs["menukaartPaper"]
      },
      save:function (data,name){
        const archive = this.archive
        const menuToArchive = {
          id: Math.floor(Math.random() * 10000),
          profit: 'avg',
          message: name,
          desc: name,
          options: data
        }
        archive.push(menuToArchive)
        localStorage.setItem('MenuggestDB', archive)
      },

      checkData: function () {
        const data = this.$store.state.createdMenu.createdMenu
        const downloadAllowed = false
        // Get prefix voor errors of dat de user het vergeet
        const date = new Date()
        const prefixName = this.$store.state.createdMenu.preMenuName
        const monthNames = this.$store.state.createdMenu.monthNames
        const prefixMonth = monthNames[date.getMonth()]
        const prefixYear = date.getFullYear()

        let name = this.$store.state.createdMenu.menuName
        if (name === '') {
          name = `${prefixName}-${prefixMonth}-${prefixYear}`
        }
        if (downloadAllowed){
          const blob = new Blob([data], {type: 'application/binary'})
          const nameAnchor = document.createElement('a')
          nameAnchor.download = name
          nameAnchor.href = (window.webkitURL || window.URL).createObjectURL(blob)
          nameAnchor.dataset.downloadurl = ['application/binary', nameAnchor.download, nameAnchor.href].join(':')
          nameAnchor.click()
        }
        this.save(data,name)

      }
    },
    computed: {
      suggestionModeAllowed: function () {
        return this.$route.name === 'menu'
      }
      //this.$route.query.page
    },
    watch: {
      timerCount: {
        handler (value) {
          if (value > 0) {
            setTimeout(() => {
              this.timerCount--
            }, 1000)
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
  .vertical-nav {
    height: 150px;
    width: 150px;
    background-color: transparent;
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }

  .vertical-nav button {
    width: 100%;
  }
</style>
