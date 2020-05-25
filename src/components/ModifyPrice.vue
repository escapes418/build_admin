<template>
  <div class="modify-price-component">
    <!-- 商品单价 -->
    <div class="item-header mt-15">商品单价</div>
    <el-table
      :data="priceSource.tradePriceList"
      border
      @cell-click="(row, column, cell, event) => handleCellClick(1, row, column, cell, event)"
    >
      <el-table-column label="商砼强度" prop="goodsName" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="不含税单价(元)" prop="goodsPrice" min-width="110" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="!scope.row.priceEdit">{{ scope.row.goodsPrice | thousands }}</span>
          <span v-else>
            <el-input
              :ref="`table1-price${scope.$index}`"
              v-model="scope.row.goodsPrice"
              class="cell-mini-input"
              type="text"
              size="mini"
              placeholder="不含税单价"
              v-allow.number
              @blur="onEditBlur(scope.row, 1, 'goodsPrice')"
            ></el-input>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="税率(%)" prop="goodsTax" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="!scope.row.taxEdit">{{ scope.row.goodsTax }}</span>
          <span v-else>
            <el-input
              :ref="`table1-tax${scope.$index}`"
              v-model="scope.row.goodsTax"
              class="cell-mini-input"
              type="text"
              size="mini"
              placeholder="税率"
              v-allow.number.float
              @blur="onEditBlur(scope.row, 1, 'goodsTax')"
            ></el-input>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="含税单价(元)" prop="goodsTaxPrice" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.goodsTaxPrice | thousands }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 特殊属性单价 -->
    <div class="item-header mt-15">特殊属性单价</div>
    <el-table
      :data="priceSource.attributeList"
      border
      @cell-click="(row, column, cell, event) => handleCellClick(2, row, column, cell, event)"
    >
      <el-table-column label="特殊属性" prop="attrValueName" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="不含税单价(元)" prop="attrPrice" min-width="110" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="!scope.row.priceEdit">{{ scope.row.attrPrice | thousands }}</span>
          <span v-else>
            <el-input
              :ref="`table2-price${scope.$index}`"
              v-model="scope.row.attrPrice"
              class="cell-mini-input"
              type="text"
              size="mini"
              placeholder="不含税单价"
              v-allow.number
              @blur="onEditBlur(scope.row, 2, 'attrPrice')"
            ></el-input>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="税率(%)" prop="attrTax" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="!scope.row.taxEdit">{{ scope.row.attrTax }}</span>
          <span v-else>
            <el-input
              :ref="`table2-tax${scope.$index}`"
              v-model="scope.row.attrTax"
              class="cell-mini-input"
              type="text"
              size="mini"
              placeholder="税率"
              v-allow.number.float
              @blur="onEditBlur(scope.row, 2, 'attrTax')"
            ></el-input>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="含税单价(元)" prop="attrTaxPrice" min-width="200" show-overflow-tooltip></el-table-column>
    </el-table>

    <!-- 泵车单价 -->
    <div class="item-header mt-15">泵车单价</div>
    <el-table
      :data="priceSource.pumpsList"
      border
      @cell-click="(row, column, cell, event) => handleCellClick(3, row, column, cell, event)"
    >
      <el-table-column label="特殊属性" prop="attrValueName" min-width="160" show-overflow-tooltip></el-table-column>
      <el-table-column label="不含税单价(元)" prop="attrPrice" min-width="110" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="!scope.row.priceEdit">{{ scope.row.attrPrice | thousands }}</span>
          <span v-else>
            <el-input
              :ref="`table3-price${scope.$index}`"
              v-model="scope.row.attrPrice"
              class="cell-mini-input"
              type="text"
              size="mini"
              placeholder="不含税单价"
              v-allow.number
              @blur="onEditBlur(scope.row, 3, 'attrPrice')"
            ></el-input>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="税率(%)" prop="attrTax" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="!scope.row.taxEdit">{{ scope.row.attrTax }}</span>
          <span v-else>
            <el-input
              :ref="`table3-tax${scope.$index}`"
              v-model="scope.row.attrTax"
              class="cell-mini-input"
              type="text"
              size="mini"
              placeholder="税率"
              v-allow.number.float
              @blur="onEditBlur(scope.row, 3, 'attrTax')"
            ></el-input>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="含税单价(元)" prop="attrTaxPrice" min-width="200" show-overflow-tooltip></el-table-column>
    </el-table>
  </div>
</template>
<script>
import utils from '@/utils/utils';
import calc from '@/utils/calc';

