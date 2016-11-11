import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  // scrollBehavior: () => ({ y: 0 }),
  routes: [
    { path: '/admin/tables', component: createListView('tables') },
    { path: '/admin/orderings', component: createListView('orderings') },
    { path: '/admin/*', redirect: '/' }
  ]
})


function createListView (type) {
  return {
    // name: `${type}`,
    // template: require(`../components/${type}.vue`)
    // this will be called during SSR to pre-fetch data into the store!
    // preFetch (store) {
    //   return store.dispatch('FETCH_LIST_DATA', { type })
    // },
    // render (h) {
    //   return h(require(`../components/${type}.vue`))
    // }
  }
}
