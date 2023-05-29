<template>
  <div class="order-book dark">
    <el-card v-if="hasSpread" class="spread-info">
      <b>{{ currentBitcoinPrice }}</b
      ><SpreadInfo :spread="spread" />
    </el-card>
    <loading-spinner :loading="loading">
      <div class="header-row">
        <div class="current-price"></div>
      </div>
      <OrderTable
        :orders="asks"
        type="sell"
        :ourOrders="ourOrders"
        :currency="selectedCurrency"
        :headerText="'Цена (BTC)'"
      />
      <OrderTable
        :orders="bids"
        type="buy"
        :ourOrders="ourOrders"
        :currency="selectedCurrency"
        :headerText="currentBitcoinPrice"
      />
    </loading-spinner>
  </div>
</template>

<script>
  import OrderTable from "./OrderTable.vue";
  import SpreadInfo from "./SpreadInfo.vue";
  import LoadingSpinner from "./LoadingSpinner.vue";

  export default {
    components: {
      OrderTable,
      SpreadInfo,
      LoadingSpinner
    },
    data() {
      return {
        selectedCurrency: "btc",
        currencies: [{ label: "BTC", value: "btc" }]
      };
    },
    computed: {
      loading() {
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
      },
      currentBitcoinPrice() {
        return this.$store.state.currentBitcoinPrice.toFixed(2);
      }
    },
    created() {
      this.$store.dispatch("subscribeToOrderBookStream");
    },
    methods: {
      changeCurrency() {
        this.selectedCurrency = this.selectedCurrency.toLowerCase();
      },
      refreshOrders() {
        this.$store.dispatch("fetchOurOrders");
      }
    }
  };
</script>
