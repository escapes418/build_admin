<template>
  <layout navActive="mall">
    <div class="addProtocl-content">
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>交易管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/project/list' }">项目管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增项目</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="addProtocl-form-content">
        <el-form
          :model="addProjectFrom"
          :rules="addProjectFromRules"
          :validate-on-rule-change="false"
          :status-icon="false"
          label-position="right"
          label-width="160px"
          ref="addProjectFrom"
        >
          <!--项目信息-->
          <section>
            <div class="item-header">项目信息</div>
            <div class="panels">
              <!-- 采购商/采购商联系人/联系电话 -->
              <el-row>
                <el-col :span="8">
                  <el-form-item label="采购商" prop="purchaserId">
                    <el-select
                      v-model="addProjectFrom.purchaserId"
                      clearable
                      placeholder="请选择采购商"
                      style="width:240px"
                    >
                      <el-option
                        v-for="item in purchaserOptions"
                        :key="item.companyId"
                        :label="item.fullName"
                        :value="item.companyId"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="采购商联系人" prop="purchaserTrader">
                    <el-input
                      v-model.trim="addProjectFrom.purchaserTrader"
                      placeholder="请输入采购商联系人"
                      maxlength="30"
                      clearable
                      style="width:240px"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="联系电话" prop="purchaserTraderMobile">
                    <el-input
                      v-model.trim="addProjectFrom.purchaserTraderMobile"
                      placeholder="请输入联系电话"
                      maxlength="14"
                      clearable
                      style="width:240px"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 供应商/供应商联系人/联系电话 -->
              <el-row>
                <el-col :span="8">
                  <el-form-item label="供应商" prop="supplierId">
                    <el-select
                      v-model="addProjectFrom.supplierId"
                      clearable
                      placeholder="请选择供应商"
                      style="width:240px"
                    >
                      <el-option
                        v-for="item in finOptions"
                        :key="item.companyId"
                        :label="item.fullName"
                        :value="item.companyId"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="供应商联系人" prop="supplierTrader">
                    <el-input
                      v-model.trim="addProjectFrom.supplierTrader"
                      placeholder="请输入供应商联系人"
                      maxlength="30"
                      clearable
                      style="width:240px"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="联系电话" prop="supplierTraderMobile">
                    <el-input
                      v-model.trim="addProjectFrom.supplierTraderMobile"
                      placeholder="请输入联系电话"
                      maxlength="14"
                      clearable
                      style="width:240px"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 项目名称/项目生效时间/有效期 -->
              <el-row>
                <el-col :span="8">
                  <el-form-item label="项目名称" prop="projectName">
                    <el-input
                      v-model.trim="addProjectFrom.projectName"
                      placeholder="请输入项目名称"
                      maxlength="80"
                      clearable
                      style="width:240px"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="项目生效时间" prop="effectiveTime">
                    <el-date-picker
                      v-model="addProjectFrom.effectiveTime"
                      type="date"
                      placeholder="选择日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      :picker-options="pickerOptions"
                      style="width:240px"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="有效期(年)" prop="validPeriod">
                    <el-input
                      v-model.trim="addProjectFrom.validPeriod"
                      placeholder="请输入有效期"
                      maxlength="4"
                      clearable
                      style="width:240px"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 工程结构/计划混凝土方量/到达地点 -->
              <el-row>
                <el-col :span="8">
                  <el-form-item label="工程结构" prop="projectStructure">
                    <el-input
                      v-model.trim="addProjectFrom.projectStructure"
                      placeholder="请输入工程结构"
                      maxlength="20"
                      clearable
                      style="width:240px"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="计划混凝土方量(m³)" prop="number">
                    <el-input
                      v-model.trim="addProjectFrom.number"
                      placeholder="请输入计划混凝土方量"
                      maxlength="10"
                      clearable
                      style="width:240px"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="到达地点" prop="deliveryPlace">
                    <el-input
                      v-model.trim="addProjectFrom.deliveryPlace"
                      placeholder="请输入到达地点"
                      type="textarea"
                      :autosize="{ minRows: 1, maxRows: 10 }"
                      maxlength="100"
                      style="width:240px"
                      clearable
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 计划供应时间/采购合同编号 -->
              <el-row>
                <el-col :span="8">
                  <el-form-item label="采购合同编号" prop="contractSn">
                    <el-input
                      v-model.trim="addProjectFrom.contractSn"
                      placeholder="请输入采购合同编号"
                      maxlength="20"
                      clearable
                      style="width:240px"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="计划供应时间" required>
                    <el-date-picker
                      v-model="createTimeRange"
                      @change="onDateChange"
                      type="daterange"
                      range-separator="-"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      :picker-options="pickerOptions"
                      style="width:240px"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="经纪人模式" prop="proxyMode">
                    <el-select
                      v-model.trim="addProjectFrom.proxyMode"
                      placeholder="请选择经纪人模式"
                      maxlength="20"
                      clearable
                      style="width:240px"
                      @change="onProxyModeChange"
                    >
                      <el-option
                        v-for="proxyMode in proxyModeArr"
                        :key="proxyMode.value"
                        :label="proxyMode.label"
                        :value="proxyMode.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <!-- 上传采购协议 -->
              <el-row>
                <el-col :span="24">
                  <el-form-item label="上传采购协议" prop="fileGroup">
                    <img-upload-viewer ref="purchaseAgreementImgs" viewerTitle="采购协议" :limit="10"></img-upload-viewer>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </section>

          <!--结算信息-->
          <section>
            <div class="item-header">结算信息</div>
            <div class="panels">
              <el-row>
                <el-col :span="8">
                  <!-- <el-form-item label="月结日期" prop="deliveryPayTime">
                    <el-date-picker
                      v-model="addProjectFrom.deliveryPayTime"
                      type="date"
                      placeholder="选择月结日期"
                      format="dd"
                      value-format="dd"
                      :picker-options="pickerOptions"
                    >
                      >
                    </el-date-picker>
                  </el-form-item>-->

                  <el-form-item label="结算方式" prop="statementMode">
                    <el-select
                      v-model.number="addProjectFrom.statementMode"
                      placeholder="请选择结算方式"
                      maxlength="4"
                      clearable
                      style="width:240px"
                      disabled
                    >
                      <el-option
                        v-for="statementMode in statementModeArr"
                        :key="statementMode.value"
                        :label="statementMode.label"
                        :value="statementMode.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="结算时间(天)" prop="timeLimit">
                    <el-input
                      v-model.number="addProjectFrom.timeLimit"
                      placeholder="请输入结算时间"
                      maxlength="4"
                      clearable
                      style="width:240px"
                    ></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="次月支付货款比例(%)" prop="nextMonthPaymentScale">
                    <el-input
                      v-model.trim="addProjectFrom.nextMonthPaymentScale"
                      placeholder="请输入次月支付货款比例"
                      maxlength="5"
                      clearable
                      style="width:240px"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <!-- <el-col :span="8">
                  <el-form-item label="结算税率(%)" prop="taxRate">
                    <el-input
                      v-model.trim="addProjectFrom.taxRate"
                      placeholder="请输入结算税率"
                      maxlength="5"
                      clearable
                      style="width:240px"
                    ></el-input>
                  </el-form-item>
                </el-col>-->
                <!-- 预付款模式下是没有计费模式 -->
                <el-col :span="8">
                  <el-form-item
                    label="计费模式"
                    prop="deliveryPayType"
                    v-if="addProjectFrom.statementMode !== '0'"
                  >
                    <el-select
                      v-model="addProjectFrom.deliveryPayType"
                      clearable
                      placeholder="请选择计费模式"
                      style="width:240px"
                    >
                      <el-option
                        v-for="item in PayTypeArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </section>

          <!-- 添加商品单价 -->
          <section>
            <div class="item-header mt-15">添加商品销售单价</div>
            <el-button
              class="mb-15"
              type="primary"
              plain
              @click="onShowDialog('addTradePrice')"
            >添加商品</el-button>
            <el-table
              :data="projectGoodsList"
              border
              @cell-click="(row,column,cell,event)=>{handleCellClick('addTradePrice',row,column,cell,event)}"
            >
              <el-table-column label="商砼强度" prop="label" min-width="160" show-overflow-tooltip></el-table-column>
              <el-table-column
                label="不含税采购单价(元/m³)"
                prop="exclusiveTaxPurchasePrice"
                min-width="150"
                show-overflow-tooltip
              >
                <template slot="header">
                  <template>
                    <span class="font-default">不含税采购单价(元/m³)</span>
                    <i class="el-icon-edit font-default ml-5"></i>
                  </template>
                </template>
                <template slot-scope="scope">
                  <span
                    v-if="!scope.row.exclusiveTaxPurchasePriceEdit"
                  >{{ scope.row.exclusiveTaxPurchasePrice | thousands }}</span>
                  <span v-else>
                    <el-input
                      :ref="`table-exclusiveTaxPurchasePrice${scope.$index}`"
                      v-model="scope.row.exclusiveTaxPurchasePrice"
                      class="cell-mini-input"
                      type="text"
                      size="mini"
                      placeholder="不含税采购单价"
                      v-allow.number.float
                      @blur="onEditBlur('addTradePrice',scope.row, 'exclusiveTaxPurchasePrice')"
                    ></el-input>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="采购税率(%)"
                prop="purchaseTaxPercent"
                min-width="100"
                show-overflow-tooltip
              >
                <template slot="header">
                  <template>
                    <span class="font-default">采购税率(%)</span>
                    <i class="el-icon-edit font-default ml-5"></i>
                  </template>
                </template>
                <template slot-scope="scope">
                  <span
                    v-if="!scope.row.purchaseTaxPercentEdit"
                  >{{ scope.row.purchaseTaxPercent | thousands }}</span>
                  <span v-else>
                    <el-input
                      :ref="`table-purchaseTaxPercent${scope.$index}`"
                      v-model="scope.row.purchaseTaxPercent"
                      class="cell-mini-input"
                      type="text"
                      size="mini"
                      placeholder="采购税率"
                      v-allow.number.float
                      @blur="onEditBlur('addTradePrice',scope.row, 'purchaseTaxPercent')"
                    ></el-input>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="含税采购单价(元/m³)"
                prop="inclusiveTaxPurchasePrice"
                min-width="200"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.inclusiveTaxPurchasePrice | toFixed(2) | thousands }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="不含税销售单价(元/m³)"
                prop="exclusiveTaxSalePrice"
                min-width="150"
                show-overflow-tooltip
              >
                <template slot="header">
                  <template>
                    <span class="font-default">不含税销售单价(元/m³)</span>
                    <i class="el-icon-edit font-default ml-5"></i>
                  </template>
                </template>
                <template slot-scope="scope">
                  <span
                    v-if="!scope.row.exclusiveTaxSalePriceEdit"
                  >{{ scope.row.exclusiveTaxSalePrice | thousands }}</span>
                  <span v-else>
                    <el-input
                      :ref="`table-exclusiveTaxSalePrice${scope.$index}`"
                      v-model="scope.row.exclusiveTaxSalePrice"
                      class="cell-mini-input"
                      type="text"
                      size="mini"
                      placeholder="不含税销售单价"
                      v-allow.number.float
                      @blur="onEditBlur('addTradePrice',scope.row, 'exclusiveTaxSalePrice')"
                    ></el-input>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="销售税率(%)"
                prop="saleTaxPercent"
                min-width="100"
                show-overflow-tooltip
              >
                <template slot="header">
                  <template>
                    <span class="font-default">销售税率(%)</span>
                    <i class="el-icon-edit font-default ml-5"></i>
                  </template>
                </template>
                <template slot-scope="scope">
                  <span
                    v-if="!scope.row.saleTaxPercentEdit"
                  >{{ scope.row.saleTaxPercent | thousands }}</span>
                  <span v-else>
                    <el-input
                      :ref="`table-saleTaxPercent${scope.$index}`"
                      v-model="scope.row.saleTaxPercent"
                      class="cell-mini-input"
                      type="text"
                      size="mini"
                      placeholder="销售税率"
                      v-allow.number.float
                      @blur="onEditBlur('addTradePrice',scope.row, 'saleTaxPercent')"
                    ></el-input>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="含税销售单价(元/m³)"
                prop="inclusiveTaxSalePrice"
                min-width="200"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.inclusiveTaxSalePrice | toFixed(2) | thousands }}</span>
                </template>
              </el-table-column>

              <el-table-column label="操作" min-width="100">
                <template slot-scope="scope">
                  <span
                    class="font-red pointer ml-10"
                    @click="handleDeleteItem('addTradePrice', scope.$index, scope.row)"
                  >删除</span>
                </template>
              </el-table-column>
            </el-table>
          </section>

          <!-- 添加特殊属性单价 -->
          <section>
            <div class="item-header mt-15">添加特殊属性销售单价</div>
            <el-button
              class="mb-15"
              type="primary"
              plain
              @click="onShowDialog('addAttribute')"
            >添加特殊属性</el-button>
            <el-table
              :data="specialAttrList"
              border
              @cell-click="(row,column,cell,event)=>{handleCellClick('addAttribute',row,column,cell,event)}"
            >
              <el-table-column label="特殊属性" prop="label" min-width="160" show-overflow-tooltip></el-table-column>
              <el-table-column
                label="不含税采购单价(元/m³)"
                prop="exclusiveTaxPurchasePrice"
                min-width="150"
                show-overflow-tooltip
              >
                <template slot="header">
                  <template>
                    <span class="font-default">不含税采购单价(元/m³)</span>
                    <i class="el-icon-edit font-default ml-5"></i>
                  </template>
                </template>
                <template slot-scope="scope">
                  <span
                    v-if="!scope.row.exclusiveTaxPurchasePriceEdit"
                  >{{ scope.row.exclusiveTaxPurchasePrice | thousands }}</span>
                  <span v-else>
                    <el-input
                      :ref="`table-exclusiveTaxPurchasePrice${scope.$index}`"
                      v-model="scope.row.exclusiveTaxPurchasePrice"
                      class="cell-mini-input"
                      type="text"
                      size="mini"
                      placeholder="不含税采购单价"
                      v-allow.number.float
                      @blur="onEditBlur('addAttribute',scope.row, 'exclusiveTaxPurchasePrice')"
                    ></el-input>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="采购税率(%)"
                prop="purchaseTaxPercent"
                min-width="100"
                show-overflow-tooltip
              >
                <template slot="header">
                  <template>
                    <span class="font-default">采购税率(%)</span>
                    <i class="el-icon-edit font-default ml-5"></i>
                  </template>
                </template>
                <template slot-scope="scope">
                  <span
                    v-if="!scope.row.purchaseTaxPercentEdit"
                  >{{ scope.row.purchaseTaxPercent | thousands }}</span>
                  <span v-else>
                    <el-input
                      :ref="`table-purchaseTaxPercent${scope.$index}`"
                      v-model="scope.row.purchaseTaxPercent"
                      class="cell-mini-input"
                      type="text"
                      size="mini"
                      placeholder="采购税率"
                      v-allow.number.float
                      @blur="onEditBlur('addAttribute',scope.row, 'purchaseTaxPercent')"
                    ></el-input>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="含税采购单价(元/m³)"
                prop="inclusiveTaxPurchasePrice"
                min-width="200"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.inclusiveTaxPurchasePrice | toFixed(2) | thousands }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="不含税销售单价(元/m³)"
                prop="exclusiveTaxSalePrice"
                min-width="150"
                show-overflow-tooltip
              >
                <template slot="header">
                  <template>
                    <span class="font-default">不含税销售单价(元/m³)</span>
                    <i class="el-icon-edit font-default ml-5"></i>
                  </template>
                </template>
                <template slot-scope="scope">
                  <span
                    v-if="!scope.row.exclusiveTaxSalePriceEdit"
                  >{{ scope.row.exclusiveTaxSalePrice | thousands }}</span>
                  <span v-else>
                    <el-input
                      :ref="`table-exclusiveTaxSalePrice${scope.$index}`"
                      v-model="scope.row.exclusiveTaxSalePrice"
                      class="cell-mini-input"
                      type="text"
                      size="mini"
                      placeholder="不含税销售单价"
                      v-allow.number.float
                      @blur="onEditBlur('addAttribute',scope.row, 'exclusiveTaxSalePrice')"
                    ></el-input>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="销售税率(%)"
                prop="saleTaxPercent"
                min-width="100"
                show-overflow-tooltip
              >
                <template slot="header">
                  <template>
                    <span class="font-default">销售税率(%)</span>
                    <i class="el-icon-edit font-default ml-5"></i>
                  </template>
                </template>
                <template slot-scope="scope">
                  <span
                    v-if="!scope.row.saleTaxPercentEdit"
                  >{{ scope.row.saleTaxPercent | thousands }}</span>
                  <span v-else>
                    <el-input
                      :ref="`table-saleTaxPercent${scope.$index}`"
                      v-model="scope.row.saleTaxPercent"
                      class="cell-mini-input"
                      type="text"
                      size="mini"
                      placeholder="销售税率"
                      v-allow.number.float
                      @blur="onEditBlur('addAttribute',scope.row, 'saleTaxPercent')"
                    ></el-input>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="含税销售单价(元/m³)"
                prop="inclusiveTaxSalePrice"
                min-width="200"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.inclusiveTaxSalePrice | toFixed(2) | thousands }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="100">
                <template slot-scope="scope">
                  <span
                    class="font-red pointer ml-10"
                    @click="handleDeleteItem('addAttribute', scope.$index, scope.row)"
                  >删除</span>
                </template>
              </el-table-column>
            </el-table>
          </section>

          <!-- 添加泵车单价 -->
          <section>
            <div class="item-header mt-15">添加泵车销售单价</div>
            <el-button class="mb-15" type="primary" plain @click="onShowDialog('addPumps')">添加泵车</el-button>
            <el-table
              :data="pumpPriceList"
              border
              @cell-click="(row,column,cell,event)=>{handleCellClick('addPumps',row,column,cell,event)}"
            >
              <el-table-column label="泵车类型" prop="label" min-width="160" show-overflow-tooltip></el-table-column>
              <el-table-column
                label="不含税采购单价(元/m³)"
                prop="exclusiveTaxPurchasePrice"
                min-width="150"
                show-overflow-tooltip
              >
                <template slot="header">
                  <template>
                    <span class="font-default">不含税采购单价(元/m³)</span>
                    <i class="el-icon-edit font-default ml-5"></i>
                  </template>
                </template>
                <template slot-scope="scope">
                  <span
                    v-if="!scope.row.exclusiveTaxPurchasePriceEdit"
                  >{{ scope.row.exclusiveTaxPurchasePrice | thousands }}</span>
                  <span v-else>
                    <el-input
                      :ref="`table-exclusiveTaxPurchasePrice${scope.$index}`"
                      v-model="scope.row.exclusiveTaxPurchasePrice"
                      class="cell-mini-input"
                      type="text"
                      size="mini"
                      placeholder="不含税采购单价"
                      v-allow.number.float
                      @blur="onEditBlur('addPumps',scope.row, 'exclusiveTaxPurchasePrice')"
                    ></el-input>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="采购税率(%)"
                prop="purchaseTaxPercent"
                min-width="100"
                show-overflow-tooltip
              >
                <template slot="header">
                  <template>
                    <span class="font-default">采购税率(%)</span>
                    <i class="el-icon-edit font-default ml-5"></i>
                  </template>
                </template>
                <template slot-scope="scope">
                  <span
                    v-if="!scope.row.purchaseTaxPercentEdit"
                  >{{ scope.row.purchaseTaxPercent | thousands }}</span>
                  <span v-else>
                    <el-input
                      :ref="`table-purchaseTaxPercent${scope.$index}`"
                      v-model="scope.row.purchaseTaxPercent"
                      class="cell-mini-input"
                      type="text"
                      size="mini"
                      placeholder="采购税率"
                      v-allow.number.float
                      @blur="onEditBlur('addPumps',scope.row, 'purchaseTaxPercent')"
                    ></el-input>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="含税采购单价(元/m³)"
                prop="inclusiveTaxPurchasePrice"
                min-width="200"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.inclusiveTaxPurchasePrice | toFixed(2) | thousands }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="不含税销售单价(元/m³)"
                prop="exclusiveTaxSalePrice"
                min-width="150"
                show-overflow-tooltip
              >
                <template slot="header">
                  <template>
                    <span class="font-default">不含税销售单价(元/m³)</span>
                    <i class="el-icon-edit font-default ml-5"></i>
                  </template>
                </template>
                <template slot-scope="scope">
                  <span
                    v-if="!scope.row.exclusiveTaxSalePriceEdit"
                  >{{ scope.row.exclusiveTaxSalePrice | thousands }}</span>
                  <span v-else>
                    <el-input
                      :ref="`table-exclusiveTaxSalePrice${scope.$index}`"
                      v-model="scope.row.exclusiveTaxSalePrice"
                      class="cell-mini-input"
                      type="text"
                      size="mini"
                      placeholder="不含税销售单价"
                      v-allow.number.float
                      @blur="onEditBlur('addPumps',scope.row, 'exclusiveTaxSalePrice')"
                    ></el-input>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="销售税率(%)"
                prop="saleTaxPercent"
                min-width="100"
                show-overflow-tooltip
              >
                <template slot="header">
                  <template>
                    <span class="font-default">销售税率(%)</span>
                    <i class="el-icon-edit font-default ml-5"></i>
                  </template>
                </template>
                <template slot-scope="scope">
                  <span
                    v-if="!scope.row.saleTaxPercentEdit"
                  >{{ scope.row.saleTaxPercent | thousands }}</span>
                  <span v-else>
                    <el-input
                      :ref="`table-saleTaxPercent${scope.$index}`"
                      v-model="scope.row.saleTaxPercent"
                      class="cell-mini-input"
                      type="text"
                      size="mini"
                      placeholder="销售税率"
                      v-allow.number.float
                      @blur="onEditBlur('addPumps',scope.row, 'saleTaxPercent')"
                    ></el-input>
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                label="含税销售单价(元/m³)"
                prop="inclusiveTaxSalePrice"
                min-width="200"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.inclusiveTaxSalePrice | toFixed(2) | thousands }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" min-width="100">
                <template slot-scope="scope">
                  <span
                    class="font-red pointer ml-10"
                    @click="handleDeleteItem('addPumps', scope.$index, scope.row)"
                  >删除</span>
                </template>
              </el-table-column>
            </el-table>
          </section>
        </el-form>

        <div class="text-l mt-20">
          <el-button type="primary" @click="onSubmitFrom">保存</el-button>
          <el-button @click="onJumpList">取消</el-button>
          <!-- 方便测试 -->
          <el-button type="primary" v-if="env !== 'prod'" @click="onWriteDemoData">模板数据</el-button>
        </div>
      </div>

      <!-- 添加商品/添加特殊属性/添加泵车 -->
      <el-dialog
        :title="addDialog.title"
        :visible.sync="addDialog.visable"
        width="600px"
        center
        class="add-dialog"
      >
        <div class="check-label">
          <span class="font-default mr-20">{{ dialogItemLable }}:</span>
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            class="mb-15"
          >全选</el-checkbox>
        </div>

        <el-checkbox-group v-model="checkedList" @change="handleCheckedChange">
          <el-checkbox-button
            v-for="item in addOptions"
            :key="item.value"
            :label="item.value"
            size="small"
          >
            {{
            item.label
            }}
          </el-checkbox-button>
        </el-checkbox-group>

        <span slot="footer" class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="handleAddSubmit">确 定</el-button>
          <!-- 方便测试 -->
          <!-- <el-button type="primary" v-if="env !== 'prod'" @click="handleAddDemoData">模板数据</el-button> -->
        </span>
      </el-dialog>
    </div>
  </layout>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import Validator from '@/utils/Validator';
