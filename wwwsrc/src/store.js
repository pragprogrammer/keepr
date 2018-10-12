import Vue from 'vue'
import Vuex from 'vuex'
import Axios from 'axios'
import router from './router'

Vue.use(Vuex)

let auth = Axios.create({
  baseURL: "//localhost:5000/account/",
  timeout: 3000,
  withCredentials: true
})

let api = Axios.create({
  baseURL: "//localhost:5000/api/",
  timeout: 3000,
  withCredentials: true
})

export default new Vuex.Store({
  state: {
    user: {},
    keeps: [],
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setkeeps(state, keeps) {
      state.keeps = keeps
    },
    logout(state, data) {
      console.log(data)
      state.user = {}
    },
    updatekeeps(state, data) {
      state.keeps.push(data)
    }
  },
  actions: {
    register({ commit, dispatch }, newUser) {
      auth.post('register', newUser)
        .then(res => {
          commit('setUser', res.data)
          router.push({ name: 'home' })
        })
        .catch(e => {
          console.log('[registration failed] :', e)
        })
    },
    authenticate({ commit, dispatch }) {
      auth.get('authenticate')
        .then(res => {
          commit('setUser', res.data)
          router.push({ name: 'home' })
        })
        .catch(e => {
          console.log('not authenticated')
        })
    },
    login({ commit, dispatch }, creds) {
      auth.post('login', creds)
        .then(res => {
          commit('setUser', res.data)
          router.push({ name: 'home' })
        })
        .catch(e => {
          console.log('Login Failed')
        })
    },
    logout({ commit, dispatch }) {
      auth.delete('logout')
        .then(res => {
          commit('logout', res)
          router.push({ name: 'login' })
        })
        .catch(err => console.error(err))
    },
    //keep actions
    getkeeps({ commit, dispatch }) {
      api.get('keeps')
        .then(res => {
          commit('setkeeps', res.data)
        })
    },
    addkeep({ commit, dispatch }, payload) {
      api.post('keeps', payload)
        .then(res => {
          dispatch('getkeeps')
        })
    },
    deletekeep({ commit, dispatch }, id) {
      api.delete('keeps/' + id)
        .then(res => {
          dispatch('getkeeps')
        })
    },
    updatekeep({ commit, dispatch }, keep) {
      api.put('keeps', keep)
        .then(res => {
          dispatch('getkeeps')
        })
    }
  }
})