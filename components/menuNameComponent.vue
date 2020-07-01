<template>
  <div class="nameHolder">
<!-- Naam opties -->
    <input v-model="value" type="text" placeholder="Naam" class="form-control">
    <b-form-select v-model="selected" :options="options"></b-form-select>
    <b-form-input id="type-number" min="2000" max="2025" placeholder="2020" type="number"></b-form-input>
  </div>
</template>

<script>
  export default {
    name: 'menuNameComponent',
    data() {
      return {
        value: '',
        selected: null,
        options: [
          { value: null, text: 'Geen' },
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
