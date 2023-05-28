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
          <b v-if="rowIndex === 1 && type === 'buy'">
            {{ getCurrentBitcoinPrice }}
          </b>
          <b v-else>
            {{ formatPrice(row.price) }}
          </b>
        </div>
      </template>
      <template v-slot:header>
        <span v-if="currency === 'btc'">Цена (BTC)</span>
        <span v-else-if="rowIndex === 1 && type === 'buy'">
          <b>{{ getCurrentBitcoinPrice }} (актуальная цена биткойна)</b>
        </span>
        <span v-else>Цена (DENT)</span>
      </template>
    </el-table-column>
    <el-table-column prop="quantity">
      <template v-slot="{ row }">
        {{ formatQuantity(row.quantity) }}
      </template>
      <template v-slot:header>
        <span v-if="currency === 'btc'">Количество (BTC)</span>
        <span v-else>Количество (DENT)</span>
      </template>
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
      },
      currency: {
        type: String,
        required: true
      }
    },
    computed: {
      filteredOrders() {
        return this.orders.filter((order) => order.quantity !== 0);
      },
      getCurrentBitcoinPrice() {
        // Get the current Bitcoin price from the Vuex store or any other data source
        return this.$store.state.currentBitcoinPrice;
      }
    },
    methods: {
      isOurOrder(order) {
        return this.ourOrders.some(
          (ourOrder) => ourOrder.price === order.price
        );
      },
      formatPrice(price) {
        return parseFloat(price).toFixed(8);
      },
      formatQuantity(quantity) {
        return parseFloat(quantity).toFixed(8);
      },
      formatTotal(price, quantity) {
        const total = price * quantity;
        return parseFloat(total).toFixed(8);
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
  .highlighted {
    background-color: yellow;
  }
</style>
