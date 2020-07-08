export const state = () => ({
  fallbackMenuName:'',
  menuName:'',
  createdMenu:[],
  toolkit:false,
  preMenuName:'Menukaart',
  monthNames:[
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
})

export const mutations = {
  addMenuName (state, item){
    state.menuName =  `${item}.json`
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
