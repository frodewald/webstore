<template>
  <div id="nav-bar">
    <router-link :to="{ name: 'product' }" id="products-link">
      <h1>Webstore</h1>
    </router-link>
    <div class="logo-profile" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
      <router-link :to="{ name: 'profile'}" id="profile-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="#41B883" class="bi bi-person-circle" viewBox="0 0 16 16">
          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
          <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
        </svg>
      </router-link> 
    </div>
    <div class="info-profile" v-if="!isNotForInfoProfile" v-show="isHovered" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
      <a href="/" class="info-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-house" viewBox="0 0 16 16">
          <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
        </svg>
        <span>Home</span>
      </a>
      <a v-if="isAdmin" href="/admin/dashboard" class="info-item">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-clipboard-data" viewBox="0 0 16 16">
          <path d="M4 11a1 1 0 1 1 2 0v1a1 1 0 1 1-2 0zm6-4a1 1 0 1 1 2 0v5a1 1 0 1 1-2 0zM7 9a1 1 0 0 1 2 0v3a1 1 0 1 1-2 0z"/>
          <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
          <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
        </svg>
        <span>Dashboard</span>
      </a>
      <div class="info-item logout" @click="logout">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
          <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
        </svg>
        <span>Logout</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { USER_API_ENDPOINTS } from '@/services/api';
export default {
  data() {
    return {
      isHovered: false
    }
  },
  props: {
    isAdmin: {
      type: Boolean,
      required: true
    }
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

.logout {
  margin-top: 5px;
}
</style>