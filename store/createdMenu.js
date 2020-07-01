export const state = () => ({
  createdMenu:[]
})

export const mutations = {
  add (state, item){
    state.createdMenu.push(item)
  },
  remove(state, index ) {
    state.createdMenu.splice(index, 1);
  }
}
