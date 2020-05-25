<template>
  <layout navActive="mall">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item>交易管理</el-breadcrumb-item>
      <el-breadcrumb-item to="/settlement/list">结算单管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="`/settlement/detail/${settlementId}`">结算单详情</el-breadcrumb-item>
      <el-breadcrumb-item>{{ edit ? '调整结算价格' : '结算单价对照表' }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="detail-hander-panel">
      <div class="detail-hander-content">
        <span class="font-label">结算单编号：</span>
        <span class="font-default">{{ settlementSn }}</span>
      </div>
      <div class="detail-hander-toolbtn">
        <router-link v-if="!edit" :to="`/settlement/detail/${settlementId}`">
          <el-button type="primary">返回</el-button>
        </router-link>
      </div>
    </div>

    <div class="modify-price-component">
      <!-- 商品单价 -->
      <div class="item-header mt-15">商品单价</div>
      <el-table
        :data="priceData.goods"
        border
        @cell-click="(row, column, cell, event) => handleCellClick('goods', row, column, cell, event)"
      >
        <el-table-column label="商砼强度" prop="label" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="不含税采购单价(元/m³)"
          prop="exclusiveTaxPurchasePrice"
          min-width="150"
          show-overflow-tooltip
        >
          <template v-if="edit" slot="header">
            <span class="font-default">不含税采购单价(元/m³)</span><i class="el-icon-edit font-default ml-5"></i>
          </template>
          <template slot-scope="scope">
            <span v-if="!scope.row.exclusiveTaxPurchasePriceEdit">{{
              scope.row.exclusiveTaxPurchasePrice | thousands
            }}</span>
            <span v-else>
              <el-input
                :ref="`goods-exclusiveTaxPurchasePrice-${scope.$index}`"
                v-model="scope.row.exclusiveTaxPurchasePrice"
                class="cell-mini-input"
                type="text"
                size="mini"
                placeholder="不含税采购单价"
                v-allow.number.float
                @blur="onEditBlur(scope, 'goods')"
              ></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="采购税率(%)" prop="purchaseTaxPercent" min-width="100" show-overflow-tooltip>
          <template v-if="edit" slot="header">
            <span class="font-default">采购税率(%)</span><i class="el-icon-edit font-default ml-5"></i>
          </template>
          <template slot-scope="scope">
            <span v-if="!scope.row.purchaseTaxPercentEdit">{{ scope.row.purchaseTaxPercent }}</span>
            <span v-else>
              <el-input
                :ref="`goods-purchaseTaxPercent-${scope.$index}`"
                v-model="scope.row.purchaseTaxPercent"
                class="cell-mini-input"
                type="text"
                size="mini"
                placeholder="采购税率"
                v-allow.number.float
                @blur="onEditBlur(scope, 'goods')"
              ></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="含税采购单价(元/m³)"
          prop="inclusiveTaxPurchasePrice"
          min-width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="不含税销售单价(元/m³)"
          prop="exclusiveTaxSalePrice"
          min-width="150"
          show-overflow-tooltip
        >
          <template v-if="edit" slot="header">
            <span class="font-default">不含税销售单价(元/m³)</span><i class="el-icon-edit font-default ml-5"></i>
          </template>
          <template slot-scope="scope">
            <span v-if="!scope.row.exclusiveTaxSalePriceEdit">{{ scope.row.exclusiveTaxSalePrice | thousands }}</span>
            <span v-else>
              <el-input
                :ref="`goods-exclusiveTaxSalePrice-${scope.$index}`"
                v-model="scope.row.exclusiveTaxSalePrice"
                class="cell-mini-input"
                type="text"
                size="mini"
                placeholder="不含税销售单价"
                v-allow.number.float
                @blur="onEditBlur(scope, 'goods')"
              ></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="销售税率(%)" prop="saleTaxPercent" min-width="100" show-overflow-tooltip>
          <template v-if="edit" slot="header">
            <span class="font-default">销售税率(%)</span><i class="el-icon-edit font-default ml-5"></i>
          </template>
          <template slot-scope="scope">
            <span v-if="!scope.row.saleTaxPercentEdit">{{ scope.row.saleTaxPercent }}</span>
            <span v-else>
              <el-input
                :ref="`goods-saleTaxPercent-${scope.$index}`"
                v-model="scope.row.saleTaxPercent"
                class="cell-mini-input"
                type="text"
                size="mini"
                placeholder="销售税率"
                v-allow.number.float
                @blur="onEditBlur(scope, 'goods')"
              ></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="含税销售单价(元/m³)"
          prop="inclusiveTaxSalePrice"
          min-width="200"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>

      <!-- 特殊属性单价 -->
      <div class="item-header mt-15">特殊属性单价</div>
      <el-table
        :data="priceData.attributes"
        border
        @cell-click="(row, column, cell, event) => handleCellClick('attributes', row, column, cell, event)"
      >
        <el-table-column label="特殊属性" prop="label" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="不含税采购单价(元/m³)"
          prop="exclusiveTaxPurchasePrice"
          min-width="150"
          show-overflow-tooltip
        >
          <template v-if="edit" slot="header">
            <span class="font-default">不含税采购单价(元/m³)</span><i class="el-icon-edit font-default ml-5"></i>
          </template>
          <template slot-scope="scope">
            <span v-if="!scope.row.exclusiveTaxPurchasePriceEdit">{{
              scope.row.exclusiveTaxPurchasePrice | thousands
            }}</span>
            <span v-else>
              <el-input
                :ref="`attributes-exclusiveTaxPurchasePrice-${scope.$index}`"
                v-model="scope.row.exclusiveTaxPurchasePrice"
                class="cell-mini-input"
                type="text"
                size="mini"
                placeholder="不含税采购单价"
                v-allow.number.float
                @blur="onEditBlur(scope, 'attributes')"
              ></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="采购税率(%)" prop="purchaseTaxPercent" min-width="100" show-overflow-tooltip>
          <template v-if="edit" slot="header">
            <span class="font-default">采购税率(%)</span><i class="el-icon-edit font-default ml-5"></i>
          </template>
          <template slot-scope="scope">
            <span v-if="!scope.row.purchaseTaxPercentEdit">{{ scope.row.purchaseTaxPercent }}</span>
            <span v-else>
              <el-input
                :ref="`attributes-purchaseTaxPercent-${scope.$index}`"
                v-model="scope.row.purchaseTaxPercent"
                class="cell-mini-input"
                type="text"
                size="mini"
                placeholder="采购税率"
                v-allow.number.float
                @blur="onEditBlur(scope, 'attributes')"
              ></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="含税采购单价(元/m³)"
          prop="inclusiveTaxPurchasePrice"
          min-width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="不含税销售单价(元/m³)"
          prop="exclusiveTaxSalePrice"
          min-width="150"
          show-overflow-tooltip
        >
          <template v-if="edit" slot="header">
            <span class="font-default">不含税销售单价(元/m³)</span><i class="el-icon-edit font-default ml-5"></i>
          </template>
          <template slot-scope="scope">
            <span v-if="!scope.row.exclusiveTaxSalePriceEdit">{{ scope.row.exclusiveTaxSalePrice | thousands }}</span>
            <span v-else>
              <el-input
                :ref="`attributes-exclusiveTaxSalePrice-${scope.$index}`"
                v-model="scope.row.exclusiveTaxSalePrice"
                class="cell-mini-input"
                type="text"
                size="mini"
                placeholder="不含税销售单价"
                v-allow.number.float
                @blur="onEditBlur(scope, 'attributes')"
              ></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="销售税率(%)" prop="saleTaxPercent" min-width="100" show-overflow-tooltip>
          <template v-if="edit" slot="header">
            <span class="font-default">销售税率(%)</span><i class="el-icon-edit font-default ml-5"></i>
          </template>
          <template slot-scope="scope">
            <span v-if="!scope.row.saleTaxPercentEdit">{{ scope.row.saleTaxPercent }}</span>
            <span v-else>
              <el-input
                :ref="`attributes-saleTaxPercent-${scope.$index}`"
                v-model="scope.row.saleTaxPercent"
                class="cell-mini-input"
                type="text"
                size="mini"
                placeholder="销售税率"
                v-allow.number.float
                @blur="onEditBlur(scope, 'attributes')"
              ></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="含税销售单价(元/m³)"
          prop="inclusiveTaxSalePrice"
          min-width="200"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>

      <!-- 泵车单价 -->
      <div class="item-header mt-15">泵车单价</div>
      <el-table
        :data="priceData.pumpAttributes"
        border
        @cell-click="(row, column, cell, event) => handleCellClick('pumpAttributes', row, column, cell, event)"
      >
        <el-table-column label="泵车类型" prop="label" min-width="160" show-overflow-tooltip></el-table-column>
        <el-table-column
          label="不含税采购单价(元/m³)"
          prop="exclusiveTaxPurchasePrice"
          min-width="150"
          show-overflow-tooltip
        >
          <template v-if="edit" slot="header">
            <span class="font-default">不含税采购单价(元/m³)</span><i class="el-icon-edit font-default ml-5"></i>
          </template>
          <template slot-scope="scope">
            <span v-if="!scope.row.exclusiveTaxPurchasePriceEdit">{{
              scope.row.exclusiveTaxPurchasePrice | thousands
            }}</span>
            <span v-else>
              <el-input
                :ref="`pumpAttributes-exclusiveTaxPurchasePrice-${scope.$index}`"
                v-model="scope.row.exclusiveTaxPurchasePrice"
                class="cell-mini-input"
                type="text"
                size="mini"
                placeholder="不含税采购单价"
                v-allow.number.float
                @blur="onEditBlur(scope, 'pumpAttributes')"
              ></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="采购税率(%)" prop="purchaseTaxPercent" min-width="100" show-overflow-tooltip>
          <template v-if="edit" slot="header">
            <span class="font-default">采购税率(%)</span><i class="el-icon-edit font-default ml-5"></i>
          </template>
          <template slot-scope="scope">
            <span v-if="!scope.row.purchaseTaxPercentEdit">{{ scope.row.purchaseTaxPercent | thousands }}</span>
            <span v-else>
              <el-input
                :ref="`pumpAttributes-purchaseTaxPercent-${scope.$index}`"
                v-model="scope.row.purchaseTaxPercent"
                class="cell-mini-input"
                type="text"
                size="mini"
                placeholder="采购税率"
                v-allow.number.float
                @blur="onEditBlur(scope, 'pumpAttributes')"
              ></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="含税采购单价(元/m³)"
          prop="inclusiveTaxPurchasePrice"
          min-width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="不含税销售单价(元/m³)"
          prop="exclusiveTaxSalePrice"
          min-width="150"
          show-overflow-tooltip
        >
          <template v-if="edit" slot="header">
            <span class="font-default">不含税销售单价(元/m³)</span><i class="el-icon-edit font-default ml-5"></i>
          </template>
          <template slot-scope="scope">
            <span v-if="!scope.row.exclusiveTaxSalePriceEdit">{{ scope.row.exclusiveTaxSalePrice | thousands }}</span>
            <span v-else>
              <el-input
                :ref="`pumpAttributes-exclusiveTaxSalePrice-${scope.$index}`"
                v-model="scope.row.exclusiveTaxSalePrice"
                class="cell-mini-input"
                type="text"
                size="mini"
                placeholder="不含税销售单价"
                v-allow.number.float
                @blur="onEditBlur(scope, 'pumpAttributes')"
              ></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="销售税率(%)" prop="saleTaxPercent" min-width="100" show-overflow-tooltip>
          <template v-if="edit" slot="header">
            <span class="font-default">销售税率(%)</span><i class="el-icon-edit font-default ml-5"></i>
          </template>
          <template slot-scope="scope">
            <span v-if="!scope.row.saleTaxPercentEdit">{{ scope.row.saleTaxPercent }}</span>
            <span v-else>
              <el-input
                :ref="`pumpAttributes-saleTaxPercent-${scope.$index}`"
                v-model="scope.row.saleTaxPercent"
                class="cell-mini-input"
                type="text"
                size="mini"
                placeholder="销售税率"
                v-allow.number.float
                @blur="onEditBlur(scope, 'pumpAttributes')"
              ></el-input>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="含税销售单价(元/m³)"
          prop="inclusiveTaxSalePrice"
          min-width="200"
          show-overflow-tooltip
        ></el-table-column>
      </el-table>
    </div>
    <template v-if="edit">
      <div class="item-header">调价凭证</div>
      <div class="segment noborder">
        <div class="segment-area flex-area">
          <div class="segment-item row-width warp">
            <div class="segment-label imglabel">上传凭证</div>
            <div class="segment-content">
              <img-upload-viewer
                ref="modifyPrice"
                viewerTitle="调价凭证"
                :limit="3"
                :defaultFiles="modifyFiles"
              ></img-upload-viewer>
            </div>
          </div>
        </div>
      </div>
    </template>
    <div v-if="edit">
      <el-button type="primary" @click="onSavePrice">确认调价</el-button>
      <router-link :to="`/settlement/detail/${settlementId}`">
        <el-button class="ml-10">取消</el-button>
      </router-link>
    </div>
  </layout>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import utils from '@/utils/utils';
import calc from '@/utils/calc';
import ImgUploadViewer from '@/components/ImgUploadViewer';
import Validator from '@/utils/Validator';

export default {
  components: { ImgUploadViewer },
  data() {
    return {
      settlementId: '',
      settlementSn: '',
      priceData: {
        goods: [],
        attributes: [],
        pumpAttributes: []
      },
      priceDataOld: {},
      modifyFiles: [],
      edit: false // 查看 or 调价
    };
  },
  async created() {
    const params = this.$route.params;
    this.settlementId = params.settlementId;
    this.settlementSn = params.settlementSn;

    if (this.$route.name === 'SettlementModifyPrice') {
      this.edit = true;
    }

    let result = await axios.post(api.settlementPrice, { statementId: this.settlementId });
    result.data = result.data || {};
    result.data.goods = result.data.goods || [];
    result.data.attributes = result.data.attributes || [];
    result.data.pumpAttributes = result.data.pumpAttributes || [];
    result.data.files = result.data.files || [];
    this.priceDataOld = result.data;
    // 映射数据
    this.priceData = {
      goods: result.data.goods.map(el => {
        return {
          ...el,
          label: el.goodsName, // 名称
          exclusiveTaxPurchasePrice: el.goodsPrice, // 不含税采购单价
          purchaseTaxPercent: el.goodsTax, //采购税率
          inclusiveTaxPurchasePrice: el.goodsTaxPrice, //含税采购单价
          exclusiveTaxSalePrice: el.goodsSalePrice, // 不含税销售单价
          saleTaxPercent: el.goodsSaleTax, //销售税率
          inclusiveTaxSalePrice: el.goodsSaleTaxPrice, // 含税销售单价

          exclusiveTaxPurchasePriceEdit: false, //不含税采购单价编辑
          purchaseTaxPercentEdit: false, //采购税率编辑
          exclusiveTaxSalePriceEdit: false, //不含税销售单价编辑
          saleTaxPercentEdit: false //销售税率编辑
        };
      }),
      attributes: result.data.attributes.map(el => {
        return {
          ...el,
          label: el.attrValueName, // 名称
          exclusiveTaxPurchasePrice: el.attrPrice, // 不含税采购单价
          purchaseTaxPercent: el.attrTax, //采购税率
          inclusiveTaxPurchasePrice: el.attrTaxPrice, //含税采购单价
          exclusiveTaxSalePrice: el.attrSalePrice, // 不含税销售单价
          saleTaxPercent: el.attrSaleTax, //销售税率
          inclusiveTaxSalePrice: el.attrSaleTaxPrice, // 含税销售单价

          exclusiveTaxPurchasePriceEdit: false, //不含税采购单价编辑
          purchaseTaxPercentEdit: false, //采购税率编辑
          exclusiveTaxSalePriceEdit: false, //不含税销售单价编辑
          saleTaxPercentEdit: false //销售税率编辑
        };
      }),
      pumpAttributes: result.data.pumpAttributes.map(el => {
        return {
          ...el,
          label: el.attrValueName, // 名称
          exclusiveTaxPurchasePrice: el.attrPrice, // 不含税采购单价
          purchaseTaxPercent: el.attrTax, //采购税率
          inclusiveTaxPurchasePrice: el.attrTaxPrice, //含税采购单价
          exclusiveTaxSalePrice: el.attrSalePrice, // 不含税销售单价
          saleTaxPercent: el.attrSaleTax, //销售税率
          inclusiveTaxSalePrice: el.attrSaleTaxPrice, // 含税销售单价

          exclusiveTaxPurchasePriceEdit: false, //不含税采购单价编辑
          purchaseTaxPercentEdit: false, //采购税率编辑
          exclusiveTaxSalePriceEdit: false, //不含税销售单价编辑
          saleTaxPercentEdit: false //销售税率编辑
        };
      })
    };
    this.modifyFiles = result.data.files.map(el => el.filePath);
  },
  methods: {
    getPriceData() {
      let priceData = { ...this.priceData };
      return {
        goods: priceData.goods.map(el => {
          let newEl = {
            ...el,
            goodsName: el.label, // 名称
            goodsPrice: el.exclusiveTaxPurchasePrice, // 不含税采购单价
            goodsTax: el.purchaseTaxPercent, //采购税率
            goodsTaxPrice: el.inclusiveTaxPurchasePrice, //含税采购单价
            goodsSalePrice: el.exclusiveTaxSalePrice, // 不含税销售单价
            goodsSaleTax: el.saleTaxPercent, //销售税率
            goodsSaleTaxPrice: el.inclusiveTaxSalePrice // 含税销售单价
          };
          delete newEl.label;
          delete newEl.exclusiveTaxPurchasePrice;
          delete newEl.purchaseTaxPercent;
          delete newEl.inclusiveTaxPurchasePrice;
          delete newEl.exclusiveTaxSalePrice;
          delete newEl.saleTaxPercent;
          delete newEl.inclusiveTaxSalePrice;

          delete newEl.exclusiveTaxPurchasePriceEdit;
          delete newEl.purchaseTaxPercentEdit;
          delete newEl.exclusiveTaxSalePriceEdit;
          delete newEl.saleTaxPercentEdit;

          return newEl;
        }),
        attributes: priceData.attributes.map(el => {
          let newEl = {
            ...el,
            attrValueName: el.label, // 名称
            attrPrice: el.exclusiveTaxPurchasePrice, // 不含税采购单价
            attrTax: el.purchaseTaxPercent, //采购税率
            attrTaxPrice: el.inclusiveTaxPurchasePrice, //含税采购单价
            attrSalePrice: el.exclusiveTaxSalePrice, // 不含税销售单价
            attrSaleTax: el.saleTaxPercent, //销售税率
            attrSaleTaxPrice: el.inclusiveTaxSalePrice // 含税销售单价
          };
          delete newEl.label;
          delete newEl.exclusiveTaxPurchasePrice;
          delete newEl.purchaseTaxPercent;
          delete newEl.inclusiveTaxPurchasePrice;
          delete newEl.exclusiveTaxSalePrice;
          delete newEl.saleTaxPercent;
          delete newEl.inclusiveTaxSalePrice;

          delete newEl.exclusiveTaxPurchasePriceEdit;
          delete newEl.purchaseTaxPercentEdit;
          delete newEl.exclusiveTaxSalePriceEdit;
          delete newEl.saleTaxPercentEdit;

          return newEl;
        }),
        pumpAttributes: priceData.pumpAttributes.map(el => {
          let newEl = {
            ...el,
            attrValueName: el.label, // 名称
            attrPrice: el.exclusiveTaxPurchasePrice, // 不含税采购单价
            attrTax: el.purchaseTaxPercent, //采购税率
            attrTaxPrice: el.inclusiveTaxPurchasePrice, //含税采购单价
            attrSalePrice: el.exclusiveTaxSalePrice, // 不含税销售单价
            attrSaleTax: el.saleTaxPercent, //销售税率
            attrSaleTaxPrice: el.inclusiveTaxSalePrice // 含税销售单价
          };
          delete newEl.label;
          delete newEl.exclusiveTaxPurchasePrice;
          delete newEl.purchaseTaxPercent;
          delete newEl.inclusiveTaxPurchasePrice;
          delete newEl.exclusiveTaxSalePrice;
          delete newEl.saleTaxPercent;
          delete newEl.inclusiveTaxSalePrice;

          delete newEl.exclusiveTaxPurchasePriceEdit;
          delete newEl.purchaseTaxPercentEdit;
          delete newEl.exclusiveTaxSalePriceEdit;
          delete newEl.saleTaxPercentEdit;

          return newEl;
        })
      };
    },
    async onSavePrice() {
      let priceData = this.getPriceData();
      console.log(priceData, 'priceData');

      let result = await axios.post(api.settlementPricing, {
        statementId: this.settlementId,
        ...priceData,
        fileInfos: [
          { filePath: this.$refs.modifyPrice.getUploadFiles(), fileType: 'STATEMENT_PRICE_ADJUSTMENT_CREDENTIALS' }
        ]
      });

      this.$message.success('调价成功');
      this.$router.push({ path: `/settlement/detail/${this.settlementId}` });
    },
    // 单元格点击 启用编辑
    handleCellClick(type, row, column, cell, event) {
      if (!this.edit) return;

      const idx = this.priceData[type].indexOf(row);
      const columnKey = column.property; // column绑定的key
      if (columnKey) {
        row[`${columnKey}Edit`] = true;
        this.$nextTick(() => {
          const ref = `${type}-${columnKey}-${idx}`;
          this.$refs[ref].focus();
        });
      }
    },
    // 文本框失去焦点 计算含税价
    async onEditBlur(scope, type) {
      // console.log(scope, type, 'scope,type');
      const columnKey = scope.column.property; // column绑定的key
      if (columnKey) {
        scope.row[`${columnKey}Edit`] = false;
        scope.row[columnKey] = (+scope.row[columnKey] || 0).toFixedNew(2);
        this.onCalcPrice(type, scope.row);
      }
    },
    onCalcPrice(type, activeRow) {
      ['goods', 'attributes', 'pumpAttributes'].forEach(el => {
        this.priceData[el].forEach(row => {
          //更新税率
          row.purchaseTaxPercent = activeRow.purchaseTaxPercent;
          row.saleTaxPercent = activeRow.saleTaxPercent;
          // 重新计算采购单价
          let _taxPurchasePrice = calc.divide(row.purchaseTaxPercent, 100);
          _taxPurchasePrice = calc.add(1, _taxPurchasePrice);
          _taxPurchasePrice = calc.multiply(row.exclusiveTaxPurchasePrice || 0, _taxPurchasePrice).toFixedNew(2);
          row.inclusiveTaxPurchasePrice = _taxPurchasePrice;
          // 重新计算销售单价
          let _saleTaxPrice = calc.divide(row.saleTaxPercent, 100);
          _saleTaxPrice = calc.add(1, _saleTaxPrice);
          _saleTaxPrice = calc.multiply(row.exclusiveTaxSalePrice || 0, _saleTaxPrice).toFixedNew(2);
          row.inclusiveTaxSalePrice = _saleTaxPrice;
        });
      });
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
