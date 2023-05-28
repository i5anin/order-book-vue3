<template>
  <el-card class="loading">{{ loadingText }}</el-card>
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
