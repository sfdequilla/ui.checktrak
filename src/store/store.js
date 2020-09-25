import Vue from 'vue'
import Vuex from 'vuex'
import Error from './../helper/Error'

import auth from './auth/store'
import company from './company/store'
import user from './user/store'
import access from './access/store'
import branch from './branch/store'
import group from './group/store'
import tools from './tools/store'
import account from './account/store'
import checkbook from './checkbook/store'
import payee from './payee/store'
import check from './check/store'
import transmittal from './transmittal/store'
import imports from './imports/store'
import report from './report/store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    company,
    user,
    access,
    branch,
    group,
    tools,
    account,
    checkbook,
    payee,
    check,
    transmittal,
    imports,
    report
  },
  state: {
    alert: {},
    drawer: 1,
    error: new Error(),
    filter: false,
    footer: false,
    loader: true,
    loading: true,
    showAlert: false,
    showAvatar: false,
    staledNotification: false
  },
  mutations: {
    alert(state, payload) {
      state.alert = payload
      state.showAlert = true
    },
    drawer(state, payload) {
      localStorage.setItem('drawer', payload)
      state.drawer = payload
    },
    filter(state, payload) {
      state.filter = payload
    },
    footer(state, payload) {
      state.footer = payload
    },
    loader(state, payload) {
      state.loader = payload
    },
    loading(state, payload) {
      state.loader = payload
      state.loading = payload
    },
    showAlert(state, payload) {
      state.showAlert = payload
    },
    showAvatar(state, payload) {
      state.showAvatar = payload
    },
    staledNotification(state, payload) {
      state.staledNotification = payload
    }
  },
  actions: {
    async loadData(context) {
      context.commit('loading', true)
      try {
        await context.dispatch('auth/getUser')
        await context.dispatch(
          'tools/getCompany',
          localStorage.getItem('company_id')
        )

        if (context.getters['auth/user'].actionAccess.includes('stl')) {
          await context.dispatch('tools/getStaledChecks')
        }
        context.commit('loading', false)
      } catch (error) {
        return
      }
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
    filter(state) {
      return state.filter
    },
    footer(state) {
      return state.footer
    },
    loader(state) {
      return state.loader
    },
    loading(state) {
      return state.loading
    },
    showAlert(state) {
      return state.showAlert
    },
    showAvatar(state) {
      return state.showAvatar
    },
    staledNotification(state) {
      return state.staledNotification
    }
  }
})
