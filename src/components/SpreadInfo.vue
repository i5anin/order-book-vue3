<template>
  <div class="spread" title="Разница между лучшей ценой на покупку и продажу">
    Spread: <b>{{ formatSpread() }} %</b>
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

<style>
  .spread {
    font-size: 12px;
    color: red;
  }
</style>
