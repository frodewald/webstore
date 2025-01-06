<template>
  <div>
    <div id="page-wrap">
        <h1>Shopping Cart</h1>
        <ItemCard 
          v-for="item in cartItems"
          :key="item.id"

          :item="item"
          v-on:remove-item="removeFromCart($event)"
        />
        <h2 class="text-center m-5" v-if="cartItems.length === 0" style="opacity: 0.5;">Tidak Ada Produk</h2>
        <h3 id="total-price">Total: {{ totalPrice? totalPrice : "0" | currencyFormat }}</h3>
        <button id="checkout-button">Checkout</button>
    </div>
  </div>
</template>

<script>
import ItemCard from '@/components/ItemCard.vue';
import axios from 'axios';
import { ORDER_API_ENDPOINTS } from '@/services/api';

export default {
  components: {
    ItemCard
  },
  data() {
    return {
      cartItems: [],
    }
  },
  methods: {
    async removeFromCart(product) {
      try {
        await axios.delete(ORDER_API_ENDPOINTS.deleteOrder(product), {
            withCredentials: true // Sertakan ini agar cookies dikirim
        });
        const indexCart = this.cartItems.findIndex(item => item.code === product);
        if (indexCart !== -1) {
          this.cartItems.splice(indexCart, 1);
        }
        this.$store.dispatch('removeItemQuantity', product);
      } catch (error) {
        console.error("Error removing item from cart:", error);
      }
    },
    async fetchCart() {
      try {
        const { data } = await axios.get(ORDER_API_ENDPOINTS.getOrder, {
            withCredentials: true // Sertakan ini agar cookies dikirim
        });
        this.cartItems = data.flatMap(result => result.products); // Menggunakan flatMap jika data berbentuk array
        this.$emit('update-cart-qty', this.cartItems.length);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    }
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce((total, item) => {
        const quantity = this.$store.getters.getItemQuantity(item.code) || 1;
        return total + (item.price * quantity);
      }, 0);
    },
    cartQty() {
      return this.cartItems.length
    }
  },
  // created ini untuk memanggil data cart yang ada di db, jadinya nanti pas cart dirender langsung keliatan datanya
  async created() {
    await this.fetchCart();
  },
  watch: {
    cartItems: {
      handler(newVal) {
        // Emit event to update cart quantity whenever cartItems change
        this.$emit('update-cart-qty', newVal.length);
      },
      deep: true // To watch for changes in array elements
    }
  }
}
</script>

<style scoped>
  h1 {
    border-bottom: 1px solid #41B883;
    margin: 0;
    margin-top: 16px;
    padding: 16px;
  }
  #total-price {
    padding: 16px;
    text-align: right;
  }
  #checkout-button {
    width: 100%;
  }
</style>