<template>
    <div class="container mt-5">
      <h4 v-if="notif" class="notif">update profile successfully</h4>
      <h1 class="text-center mb-4">Profile</h1>
      <form @submit.prevent="updateProfile">
        <div class="mb-3">
          <label for="nama" class="form-label">Nama</label>
          <input type="text" class="form-control" v-model="profile.nama" id="nama" />
        </div>
  
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" v-model="profile.email" id="email" />
        </div>
  
        <div class="mb-3">
          <label for="alamat" class="form-label">Alamat</label>
          <input type="text" class="form-control" v-model="profile.alamat" id="alamat" />
        </div>
  
        <div class="mb-3">
          <label for="telepon" class="form-label">Nomor Telepon</label>
          <input type="tel" class="form-control" v-model="profile.telepon" id="telepon" />
        </div>

        <!-- <div class="mb-3">
          <label for="password" class="form-label">Ganti Password</label>
          <input type="password" class="form-control" v-model="profile.password" id="password" />
        </div> -->
  
        <button type="submit" class="btn btn-primary w-100">Update Profile</button>
      </form>
      <button type="button" class="btn btn-danger w-100 mt-2" @click="logout">Log Out</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { USER_API_ENDPOINTS } from '@/services/api';
  export default {
    data() {
      return {
        profile: {
          nama: "",
          email: "",
          password: "",
          alamat: "",
          telepon: "",
        },
        notif: false
      };
    },
    async created() {
      await this.getProfile()
    },
    methods: {
      async updateProfile() {
        const response = await axios.post(USER_API_ENDPOINTS.updateUser, {
          username: this.profile.nama,
          email: this.profile.email,
          alamat: this.profile.alamat,
          telepon: this.profile.telepon,
        }, {
          withCredentials: true // Ini memungkinkan pengiriman cookie
        });
        if (response.status === 200) {
          this.notif = true
        }
      },
      async getProfile() {
        const { data } = await axios.get(USER_API_ENDPOINTS.getUser, {
          withCredentials: true, // Penting untuk session-based authentication
        })

        const getUser = data.user
        this.profile.nama = getUser.username
        this.profile.email = getUser.email
        this.profile.alamat = getUser.alamat
        this.profile.telepon = getUser.telepon
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
    },
  };
  </script>
  
  <style scoped>
  .notif {
    text-align: center;
    color: white;
    background-color: #41B883;
    padding: 3%;
    border-radius: 8px;
  }
  .container {
    max-width: 600px;
    margin-bottom: 10%;
  }
  </style>
  