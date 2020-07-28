export const state = () => ({
  fallbackMenuName:'',
  menuName:'',
  preMenuName:'Menukaart',
  monthNames:[
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ],
  createdMenu:[],
  menuItems:[],
  toolkit:false,
  seasons:[],
  suggestionMode:false,
  switchIndex:false,
  saveAlert:false
})

export const mutations = {
  switchIndex (state, item){
    //TODO: Check deze logic maybe een 3de var

    state.switchIndex = !state.switchIndex
    state.suggestionMode = !state.suggestionMode
    // if (item){
    //   state.switchIndex = item
    //   state.suggestionMode = item
    // }
    // if (state.suggestionMode){
    //   state.switchIndex = false
    // }
    // else{
    //   state.switchIndex = !state.switchIndex
    // }
  },
  // dit kan anders / nieuwe logic maar low importance
  switchSuggestionMode (state, item){
    state.switchIndex = !state.switchIndex
    state.suggestionMode = !state.suggestionMode
  },
  addMenucardItem (state, item){
    console.log('item', item)
    state.menuItems = item
  },
  addMenuName (state, item){
    // voor mogelijke downlaod naar local
    // state.menuName =  `${item}.json`
    state.menuName = item
  },
  addMenu (state, item){
    state.createdMenu.push(item)
  },
  removeMenu(state, index ) {
    state.createdMenu.splice(index, 1);
  },
  switchToolKit (state, item){
    state.toolkit = !state.toolkit
  },
  saveAlert (state, item){
    state.saveAlert = item
    console.log('state.saveAlert', state.saveAlert)
  },
}
