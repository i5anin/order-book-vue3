<template>
  <div class="spread" title="Разница между лучшей ценой на покупку и продажу">
    Spread: {{ formatSpread() }} %
  </div>
</template>

<script>
  export default {
    props: {
      spread: {
        type: Number,
        required: true
      }
    },
    methods: {
      formatSpread() {
        return parseFloat(this.spread).toFixed(2);
      }
    }
  };
</script>

<style scoped>
  /* Стили для компонента Spread */
  .spread {
    margin-top: 20px;
    font-weight: bold;
    font-size: 16px;
    cursor: help; /* Добавлен стиль указателя мыши для указания на наличие подсказки */
  }

  /* Темные стили */
  .dark .spread {
    color: #ddd;
  }
</style>
