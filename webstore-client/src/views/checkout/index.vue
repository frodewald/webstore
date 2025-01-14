<template>
  <div class="checkout-container mt-5">
    <Notification
      :notif="notif"
      :response="response"
      :notifType="notifType"
      @update:notif="notif = $event"
    />
    <h1 class="checkout-title">Checkout</h1>
    <hr>

    <!-- Informasi Pelanggan -->
    <div class="customer-info">
      <h2 class="text-center">Informasi Pelanggan</h2>
      <div class="info-row">
        <strong>Nama Lengkap:</strong>
        <p>{{ profile.name }}</p>
      </div>
      <div class="info-row">
        <strong>Alamat Pengiriman:</strong>
        <p>{{ profile.address }}</p>
      </div>
      <div class="info-row">
        <strong>Nomor Telepon:</strong>
        <p>{{ profile.phone }}</p>
      </div>
      <div class="info-row">
        <strong>Email:</strong>
        <p>{{ profile.email }}</p>
      </div>
      <button @click="redirectToProfile" class="edit-profile-button">Edit Profil</button>
    </div>

    <!-- Ringkasan Pesanan -->
    <div class="order-summary">
      <h2 class="text-center mb-5">Ringkasan Pesanan</h2>
      <ul>
        <li v-for="item in orderSummary.products" :key="item._id" class="order-item">
          <img :src="`${BACKEND_URL}${item.imageUrl}`" alt="Gambar Produk" class="product-image" />
          <div class="product-info">
            <p class="product-name">{{ item.name }}</p>
            <p class="product-quantity">Quantity: {{ item.quantity }}</p>
          </div>
          <p class="product-total">{{ item.total | currencyFormat }}</p>
        </li>
      </ul>
      <div class="shipping-method mt-4">
        <label for="shippingMethod" class="form-label">Metode Pengiriman</label>
        <select 
          id="shippingMethod" 
          class="form-select form-select-lg mb-3" 
          v-model="selectedShippingMethod" 
          @change="updateShippingFee"
        >
          <option 
            v-for="method in shippingMethods" 
            :key="method.value" 
            :value="method.value"
          >
            {{ method.name }} ({{ method.fee | currencyFormat }})
          </option>
        </select>
      </div>
      <div class="order-total">
        <p>Total Produk: <strong>{{ orderSummary.totalPrice | currencyFormat }}</strong></p>
        <p>Biaya Pengiriman: <strong>{{ orderSummary.shippingFee | currencyFormat }}</strong></p>
        <hr>
        <p class="total-cash">Total Pembayaran: <strong>{{ orderSummary.totalPayment | currencyFormat }}</strong></p>
      </div>
    </div>

    <hr>
    <!-- Pilihan Metode Pembayaran -->
    <div class="payment-methods">
      <h2 class="text-center">Pilih Metode Pembayaran</h2>
      <div class="payment-options">
        <div 
          v-for="method in paymentMethods" 
          :key="method.value" 
          class="payment-card" 
          :class="{ 'selected': paymentMethod === method.value }"
         @click="selectPaymentMethod(method.value)"
          role="button"
          tabindex="0"
          :aria-label="`Pilih metode pembayaran ${method.name}`"
        >
          <img :src="method.icon" alt="Payment Icon" class="payment-icon" />
          <p class="payment-name m-0">{{ method.name }}</p>
        </div>
      </div>
    </div>
    <button class="submit-button" @click="createCheckout">Bayar Sekarang</button>
  </div>
</template>

