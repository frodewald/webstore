<template>
  <div class="container">
    <Notification
      :notif="notif"
      :response="responseLogin"
      :notifType="notifType"
      @update:notif="notif = $event"
    />
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
import Notification from '@/components/Notification.vue'
export default {
  name: "loginForm",
  components: {
    Notification,
  },
  data() {
    return {
      username: "",
      password: "",
      notif: false,
      responseLogin: "",
      notifType: "",
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
          this.notif = true
          this.responseLogin = "Login successful!";
          setTimeout(() => {
            this.$router.push("/admin/dashboard");
          }, 1500);
        }
      } catch (error) {
        this.notifType = "error";
        this.notif = true
        this.responseLogin = error.response?.data?.message || "An error occurred!";
      }
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
</style>