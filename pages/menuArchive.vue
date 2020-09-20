<template>
  <div class="mainHolderDeluxChangeThislater">
    <navigationBar title="Menuggest">
    </navigationBar>
<alert></alert>
    <menuBased
      title="Menukaart maken"
      >
    </menuBased>
    pushdata()
  </div>

</template>

<script>
  /* eslint-disable no-alert, no-console */
  import navigationBar from '../components/navigationBar'
  import menuBased from '../components/menuBased'
  import myFile from '../assets/menukaart.json'
  import Alert from '../components/alert'

  export default {
    data () {
      return {
        dismissSecs: 10,
        dismissCountDown: 0,
        showDismissibleAlert: false,
        data:myFile
      }
    },
    components: {
      Alert,
      navigationBar,
      menuBased
    },
    mounted(){
      this.pushdata()
    },
    methods: {
      pushdata(){
       const arrayDemoData = [{"name":"carpaccio","profit":"bad","desc":"van dun gesneden ossenhaas met pesto, rucola en olijfjes","time":"0,5","luxe":true,"vegan":false,"vegetarian":false,"course":"appetizer","ingredient":false,"price":10,"currency":"euro","foodType":"rund","ingredients":["ossenhaas","pesto","kaas","rucola","olijf"]},{"name":"uiensoep","profit":"avg","desc":"Uiensoep met een kaasdakje","time":"0,5","luxe":true,"vegan":false,"vegetarian":false,"course":"appetizer","ingredient":false,"price":6,"currency":"euro","foodType":"soup","ingredients":["ui","kaas","stokbrood","rund"]},{"name":"Garnalenkroketjes","profit":"avg","desc":"drie stukjes met selderijsalade & cocktailsaus","time":"0,5","luxe":true,"vegan":false,"vegetarian":false,"course":"appetizer","ingredient":false,"price":9.5,"currency":"euro","foodType":"soup","ingredients":["Cocktailsaus","bleekselderij","garnalen","ijsbergsla"]},{"name":"Meierij proefplankje","profit":"good","desc":"spinata romana, truffelsalami, dagsoepje, kroketje, chorizo & parmaham","time":"0,5","luxe":false,"vegan":false,"vegetarian":false,"course":"appetizer","ingredient":false,"price":12,"currency":"euro","foodType":"soup","ingredients":["Truffelsalami","Chorizo","Parmaham","ijsbergsla","Champignons"]},{"name":"Champignons","profit":"avg","desc":"gevuld met gekruid gehakt & gegratineerd met kaas","time":"0,5","luxe":false,"vegan":false,"vegetarian":false,"course":"appetizer","ingredient":false,"price":12,"currency":"euro","foodType":"soup","ingredients":["Champignons","Paprika poeder","Peper","Rundergehakt"]},{"name":"Eendenborst","profit":"bad","desc":"zuurkool & aardappelpuree","time":"0,5","luxe":false,"vegan":false,"vegetarian":false,"course":"main","ingredient":false,"price":20,"currency":"euro","foodType":"eend","ingredients":["eend","seizoensgroenten","rode wijnsaus","zuurkool","aardappelpuree","aardappel"]},{"name":"Tournedos","profit":"good","desc":"tournedos,zachtste gedeelte van de haas & bearnaisesaus","time":"0,5","luxe":true,"vegan":false,"vegetarian":false,"course":"main","ingredient":false,"price":25,"currency":"euro","foodType":"rund","ingredients":["tournedos","seizoensgroenten","rode wijnsaus","friet"]},{"name":"Runder-ribeye 350 gram","profit":"good","desc":"voor de vleesliefhebber 350 gram van de grill met pepersaus","time":"0,5","luxe":true,"vegan":false,"vegetarian":false,"course":"main","ingredient":false,"price":25,"currency":"euro","foodType":"rund","ingredients":["Runderrib","seizoensgroenten","pepersaus","friet","peper"]},{"name":"Zalmfilet","profit":"good","desc":"op de huid gebakken met saus van mosterd & basilicum","time":"0,5","luxe":true,"vegan":false,"vegetarian":false,"course":"main","ingredient":false,"price":20,"currency":"euro","foodType":"zalm","ingredients":["Zalm","Mosterd","mosterdsaus","basilicum","Pesto"]},{"name":"Vis van de markt.","profit":"good","desc":"met pittige pindasaus en cassave","time":"0,5","luxe":false,"vegan":false,"vegetarian":false,"course":"main","ingredient":false,"price":17.5,"currency":"euro","foodType":"lam","ingredients":["chinesekool","ijsbergsla","Satésaus","pindasaus","knoflook","tarbot","tongschar","Wijting","Wulk","Zalm","Zeebaars","asperge","asperge-erwt","aubergine","augurk","ayote","bamboescheut"]},{"name":"Rode curry","profit":"good","desc":"diverse groenten  kip of tofu in kokosmelk en thaise kruiden","time":"0,5","luxe":false,"vegan":false,"vegetarian":true,"course":"main","ingredient":false,"price":17.5,"currency":"euro","foodType":"curry","ingredients":["Dressing","Mosterd","Oestersaus","pindasaus","knoflook","kip"]},{"name":"Saté van varkenshaas","profit":"good","desc":"met pittige pindasaus en cassave","time":"0,5","luxe":false,"vegan":false,"vegetarian":false,"course":"main","ingredient":false,"price":17.5,"currency":"euro","foodType":"lam","ingredients":["chinesekool","ijsbergsla","Satésaus","pindasaus","knoflook","varkenshaas","sate"]},{"name":"Italiaans dessert","profit":"good","desc":"Italiaans dessert","time":"0,5","luxe":false,"vegan":false,"vegetarian":true,"course":"after","ingredient":false,"price":8,"currency":"euro","foodType":"ice","ingredients":["ijs","framboos"]},{"name":"Chocolade lava taartje","profit":"good","desc":"(warm) met vanille roomijs","time":"0,5","luxe":false,"vegan":false,"vegetarian":true,"course":"after","ingredient":false,"price":7,"currency":"euro","foodType":"curry","ingredients":["Chocoladesaus","Mosterd","appelijs","chocoladeijs","yoghurt","Lavacake"]},{"name":"IJsmacaron","profit":"good","desc":"met vulling van mango & passiefruit","time":"0,5","luxe":false,"vegan":false,"vegetarian":true,"course":"after","ingredient":false,"price":7,"currency":"euro","foodType":"curry","ingredients":["Chocoladesaus","Mangoijs","appelijs","passiefruit","yoghurt","macaron"]}]
        arrayDemoData.forEach(item => {
          if (item.course === 'appetizer') {
            this.$store.commit('createdMenu/appetizerAdd', item)
          }
          if (item.course === 'main') {
            this.$store.commit('createdMenu/mainAdd', item)
          }
          if (item.course === 'after') {
            this.$store.commit('createdMenu/afterAdd', item)
          }
        })

      },
      countDownChanged (dismissCountDown) {
        this.dismissCountDown = dismissCountDown
      },
      showAlert () {
        this.dismissCountDown = this.dismissSecs
      }
    },
  }
</script>

<style>
  .mainHolderDeluxChangeThislater {
    height: 100vh;
    overflow: hidden;
  }
  @media print {
    body * {
      visibility: hidden;
    }
  }
</style>
