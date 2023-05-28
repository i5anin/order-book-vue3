<template>
  <div class="order-book dark">
    <!-- Показываем индикатор загрузки, если данные загружаются -->
    <LoadingIndicator v-if="isLoading" />

    <div v-else>
      <!-- Заголовок для списка продаж -->
      <div class="header-row">
        <div class="header">Asks (Продажа)</div>
      </div>

      <!-- Компонент таблицы для списка продаж -->
      <OrderTable :orders="asks" type="sell" :ourOrders="ourOrders" />

      <!-- Заголовок для списка покупок -->
      <div class="header-row pt25">
        <div class="header">Bids (Покупка)</div>
      </div>

      <!-- Компонент таблицы для списка покупок -->
      <OrderTable :orders="bids" type="buy" :ourOrders="ourOrders" />

      <!-- Компонент для отображения информации о спреде -->
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
      // Проверка наличия спреда
      hasSpread() {
        return this.bids.length > 0 && this.asks.length > 0;
      },
      // Расчет спреда
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
      // Подписка на поток данных о книге ордеров
      async subscribeToOrderBookStream() {
        const baseUrl = "wss://stream.binance.com:9443";
        const requestUrl = `${baseUrl}/ws/btcusdt@depth@1000ms`;

        const eventSource = new WebSocket(requestUrl);

        // Установка флага загрузки в false при успешном подключении
        eventSource.onopen = () => {
          this.isLoading = false;
        };

        // Обработка полученных данных из потока
        eventSource.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.handleOrderBookStreamData(data);
        };

        // Обработка ошибок подписки на поток
        eventSource.onerror = (error) => {
          console.error("Failed to subscribe to order book stream:", error);
        };
      },

      // Получение данных о наших ордерах
      async fetchOurOrders() {
        try {
          const requestUrl =
            "https://api.binance.com/api/v3/avgPrice?symbol=BTCUSDT";
          const response = await fetch(requestUrl);
          const data = await response.json();

          // Создание объекта ордера на основе полученных данных
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

      // Обработка полученных данных из потока книги ордеров
      handleOrderBookStreamData(data) {
        if (!data || !data.b || !data.a) {
          console.error("Invalid order book stream data:", data);
          return;
        }

        // Преобразование данных о продажах (asks) в нужный формат
        this.asks = data.a.map((ask) => ({
          price: parseFloat(ask[0]),
          quantity: parseFloat(ask[1])
        }));

        // Преобразование данных о покупках (bids) в нужный формат
        this.bids = data.b.map((bid) => ({
          price: parseFloat(bid[0]),
          quantity: parseFloat(bid[1])
        }));
      }
    },
    created() {
      // При создании компонента подписываемся на поток данных и получаем информацию о наших ордерах
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
