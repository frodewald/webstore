<template>
  <div>
    <div id="page-wrap" v-if="product">
      <div id="product-container">
        <div id="img-wrap">
          <img :src="`${BACKEND_URL}${product.imageUrl}`" alt="Product image">
        </div>
        <div id="product-details">
          <h1 class="product-name">{{ product.name }}</h1>
          <p id="price">{{ product.price | currencyFormat }}</p>
          <p class="rating">⭐ {{ product.averageRating }}</p>
          <p class="stock">Stock: {{ product.stock }}</p>
          <p class="description">{{ product.description }}</p>
          <div class="actions">
            <QtySelector v-model="quantity" :max="product.stock" />
          </div>
        </div>
      </div>
      <button id="add-to-cart" @click="addToCart(product)">Add to Cart</button>
      <router-link class="go-back" :to="{ name: 'product' }">
        <div class="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708.708L2.707 7.5H14.5A.5.5 0 0 1 15 8z"/>
          </svg>
          <span>Back</span>
        </div>
      </router-link>
    </div>
    <NotFound v-else />
  </div>
</template>

<script>
import axios from 'axios';
import NotFound from '../errors/404'
import QtySelector from '@/components/QtySelector.vue';
import { ORDER_API_ENDPOINTS } from '@/services/api';
// eslint-disable-next-line no-unused-vars
import { PRODUCT_API_ENDPOINTS, BACKEND_URL } from '@/services/api';
export default {
    components: {
        NotFound,
        QtySelector
    },
    data() {
      return {
        product: {},
        notif: false,
        BACKEND_URL
      }
    },
    computed: {
      quantity: {
        get() {
            return this.$store.getters.getItemQuantity(this.product.code);
        },
        set(newQuantity) {
          this.$store.dispatch('setItemQuantity', { code: this.product.code, quantity: newQuantity });
        }
      }
    },
    methods : {
      async addToCart(product) {
        try{
          const response = await axios.post(ORDER_API_ENDPOINTS.updateOrder, {
            product: [{ // Mengirim produk dalam array
              code: product.code,
              quantity: this.quantity
            }]
          }, { withCredentials: true });
            if (response.status === 200) {
              this.$swal.fire({
                title: "added!",
                text: "Your product has been added to cart.",
                icon: "success"
              });
            } else {
              throw new Error("Failed to add product");
            } 
          this.notif = true
          const result = await axios.get(ORDER_API_ENDPOINTS.getOrder, {
              withCredentials: true // Sertakan ini agar cookies dikirim
          });
          console.log(result)
          let data = Object.assign({},
            ...(result.data.map(
              result => ({
                cart_items: result.products
              })
            ))
          )

          this.$emit('update-cart-qty', data.cart_items.length);
        } catch (error) {
          this.$swal.fire({
            title: "Error!",
            text: `Failed to add product: ${error.message}`,
            icon: "error"
          });
        }
      },
    },
    async created() {
      const code = this.$route.params.id
        const result = await axios.get(PRODUCT_API_ENDPOINTS.getProductById(code))
        this.product = result.data
    },
    watch: {
      quantity(newVal) {
        // Emit update-quantity event to parent component (Cart)
        this.$emit('update-item-quantity', { code: this.product.code, quantity: newVal });
      }
    }
}
</script>

<style scoped>
/* Container */
#page-wrap {
  margin: 30px auto;
  min-height: auto;
  padding: 20px;
  max-width: 800px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: stretch;
}

/* Back Button */
.go-back {
  text-decoration: none;
  display: flex;
  justify-content: center;
  align-content: center;
  width: 100%;
}

.back-button {
  display: inline-flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  background: #e0e0e0; /* Warna abu-abu untuk tombol back */
  color: #333; /* Warna teks lebih gelap */
  font-weight: bold;
  font-size: 1.2em;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background: #d6d6d6; /* Sedikit lebih gelap saat hover */
  color: #000;
}

/* Product Container */
#product-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: stretch;
}

/* Image */
#img-wrap img {
  width: 100%;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Details */
#product-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-name {
  font-size: 1.8em;
  font-weight: bold;
  color: #333;
}

#price {
  font-size: 1.5em;
  font-weight: bold;
  color: #41B883;
  margin-top: -5px;
}

.rating {
  color: #f4b400;
  font-size: 1.1em;
}

.stock {
  font-size: 0.9em;
  color: #555;
}

.description {
  font-size: 0.95em;
  color: #666;
  line-height: 1.5;
}

/* Actions */
.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Add to Cart Button */
#add-to-cart {
  display: block;
  margin-top: 20px;
  padding: 14px 20px;
  width: 100%;
  background: #41B883;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s ease;
}

#add-to-cart:hover {
  background: #369d70;
}
</style>