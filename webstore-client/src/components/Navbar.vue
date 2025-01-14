<template>
  <div id="nav-bar">
    <router-link :to="{ name: 'home' }" id="products-link">
      <h1>Webstore</h1>
    </router-link>
    <div class="nav-right">
      <searchComponent class="search-bar" />
      <div class="logo-profile" @click="showDropdown = !showDropdown">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#41B883" class="bi bi-person-circle" viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
          <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
        </svg>
      </div>
      <div class="info-profile" v-if="!isNotForInfoProfile" v-show="showDropdown"  @mouseleave="showDropdown = false">
        <a href="/" class="info-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-house" viewBox="0 0 16 16">
            <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
          </svg>
          <span>Home</span>
        </a>
        <a href="/products" class="info-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box-seam" viewBox="0 0 16 16">
            <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5l2.404.961L10.404 2zm3.564 1.426L5.596 5 8 5.961 14.154 3.5zm3.25 1.7-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464z"/>
          </svg>
          <span>Produk</span>
        </a>
        <a v-if="isAdmin" href="/admin/dashboard" class="info-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-clipboard-data" viewBox="0 0 16 16">
            <path d="M4 11a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0zm6-4a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0zM7 9a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0z"/>
            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
          </svg>
          <span>Dashboard</span>
        </a>
        <a href="/status" class="info-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-cart-check" viewBox="0 0 16 16">
            <path d="M11.354 6.354a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0z"/>
            <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
          </svg>
          <span>Status Pesanan</span>
        </a>
        <hr class="m-0">
        <router-link :to="{ name: 'profile'}" id="profile-icon" class="info-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-person-bounding-box" viewBox="0 0 16 16">
            <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5"/>
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
          </svg>
          <span>Profile</span>
        </router-link> 
        <div class="info-item m-0" @click="logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
            <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
          </svg>
          <span>Logout</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { USER_API_ENDPOINTS } from '@/services/api';
import searchComponent from './searchComponent.vue';
export default {
  data() {
    return {
      showDropdown: false,
    }
  },
  props: {
    isAdmin: {
      type: Boolean,
      required: true
    }
  },
  components: {
    searchComponent
  },
  computed: {
    isNotForInfoProfile() {
      const isNotForInfoProfile = ['login', 'register']
      return isNotForInfoProfile.includes(this.$route.name); // Atau bisa menggunakan this.$route.path === '/cart'
    }
  },
  methods: {
    infoProfile() {
      this.isProfileFocus = true
    },
    async logout() {
      try {
        // Kirim request ke server untuk menghapus session
        await axios.post(USER_API_ENDPOINTS.logout, {}, {
          withCredentials: true // Ini memastikan cookie session dikirimkan
        });
        
        // Arahkan pengguna ke halaman login setelah logout
        this.$router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  }
}
</script>

<style scoped>
#nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 40px;
  height: 75px;
  border-bottom: 1px solid #ddd;
}

#products-link {
  text-decoration: none;
  color: #41B883;
  font-size: 22px;
}

#products-link h1 {
  margin: 0;
}

.logo-profile {
  padding: 10px;
  cursor: pointer;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 20px; /* Jarak antar elemen */
}

.search-bar {
  width: 250px;
}

.info-profile {
  position: absolute;
  top: 60px;
  right: 40px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  display: flex;
  flex-direction: column;
  width: 150px;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 10px;
  font-size: 14px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
  cursor: pointer;
  border-radius: 8px;
}

.info-item:hover {
  background-color: #41B883;
  color: white;
}

.info-item svg {
  margin-right: 8px;
}

@media (max-width: 576px) {
  .search-bar {
    width: 150px;
  }
}

@media (max-width: 480px) {
  /* Menyembunyikan Webstore pada layar kecil */
  #products-link h1 {
    display: none;
  }

  /* Mengubah layout navbar untuk space-between */
  .nav-right {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .logo-profile {
    margin-left: 10px; /* Menambah jarak antara search dan logo */
  }

  /* Membuat search bar lebih kecil di layar kecil */
  .search-bar {
    flex-grow: 1;
    margin-right: 10px; /* Menambah jarak antara search dan profile */
  }

  /* Profile info dropdown tampil lebih kecil */
  .info-profile {
    width: auto;
  }
}

</style>