<template>
  <el-table class="order-table" :data="filteredOrders" border>
    <el-table-column>
      <template v-slot="{ row }">
        <div
          :class="{
            highlighted: isOurOrder(row),
            'sell-cell': type === 'sell',
            'buy-cell': type === 'buy'
          }"
        >
          <strong>{{ formatPrice(row.price) }}</strong>
        </div>
      </template>
      <template v-slot:header>Цена (USDT)</template>
    </el-table-column>
    <el-table-column prop="quantity">
      <template v-slot="{ row }">
        {{ formatQuantity(row.quantity) }}
      </template>
      <template v-slot:header>Количество (BTC)</template>
    </el-table-column>
    <el-table-column>
      <template v-slot="{ row }">
        {{ formatTotal(row.price, row.quantity) }}
      </template>
      <template v-slot:header>Всего</template>
    </el-table-column>
  </el-table>
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
    computed: {
      filteredOrders() {
        return this.orders.filter((order) => order.quantity !== 0);
      }
    },
    methods: {
      isOurOrder(order) {
        return this.ourOrders.some(
          (ourOrder) => ourOrder.price === order.price
        );
      },
      formatPrice(price) {
        return parseFloat(price).toFixed(10);
      },
      formatQuantity(quantity) {
        return parseFloat(quantity).toFixed(10);
      },
      formatTotal(price, quantity) {
        const total = price * quantity;
        return parseFloat(total).toFixed(10);
      }
    }
  };
</script>

<style scoped>
  .sell-cell {
    color: red;
  }
  .buy-cell {
    color: green;
  }
</style>
