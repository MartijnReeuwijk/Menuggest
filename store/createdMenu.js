export const state = () => ({
  fallbackMenuName:'',
  menuName:'',
  preMenuName:'Menukaart',
  monthNames:[
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ],
  createdMenu:[],
  menu:
    {
      appetizer:[],
      main:[],
      after:[],
    }
  ,
  menuItems:[],
  toolkit:false,
  seasons:[],
  suggestionMode:false,
  switchIndex:false,
  saveAlert:false
})

// TODO:: Verbeter de store
//  Action ipv just mutations
export const mutations = {
  appetizerAdd(state, item){
    state.menu.appetizer.push(item)
  },
  mainAdd(state, item){
    state.menu.main.push(item)
  },
  afterAdd(state, item){
    state.menu.after.push(item)
  },

  menuItemsToevoegen(state, item){
    state.menuItems.unshift(item)
  },
  switchIndex (state, item){
    //TODO: Check deze logic maybe een 3de var
    state.switchIndex = !state.switchIndex
    state.suggestionMode = !state.suggestionMode
  },
  switchSuggestionMode (state, item){
    state.switchIndex = !state.switchIndex
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
  saveAlert (state, item){
    state.saveAlert = item
    console.log('state.saveAlert', state.saveAlert)
  },
}
