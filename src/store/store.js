import { createStore } from "vuex";

export default createStore({
  state() {
    return {
      isLoading: true,
      asks: [],
      bids: [],
      ourOrders: [],
      currentBitcoinPrice: 0 // Добавляем новое поле для текущей стоимости BTC
    };
  },
  getters: {
    hasSpread: (state) => {
      return state.bids.length > 0 && state.asks.length > 0;
    },
    spread: (state, getters) => {
      if (!getters.hasSpread) {
        return 0;
      }
      const bestBid = parseFloat(state.bids[0].price);
      const bestAsk = parseFloat(state.asks[0].price);
      return bestAsk - bestBid;
    }
  },
  mutations: {
    setLoading(state, isLoading) {
      state.isLoading = isLoading;
    },
    setAsks(state, asks) {
      state.asks = asks;
    },
    setBids(state, bids) {
      state.bids = bids;
    },
    setOurOrders(state, ourOrders) {
      state.ourOrders = ourOrders;
    },
    setCurrentBitcoinPrice(state, currentPrice) {
      state.currentBitcoinPrice = currentPrice;
    } // Добавляем мутацию для обновления текущей стоимости BTC
  },
  actions: {
    async subscribeToOrderBookStream({ commit }) {
      const baseUrl = "wss://stream.binance.com:9443";
      const requestUrl = `${baseUrl}/ws/btcusdt@depth@1000ms`;
      //   const requestUrl = `${baseUrl}/ws/dentusdt@depth@1000ms`;

      const eventSource = new WebSocket(requestUrl);

      eventSource.onopen = () => {
        commit("setLoading", false);
      };

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        commit(
          "setAsks",
          data.a.map((ask) => ({
            price: parseFloat(ask[0]),
            quantity: parseFloat(ask[1])
          }))
        );
        commit(
          "setBids",
          data.b.map((bid) => ({
            price: parseFloat(bid[0]),
            quantity: parseFloat(bid[1])
          }))
        );

        // Извлекаем текущую стоимость BTC из предложений покупки (bids)
        if (data.b && data.b.length > 0) {
          const currentPrice = parseFloat(data.b[0][0]);
          commit("setCurrentBitcoinPrice", currentPrice);
          // console.log("Текущая стоимость BTC:", currentPrice);
        }
      };

      eventSource.onerror = (error) => {
        console.error("Failed to subscribe to order book stream:", error);
      };
    }
  }
});
