<template>
  <layout navActive="mall">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>交易管理</el-breadcrumb-item>
        <el-breadcrumb-item to="/project/list">项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>项目调价对照表</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="detail-hander-panel mb-0">
        <div class="detail-hander-content">
          <span class="font-label">项目编号：</span>
          <span class="font-default">{{ params.projectSn }}</span>
        </div>
        <div class="detail-hander-toolbtn">
          <el-button type="primary" @click="onJumpProtocolDetail">返回</el-button>
        </div>
      </div>

      <section>
        <!-- 商品调价 -->
        <div class="item-header mt-15">商品调价</div>
        <el-table :data="tradePriceList" border>
          <el-table-column label="商砼强度" prop="goodsName" min-width="110" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="调价前不含税采购单价(元/m³)"
            prop="preGoodsPrice"
            min-width="140"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preGoodsPrice!==scope.row.goodsPrice"
              >{{ scope.row.preGoodsPrice | thousands(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="调价后不含税采购单价(元/m³)"
            prop="goodsPrice"
            min-width="140"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preGoodsPrice!==scope.row.goodsPrice"
              >{{ scope.row.goodsPrice | thousands(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="调价前采购税率(%)"
            prop="preGoodsTaxRate"
            min-width="110"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preGoodsTaxRate!==scope.row.goodsTaxRate"
              >{{ scope.row.preGoodsTaxRate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="调价后采购税率(%)"
            prop="goodsTaxRate"
            min-width="110"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preGoodsTaxRate!==scope.row.goodsTaxRate"
              >{{ scope.row.goodsTaxRate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="调价前不含税销售单价(元/m³)"
            prop="preGoodsSalePrice"
            min-width="140"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preGoodsSalePrice!==scope.row.goodsSalePrice"
              >{{ scope.row.preGoodsSalePrice | thousands(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="调价后不含税销售单价(元/m³)"
            prop="goodsSalePrice"
            min-width="140"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preGoodsSalePrice!==scope.row.goodsSalePrice"
              >{{ scope.row.goodsSalePrice | thousands(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="调价前销售税率(%)"
            prop="preGoodsSaleTaxRate"
            min-width="110"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preGoodsSaleTaxRate!==scope.row.goodsSaleTaxRate"
              >{{ scope.row.preGoodsSaleTaxRate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="调价后销售税率(%)"
            prop="goodsSaleTaxRate"
            min-width="110"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preGoodsSaleTaxRate!==scope.row.goodsSaleTaxRate"
              >{{ scope.row.goodsSaleTaxRate }}</span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 特殊属性调价 -->
        <div class="item-header mt-15">特殊属性调价</div>
        <el-table :data="attributeList" border>
          <el-table-column label="特殊属性" prop="attrValueName" min-width="110" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="调价前不含税采购单价(元/m³)"
            prop="preAttrPrice"
            min-width="140"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preAttrPrice!==scope.row.attrPrice"
              >{{ scope.row.preAttrPrice | thousands(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="调价后不含税采购单价(元/m³)"
            prop="attrPrice"
            min-width="140"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preAttrPrice!==scope.row.attrPrice"
              >{{ scope.row.attrPrice | thousands(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="调价前采购税率(%)"
            prop="preAttrTaxRate"
            min-width="110"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preAttrTaxRate!==scope.row.attrTaxRate"
              >{{ scope.row.preAttrTaxRate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="调价后采购税率(%)"
            prop="attrTaxRate"
            min-width="110"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preAttrTaxRate!==scope.row.attrTaxRate"
              >{{ scope.row.attrTaxRate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="调价前不含税销售单价(元/m³)"
            prop="preAttrSalePrice"
            min-width="140"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preAttrSalePrice!==scope.row.attrSalePrice"
              >{{ scope.row.preAttrSalePrice | thousands(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="调价后不含税销售单价(元/m³)"
            prop="attrSalePrice"
            min-width="140"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preAttrSalePrice!==scope.row.attrSalePrice"
              >{{ scope.row.attrSalePrice | thousands(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="调价前销售税率(%)"
            prop="preAttrSaleTaxRate"
            min-width="110"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preAttrSaleTaxRate!==scope.row.attrSaleTaxRate"
              >{{ scope.row.preAttrSaleTaxRate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="调价后销售税率(%)"
            prop="attrSaleTaxRate"
            min-width="110"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preAttrSaleTaxRate!==scope.row.attrSaleTaxRate"
              >{{ scope.row.attrSaleTaxRate | thousands(3) }}</span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 泵车调价 -->
        <div class="item-header mt-15">泵车调价</div>
        <el-table :data="pumpsList" border>
          <el-table-column label="泵车类型" prop="attrValueName" min-width="110" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="调价前不含税采购单价(元/m³)"
            prop="preAttrPrice"
            min-width="140"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preAttrPrice!==scope.row.attrPrice"
              >{{ scope.row.preAttrPrice | thousands(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="调价后不含税采购单价(元/m³)"
            prop="attrPrice"
            min-width="140"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preAttrPrice!==scope.row.attrPrice"
              >{{ scope.row.attrPrice | thousands(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="调价前采购税率(%)"
            prop="preAttrTaxRate"
            min-width="110"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preAttrTaxRate!==scope.row.attrTaxRate"
              >{{ scope.row.preAttrTaxRate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="调价后采购税率(%)"
            prop="attrTaxRate"
            min-width="110"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preAttrTaxRate!==scope.row.attrTaxRate"
              >{{ scope.row.attrTaxRate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="调价前不含税销售单价(元/m³)"
            prop="preAttrSalePrice"
            min-width="140"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preAttrSalePrice!==scope.row.attrSalePrice"
              >{{ scope.row.preAttrSalePrice | thousands(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="调价后不含税销售单价(元/m³)"
            prop="attrSalePrice"
            min-width="140"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preAttrSalePrice!==scope.row.attrSalePrice"
              >{{ scope.row.attrSalePrice | thousands(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="调价前销售税率(%)"
            prop="preAttrSaleTaxRate"
            min-width="110"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preAttrSaleTaxRate!==scope.row.attrSaleTaxRate"
              >{{ scope.row.preAttrSaleTaxRate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="调价后销售税率(%)"
            prop="attrSaleTaxRate"
            min-width="110"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.preAttrSaleTaxRate!==scope.row.attrSaleTaxRate"
              >{{ scope.row.attrSaleTaxRate | thousands(3) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </section>
    </div>
  </layout>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';

import utils from '@/utils/utils';

export default {
  data() {
    return {
      params: {
        id: '', // 项目id
        bizId: '', // 业务id
        projectSn: '' // 项目编号
      },
      attributeList: [], // 特殊属性list
      tradePriceList: [], // 商品list
      pumpsList: [] //泵车list
    };
  },
  computed: {},
  async created() {
    this.params.projectSn = this.$route.params.projectSn || '';
    this.params.id = this.$route.params.id || '';
    this.params.bizId = this.$route.params.bizId || '';
    // 获取调价数据
    let result = await axios.post(api.viewProjectPriceList, { bizId: this.params.bizId });
    result.data = result.data || {};
    this.tradePriceList = result.data.goods || [];
    this.attributeList = result.data.attrs || [];
    this.pumpsList = result.data.pumpAttrs || [];
  },
  methods: {
    onJumpProtocolDetail() {
      this.$router.push({ path: `/project/detail/${this.params.id}` });
    }
  }
};
</script>

