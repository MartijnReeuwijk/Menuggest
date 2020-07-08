<template>
  <div class="nameHolder">
<!-- Naam opties -->
    <input v-model="value" @change="saveName" type="text" placeholder="Menukaart" class="form-control">
    <b-form-select class="custom-select" v-model="selected" @change="saveName" :options="options"></b-form-select>
    <b-form-input v-model="yearNumber" id="type-number" @change="saveName" min="2000" max="2025" placeholder="Jaar" type="number"></b-form-input>
  </div>
</template>

<script>
  export default {
    name: 'menuNameComponent',
    methods:{
      autoSave() {

      },
      dateErrorPrev(){
        //Dit moet global
        const monthNames = this.$store.state.createdMenu.monthNames
        const date = new Date()
        if(this.selected === ''){
          this.selected = monthNames[date.getMonth()]
        }
        if(this.value.length == 0){
          this.value = this.$store.state.createdMenu.preMenuName
        }
        if(this.yearNumber ===''){
         this.yearNumber = date.getFullYear()
        }

      },
      saveName(){
        this.dateErrorPrev()
        let name = `${this.value}-${this.selected}-${this.yearNumber}`
        this.$store.commit('createdMenu/addMenuName', name)
      },
    },
    data() {
      return {
        value: '',
        yearNumber: '',
        selected: '',
        options: [
          { value: '', text: 'Maand/type' },
          { value: 'Januari', text: 'Januari' },
          { value: 'Febuari', text: 'Febuari' },
          { value: 'Maart', text: 'Maart' },
          { value: 'April', text: 'April' },
          { value: 'Mei', text: 'Mei' },
          { value: 'Kerst', text: 'Kerst' },
          { value: 'Asperges', text: 'Asperges' }
        ]
      }
    },
    computed:{

    }
  }
</script>

<style lang="scss" scoped>
.nameHolder{
  width: 595px;
  margin: 0 auto 10px;
  display: flex;
}
  .custom-select{
    margin: 0 10px;
  }
</style>
