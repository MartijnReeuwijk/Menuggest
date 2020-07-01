export const state = () => ({
  createdMenu:[]
})

export const mutations = {
  add (state, item){
    state.createdMenu.push(item)
  },
  remove(state, { item }) {

  }
}
