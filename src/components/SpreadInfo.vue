<template>
  <div class="spread" :class="{ red: spread > 0, green: spread < 0 }">
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
    font-size: 16px;
  }

  .red {
    color: red;
  }

  .green {
    color: green;
  }
</style>
