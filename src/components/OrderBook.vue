<template>
  <div class="order-book dark">
    <SpreadInfo v-if="hasSpread" :spread="spread" />
    <LoadingIndicator v-if="isLoading" />
    <div v-else>
      <div class="header-row">
        <div class="header">Asks (Продажа)</div>
      </div>
      <OrderTable :orders="asks" type="sell" :ourOrders="ourOrders" />
      <div class="header-row pt25">
        <div class="header">Bids (Покупка)</div>
      </div>
      <OrderTable :orders="bids" type="buy" :ourOrders="ourOrders" />
    </div>
  </div>
</template>

<script>
  import OrderTable from "./OrderTable.vue";
  import SpreadInfo from "./SpreadInfo.vue";
  import LoadingIndicator from "./LoadingIndicator.vue";

  export default {
    components: {
      OrderTable,
      SpreadInfo,
      LoadingIndicator
    },
    computed: {
      isLoading() {
        return this.$store.state.isLoading;
      },
      hasSpread() {
        return this.$store.getters.hasSpread;
      },
      spread() {
        return this.$store.getters.spread;
      },
      asks() {
        return this.$store.state.asks;
      },
      bids() {
        return this.$store.state.bids;
      },
      ourOrders() {
        return this.$store.state.ourOrders;
      }
    },
    created() {
      this.$store.dispatch("subscribeToOrderBookStream");
      this.$store.dispatch("fetchOurOrders");
    }
  };
</script>

<style scoped>
  .order-book {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Arial, sans-serif;
    padding: 10px;
  }

  .loading {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .header-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
    font-weight: bold;
    font-size: 16px;
  }

  .header {
    margin-bottom: 5px;
  }

  .spread {
    margin-top: 20px;
    font-weight: bold;
    font-size: 16px;
  }

  .dark {
    background-color: #333;
    color: #fff;
  }

  .dark .header-row {
    color: #ddd;
  }

  .dark .header {
    color: #aaa;
  }

  .dark .spread {
    color: #ddd;
  }

  .pt25 {
    padding-top: 25px;
  }
</style>
