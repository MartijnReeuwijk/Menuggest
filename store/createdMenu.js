export const state = () => ({
  menuName:'',
  createdMenu:[],
  toolkit:false
})

export const mutations = {
  addMenuName (state, item){
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