<script>
import { USER_API_ENDPOINTS, ORDER_API_ENDPOINTS, BACKEND_URL, CHECKOUT_API_ENDPOINTS } from "@/services/api";
import axios from "axios";
import Notification from '@/components/Notification.vue'
export default {
  components: {
    Notification,
  },
  data() {
    return {
      profile: {
        name: "",
        address: "",
        phone: "",
        email: "",
      },
      paymentMethods: [
        {
          name: "Transfer Bank",
          value: "transfer",
          icon: "https://img.icons8.com/ios-filled/50/000000/bank-cards.png",
        },
        {
          name: "COD",
          value: "cod",
          icon: "https://img.icons8.com/ios-filled/50/000000/cash-in-hand.png",
        },
        {
          name: "GoPay",
          value: "gopay",
          icon: "https://i.pinimg.com/736x/7c/50/f0/7c50f0b7ebf83989a200063ed2605d15.jpg",
        },
        {
          name: "OVO",
          value: "ovo",
          icon: "https://i.pinimg.com/736x/35/31/f6/3531f641b11732e00ba7d4671fab852e.jpg",
        },
        {
          name: "Dana",
          value: "dana",
          icon: "https://i.pinimg.com/originals/2b/1f/11/2b1f11dec29fe28b5137b46fffa0b25f.png",
        },
        {
          name: "Kartu Kredit/Debit",
          value: "credit_card",
          icon: "https://img.icons8.com/ios-filled/50/000000/bank-cards.png",
        },
      ],
      shippingMethods: [
        { name: "JNE Reguler", value: "JNE", fee: 20000 },
        { name: "J&T Express", value: "JNT", fee: 25000 },
        { name: "SiCepat", value: "SICEPAT", fee: 22000 },
        { name: "Gosend", value: "GOSEND", fee: 15000 },
        { name: "GrabExpress", value: "GRABEXPRESS", fee: 18000 },
      ],
      selectedShippingMethod: null,
      paymentMethod: null,
      orderSummary: {
        products: [],
        totalPrice: 0,
        shippingFee: 0,
        totalPayment: 0,
      },
      notif: false,
      response: '',
      notifType: '',
      BACKEND_URL
    };
  },
  methods: {
    submitForm() {
      alert("Formulir berhasil dikirim!");
      console.log(this.form);
    },
    redirectToProfile() {
      this.$router.push("/profile");
    },
    async getProfile() {
      const { data } = await axios.get(USER_API_ENDPOINTS.getUser, {
        withCredentials: true,
      });

      const getUser = data.user;
      this.profile.name = getUser.username;
      this.profile.email = getUser.email;
      this.profile.address = getUser.alamat;
      this.profile.phone = getUser.telepon;
    },
    async getOrderSummary() {
      try {
        const { data } = await axios.get(ORDER_API_ENDPOINTS.getOrder, {
          withCredentials: true,
        });

        const order = data[0];
        const cartItems = order.cart_items;
        const products = order.products;

        const orderProducts = cartItems.map((item) => {
          const productDetails = products.find(
            (product) => product.code === item.code
          );
          return {
            ...productDetails,
            quantity: item.quantity,
            total: item.quantity * productDetails.price,
          };
        });

        const totalPrice = orderProducts.reduce(
          (sum, item) => sum + item.total,
          0
        );

        const defaultShipping = this.shippingMethods[0]; // Default metode pengiriman
        this.selectedShippingMethod = defaultShipping.value;

        this.orderSummary = {
          products: orderProducts,
          totalPrice: totalPrice,
          shippingFee: defaultShipping.fee,
          totalPayment: totalPrice + defaultShipping.fee,
        };
      } catch (error) {
        console.error("Error fetching order summary:", error);
      }
    },
    selectPaymentMethod(value) {
      this.paymentMethod = value;
    },
    async createCheckout() {
      try {
        // Validasi metode pembayaran
        if (!this.paymentMethod) {
          alert("Pilih metode pembayaran terlebih dahulu.");
          return;
        }

        // Menyusun data untuk dikirim ke backend
        const checkoutData = {
          products: this.orderSummary.products.map(product => ({
            product_id: product._id,
            quantity: product.quantity
          })),
          total_pembayaran: this.orderSummary.totalPayment,
          metode_pengiriman: this.selectedShippingMethod,
          metode_pembayaran: this.paymentMethod,
          biaya_pengiriman: this.orderSummary.shippingFee
        };

        const response = await axios.post(CHECKOUT_API_ENDPOINTS.createCheckout, checkoutData, {
          withCredentials: true
        });

        if (response.status === 201) {
          this.notifType = "success";
          this.notif = true
          this.response = "Checkout successful!";
          await axios.delete(ORDER_API_ENDPOINTS.deletAllOrder, {
            withCredentials: true
          })
          this.$emit('update-cart-qty', 0);
          setTimeout(() => {
            this.$router.push("/status");
          }, 3000);
        }
      } catch (error) {
        this.notif = true;
        this.notifType = 'error';
        this.response = error.response.data.message || 'Error occurred';
      }
    },
    updateShippingFee() {
      const selectedMethod = this.shippingMethods.find(
        (method) => method.value === this.selectedShippingMethod
      );
      if (selectedMethod) {
        this.orderSummary.shippingFee = selectedMethod.fee;
        this.orderSummary.totalPayment =
          this.orderSummary.totalPrice + this.orderSummary.shippingFee;
      }
    },
  },
  mounted() {
    this.getProfile();
    this.getOrderSummary();
    this.updateShippingFee();
  },
};
</script>

<style scoped>
.checkout-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  font-family: Arial, sans-serif;
}

.checkout-title {
  color: #41B883;
  text-align: center;
  margin-bottom: 20px;
}

.customer-info {
  background-color: #f3f3f3;
  border-radius: 20px;
  margin-bottom: 20px;
  padding: 20px;
}

.info-row {
  margin: 25px 0;
}

.info-row strong {
  display: block;
}

.info-row p {
  margin: 0;
}

.total-cash {
  font-size: 22px;
}

.total-cash strong {
  background-color: #bebebe;
  padding: 4px;
  border-radius: 10px;
}

.edit-profile-button {
  background-color: #41B883;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-profile-button:hover {
  background-color: #369f6b;
}

.order-summary {
  margin-bottom: 20px;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}

.order-total p {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0;
}

.order-total strong {
  font-size: 22px;
  text-align: end;
}

.order-summary h2 {
  color: #41B883;
}

.order-summary ul {
  list-style: none;
  padding: 0;
}

.order-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-right: 15px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.product-info {
  flex-grow: 1;
}

.product-name {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
}

.product-quantity {
  font-size: 14px;
  color: #555;
}

.product-total {
  font-size: 16px;
  font-weight: bold;
  color: #41B883;
}

.order-total {
  margin-top: 15px;
}

.payment-methods {
  margin-top: 30px;
  margin-bottom: 30px;
}

.payment-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
}

.payment-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
  width: 100%;
}

.payment-card:hover {
  transform: scale(1.05);
  border-color: #41B883;
}

.payment-card.selected {
  border-color: #41B883;
  background-color: #e6f7ee;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.payment-icon {
  width: 50px;
  height: 50px;
  object-fit: contain;
  padding: 5px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.payment-name {
  font-size: 14px;
  font-weight: bold;
  text-align: left;
  color: #333;
}

.submit-button {
  width: 100%;
  padding: 10px;
  background-color: #41B883;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #369f6b;
}
</style>
