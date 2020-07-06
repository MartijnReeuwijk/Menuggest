<template>
  <div class="nameHolder">
<!-- Naam opties -->
    <input v-model="value" @change="saveName" type="text" placeholder="Naam" class="form-control">
    <b-form-select v-model="selected" @change="saveName" :options="options"></b-form-select>
    <b-form-input v-model="yearNumber" id="type-number" @change="saveName" min="2000" max="2025" placeholder="Jaar" type="number"></b-form-input>
  </div>
</template>

<script>
  export default {
    name: 'menuNameComponent',
    methods:{
      autoSave() {

      },
      saveName(){
        const name = `${this.value}-${this.selected}-${this.yearNumber}`
        if(!this.value.length >= 0){
          this.value = "Naamloos"
        }
      //  - / start of name
      },
      checkData(){

      }
    },
    data() {
      return {
        value: '',
        yearNumber: new Date().getFullYear(),
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
    }
  }
</script>

<style lang="scss" scoped>
.nameHolder{
  width: 595px;
  margin: 0 auto 10px;
  display: flex;
}
</style>
