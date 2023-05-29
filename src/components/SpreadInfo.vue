<template>
  <div
    class="spread"
    :class="{ red: spread < 0 }"
    title="Разница между лучшей ценой на покупку и продажу"
  >
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
    font-size: 14px;
  }

  .red {
    color: red;
  }
</style>
