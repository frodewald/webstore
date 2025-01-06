<template>
  <div class="search-wrapper">
    <div class="input-group">
      <input 
        type="text" 
        class="form-control search-input" 
        placeholder="Search..." 
        :value="searchInput" 
        @input="$emit('input', $event.target.value)" 
        @wheel.prevent
      />
      <button 
        class="btn dropdown-toggle criteria-button" 
        type="button" 
        data-bs-toggle="dropdown" 
        aria-expanded="false"
      >
        {{ selectedCriteriaInComp || 'Filter By' }}
      </button>
      <ul class="dropdown-menu">
        <li 
          v-for="(criteria, index) in searchByCriteriaInComp" 
          :key="index"
        >
          <a 
            class="dropdown-item" 
            href="#" 
            @click="selectCriteria(criteria)"
          >
            {{ criteria }}
          </a>
        </li>
        <li><hr class="dropdown-divider"></li>
        <li>
          <a 
            class="dropdown-item" 
            href="#" 
            @click="resetCriteria"
          >
            Reset Filter
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    searchInput: {
      type: String,
    },
  },
  data() {
    return {
      searchByCriteriaInComp: ["nama", "rating"],
      selectedCriteriaInComp: "",
    };
  },
  methods: {
    selectCriteria(criteria) {
      this.selectedCriteriaInComp = criteria;
      this.$emit("selectedCriteriaInComp", this.selectedCriteriaInComp);
    },
    resetCriteria() {
      this.selectedCriteriaInComp = "";
      this.$emit("selectedCriteriaInComp", "");
      this.$emit("searchInput", "");
    },
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
  align-items: center;
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

.criteria-button {
  background-color: #198754;
  color: #ffffff;
  font-size: 1rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0 8px 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.criteria-button:hover {
  background-color: #146c43;
}

.dropdown-menu {
  min-width: 100%;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.dropdown-item {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  color: #333333;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.dropdown-divider {
  margin: 0.5rem 0;
  border-top: 1px solid #e0e0e0;
}
</style>