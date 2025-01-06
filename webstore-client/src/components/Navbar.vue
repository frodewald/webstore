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
      <div class="logout" @click="logout">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
          <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
        </svg>
        <p>Logout</p>
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
    border-bottom: 1px solid #ddd;
    height: 75px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 40px;
  }
  #products-link {
    text-align: center;
    display: block;
    color: #41B883;
    font-size: 22px;
    text-decoration: none;
  }
  #products-link h1 {
      margin: 0;
  }
  #cart-link {
    position: absolute;
    right: 16px;
    top: 16px;
  }
  .logo-profile {
    padding: 10px; /* Area lebih luas yang akan memicu event mouseenter */
    cursor: pointer;
  }
  .info-profile {
    position: absolute;
    top: 60px;
    right: 40px;
    background-color: white;
    border-radius: 5px;
    padding: 10px;
    border: 0.5px solid rgba(163, 163, 163, 0.5);
    box-shadow: 0px 0px 1px 0;
    z-index: 100;
  }
  .info-profile:hover {
    background-color: rgb(207, 205, 205);
  }
  .logout {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .info-profile p {
    padding: 0;
    margin: 0 0 0 5px;
  }
</style>