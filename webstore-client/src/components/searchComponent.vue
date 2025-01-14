<template>
  <div class="search-wrapper">
    <div class="input-group">
      <input 
        type="text" 
        class="form-control search-input" 
        placeholder="Search..." 
        v-model="searchInput"
        @wheel.prevent
      />
      <router-link 
        v-if="searchInput.trim()" 
        :to="{ path: '/products', query: { search: searchInput } }"
        class="btn search-button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
        </svg>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchInput: '',
    };
  },
};
</script>

<style scoped>
.search-wrapper {
  width: 100%;
  max-width: 400px;
  padding: 0.1rem;
  background-color: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.input-group {
  display: flex;
  align-items: stretch;
  height: 50px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  padding: 0.75rem;
  font-size: 1rem;
  border-radius: 8px 0 0 8px;
  background-color: #ffffff;
  box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.1);
}

.search-button {
  background-color: #198754;
  height: 100%;
  color: #ffffff;
  font-size: 1.25rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-button:hover {
  background-color: #146c43;
}

/* Responsive: Adjust the size of the button for smaller screens */
@media (max-width: 768px) {
  .search-button {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
  .search-input {
    font-size: 0.8rem;
  }

  .input-group {
    height: 40px;
  }
}

@media (max-width: 480px) {
  .search-button {
    font-size: 0.6rem;
    padding: 0.35rem 0.7rem;
  }
  .search-input {
    padding: 0.7rem;
    font-size: 0.8rem;
  }

  .input-group {
    height: 40px;
  }
}
</style>