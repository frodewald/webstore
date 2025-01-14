<!-- Notification.vue -->
<template>
  <div v-if="notif" class="notif" :class="notifType">
    <i class="icon"></i>
    <span>{{ response }}</span>
  </div>
</template>

<script>
export default {
  name: "Notification",
  props: {
    notif: {
      type: Boolean,
      default: false,
    },
    response: {
      type: String,
      default: "",
    },
    notifType: {
      type: String,
      default: "",
    },
  },
  watch: {
    notif(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.$emit("update:notif", false);
        }, 3000); 
      }
    },
  },
};
</script>

<style scoped>
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
  background-image: url("../assets/icons/check.svg"); /* Sesuaikan dengan ikon sukses */
}

.error .icon {
  background-image: url("../assets/icons/error.svg"); /* Sesuaikan dengan ikon error */
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