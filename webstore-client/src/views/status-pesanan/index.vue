<template>
  <div class="status-page">
    <h1 class="page-title">Status Pesanan Anda</h1>

    <Loading v-if="isLoading" :isLoading="isLoading" :isFullPage="false" />
    <div v-else-if="checkouts.length" class="status-grid">
      <div v-for="(checkout, index) in checkouts" :key="index" class="status-card">
        <div class="card-header">
          <div>
            <h3 class="order-id">Pesanan #{{ checkout.id }}</h3>
            <p class="order-date">Tanggal: {{ formatDate(checkout.createdAt) }}</p>
          </div>
          <div class="order-status" :class="statusClass(checkout.status_pemesanan)">
            {{ checkout.status_pemesanan }}
          </div>
        </div>

        <div class="card-body">
          <h4 class="text-center mb-5">Produk Dipesan</h4>
          <ul class="product-list">
            <li v-for="(product, idx) in checkout.products" :key="idx" class="product-item">
              <img :src="`${BACKEND_URL}${product.product_id.imageUrl}`" :alt="product.product_id.name" />
              <div>
                <p class="product-name">{{ product.product_id.name }}</p>
                <p class="product-details">
                  {{ product.quantity }} x {{ product.product_id.price | currencyFormat }} = 
                  {{ (product.quantity * product.product_id.price) | currencyFormat }}
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div class="card-footer">
          <div class="d-flex justify-content-between align-items-center">
            <h4>Pembayaran</h4>
            <div class="payment-method">{{ checkout.metode_pembayaran }}</div>
          </div>
          <hr>
          <div class="order-summary">
            <p class="pengiriman_container">
              <span>Metode Pengiriman: </span>
              <span class="metode_pengiriman">
                <span class="pengiriman_value">{{ checkout.metode_pengiriman }}</span>
                <strong>{{ checkout.biaya_pengiriman | currencyFormat }}</strong>
              </span>
            </p>
            <p><span>Total Pembayaran: </span><strong class="total_pembayaran">{{ checkout.total_pembayaran | currencyFormat }}</strong></p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>Anda belum memiliki pesanan.</p>
    </div>    
  </div>
</template>

<script>
import { BACKEND_URL, CHECKOUT_API_ENDPOINTS } from "@/services/api";
import Loading from "@/components/Loading.vue";
import axios from "axios";

export default {
  components: {
    Loading
  },
  data() {
    return {
      checkouts: [],
      BACKEND_URL,
      isLoading: false
    };
  },
  created() {
    this.fetchCheckouts();
  },
  methods: {
    async fetchCheckouts() {
      this.isLoading = true
      try {
        const response = await axios.get(CHECKOUT_API_ENDPOINTS.getCheckout, {
          withCredentials: true,
        });
        this.checkouts = response.data;
        if (response.status === 200) {
          this.isLoading = false
        }
      } catch (error) {
        console.error("Error fetching checkout data", error);
        this.isLoading = false
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,  // Menampilkan waktu dalam format 24 jam
      });
    },
    statusClass(status) {
      return {
        pending: "status-pending",
        confirmed: "status-confirmed",
        shipped: "status-shipped",
        delivered: "status-delivered",
        canceled: "status-canceled",
      }[status.toLowerCase()] || "status-unknown";
    },
  },
};
</script>

<style scoped>
.status-page {
  min-height: 100vh;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.page-title {
  text-align: center;
  margin-bottom: 30px;
  font-size: 24px;
  color: #333;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr)); /* Membuat grid otomatis wrap */
  gap: 20px;
}

.status-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.order-id {
  font-size: 18px;
  color: #333;
}

.order-date {
  font-size: 14px;
  color: #777;
}

.order-status {
  font-size: 14px;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  text-transform: capitalize;
}

.card-body {
  margin-bottom: 10px;
}

.product-list {
  list-style-type: none;
  padding: 0;
}

.product-item {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
}

.product-item img {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
}

.product-name {
  font-size: 16px;
  color: #333;
}

.product-details {
  font-size: 14px;
  color: #555;
}

.card-footer {
  margin-top: 10px;
}

.payment-method {
  font-size: 14px;
  color: #555;
  background-color: #f9f9f9;
  padding: 5px 10px;
  border-radius: 5px;
}

.order-summary {
  margin-top: 10px;
  font-size: 20px;
  color: #555;
}

.order-summary p {
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-summary .pengiriman_container {
  display: inline;
}

.order-summary strong {
  margin-left: 10px;
}

.order-summary .total_pembayaran {
  background-color: #dddddd;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 25px;
}

.order-summary .metode_pengiriman {
  display: flex;
  justify-content: space-between;
}

.order-summary .pengiriman_value {
  font-size: 20px;
  color: #555;
  background-color: #eeeeee;
  padding: 5px 10px;
  border-radius: 10px;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-confirmed {
  background-color: #d4edda;
  color: #155724;
}

.status-shipped {
  background-color: #cce5ff;
  color: #004085;
}

.status-delivered {
  background-color: #d4edda;
  color: #155724;
}

.status-canceled {
  background-color: #f8d7da;
  color: #721c24;
}

.empty-state {
  text-align: center;
  color: #555;
  font-size: 16px;
  margin-top: 50px;
}

@media (max-width: 480px) {
  .order-id {
    font-size: 16px;
  }

  .order-date {
    font-size: 12px;
  }

  .order-summary {
    font-size: 16px;
  }

  .order-summary .pengiriman_value {
    font-size: 15px;
  }

  .order-summary .total_pembayaran {
    font-size: 20px;
  }

  h4 {
    font-size: 18px;
  }

  .status-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 390px) {
  .card-header {
    flex-direction: column;
  }

  .card-header div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .order-id {
    text-align: center;
  }
}
</style>