export const state = () => ({
  fallbackMenuName:'',
  menuName:'',
  createdMenu:[],
  menuItems:[],
  suggestionMode:false,
  toolkit:false,
  switchIndex:false,
  preMenuName:'Menukaart',
  monthNames:[
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
})

export const mutations = {
  switchIndex (state, item){
    //TODO: Check deze logic maybe een 3de var
    if (state.suggestionMode){
      state.switchIndex = false
    }
    else{
      state.switchIndex = !state.switchIndex
    }
  },
  switchSuggestionMode (state){
    state.suggestionMode = !state.suggestionMode
  },
  addMenucardItem (state, item){
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
}
