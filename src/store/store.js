import Vue from 'vue'
import Vuex from 'vuex'
import Error from './../helper/Error'

import auth from './auth/store'
import company from './company/store'
import user from './user/store'
import group from './group/store'
import branch from './branch/store'
import tools from './tools/store'
import account from './account/store'
import payee from './payee/store'
import check from './check/store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: { auth, company, user, group, branch, tools, account, payee, check },
  state: {
    alert: {},
    drawer: true,
    error: new Error(),
    footer: false,
    showAlert: false
  },
  mutations: {
    alert(state, payload) {
      state.alert = payload
      state.showAlert = true
    },
    drawer(state, payload) {
      state.drawer = payload
    },
    footer(state, payload) {
      state.footer = payload
    },
    showAlert(state, payload) {
      state.showAlert = payload
    }
  },
  actions: {
    async loadData(context) {
      context.commit('auth/logging', true)
      await context.dispatch('auth/getUser')
      await context.dispatch(
        'tools/getCompany',
        localStorage.getItem('company_id')
      )
      await context.dispatch('tools/getUsers')
      await context.dispatch('tools/getGroups')
      await context.dispatch('tools/getBranches')
      await context.dispatch('tools/getActions')
      await context.dispatch('tools/getModules')
      await context.dispatch('tools/getPayeeGroup')
      context.commit('auth/logging', false)
    },
    async loadData2(context) {
      context.commit('check/waiting', true)
      await context.dispatch('tools/getPayees')
      await context.dispatch('tools/getAccounts')
      context.commit('check/waiting', false)
      context.commit('footer', true)
    }
  },
  getters: {
    alert(state) {
      return state.alert
    },
    drawer(state) {
      return state.drawer
    },
    error(state) {
      return state.error
    },
    footer(state) {
      return state.footer
    },
    showAlert(state) {
      return state.showAlert
    }
  }
})
