<template>
  <div class="nameHolder">
    <!-- Naam opties -->
    <input @change="saveName" class="form-control" placeholder="Menukaart" type="text" v-model="value">
    <b-form-select :options="options" @change="saveName" class="custom-select" v-model="selected">

    </b-form-select>
    <b-form-input @change="saveName" id="type-number" max="2025" min="2000" placeholder="Jaar" type="number"
                  v-model="yearNumber">

    </b-form-input>
  </div>
</template>

<script>
  export default {
    name: 'menuNameComponent',
    methods: {
      autoSave () {

      },
      dateErrorPrev () {
        //Dit moet global
        const monthNames = this.$store.state.createdMenu.monthNames
        const date = new Date()
        if (this.selected === '') {
          this.selected = monthNames[date.getMonth()]
        }
        if (this.value.length == 0) {
          this.value = this.$store.state.createdMenu.preMenuName
        }
        if (this.yearNumber === '') {
          this.yearNumber = date.getFullYear()
        }

      },
      saveName () {
        this.dateErrorPrev()
        let name = `${this.value}-${this.selected}-${this.yearNumber}`
        this.$store.commit('createdMenu/addMenuName', name)
      },
    },
    data () {
      return {
        value: '',
        yearNumber: '',
        selected: '',
        options: [
          {value: '', text: 'Maand/type'},
          {value: 'Januari', text: 'Januari'},
          {value: 'Febuari', text: 'Febuari'},
          {value: 'Maart', text: 'Maart'},
          {value: 'April', text: 'April'},
          {value: 'Mei', text: 'Mei'},
          {value: 'Juni', text: 'Juni'},
          {value: 'Juli', text: 'Juli'},
          {value: 'Augustus', text: 'Augustus'},
          {value: 'September', text: 'September'},
          {value: 'Oktober', text: 'Oktober'},
          {value: 'November', text: 'November'},
          {value: 'December', text: 'December'},
          {value: 'Asperges', text: 'Asperges'},
          {value: 'Kerst', text: 'Kerst'},
          {value: 'Lam', text: 'Lam'},
          {value: 'Kreeft', text: 'Kreeft'},

        ]
      }
    },
    computed: {}
  }
</script>

<style lang="scss" scoped>
  .nameHolder {
    width: 595px;
    margin: 0 auto 10px;
    display: flex;
  }

  .custom-select {
    margin: 0 10px;
  }
</style>
