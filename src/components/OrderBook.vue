<template>
  <div class="order-book dark">
    <LoadingIndicator v-if="isLoading" />
    <div v-else>
      <div class="header-row">
        <div class="header">Asks (Продажа)</div>
      </div>
      <OrderTable :orders="asks" type="sell" :ourOrders="ourOrders" />
      <div class="header-row">
        <div class="header pt25">Bids (Покупка)</div>
      </div>
      <OrderTable :orders="bids" type="buy" :ourOrders="ourOrders" />
      <SpreadInfo v-if="hasSpread" :spread="spread" />
    </div>
  </div>
</template>

<script>
  import OrderTable from "./OrderTable.vue";
  import LoadingIndicator from "./LoadingIndicator.vue";
  import SpreadInfo from "./SpreadInfo.vue";

  export default {
    components: {
      OrderTable,
      LoadingIndicator,
      SpreadInfo
    },
    data() {
      return {
        isLoading: true,
        asks: [],
        bids: [],
        ourOrders: []
      };
    },
    computed: {
      hasSpread() {
        return this.bids.length > 0 && this.asks.length > 0;
      },
      spread() {
        if (!this.hasSpread) {
          return 0;
        }
        const bestBid = parseFloat(this.bids[0].price);
        const bestAsk = parseFloat(this.asks[0].price);
        return bestAsk - bestBid;
      }
    },
    methods: {
      async subscribeToOrderBookStream() {
        const baseUrl = "wss://stream.binance.com:9443";
        const requestUrl = `${baseUrl}/ws/btcusdt@depth@1000ms`;

        const eventSource = new WebSocket(requestUrl);

        eventSource.onopen = () => {
          this.isLoading = false;
        };

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.handleOrderBookStreamData(data);
        };

        eventSource.onerror = (error) => {
          console.error("Failed to subscribe to order book stream:", error);
        };
      },
      async fetchOurOrders() {
        try {
          const requestUrl =
            "https://api.binance.com/api/v3/avgPrice?symbol=BTCUSDT";
          const response = await fetch(requestUrl);
          const data = await response.json();

          const order = {
            price: parseFloat(data.price),
            quantity: 0
          };

          this.ourOrders = [order];
        } catch (error) {
          console.error("Failed to fetch our orders:", error);
          this.ourOrders = [];
        }
      },
      handleOrderBookStreamData(data) {
        if (!data || !data.b || !data.a) {
          console.error("Invalid order book stream data:", data);
          return;
        }

        this.bids = data.b.map((bid) => ({
          price: parseFloat(bid[0]),
          quantity: parseFloat(bid[1])
        }));

        this.asks = data.a.map((ask) => ({
          price: parseFloat(ask[0]),
          quantity: parseFloat(ask[1])
        }));
      }
    },
    created() {
      this.subscribeToOrderBookStream();
      this.fetchOurOrders();
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
