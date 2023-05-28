<template>
  <div class="loading">{{ loadingText }}</div>
</template>

<script>
  export default {
    data() {
      return {
        loadingText: "Загрузка"
      };
    },
    mounted() {
      this.animateDots();
    },
    methods: {
      animateDots() {
        setInterval(() => {
          const dotsCount = (this.loadingText.match(/\./g) || []).length;
          const newDotsCount = (dotsCount + 1) % 4;
          this.loadingText = "Загрузка" + ".".repeat(newDotsCount);
        }, 500);
      }
    }
  };
</script>

<style scoped>
  /* Стили для компонента LoadingIndicator */
  .loading {
    font-size: 20px;
    margin-bottom: 10px;
  }

  /* Темные стили */
  .dark .loading {
    color: #ddd;
  }
</style>