export default {
  props: {
    priceData: {
      type: Object,
      required: true,
      default: function() {
        return {
          tradePriceList: [],
          attributeList: [],
          pumpsList: []
        };
      }
    },
    edit: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {};
  },
  computed: {
    priceSource() {
      return {
        tradePriceList: this.priceData.tradePriceList.map(el => {
          return { ...el, priceEdit: false, taxEdit: false };
        }),
        attributeList: this.priceData.attributeList.map(el => {
          return { ...el, priceEdit: false, taxEdit: false };
        }),
        pumpsList: this.priceData.pumpsList.map(el => {
          return { ...el, priceEdit: false, taxEdit: false };
        })
      };
    }
  },
  // watch: {
  //   priceData: function(newValue, oldValue) {
  //     console.log(newValue);
  //   }
  // },
  created() {},
  methods: {
    // 单元格点击 启用编辑
    handleCellClick(type, row, column, cell, event) {
      // 商砼价格
      if (type === 1) {
        const idx = this.priceSource.tradePriceList.indexOf(row);
        if (column.property === 'goodsPrice') {
          row.priceEdit = true;
          this.$nextTick(() => {
            const ref = `table${type}-price${idx}`;
            this.$refs[ref].focus();
          });
        }
        if (column.property === 'goodsTax') {
          row.taxEdit = true;
          this.$nextTick(() => {
            const ref = `table${type}-tax${idx}`;
            this.$refs[ref].focus();
          });
        }
      }
      // 特殊属性价格
      if (type === 2) {
        const idx = this.priceSource.attributeList.indexOf(row);
        if (column.property === 'attrPrice') {
          row.priceEdit = true;
          this.$nextTick(() => {
            const ref = `table${type}-price${idx}`;
            this.$refs[ref].focus();
          });
        }
        if (column.property === 'attrTax') {
          row.taxEdit = true;
          this.$nextTick(() => {
            const ref = `table${type}-tax${idx}`;
            this.$refs[ref].focus();
          });
        }
      }
      // 泵车价格
      if (type === 3) {
        const idx = this.priceSource.pumpsList.indexOf(row);
        if (column.property === 'attrPrice') {
          row.priceEdit = true;
          this.$nextTick(() => {
            const ref = `table${type}-price${idx}`;
            this.$refs[ref].focus();
          });
        }
        if (column.property === 'attrTax') {
          row.taxEdit = true;
          this.$nextTick(() => {
            const ref = `table${type}-tax${idx}`;
            this.$refs[ref].focus();
          });
        }
      }
    },
    // 文本框失去焦点 计算含税价
    async onEditBlur(row, table, col) {
      // 商砼价格
      if (table === 1) {
        if (col === 'goodsPrice') {
          row.priceEdit = false;
          row.goodsPrice = Number(row.goodsPrice) || 0;
        }
        if (col === 'goodsTax') {
          row.taxEdit = false;
          row.goodsTax = Number(row.goodsTax).toFixedNew(2) || 0;
        }
        this.onCalcPrice(row.goodsTax);
      }
      // 特殊属性价格
      if (table === 2) {
        if (col === 'attrPrice') {
          row.priceEdit = false;
          row.attrPrice = Number(row.attrPrice) || 0;
        }
        if (col === 'attrTax') {
          row.taxEdit = false;
          row.attrTax = Number(row.attrTax).toFixedNew(2) || 0;
        }
        this.onCalcPrice(row.attrTax);
      }
      // 泵车价格
      if (table === 3) {
        if (col === 'attrPrice') {
          row.priceEdit = false;
          row.attrPrice = Number(row.attrPrice) || 0;
        }
        if (col === 'attrTax') {
          row.taxEdit = false;
          row.attrTax = Number(row.attrTax).toFixedNew(2) || 0;
        }
        this.onCalcPrice(row.attrTax);
      }
    },
    onCalcPrice(tax) {
      this.priceSource.tradePriceList.forEach(row => {
        row.goodsTax = tax;
        let _price = calc.divide(row.goodsTax || 13, 100);
        _price = calc.add(1, _price);
        _price = calc.multiply(row.goodsPrice || 0, _price).toFixedNew(2);
        row.goodsTaxPrice = _price;
      });
      this.priceSource.attributeList.forEach(row => {
        row.attrTax = tax;
        let _price = calc.divide(row.attrTax || 13, 100);
        _price = calc.add(1, _price);
        _price = calc.multiply(row.attrPrice || 0, _price).toFixedNew(2);
        row.attrTaxPrice = _price;
      });
      this.priceSource.pumpsList.forEach(row => {
        row.attrTax = tax;
        let _price = calc.divide(row.attrTax || 13, 100);
        _price = calc.add(1, _price);
        _price = calc.multiply(row.attrPrice || 0, _price).toFixedNew(2);
        row.attrTaxPrice = _price;
      });
    },

    getPriceData() {
      return {
        tradePriceList: this.priceSource.tradePriceList.map(el => {
          let element = { ...el };
          delete element.priceEdit;
          delete element.taxEdit;
          return element;
        }),
        attributeList: this.priceSource.attributeList.map(el => {
          let element = { ...el };
          delete element.priceEdit;
          delete element.taxEdit;
          return element;
        }),
        pumpsList: this.priceSource.pumpsList.map(el => {
          let element = { ...el };
          delete element.priceEdit;
          delete element.taxEdit;
          return element;
        })
      };
    }
  }
};
</script>
<style lang="postcss">
.modify-price-component {
  .cell-mini-input .el-input__inner {
    height: 21px;
    line-height: 21px;
    border-radius: 2px;
    padding: 0 5px;
  }
}
</style>

