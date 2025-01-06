<template>
    <div class="input-group mb-3" style="max-width: 140px;">
      <div class="input-group-prepend">
        <button class="btn btn-outline-secondary" type="button" @click="decreaseQty">-</button>
      </div>
      <input type="number" class="form-control text-center number-input" v-model="quantity" :min="1" :max="max">
      <div class="input-group-append">
        <button class="btn btn-outline-secondary" type="button" @click="increaseQty">+</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'QtySelector',
    props: {
        max: Number,
        value: Number
    },
    computed: {
      quantity: {
        get() {
          return this.value; // Mengambil nilai dari `v-model`
        },
        set(newVal) {
          const quantity = Math.min(this.max, Math.max(1, newVal)); // Batasi jumlah
          this.$emit('input', quantity); // Emit nilai yang telah dibatasi
        }
      }
    },
    methods: {
      increaseQty() {
        if (this.quantity < this.max) {
        this.quantity++;
        }
      },
      decreaseQty() {
        if (this.quantity > 1) {
          this.quantity--;
        }
      },
    }
  };
  </script>
  
  <style scoped>
    /* Menghilangkan tanda panah di input number */
    .number-input::-webkit-inner-spin-button,
    .number-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
    }
  </style>
  