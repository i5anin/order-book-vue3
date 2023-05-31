import { createStore } from "vuex";
import { subscribeToOrderBookStream } from "./api";

export default createStore({
  state() {
    return {
      isLoading: true,
      asks: [],
      bids: [],
      ourOrders: [],
      currentBitcoinPrice: 0
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
    setLoading: (state, isLoading) => (state.isLoading = isLoading),
    setAsks: (state, asks) => (state.asks = asks),
    setBids: (state, bids) => (state.bids = bids),
    setOurOrders: (state, ourOrders) => (state.ourOrders = ourOrders),
    setCurrentCoinPrice: (state, currentPrice) =>
      (state.currentCoinPrice = currentPrice)
  },

  actions: {
    async subscribeToOrderBookStream({ commit }) {
      try {
        const eventSource = await subscribeToOrderBookStream();
        commit("setLoading", false); // Set loading to false when the connection is established

        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          const asks = data.a.map((ask) => ({
            price: parseFloat(ask[0]),
            quantity: parseFloat(ask[1])
          }));
          const bids = data.b.map((bid) => ({
            price: parseFloat(bid[0]),
            quantity: parseFloat(bid[1])
          }));

          commit("setAsks", asks);
          commit("setBids", bids);

          if (bids && bids.length > 0) {
            const currentPrice = parseFloat(bids[0].price);
            commit("setCurrentBitcoinPrice", currentPrice);
          }
        };
      } catch (error) {
        console.error("Failed to subscribe to order book stream:", error);
        commit("setLoading", false); // Set loading to false in case of an error
      }
    }
  }
});
