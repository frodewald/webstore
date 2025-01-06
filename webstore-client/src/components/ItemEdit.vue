<template>
  <tr>
    <td>
      <div class="product-info">
        <img :src="`http://localhost:8000${product.imageUrl}`" alt="" width="100">
        <h5 class="product-name">{{ product.name }}</h5>
      </div>
    </td>
    <td>
      <p class="product-price">{{ product.price | currencyFormat }}</p>
    </td>
    <td>
      <p>{{ product.stock }}</p>
    </td>
    <td>
      <div class="button-action">
        <router-link :to="{ name: 'update-product', params: { id: product.code }}">
          <button class="action">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="blue" class="bi bi-pencil-square svg-icon edit" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
              <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
            </svg>
          </button>
        </router-link>
        <button class="action" @click="deleteBtn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-trash svg-icon delete" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
          </svg>
        </button>
      </div>
    </td>
  </tr>
</template>
 
<script>
import { PRODUCT_API_ENDPOINTS } from '@/services/api';
import axios from 'axios';
 export default {
     props: [
         'product'
     ],
     methods: {
      deleteBtn() {
        this.$swal.fire({
          title: "Are you sure?",
          text: "You won't be able to revert this!",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
          if (result.isConfirmed) {
            this.$swal.fire({
              title: "Deleting...",
              text: "Please wait while we delete the product",
              icon: "info",
              allowOutsideClick: false,
              showConfirmButton: false,
              willOpen: () => {
                this.$swal.showLoading();
              }
            });
            try {
              const response = await axios.delete(PRODUCT_API_ENDPOINTS.deleteProduct(this.product.code));
              if (response.status === 204) {
                this.$swal.fire({
                  title: "Deleted!",
                  text: "Your product has been deleted.",
                  icon: "success"
                });
                this.$emit('product-deleted', this.product.code);
              } else {
                throw new Error("Failed to delete product");
              }
            } catch (error) {
              this.$swal.fire({
                title: "Error!",
                text: `Failed to delete product: ${error.message}`,
                icon: "error"
              });
            }
          }
        });
      }
    }
 }
</script>
 
 <style scoped>
  .product-info {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
 
  .product-info .product-name {
    margin-left: 10px;
  }
  .product-name {
    margin-bottom: 0;
  }

  img {
    width: 10%;
    border-radius: 5%;
  }

  button.action {
    background-color: transparent;
    border: none;
    width: fit-content;
    padding: 8px;
  }

  .svg-icon.edit:hover {
    fill: darkblue;
  }
  .svg-icon.delete:hover {
    fill: darkred;
  }

  td {
  padding: 6px;
  }

  .button-action {
    display: flex;
    flex-direction: row;
  }
 </style>