// let posOutlook = this.form
// this.$store.commit('createdMenu/addMenucardItem', posOutlook)
//
// if (localStorage.getItem('MenuggestDB_menuKaart')) {
//   console.log('local', localStorage.getItem('MenuggestDB_menuKaart'))
//   console.log('local type', typeof localStorage.getItem('MenuggestDB_menuKaart'))
//
//   const parsed = JSON.parse(localStorage.getItem('MenuggestDB_menuKaart'))
//   console.log('parsed', parsed)
//   console.log('typeof parsed', typeof parsed)
//
//   const vueState = this.$store.state.createdMenu.menuItems
//
//   console.log('vueState', vueState)
//
//   const updateLocal = []
//   updateLocal.push(parsed)
//
//   vueState.forEach(item => {
//     if (Array.isArray(item)) {
//       return
//     } else {
//       updateLocal.push(item)
//     }
//   })
//   const flat = updateLocal.flat();
//
//   console.log(flat)
//
//   localStorage.setItem('MenuggestDB_menuKaart', JSON.stringify(flat))
//
// }
// else {
//   localStorage.setItem('MenuggestDB_menuKaart', JSON.stringify(posOutlook))
// }
