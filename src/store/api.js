export function subscribeToOrderBookStream() {
  const baseUrl = "wss://stream.binance.com:9443";
  const requestUrl = `${baseUrl}/ws/btcusdt@depth@1000ms`;

  const eventSource = new WebSocket(requestUrl);
  return new Promise((resolve, reject) => {
    eventSource.onopen = () => {
      resolve(eventSource);
    };

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

      // Пользовательское событие для уведомления хранилища о данных
      const customEvent = new CustomEvent("orderBookUpdate", {
        detail: {
          asks,
          bids
        }
      });
      document.dispatchEvent(customEvent);
    };

    eventSource.onerror = (error) => {
      reject(error);
    };
  });
}
