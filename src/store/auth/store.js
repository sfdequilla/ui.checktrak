import Axios from 'axios'
import router from './../../router'

export default {
  namespaced: true,
  state: {
    company: parseInt(localStorage.getItem('company_id')) || null,
    loading: false,
    user: {},
    token: localStorage.getItem('access_token') || null
  },
  mutations: {
    company(state, id) {
      state.company = id
    },
    loading(state, payload) {
      state.loading = payload
    },
    setToken(state, token) {
      state.token = token
    },
    user(state, payload) {
      state.user = payload
    }
  },
  actions: {
    async login(context, credential) {
      context.commit('loading', true)
      try {
        const res = await Axios.post('/login', credential)
        const token = res.data.token.access_token
        context.commit('setToken', token)
        localStorage.setItem('access_token', token)
        localStorage.setItem('company_id', res.data.company)
        router.push({ name: 'home' })
        context.commit(
          'alert',
          { message: 'Successfully logged in.', color: 'blue' },
          { root: true }
        )
      } catch (e) {
        return
      } finally {
        context.commit('loading', false)
      }
    },
    async sendResetPassword(context, credential) {
      context.commit('loading', true)
      try {
        await Axios.post('/password/email', credential)
        router.push({ name: 'login' })
      } catch (e) {
        return
      } finally {
        context.commit('loading', false)
      }
    },
    async resetPassword(context, credential) {
      context.commit('loading', true)
      try {
        await Axios.post('/password/reset', credential)
        router.push({ name: 'login' })
      } catch (e) {
        return
      } finally {
        context.commit('loading', false)
      }
    },
    async logout(context) {
      context.commit('loader', true, { root: true })
      try {
        await Axios.post('logout')
        context.dispatch('clearStorage')
      } catch (e) {
        return
      }
    },
    async getUser(state) {
      try {
        const res = await Axios.get('/auth')
        state.commit('user', res.data)
      } catch (error) {
        throw error
      }
    },
    clearStorage(context) {
      context.commit('setToken', null)
      router.push({ name: 'login' })
      context.commit('footer', false, { root: true })
      localStorage.removeItem('access_token')
    }
  },
  getters: {
    company(state) {
      return state.company
    },
    loading(state) {
      return state.loading
    },
    loggedIn(state) {
      return state.token !== null
    },
    user(state) {
      return state.user
    },
    token(state) {
      return state.token
    }
  }
}