import utils from '@/utils/utils';
import calc from '@/utils/calc';
import dayjs from 'dayjs';
// import { watch } from 'fs';
import ImgUploadViewer from '@/components/ImgUploadViewer';
import config from '@/config/config';

export default {
  components: {
    ImgUploadViewer
  },
  data() {
    // 银行卡验证
    var validateBankCard = (rule, value, callback) => {
      if (!Validator.bankcard(value)) {
        callback(new Error(rule.message));
      }
      callback();
    };
    // 手机号验证
    var validateMoble = (rule, value, callback) => {
      if (!Validator.phone(value)) {
        callback(new Error(rule.message));
      }
      callback();
    };
    // 不含税单价验证
    var validateTaxUninclusive = (rule, value, callback) => {
      if (!Validator.number(value, false)) {
        callback(new Error(rule.message));
      }
      callback();
    };
    // 税率验证
    var validateTaxPercent = (rule, value, callback) => {
      if (!Validator.number(value, false)) {
        callback(new Error(rule.message));
      }
      callback();
    };
    // 有效期验证
    var validateValidPeriod = (rule, value, callback) => {
      if (!Validator.number(value, false)) {
        callback(new Error(rule.message));
      }
      callback();
    };
    // 结算时间校验
    var validateTimeLimit = (rule, value, callback) => {
      if (!Validator.number(value, false)) {
        callback(new Error(rule.message));
      }
      callback();
    };
    // 次月支付货款比例
    var validatePaymentScale = (rule, value, callback) => {
      if (!Validator.number(value, false)) {
        callback(new Error(rule.message));
      }
      callback();
    };
    // 结算时间最大值
    var validateTimeMax = (rule, value, callback) => {
      if (value > 9999) {
        callback(new Error(rule.message));
      }
      callback();
    };
    // 税率最大值
    var validateTaxMax = (rule, value, callback) => {
      if (value > 100) {
        callback(new Error(rule.message));
      }
      callback();
    };
    // 最小结算天数
    var validateTimeMin = (rule, value, callback) => {
      if (value < 5) {
        callback(new Error(rule.message));
      }
      callback();
    };
    return {
      coalMineId: '',
      proxyModeArr: [], //经纪人模式 0表示否，1表示是
      statementModeArr: [], //结算方式
      addProjectFrom: {
        purchaserId: '', //采购商id
        purchaserName: '', //采购商名称 ,
        purchaserTrader: '', //采购商交易员
        purchaserTraderMobile: '', //采购商交易员联系电话

        supplierId: '', //供应商id ,
        supplierName: '', //供应商名称 ,
        supplierTrader: '', //供应商交易员
        supplierTraderMobile: '', //供应商交易员联系电话

        projectName: '', //项目名称
        effectiveTime: '', //生效时间 ,
        validPeriod: '', //有效期

        projectStructure: '', //工程结构 ,
        number: '', //计划混凝土方量 ,
        deliveryPlace: '', //交货地 ,

        beginTime: '', // 计划供应-开始时间 ,
        endTime: '', //计划供应-结束时间 ,

        contractSn: '', //签署合同编号 ,
        fileGroup: [
          {
            fileType: '',
            fileName: '',
            operatorId: '',
            operatorName: '',
            fileInfo: [
              {
                filePath: ''
              }
            ]
          }
        ], //附件信息 ,
        proxyMode: '1', //经纪人模式
        statementMode: '0', //结算方式  0 预付款，1 月结
        deliveryPayType: '1', //计费模式 0 按待结算金额计算 1按月结货款金额计算 ,
        // taxRate: '', // 结算税率

        timeLimit: '', //账期（天） ,
        nextMonthPaymentScale: '', //次月支付货款比例 ,

        projectGoodsList: [], //项目商品
        specialAttrList: [], // 项目特殊属性 ,
        pumpPriceList: [] //泵送单价
      },
      addProjectFromRules: {
        accountBank: [{ required: true, message: '请输入开户行', trigger: 'blur' }],
        accountCity: [{ required: true, message: '请输入开户城市', trigger: 'blur' }],
        accountName: [{ required: true, message: '请输入账户名', trigger: 'blur' }],
        accountPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: validateMoble, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        accountPeople: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        accountNumber: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { validator: validateBankCard, message: '请输入正确的银行卡号', trigger: 'blur' }
        ],

        purchaserId: [{ required: true, message: '请选择采购商', trigger: 'change' }],
        purchaserTrader: [{ required: true, message: '请输入采购商联系人', trigger: 'blur' }],
        purchaserTraderMobile: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: validateMoble, message: '请输入正确的手机号码', trigger: 'blur' }
        ],

        supplierId: [{ required: true, message: '请选择供应商', trigger: 'change' }],
        supplierTrader: [{ required: true, message: '请输入供应商联系人', trigger: 'blur' }],
        supplierTraderMobile: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { validator: validateMoble, message: '请输入正确的手机号码', trigger: 'blur' }
        ],

        projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
        effectiveTime: [{ required: true, message: '请选择项目生效时间', trigger: 'change' }],
        validPeriod: [
          { required: true, message: '请输入有效期', trigger: 'blur' },
          { validator: validateValidPeriod, message: '请输入正确的有效期', trigger: 'blur' },
          { validator: validateTimeMax, message: '时间不能超过9999', trigger: 'blur' }
        ],

        projectStructure: [{ required: true, message: '请输入工程结构', trigger: 'blur' }],
        number: [
          { required: true, message: '请输入计划混凝土方量', trigger: 'blur' },
          { validator: validateValidPeriod, message: '请输入正确的计划混凝土方量,最多2位小数', trigger: 'blur' }
        ],
        deliveryPlace: [{ required: true, message: '请输入到达地点', trigger: 'blur' }],

        contractSn: [{ required: true, message: '请输入采购合同编号', trigger: 'blur' }],
        fileGroup: [{ required: true, message: '请上传采购协议', trigger: 'blur' }],

        statementMode: [{ required: true, message: '请选择结算方式', trigger: 'change' }],
        deliveryPayType: [{ required: true, message: '请选择计费模式', trigger: 'change' }],
        // taxRate: [
        //   { required: true, message: '请输入结算税率', trigger: 'blur' },
        //   { validator: validateTaxPercent, message: '请输入正确的税率，最多2位小数', trigger: 'blur' },
        //   { validator: validateTaxMax, message: '税率不能超过100%', trigger: 'blur' }
        // ],

        timeLimit: [
          { required: true, message: '请输入结算时间', trigger: 'blur' },
          { validator: validateTimeLimit, message: '结算时间为整数,介于5-9999之间', trigger: 'blur' },
          { validator: validateTimeMin, message: '结算时间不能小于5天', trigger: 'blur' },
          { validator: validateTimeMax, message: '结算时间不能超过9999天', trigger: 'blur' }
        ],
        nextMonthPaymentScale: [
          { required: true, message: '请输入次月支付货款比例', trigger: 'blur' },
          { validator: validatePaymentScale, message: '请输入正确的次月支付货款比例', trigger: 'blur' },
          { validator: validateTaxMax, message: '次月支付货款比例不能超过100%', trigger: 'blur' }
        ],
        proxyMode: [{ required: true, message: '请选择经纪人模式', trigger: 'blur' }]
      },
      projectGoodsList: [], // 添加商品list
      specialAttrList: [], // 添加特殊属性list
      pumpPriceList: [], //添加泵车list

      addDialog: {
        title: '',
        type: '',
        visable: false
      },
      addOptions: [],
      addParamsFrom: {
        type: '',
        label: '',
        taxUninclusive: 0,
        taxPercent: 0,
        taxInclusive: 0
      }, // 含税价 = 不含税价*（1+税率）
      addParamsFromRules: {
        type: [{ required: true, message: '请选择', trigger: 'change' }],
        taxUninclusive: [
          { required: true, message: '请输入不含税单价', trigger: 'blur' },
          { validator: validateTaxUninclusive, message: '请输入正确的不含税单价，最多2位小数', trigger: 'blur' }
        ],
        taxPercent: [
          { required: true, message: '请输入税率', trigger: 'blur' },
          { validator: validateTaxPercent, message: '请输入正确的税率，最多2位小数', trigger: 'blur' }
        ]
      },
      pickerOptions1: {
        // disabledDate(time) {
        //   //日期选择范围在当前月内
        //   const minTime = dayjs()
        //     .startOf('month')
        //     .valueOf();
        //   const maxTime = dayjs()
        //     .endOf('month')
        //     .valueOf();
        //   return time.getTime() < minTime || time.getTime() > maxTime;
        // }
      },
      // updateIndex: null,
      createTimeRange: [],
      pickerOptions: {
        disabledDate(time) {
          // return time.getTime() > Date.now();
          return time.getTime() <= dayjs().subtract(1, 'days');
        }
      },
      PayTypeArr: [], //结算方式
      purchaserOptions: [], // 所有采购商
      finOptions: [], // 所有供应商
      chooseGoodsOptions: [], // 所有商品筛选list
      chooseAttrOptions: [], // 所有商品筛选list
      pumpsOptions: [], // 所有商品筛选list
      purchaseTaxPercent: 13, //默认采购税率13%
      saleTaxPercent: 13, //默认销售税率13%

      checkAll: false,
      checkedList: [],
      isIndeterminate: true,
      env: config.env
    };
  },
  computed: {
    dialogItemLable() {
      switch (this.addDialog.type) {
        case 'addTradePrice': // 添加商品单价
        case 'editTradePrice': // 编辑商品
          return '商砼强度';

        case 'addAttribute': // 添加特殊属性单价
        case 'editAttribute': // 编辑特殊属性
          return '特殊属性';

        case 'addPumps': // 添加泵车单价
        case 'editPumps': // 编辑泵车单价
          return '泵车类型';
      }
    }
  },
  async created() {
    // 结算方式字典
    this.PayTypeArr = await utils.getSysDict('project_payment_type');
    //经纪人模式
    this.proxyModeArr = await utils.getSysDict('proxy_mode');
    //结算方式
    this.statementModeArr = await utils.getSysDict('statement_mode');
    // 提交所有采购商数据
    let purchaserResult = await axios.post(api.queryCompanyTypeList, { companyType: 'CONCRETE_PURCHASER' });
    this.purchaserOptions = purchaserResult.data || [];
    // 提交所有供应商数据
    let finResult = await axios.post(api.queryCompanyTypeList, { companyType: 'FIN' });
    this.finOptions = finResult.data || [];

    // 所有商品数据
    let chooseGoodsResult = await axios.post(api.chooseGoods, {});
    let chooseGoodsArr = chooseGoodsResult.data || [];
    if (chooseGoodsArr && chooseGoodsArr.length > 0) {
      this.chooseGoodsOptions = chooseGoodsArr.map(obj => {
        return { label: obj.name, value: obj.id };
      });
    } else {
      this.chooseGoodsOptions = [];
    }

    // 所有特殊属性数据（0：特殊属性，1：浇筑方式）
    let chooseAttrResult = await axios.post(api.chooseAttr, { attrType: 0 });
    let chooseAttrArr = chooseAttrResult.data || [];
    if (chooseAttrArr && chooseAttrArr.length > 0) {
      this.chooseAttrOptions = chooseAttrArr.map(obj => {
        return { label: obj.value, value: obj.id };
      });
    } else {
      this.chooseAttrOptions = [];
    }

    // 所有泵车数据
    let pumpsResult = await axios.post(api.chooseAttr, { attrType: 1 });
    let pumpsArr = pumpsResult.data || [];
    if (pumpsArr && pumpsArr.length > 0) {
      this.pumpsOptions = pumpsArr.map(obj => {
        return { label: obj.value, value: obj.id };
      });
    } else {
      this.pumpsOptions = [];
    }
  },
  methods: {
    // 选择时间范围回调(计划供应时间)
    onDateChange(val, type) {
      if (val && val.length > 0) {
        this.addProjectFrom.beginTime = val[0];
        this.addProjectFrom.endTime = val[1];
      } else {
        this.addProjectFrom.beginTime = '';
        this.addProjectFrom.endTime = '';
      }
    },
    //经纪人模式 1 是  0 否
    onProxyModeChange(value) {
      switch (value) {
        case '0':
          this.addProjectFrom.statementMode = '1'; //1表示月结
          this.addProjectFrom.deliveryPayType = ''; // 计费模式  月结的时候情况 可选
          break;
        case '1':
          this.addProjectFrom.statementMode = '0'; //表示预付款
          this.addProjectFrom.deliveryPayType = '1'; // 计费模式 预付款下指定为第二种 不可选且隐藏
          break;
        default:
          this.addProjectFrom.statementMode = '';
          break;
      }
    },
    async onSubmitFrom() {
      this.$refs.addProjectFrom.validate(async valid => {
        if (valid) {
          // 采购协议（附图）
          const AgreementList = this.$refs.purchaseAgreementImgs.getUploadFiles() || [];
          if (AgreementList.length === 0) {
            this.$message.error('请上传采购协议');
            return;
          }
          // 处理上传采购协议图片
          let fileInfo = AgreementList.map(item => {
            return { filePath: item };
          });
          this.addProjectFrom.fileGroup[0].fileInfo = fileInfo;

          // 处理提交数据(采购商名称&供应商名称)
          this.addProjectFrom.purchaserName = this.valueToLabel(this.addProjectFrom.purchaserId, this.purchaserOptions);
          this.addProjectFrom.supplierName = this.valueToLabel(this.addProjectFrom.supplierId, this.finOptions);
          // 校验添加商品价格
          if (this.projectGoodsList.length === 0) {
            this.$message.error('请添加商品销售单价');
            return;
          }

          // 校验添加特殊属性
          if (this.specialAttrList.length === 0) {
            this.$message.error('请添加特殊属性销售单价');
            return;
          }

          // 校验添加泵车单价
          if (this.pumpPriceList.length === 0) {
            this.$message.error('请添加泵车销售单价');
            return;
          }

          // 处理提交数据(添加商品价格、特殊属性、泵车单价)
          this.addProjectFrom.projectGoodsList = this.projectGoodsList.map(obj => {
            //更新提交数据值
            return {
              goodsId: obj.type, //商品id ,
              goodsName: obj.label, //商品名称 ,
              goodsPrice: obj.exclusiveTaxPurchasePrice, //不含税采购单价(元) ,
              goodsTax: obj.purchaseTaxPercent, // 采购税率 ,
              goodsTaxPrice: obj.inclusiveTaxPurchasePrice, //含税采购单价(元)
              goodsSalePrice: obj.exclusiveTaxSalePrice, //不含税销售单价
              goodsSaleTax: obj.saleTaxPercent, //销售税率
              goodsSaleTaxPrice: obj.inclusiveTaxSalePrice //含税销售税率
            };
          });
          this.addProjectFrom.specialAttrList = this.specialAttrList.map(obj => {
            return {
              attrValueId: obj.type, //属性值id
              attrValueName: obj.label, //属性值名称 ,
              attrPrice: obj.exclusiveTaxPurchasePrice, //不含税采购单价(元) ,
              attrTax: obj.purchaseTaxPercent, // 采购税率 ,
              attrTaxPrice: obj.inclusiveTaxPurchasePrice, //含税采购单价(元)
              attrSalePrice: obj.exclusiveTaxSalePrice, //不含税销售单价
              attrSaleTax: obj.saleTaxPercent, //销售税率
              attrSaleTaxPrice: obj.inclusiveTaxSalePrice //含税销售税率
            };
          });
          this.addProjectFrom.pumpPriceList = this.pumpPriceList.map(obj => {
            return {
              attrValueId: obj.type, //属性值id
              attrValueName: obj.label, //属性值名称 ,
              attrPrice: obj.exclusiveTaxPurchasePrice, //不含税采购单价(元) ,
              attrTax: obj.purchaseTaxPercent, // 采购税率 ,
              attrTaxPrice: obj.inclusiveTaxPurchasePrice, //含税采购单价(元)
              attrSalePrice: obj.exclusiveTaxSalePrice, //不含税销售单价
              attrSaleTax: obj.saleTaxPercent, //销售税率
              attrSaleTaxPrice: obj.inclusiveTaxSalePrice //含税销售税率
            };
          });

          // 提交表单数据
          let result = await axios.post(api.addProject, this.addProjectFrom);
          this.$message.success('新增成功');
          this.$router.push({ path: `/project/list/${this.addProjectFrom.contractSn}` });
        }
      });
    },
    valueToLabel(value, list) {
      if (value === null || value === undefined || value === '') return value;
      if (!Array.isArray(list)) return value;
      let item = list.filter(el => el.companyId.toString() === value.toString());
      if (item.length > 0) {
        return item[0].fullName || '';
      }
      return value;
    },
    onShowDialog(dailogType, row = {}) {
      // 初始化
      this.addOptions = [];
      this.addParamsFrom = {};
      this.isIndeterminate = false;
      this.checkAll = false;
      this.checkedList = [];

      // 切换dialog中options的值
      switch (dailogType) {
        case 'addTradePrice': // 添加商品单价
          this.addOptions = this.chooseGoodsOptions;
          // 设置选中项
          this.checkedList = this.projectGoodsList.map(item => {
            return item.type;
          });
          this.addDialog = { title: '添加商品', type: dailogType, visable: true };
          break;
        case 'addAttribute': // 添加特殊属性单价
          this.addOptions = this.chooseAttrOptions;
          // 设置选中项
          this.checkedList = this.specialAttrList.map(item => {
            return item.type;
          });
          this.addDialog = { title: '添加特殊属性', type: dailogType, visable: true };
          break;
        case 'addPumps': // 添加泵车单价
          this.addOptions = this.pumpsOptions;
          // 设置选中项
          this.checkedList = this.pumpPriceList.map(item => {
            return item.type;
          });
          this.addDialog = { title: '添加泵车', type: dailogType, visable: true };
          break;
      }
      this.handleCheckedChange(this.checkedList);
    },
    initDialog() {
      this.addOptions = [];
      this.addParamsFrom = {};
      this.addDialog = { title: '', type: '', visable: false };
      this.checkedList = [];
    },
    handleCancel() {
      this.initDialog();
    },
    handleAddSubmit() {
      let insertArray = [];
      let taxPercentObj = {};
      switch (this.addDialog.type) {
        case 'addTradePrice': // 添加商品单价
          insertArray = this.onGetInsertArray(this.chooseGoodsOptions);
          insertArray.forEach(item => {
            item.exclusiveTaxPurchasePriceEdit = false;
            item.purchaseTaxPercentEdit = false;
            item.exclusiveTaxSalePriceEdit = false;
            item.saleTaxPercentEdit = false;
            //采购税率
            item.purchaseTaxPercent = this.purchaseTaxPercent;
            //销售税率
            item.saleTaxPercent = this.saleTaxPercent;
          });
          //共有的数据不改变，没有的数据则予以新增
          this.projectGoodsList = this.getRealArray(this.projectGoodsList, insertArray);
          break;
        case 'addAttribute': // 添加特殊属性单价
          insertArray = this.onGetInsertArray(this.chooseAttrOptions);
          insertArray.forEach(item => {
            item.exclusiveTaxPurchasePriceEdit = false;
            item.purchaseTaxPercentEdit = false;
            item.exclusiveTaxSalePriceEdit = false;
            item.saleTaxPercentEdit = false;
            //采购税率
            item.purchaseTaxPercent = this.purchaseTaxPercent;
            //销售税率
            item.saleTaxPercent = this.saleTaxPercent;
          });
          this.specialAttrList = this.getRealArray(this.specialAttrList, insertArray);
          break;
        case 'addPumps': // 添加泵车单价
          insertArray = this.onGetInsertArray(this.pumpsOptions);
          insertArray.forEach(item => {
            item.exclusiveTaxPurchasePriceEdit = false;
            item.purchaseTaxPercentEdit = false;
            item.exclusiveTaxSalePriceEdit = false;
            item.saleTaxPercentEdit = false;
            //采购税率
            item.purchaseTaxPercent = this.purchaseTaxPercent;
            //销售税率
            item.saleTaxPercent = this.saleTaxPercent;
          });
          this.pumpPriceList = this.getRealArray(this.pumpPriceList, insertArray);
          break;
      }
      // 关闭dailog前初始化数据
      this.initDialog();
    },
    //格式化列表数据
    onGetInsertArray(typeToLabelArr) {
      let insertArray = this.checkedList.map(item => {
        return {
          type: item,
          label: this.typeToLabel(item, typeToLabelArr),
          exclusiveTaxPurchasePrice: 0,
          purchaseTaxPercent: 13,
          inclusiveTaxPurchasePrice: 0,
          exclusiveTaxSalePrice: 0,
          saleTaxPercent: 13,
          inclusiveTaxSalePrice: 0
        };
      });
      return insertArray;
    },
    typeToLabel(value, list) {
      if (value === null || value === undefined || value === '') return value;
      if (!Array.isArray(list)) return value;
      let item = list.filter(el => el.value.toString() === value.toString());
      if (item.length > 0) {
        return item[0].label || '';
      }
      return value;
    },
    //编辑表格
    handleEditItem(type, index, row) {
      switch (type) {
        case 'addTradePrice': // 添加商品单价
          this.projectGoodsList[index].priceEdit = true;
          break;
        case 'addAttribute': // 添加特殊属性单价
          this.specialAttrList[index].priceEdit = true;
          break;
        case 'addPumps': // 添加泵车单价
          this.pumpPriceList[index].priceEdit = true;
          break;
      }
    },
    // 行内编辑
    handleCellClick(type, row, column, cell, event) {
      switch (type) {
        //商品
        case 'addTradePrice':
          this.enableEdit(this.projectGoodsList, column, row);
          break;
        //特殊属性
        case 'addAttribute':
          this.enableEdit(this.specialAttrList, column, row);
          break;
        //泵车
        case 'addPumps':
          this.enableEdit(this.pumpPriceList, column, row);
          break;
      }
    },
    //使能编辑
    enableEdit(list, column, row) {
      const idx = list.indexOf(row);
      switch (column.property) {
        //不含税采购单价
        case 'exclusiveTaxPurchasePrice':
          row.exclusiveTaxPurchasePriceEdit = true;
          this.$nextTick(() => {
            this.$refs[`table-exclusiveTaxPurchasePrice${idx}`].focus();
          });
          break;
        //采购税率
        case 'purchaseTaxPercent':
          row.purchaseTaxPercentEdit = true;
          this.$nextTick(() => {
            this.$refs[`table-purchaseTaxPercent${idx}`].focus();
          });
          break;
        //不含税销售单价
        case 'exclusiveTaxSalePrice':
          row.exclusiveTaxSalePriceEdit = true;
          this.$nextTick(() => {
            this.$refs[`table-exclusiveTaxSalePrice${idx}`].focus();
          });
          break;
        //销售税率
        case 'saleTaxPercent':
          row.saleTaxPercentEdit = true;
          this.$nextTick(() => {
            this.$refs[`table-saleTaxPercent${idx}`].focus();
          });
          break;
      }
    },
    //
    onEditBlur(type, row, column) {
      switch (type) {
        case 'addTradePrice':
          this.updateList(this.projectGoodsList, row, column);
          break;
        case 'addAttribute':
          this.updateList(this.specialAttrList, row, column);
          break;
        case 'addPumps':
          this.updateList(this.pumpPriceList, row, column);
          break;
      }
    },
    //保存计算
    updateList(list, row, column) {
      switch (column) {
        case 'exclusiveTaxPurchasePrice':
          row.exclusiveTaxPurchasePriceEdit = false;
          //只需计算单行
          row.exclusiveTaxPurchasePrice = (+row.exclusiveTaxPurchasePrice || 0).toFixedNew(2);
          row.inclusiveTaxPurchasePrice = calc.multiply(
            calc.divide(row.purchaseTaxPercent, 100) + 1,
            row.exclusiveTaxPurchasePrice
          );
          row.inclusiveTaxPurchasePrice = (+row.inclusiveTaxPurchasePrice).toFixedNew(2);
          break;
        case 'purchaseTaxPercent':
          row.purchaseTaxPercentEdit = false;
          //同步采购税率
          this.purchaseTaxPercent = row.purchaseTaxPercent;
          this.updateAll('purchaseTaxPercent');
          break;
        case 'exclusiveTaxSalePrice':
          row.exclusiveTaxSalePriceEdit = false;
          //只需计算单行
          row.exclusiveTaxSalePrice = (+row.exclusiveTaxSalePrice || 0).toFixedNew(2);
          row.inclusiveTaxSalePrice = calc.multiply(
            calc.divide(row.saleTaxPercent, 100) + 1,
            row.exclusiveTaxSalePrice
          );
          row.inclusiveTaxSalePrice = (+row.inclusiveTaxSalePrice).toFixedNew(2);
          break;
        case 'saleTaxPercent':
          row.saleTaxPercentEdit = false;
          //同步销售税率
          this.saleTaxPercent = row.saleTaxPercent;
          this.updateAll('saleTaxPercent');
          break;
      }
    },
    //当税率变化时，变更所有
    updateAll(type) {
      let all = [this.projectGoodsList, this.specialAttrList, this.pumpPriceList];
      switch (type) {
        case 'purchaseTaxPercent':
          all.forEach(list => {
            //所有数据执行更新操作
            list = list.map(item => {
              //更新采购税率
              item.purchaseTaxPercent = (+this.purchaseTaxPercent || 0).toFixedNew(2);
              // 重新计算采购单价
              item.inclusiveTaxPurchasePrice = calc.multiply(
                calc.divide(item.purchaseTaxPercent, 100) + 1,
                item.exclusiveTaxPurchasePrice
              );
              item.inclusiveTaxPurchasePrice = (+item.inclusiveTaxPurchasePrice).toFixedNew(2);
            });
          });
          break;
        case 'saleTaxPercent':
          all.forEach(list => {
            //所有数据执行更新操作
            list = list.map(item => {
              //更新销售税率
              item.saleTaxPercent = (+this.saleTaxPercent || 0).toFixedNew(2);
              // 重新计算销售单价
              item.inclusiveTaxSalePrice = calc.multiply(
                calc.divide(item.saleTaxPercent, 100) + 1,
                item.exclusiveTaxSalePrice
              );
              item.inclusiveTaxSalePrice = (+item.inclusiveTaxSalePrice).toFixedNew(2);
            });
          });

          break;
      }
    },
    handleDeleteItem(type, index, row) {
      let option = { tips: '', list: [], index: null };
      switch (type) {
        case 'addTradePrice': // 添加商品单价
          option = { tips: '商品', list: this.projectGoodsList, index };
          break;
        case 'addAttribute': // 添加特殊属性单价
          option = { tips: '特殊属性', list: this.specialAttrList, index };
          break;
        case 'addPumps': // 添加泵车单价
          option = { tips: '泵车类型', list: this.pumpPriceList, index };
          break;
      }
      this.$confirm(`确定要删除此${option.tips}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.onDeleteArrayItem(option.list, option.index);
          this.$message.success('删除成功');
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消删除' });
        });
    },
    // 共同的数据则予以保留
    getRealArray(oldArray, newArray) {
      for (let i = 0; i < newArray.length; i++) {
        for (let j = 0; j < oldArray.length; j++) {
          if (newArray[i].type === oldArray[j].type) {
            newArray[i] = oldArray[j];
            break;
          }
        }
      }
      return newArray;
    },
    onJumpList() {
      this.$router.push({
        path: `/project/list`
      });
    },
    onDeleteArrayItem(arr, index) {
      arr.splice(index, 1);
    },
    handleCheckAllChange(val) {
      this.checkedList = val
        ? this.addOptions.map(item => {
            return item.value;
          })
        : [];
      this.isIndeterminate = false;
    },
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.addOptions.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.addOptions.length;
    },
    onWriteDemoData() {
      // 计划供应时间
      this.createTimeRange = [
        dayjs()
          .add(1, 'days')
          .format('YYYY-MM-DD'),
        dayjs()
          .add(7, 'days')
          .format('YYYY-MM-DD')
      ];
      this.addProjectFrom = {
        ...this.addProjectFrom,
        purchaserTrader: '测试采购商联系人', //采购商联系人
        purchaserTraderMobile: '13212312312', //采购商联系人电话
        supplierTrader: '测试供应商联系人', //供应商联系人
        supplierTraderMobile: '13512312312', //供应商联系人电话
        projectName: '测试项目名称', //项目名称
        validPeriod: '2', // 有效期
        projectStructure: '测试工程结构', // 工程结构
        number: '1000', //计划混凝土方量
        deliveryPlace: '到达地点', //到达地点
        contractSn: 'bh123456', // 采购合同编号,
        proxyMode: '1', //经纪人模式 否
        statementMode: '0', //结算方式
        timeLimit: '30', // 结算时间
        nextMonthPaymentScale: '50', //次月支付货款比例
        deliveryPayType: '1', //计费模式
        effectiveTime: dayjs()
          .add(1, 'days')
          .format('YYYY-MM-DD'), // 项目生效时间
        beginTime: dayjs()
          .add(1, 'days')
          .format('YYYY-MM-DD'),
        endTime: dayjs()
          .add(7, 'days')
          .format('YYYY-MM-DD')
        // taxRate: 13 //结算税率
      };
    }
  }
};
</script>

<style lang="postcss" scoped>
/* 新建合同 */
.addProtocl-content {
  .addProtocl-form-content {
    padding: 10px 0;
    .panels {
      .el-input {
        width: 180px;
      }
      .el-date-editor--daterange.el-input__inner {
        width: 230px;
      }
    }
  }
  .add-dialog {
    /* .check-label {
      margin-left: 0px;
    } */
    .el-input {
      width: 180px;
    }

    .el-checkbox-button {
      margin-bottom: 10px;
      margin-right: 15px !important;
      /deep/ &:first-child {
        .el-checkbox-button__inner {
          border-radius: 0;
        }
      }
      /deep/ &:last-child {
        .el-checkbox-button__inner {
          border-radius: 0;
        }
      }
    }
    .el-checkbox-button + .el-checkbox-button {
      border-left: 1px solid #dcdfe6 !important;
    }
  }
}
</style>
