import { createStore } from "vuex";

export default createStore({
  state() {
    return {
      isLoading: true,
      asks: [],
      bids: [],
      ourOrders: []
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
    }
  },
  actions: {
    async subscribeToOrderBookStream({ commit }) {
      const baseUrl = "wss://stream.binance.com:9443";
      const requestUrl = `${baseUrl}/ws/btcusdt@depth@1000ms`;

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
      };

      eventSource.onerror = (error) => {
        console.error("Failed to subscribe to order book stream:", error);
      };
    },
    async fetchOurOrders({ commit }) {
      try {
        const requestUrl =
          "https://api.binance.com/api/v3/avgPrice?symbol=BTCUSDT";
        const response = await fetch(requestUrl);
        const data = await response.json();

        const order = {
          price: parseFloat(data.price),
          quantity: 0
        };

        commit("setOurOrders", [order]);
      } catch (error) {
        console.error("Failed to fetch our orders:", error);
        commit("setOurOrders", []);
      }
    }
  }
});
