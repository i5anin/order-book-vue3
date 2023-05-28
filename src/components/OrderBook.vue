<template>
  <div class="order-book dark">
    <el-card v-if="hasSpread" class="spread-info">
      <SpreadInfo :spread="spread" />
    </el-card>
    <loading-indicator v-if="isLoading" />
    <div v-else>
      <div class="header-row">
        <el-card class="header">Asks (Продажа)</el-card>
      </div>
      <OrderTable :orders="asks" type="sell" :ourOrders="ourOrders" />
      <div class="header-row pt25">
        <el-card class="header">Bids (Покупка)</el-card>
      </div>
      <OrderTable :orders="bids" type="buy" :ourOrders="ourOrders" />
    </div>
  </div>
</template>

<script>
  import OrderTable from "./OrderTable.vue";
  import SpreadInfo from "./SpreadInfo.vue";

  export default {
    components: {
      OrderTable,
      SpreadInfo,
      loadingIndicator: {
        template: `<el-loading text="Loading..." background="rgba(0, 0, 0, 0.7)" spinner="el-icon-loading"></el-loading>`
      }
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
