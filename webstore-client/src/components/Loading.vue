<template>
  <loading
    :active="isLoading"
    :is-full-page="isFullPage"
    :color="color"
    :loader="loader"
    :transition="transition"
    :opacity="opacity"
  />
</template>

<script>
import Loading from 'vue-loading-overlay';
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
    isFullPage: {
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      color: '#41B883',
      loader: 'spinner',
      transition: 'fade',
      opacity: 0.7,
    };
  },
  components: {
    Loading
  },
}
</script>

<style scoped>
/* Tidak ada styling untuk vl-parent karena sudah dihilangkan */
</style>