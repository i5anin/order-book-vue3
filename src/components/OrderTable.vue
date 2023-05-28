<template>
  <table class="order-table">
    <thead>
      <tr>
        <th>Цена (USDT)</th>
        <th>Количество (BTC)</th>
        <th>Всего</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="order in orders" :key="order.price">
        <td
          :class="{
            highlighted: isOurOrder(order),
            'sell-cell': type === 'sell',
            'buy-cell': type === 'buy'
          }"
        >
          {{ formatPrice(order.price) }}
        </td>
        <td>{{ formatQuantity(order.quantity) }}</td>
        <td>{{ formatTotal(order.price, order.quantity) }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
  export default {
    props: {
      orders: {
        type: Array,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      ourOrders: {
        type: Array,
        default: () => []
      }
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
      }
    }
  };
</script>

<style scoped>
  /* Стили для компонента OrderTable */
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

  /* Темные стили */
  .dark .order-table {
    color: #ddd;
  }

  .dark .order-table th {
    border-bottom: 1px solid #aaa;
  }

  .dark .order-row td {
    border-bottom: 1px solid #aaa;
  }

  .dark .highlighted {
    font-weight: bold;
  }

  .dark .sell-cell {
    color: #ff4d4f;
  }

  .dark .buy-cell {
    color: #52c41a;
  }
</style>
