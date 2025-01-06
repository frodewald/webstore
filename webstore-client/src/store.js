// store.js
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    quantities: {}, // Default value
  },
  mutations: {
    initializeItemQuantity(state, code) {
      if (!state.quantities[code]) {
        Vue.set(state.quantities, code, 1); // Inisialisasi dengan 1 jika tidak ada
      }
    },
    updateItemQuantity(state, { code, quantity }) {
      Vue.set(state.quantities, code, quantity);
      // console.log(state.quantities)
    },
    removeItemQuantity(state, code) {
        Vue.delete(state.quantities, code); // Menghapus item berdasarkan kode
    },
  },
  actions: {
    async fetchCartQty({ commit }) {
      try {
        const { data } = await axios.get('http://localhost:8000/api/orders/user', {
          withCredentials: true // Ini memungkinkan pengiriman cookie
      });
        // console.log(data.flatMap(result => result.cart_items))
        const cartItems = data.flatMap(result => result.cart_items);
        cartItems.forEach(item => {
          // Panggil mutation updateItemQuantity untuk setiap item
          commit('updateItemQuantity', { code: item.code, quantity: item.quantity });
        });
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    },
    setItemQuantity({ commit }, payload) {
      commit('initializeItemQuantity', payload.code);
      commit('updateItemQuantity', payload);
    },
    removeItemQuantity({ commit }, code) {
      commit('removeItemQuantity', code); // Memanggil mutasi untuk menghapus item
    }
  },  
  getters: {
    getItemQuantity: (state) => (code) => {
        return state.quantities[code] !== undefined ? state.quantities[code] : 1;
    },
  }
});
