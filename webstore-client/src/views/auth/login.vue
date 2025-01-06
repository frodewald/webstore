<template>
  <div class="container">
    <div v-if="notif" class="notif" :class="notifType">
      <i class="icon"></i>
      <span>{{ responseLogin }}</span>
    </div>
    <div class="register-card">
      <h3 class="text-center">Login</h3>
      <form method="post" @submit.prevent="loginUser">
        <!-- Nama -->
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input type="text" class="form-control" id="username" v-model="username" placeholder="Enter your username" required />
        </div>

        <!-- Password -->
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input type="password" class="form-control" id="password" v-model="password" placeholder="Enter your password" required />
        </div>

        <!-- Tombol Login -->
        <button type="submit" class="btn btn-custom w-100">Login</button>
      </form>

      <div class="form-footer">
        <p>Don't have an account yet? <router-link :to="{ name: 'register' }">Register</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { USER_API_ENDPOINTS } from "@/services/api";
export default {
  name: "loginForm",
  data() {
    return {
      username: "",
      password: "",
      notif: false,
      responseLogin: "",
      notifType: "", // Class untuk sukses/error
    };
  },
  methods: {
    async loginUser() {
      try {
        const response = await axios.post(
          USER_API_ENDPOINTS.login,
          {
            username: this.username,
            password: this.password,
          },
          {
            withCredentials: true, // Untuk cookie
          }
        );
        if (response.status === 200) {
          this.notifType = "success";
          this.responseLogin = "Login successful!";
          this.showNotif();
          setTimeout(() => {
            this.$router.push("/admin/dashboard");
          }, 1500);
        }
      } catch (error) {
        this.notifType = "error";
        this.responseLogin = error.response?.data?.message || "An error occurred!";
        this.showNotif();
      }
    },
    showNotif() {
      this.notif = true;
      setTimeout(() => {
        this.notif = false;
      }, 3000); // Notif otomatis hilang
    },
  },
};
</script>

<style scoped>
.container {
  min-height: 85vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.register-card {
  background-color: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 100%;
  max-width: 400px;
}

.register-card h3 {
  font-family: "Arial", sans-serif;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
}

.form-control {
  border-radius: 10px;
}

.btn-custom {
  background-color: #41b883;
  color: #fff;
  border-radius: 50px;
  transition: background-color 0.3s ease;
  font-weight: bold;
}

.btn-custom:hover {
  background-color: #369e6c;
}

.form-footer {
  text-align: center;
  margin-top: 15px;
}

.form-footer a {
  color: #41b883;
  text-decoration: none;
}

.form-footer a:hover {
  text-decoration: underline;
}

.notif {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #41b883;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideDown 0.5s ease, fadeOut 0.5s 2.5s ease forwards;
}

.notif.success {
  background-color: #41b883;
}

.notif.error {
  background-color: #e63946;
}

.icon {
  width: 20px;
  height: 20px;
  background-size: cover;
}

.success .icon {
  background-image: url("../../assets/icons/check.svg"); /* Sesuaikan dengan ikon sukses */
}

.error .icon {
  background-image: url("../../assets/icons/error.svg"); /* Sesuaikan dengan ikon error */
}

@keyframes slideDown {
  from {
    transform: translateX(-50%) translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

@keyframes fadeOut {
  to {
    opacity: 0;
    visibility: hidden;
  }
}
</style>