<template>
  <div class="order-book dark">
    <el-card v-if="hasSpread" class="spread-info">
      <SpreadInfo :spread="spread" />
    </el-card>
    <div
      v-loading="loading"
      element-loading-text="Loading..."
      :element-loading-spinner="svg"
      element-loading-svg-view-box="-10, -10, 50, 50"
      element-loading-background="rgba(122, 122, 122, 0.8)"
    >
      <div v-if="!loading">
        <div class="header-row">
          <div class="current-price">
            <strong>{{ currentBitcoinPrice }}</strong>
          </div>
        </div>
        <OrderTable
          :orders="asks"
          type="sell"
          :ourOrders="ourOrders"
          :currency="selectedCurrency"
        />
        <div class="header-row pt25"></div>
        <OrderTable
          :orders="bids"
          type="buy"
          :ourOrders="ourOrders"
          :currency="selectedCurrency"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import OrderTable from "./OrderTable.vue";
  import SpreadInfo from "./SpreadInfo.vue";

  export default {
    components: {
      OrderTable,
      SpreadInfo
    },
    data() {
      return {
        selectedCurrency: "btc",
        currencies: [
          { label: "DENT", value: "dent" },
          { label: "BTC", value: "btc" }
        ]
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
        // Получить текущую цену биткойна из хранилища или другого источника данных
        return this.$store.state.currentBitcoinPrice;
      }
    },
    created() {
      this.$store.dispatch("subscribeToOrderBookStream");
      this.$store.dispatch("fetchOurOrders");
    },
    methods: {
      changeCurrency() {
        this.selectedCurrency = this.selectedCurrency.toLowerCase();
      },
      refreshOrders() {
        this.$store.dispatch("fetchOurOrders");
      }
    },
    setup() {
      const svg = `
      <path class="path" d="
        M 30 15
        L 28 17
        M 25.61 25.61
        A 15 15, 0, 0, 1, 15 30
        A 15 15, 0, 1, 1, 27.99 7.5
        L 15 15
      " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
    `;
      return {
        svg
      };
    }
  };
</script>
