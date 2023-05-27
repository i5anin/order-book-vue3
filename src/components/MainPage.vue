<template>
  <div class="order-book dark">
    <div v-if="isLoading" class="loading">Загрузка...</div>
    <div v-else>
      <div class="header-row">
        <div class="header">Asks (Продажа)</div>
      </div>
      <table class="order-table">
        <thead>
          <tr>
            <th>Цена (USDT)</th>
            <th>Количество (BTC)</th>
            <th>Всего</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ask in asks" :key="ask.price">
            <td :class="{ highlighted: isOurOrder(ask), 'sell-cell': true }">
              {{ formatPrice(ask.price) }}
            </td>
            <td>{{ formatQuantity(ask.quantity) }}</td>
            <td>{{ formatTotal(ask.price, ask.quantity) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="header-row">
        <div class="header">Bids (Покупка)</div>
      </div>
      <table class="order-table">
        <thead>
          <tr>
            <th>Цена (USDT)</th>
            <th>Количество (BTC)</th>
            <th>Всего</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bid in bids" :key="bid.price">
            <td :class="{ highlighted: isOurOrder(bid), 'buy-cell': true }">
              {{ formatPrice(bid.price) }}
            </td>
            <td>{{ formatQuantity(bid.quantity) }}</td>
            <td>{{ formatTotal(bid.price, bid.quantity) }}</td>
          </tr>
        </tbody>
      </table>
      <div class="spread">Spread: {{ formatSpread() }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    components: {},
    data() {
      return {
        isLoading: true,
        asks: [],
        bids: [],
        ourOrders: []
      };
    },
    methods: {
      isOurOrder(order) {
        return this.ourOrders.some(
          (ourOrder) => ourOrder.price === order.price
        );
      },
      formatPrice(price) {
        return parseFloat(price).toFixed(2);
      },
      formatQuantity(quantity) {
        return parseFloat(quantity).toFixed(8);
      },
      formatTotal(price, quantity) {
        const total = price * quantity;
        return parseFloat(total).toFixed(2);
      },
      formatSpread() {
        const spread = this.calculateSpread();
        return parseFloat(spread).toFixed(2);
      },
      calculateSpread() {
        if (this.bids.length === 0 || this.asks.length === 0) {
          return 0;
        }

        const bestBid = parseFloat(this.bids[0].price);
        const bestAsk = parseFloat(this.asks[0].price);
        return bestAsk - bestBid;
      },
      async subscribeToOrderBookStream() {
        const baseUrl = "wss://stream.binance.com:9443";
        const requestUrl = `${baseUrl}/ws/btcusdt@depth@1000ms`;

        const eventSource = new WebSocket(requestUrl);

        eventSource.onopen = () => {
          this.isLoading = false; // Connection established, no longer loading
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
            price: data.price,
            quantity: 0
          };

          this.ourOrders = [order];
        } catch (error) {
          console.error("Failed to fetch our orders:", error);
          this.ourOrders = []; // Set an empty array in case of error
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

  .order-table {
    width: 100%;
    border-collapse: collapse;
  }

  .order-table th,
  .order-table td {
    padding: 8px;
    text-align: left;
  }

  .order-table th {
    font-weight: bold;
    border-bottom: 1px solid #ddd;
  }

  .order-row td {
    border-bottom: 1px solid #ddd;
  }

  .highlighted {
    font-weight: bold;
  }

  .sell-cell {
    color: red;
  }

  .buy-cell {
    color: green;
  }

  .spread {
    margin-top: 20px;
    font-weight: bold;
    font-size: 16px;
  }

  /* Dark theme styles */
  .order-book.dark {
    background-color: #333;
    color: #fff;
  }

  .header-row.dark {
    color: #ddd;
  }

  .header.dark {
    color: #aaa;
  }

  .order-row.dark {
    color: #ddd;
  }

  .sell-cell.dark {
    color: #ff4d4f;
  }

  .buy-cell.dark {
    color: #52c41a;
  }

  .spread.dark {
    color: #ddd;
  }

  /* Additional styles for displaying in a single line */
  .order-table {
    table-layout: fixed;
  }

  .order-row td {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
