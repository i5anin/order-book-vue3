<template>
  <el-table class="order-table" :data="visibleOrders" border>
    <el-table-column>
      <template v-slot="{ row }">
        <div
          :class="{
            highlighted: isOurOrder(row),
            'sell-cell': type === 'sell',
            'buy-cell': type === 'buy'
          }"
        >
          <span v-if="type === 'buy' && row === visibleOrders[centerIndex]">
          </span>
          <span v-if="currency === 'btc'">
            <b>{{ formatPrice(row.price) }}</b>
          </span>
        </div>
      </template>
      <template v-slot:header>
        <span
          ><b> {{ headerText }}</b></span
        >
      </template>
    </el-table-column>
    <el-table-column prop="quantity">
      <template v-slot="{ row }">
        <span v-if="row.quantity !== 0">{{
          formatQuantity(row.quantity)
        }}</span>
      </template>
      <template v-slot:header>
        <span v-if="currency === 'btc'">Количество (BTC)</span>
      </template>
    </el-table-column>
    <el-table-column>
      <template v-slot="{ row }">
        <span v-if="row.price !== 0 && row.quantity !== 0">{{
          formatTotal(row.price, row.quantity)
        }}</span>
      </template>
      <template v-slot:header>Всего</template>
    </el-table-column>
  </el-table>
</template>

<script>
  import { mapState } from "vuex";

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
      },
      headerText: {
        type: [String, Number],
        required: true
      }
    },
    data() {
      return {
        centerIndex: null
      };
    },
    computed: {
      ...mapState(["currentBitcoinPrice"]),
      visibleOrders() {
        return this.calculateVisibleOrders();
      }
    },
    methods: {
      calculateVisibleOrders() {
        const filteredOrders = this.orders.filter(
          (order) => order.quantity !== 0 && order.total !== 0
        );
        const centerIndex = Math.floor(filteredOrders.length / 2);
        const start = centerIndex - 10;
        const end = centerIndex + 11; // Включите центральный ряд + 10 рядов с каждой стороны

        let visibleOrders;
        if (this.type === "sell") {
          visibleOrders = filteredOrders.slice().reverse().slice(start, end);
        } else {
          visibleOrders = filteredOrders.slice(start, end);
        }

        this.centerIndex = centerIndex;

        return visibleOrders;
      },
      getCurrentBitcoinPrice() {
        const centerRow = this.visibleOrders[this.centerIndex];
        return centerRow ? centerRow.price : "";
      },
      isOurOrder(order) {
        return this.ourOrders.some(
          (ourOrder) => ourOrder.price === order.price
        );
      },
      formatPrice(price) {
        return parseFloat(price).toFixed(2);
      },
      formatQuantity(quantity) {
        return parseFloat(quantity).toFixed(6);
      },
      formatTotal(price, quantity) {
        const total = price * quantity;
        return parseFloat(total).toFixed(6);
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
    color: yellow;
  }
</style>
