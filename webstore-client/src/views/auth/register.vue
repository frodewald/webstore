<template>
  <div class="container">
    <Notification
      :notif="notif"
      :response="responseRegis"
      :notifType="notifType"
      @update:notif="notif = $event"
    />
    <div class="register-card">
      <h3 class="text-center">Create Account</h3>
      <form method="post" @submit.prevent="registerUser">
        <!-- Nama -->
        <div class="mb-3">
          <label for="username" class="form-label">Username</label>
          <input type="text" class="form-control" :class="userValidation() ? '' : 'border-red'" id="username" v-model="username" placeholder="Enter your username" @input="userValidation" @blur="resetValidation" />
          <div class="form-text" id="basic-addon4" :class="userValidation() ? 'text-success' : 'text-danger'" v-show="showUsernameValidation">{{ userValidation() ? 'user unik' : 'user sudah ada' }}</div>
        </div>
  
        <!-- Email -->
        <div class="mb-3">
          <label for="email" class="form-label">Email address</label>
          <input type="email" class="form-control" :class="emailValidationResult.isValid ? '' : 'border-red'" id="email" v-model="email" placeholder="Enter your email" @input="emailValidation" @blur="resetValidation" />
          <div class="form-text" id="basic-addon4" :class="emailValidationResult.isValid ? 'text-success' : 'text-danger'" v-show="showEmailValidation">{{ emailValidationResult.message }}</div>
        </div>
  
        <!-- Password -->
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input type="password" class="form-control" :class="validatePassword() ? '' : 'border-red'" id="password" v-model="password" placeholder="Enter your password" @input="validatePassword" @blur="resetValidation" />
          <div class="form-text" id="basic-addon4" :class="validatePassword() ? 'text-success' : 'text-danger'" v-show="showPasswordValidation">{{ validatePassword() ? "password valid" : "Password must be at least 8 characters long, contain at least 1 uppercase letter, 1 number, and 1 special character." }}</div>
        </div>
  
        <!-- Konfirmasi Password -->
        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Confirm Password</label>
          <input type="password" class="form-control" :class="validateConfirmPassword() ? '' : 'border-red'" id="confirmPassword" v-model="confirmpass" placeholder="Confirm your password" @input="validateConfirmPassword" @blur="resetValidation" />
          <div class="form-text" id="basic-addon4" :class="validateConfirmPassword() ? 'text-success' : 'text-danger'" v-show="showConfirmPasswordValidation">{{ validateConfirmPassword() ? 'Passwords cocok.' : 'Passwords tidak match.' }}</div>
        </div>
  
        <!-- Checkbox -->
        <div class="form-check mb-3">
          <input type="checkbox" class="form-check-input" :class="!termsAccepted && termsTriedSubmit ? 'border-red' : ''"  id="termsCheck" v-model="termsAccepted" />
          <label class="form-check-label" for="termsCheck">
            I agree to the <a href="#">terms and conditions</a>
          </label>
        </div>
  
        <!-- Tombol Register -->
        <button type="submit" class="btn btn-custom w-100">Register</button>
      </form>
  
      <div class="form-footer">
        <p>Already have an account? <router-link :to="{ name: 'login' }">Sign in</router-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { USER_API_ENDPOINTS } from '@/services/api';
import Notification from '@/components/Notification.vue'
export default {
  name: "registerForm",
  components: {
    Notification,
  },
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirmpass: '',
      allUsers: [],
      notif: false,
      responseRegis: '',
      notifType: '',
      showUsernameValidation: false,
      showEmailValidation: false,
      emailValidationResult: { isValid: true, message: '' },
      showPasswordValidation: false,
      showConfirmPasswordValidation: false,
      termsAccepted: false,
      termsTriedSubmit: false
    };
  },
  created() {
    this.fetchAllUsers();
  },
  methods: {
    async registerUser() {
      this.termsTriedSubmit = true;

      if (!this.termsAccepted) {
        setTimeout(() => {
          this.termsTriedSubmit = false;
        }, 2000);
        return;
      }

      try {
        const response = await axios.post(USER_API_ENDPOINTS.register, {
          username: this.username,
          email: this.email,
          password: this.password,
          confirmpass: this.confirmpass
        }, {
          withCredentials: true
        });

        if (response.status === 201) {
          this.notifType = 'success';
          this.responseRegis = 'Register Successfully';
          this.notif = true;
          setTimeout(() => {
            this.$router.replace('/');
          }, 1500);
        }
        console.log('User registered:', response.data);
      } catch (error) {
        this.notif = true;
        this.notifType = 'error';
        this.responseRegis = error.response.data.message || 'Error occurred';
      }
    },
    async fetchAllUsers() {
      const response = await axios.get(USER_API_ENDPOINTS.getAllUsers);
      this.allUsers = response.data.users.map(user => ({
        username: user.username,
        email: user.email
      }));
    },
    validatePassword() {
      if (this.password !== '') {
        this.showPasswordValidation = true;
      } else {
        this.showPasswordValidation = false;
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      if (passwordRegex.test(this.password) || this.password.length === 0) {
        return true;
      } 
      return false;
    },
    validateConfirmPassword() {
      if (this.confirmpass !== '') {
        this.showConfirmPasswordValidation = true;
      } else {
        this.showConfirmPasswordValidation = false;
      }

      if (this.password === this.confirmpass) {
        return true;
      }
      return false;
    },
    userValidation() {
      if (this.username !== '') {
        this.showUsernameValidation = true;
      } else {
        this.showUsernameValidation = false;
      }

      const UserExists = this.allUsers.some(user => user.username === this.username);
      return !UserExists;
    },
    emailValidation() {
      if (this.email !== '') {
        this.showEmailValidation = true;
      } else {
        this.showEmailValidation = false; 
        this.emailValidationResult = { isValid: true, message: '' };
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(this.email)) {
        this.emailValidationResult = {
          isValid: false,
          message: "email tidak valid"
        };
        return;
      }

      const emailExists = this.allUsers.some(user => user.email === this.email);
      if (emailExists) {
        this.emailValidationResult = {
          isValid: false,
          message: "email sudah ada"
        };
      } else {
        this.emailValidationResult = {
          isValid: true,
          message: "email valid"
        };
      }
    },
    resetValidation() {
      this.showUsernameValidation = false;
      this.showConfirmPasswordValidation = false;
      this.showPasswordValidation = false;
      if (this.email === '') {
        this.showEmailValidation = false; 
        this.emailValidationResult = { isValid: true, message: '' };
      } else {
        this.emailValidation();
      }
    },
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
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
  background-color: #3a9c72;
}

.form-footer {
  text-align: center;
  margin-top: 10px;
}

.form-footer a {
  color: #41b883;
}

.border-red {
  border: 2px solid red;
  outline: none;
}
</style>