<template>
  <div>
    <router-link class="go-back" :to="{ name: 'product' }">
      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" style="fill: #41B883" class="bi bi-arrow-left-circle" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5z"/>
      </svg>
    </router-link>
    <div id="page-wrap" v-if="product">
        <div id="img-wrap">
            <img :src="`${BACKEND_URL}${product.imageUrl}`" alt="">
        </div>
        <div id="product-details">
            <h1>{{ product.name }}</h1>
            <h3 id="price">{{ product.price | currencyFormat }}</h3>
            <p>Average rating: {{ product.averageRating }}</p>
            <p>Stock: {{ product.stock }}</p>
            <p>{{ product.description }}</p>
            <QtySelector v-model="quantity" :max="product.stock" class="qty-selector"/>
            <button id="add-to-cart" @click="addToCart(product)">Add to Cart</button>
        </div>
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
  .go-back {
    display: inline-block;
    margin: 30px 30px 0;
  }
  #page-wrap {
    margin-top: 16px;
    padding: 16px;
    max-width: 600px;
  }

  #img-wrap {
    text-align: center;
  }

  img {
    width: 400px;
  }

  #product-details {
    padding: 16px;
    position: relative;
  }

  .qty-selector {
    float: right;
  }

  #add-to-cart {
    width: 100%;
  }

  #price {
    position: absolute;
    top: 24px;
    right: 16px;
  }
  .notif {
    text-align: center;
    color: white;
    background-color: #41B883;
    padding: 3%;
    border-radius: 8px;
  }
</style>