<template>
  <div class="order-book dark">
    <el-card v-if="hasSpread" class="spread-info">
      <b>{{ currentCoinPrice }}</b
      ><SpreadInfo :spread="spread" />
    </el-card>
    <loading-spinner :loading="isLoading">
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
        :headerText="currentCoinPrice"
      />
    </loading-spinner>
  </div>
</template>

<script>
  import OrderTable from "./OrderTable.vue";
  import SpreadInfo from "./SpreadInfo.vue";
  import LoadingSpinner from "./LoadingSpinner.vue";
  import { mapGetters } from "vuex";

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
      ...mapGetters([
        "isLoading",
        "hasSpread",
        "spread",
        "asks",
        "bids",
        "ourOrders",
        "currentCoinPrice"
      ])
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
