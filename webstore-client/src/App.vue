<template>
  <div id="app">
    <Navbar :isAdmin="isAdmin" />
    <router-view @update-cart-qty="updateCartQty" @update-qty="handleUpdateQty"/>
    <CartButton v-if="showCartButton" :cartQty="cartQty" />
    <MyFooter />
  </div>
</template>

<script>
/* eslint-disable */

import CartButton from './components/CartButton.vue';
import Navbar from './components/Navbar.vue';
import MyFooter from './components/Footer.vue';
import axios from 'axios';
import { SESSION_API_ENDPOINTS, ORDER_API_ENDPOINTS } from './services/api';

export default {
  components: {
    Navbar,
    CartButton,
    MyFooter
  },
  data() {
    return {
      cartQty: 0,
      productQty: 0,
      showCartButton: true,
      isAdmin: false
    }
  },
  async created() {
    await this.fetchCart();
    await this.checkIsNotForCartBtnPage()
  },
  watch: {
    // Watcher untuk memantau perubahan pada route
    $route: {
      immediate: true, // Menjalankan handler saat komponen pertama kali dimuat
      handler() {
        this.checkIsNotForCartBtnPage();
      }
    }
  },
  methods: {
    async fetchCart() {
      const result = await axios.get(ORDER_API_ENDPOINTS.getOrder, {
            withCredentials: true // Sertakan ini agar cookies dikirim
        });
      let data = result.data.flatMap(order => order.products);
      this.cartQty = data.length; // Update jumlah item
    },
    updateCartQty(newQty) {
      this.cartQty = newQty;
    },
    handleUpdateQty(newQty) {
      this.productQty = newQty;
    },
    async checkIsNotForCartBtnPage() {
      try {
        const isNotForCartBtnPage = ['login', 'register', 'cart']
        const { data } = await axios.get(SESSION_API_ENDPOINTS.checkSession, {
          withCredentials: true,
        });
        this.isAdmin = data.role === 'admin'
        this.showCartButton = !isNotForCartBtnPage.includes(this.$route.name) && !this.isAdmin;
      } catch (error) {
        console.error("Error fetching session:", error);
        this.showCartButton = true;
      }
    }
  }
}
</script>

<style>
  * {
    box-sizing: border-box;
    font-family: Arial;
  }

  #page-wrap {
    margin: auto;
    max-width: 1200px;
    min-height: 100vh;
  }

  button {
    background-color: #41B883;
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    font-size: 16px;
    font-weight: bold;
    outline: 0;
    padding: 16px;
  }
  /* Hilangkan panah pada input number di Chrome, Safari, Edge, dan Opera */
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
</style>
