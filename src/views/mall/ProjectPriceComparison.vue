<template>
  <layout navActive="mall">
    <div class="layout-content-list">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>交易管理</el-breadcrumb-item>
        <el-breadcrumb-item to="/project/list">项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>项目单价对照表</el-breadcrumb-item>
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
        <!-- 商品单价 -->
        <div class="item-header mt-15">添加商品销售单价</div>
        <el-table :data="tradePriceList" border>
          <el-table-column label="商砼强度" prop="goodsName" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="不含税采购单价(元/m³)"
            prop="goodsPrice"
            min-width="110"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.goodsPrice | thousands(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="采购税率(%)" prop="goodsTax" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="含税采购单价(元/m³)"
            prop="goodsTaxPrice"
            min-width="200"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.goodsTaxPrice | thousands(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="不含税销售单价(元/m³)"
            prop="goodsSalePrice"
            min-width="110"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.goodsSalePrice | thousands(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="销售税率(%)"
            prop="goodsSaleTax"
            min-width="100"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="含税销售单价(元/m³)"
            prop="goodsSaleTaxPrice"
            min-width="200"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.goodsSaleTaxPrice | thousands(3) }}</span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 特殊属性单价 -->
        <div class="item-header mt-15">添加特殊属性销售单价</div>
        <el-table :data="attributeList" border>
          <el-table-column label="特殊属性" prop="attrValueName" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="不含税采购单价(元/m³)"
            prop="attrPrice"
            min-width="110"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.attrPrice | thousands(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="采购税率(%)" prop="attrTax" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="含税采购单价(元/m³)"
            prop="attrTaxPrice"
            min-width="200"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.attrTaxPrice | thousands(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="不含税销售单价(元/m³)"
            prop="attrSalePrice"
            min-width="110"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.attrSalePrice | thousands(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="销售税率(%)" prop="attrSaleTax" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="含税销售单价(元/m³)"
            prop="attrSaleTaxPrice"
            min-width="200"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.attrSaleTaxPrice | thousands(3) }}</span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 泵车单价 -->
        <div class="item-header mt-15">添加泵车销售单价</div>
        <el-table :data="pumpsList" border>
          <el-table-column label="泵车类型" prop="attrValueName" min-width="160" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="不含税采购单价(元/m³)"
            prop="attrPrice"
            min-width="110"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.attrPrice | thousands(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="采购税率(%)" prop="attrTax" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="含税采购单价(元/m³)"
            prop="attrTaxPrice"
            min-width="200"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.attrTaxPrice | thousands(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="不含税销售单价(元/m³)"
            prop="attrSalePrice"
            min-width="110"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.attrSalePrice | thousands(3) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="销售税率(%)" prop="attrSaleTax" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column
            label="含税销售单价(元/m³)"
            prop="attrSaleTaxPrice"
            min-width="200"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>{{ scope.row.attrSaleTaxPrice | thousands(3) }}</span>
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
        projectSn: '' // 项目编号
      },
      attributeList: [], // 特殊属性list
      tradePriceList: [], // 商品list
      pumpsList: [] //泵车list
    };
  },
  computed: {},
  created() {
    this.params.projectSn = this.$route.params.projectSn || '';
    this.params.id = this.$route.params.id || '';
    // 获取商品单价
    this.onGetGoodsPriceData();
    // 获取特殊属性价格
    this.onGetAttrPriceData(0);
    // 获取泵送价格
    this.onGetAttrPriceData(1);
  },
  methods: {
    async onGetGoodsPriceData() {
      let result = await axios.post(api.goodPrice, { projectId: this.params.id });
      this.tradePriceList = result.data || [];
    },
    async onGetAttrPriceData(type) {
      //  0特殊属性 1浇筑方式(泵送)
      let result = await axios.post(api.attrPrice, { projectId: this.params.id, attrType: type });
      let list = result.data || [];
      if (type === 0) {
        this.attributeList = list;
      }
      if (type === 1) {
        this.pumpsList = list;
      }
    },
    onJumpProtocolDetail() {
      this.$router.push({ path: `/project/detail/${this.params.id}` });
    }
  }
};
</script>

