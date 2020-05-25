<template>
  <div class="layout-content-list">
    <!-- 项目信息 -->
    <div class="segment">
      <div class="segment-header">关系信息</div>
      <div class="segment-area">
        <el-row>
          <el-col :span="8">
            <div class="segment-label">创建时间</div>
            <div class="segment-content">{{ chainInfo.gmtCreate | dateFormat('YYYY-MM-DD HH:mm:ss') }}</div>
          </el-col>
          <el-col :span="8">
            <div class="segment-label">采购合同编号</div>
            <div class="segment-content">{{ chainInfo.contractSn }}</div>
          </el-col>
          <el-col :span="8">
            <div class="segment-label">项目编号</div>
            <div class="segment-content">{{ chainInfo.projectSn }}</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 关系列表 -->
    <!--
        企业类型	    不含税货款比例	增值税率	其他税费税率	剩余开票额度	利润配置比例
        混凝土采购商	 -	             -	      -	           -	          -
        供应链	       -	             -	      -	           -	          -
        水泥供应商				                                    -	           -
        加工商				                                        -	           -
        承运商				                                         -	          -
        砂石供应商					                                                 -
        采购经纪人
        贸易经纪人
    -->

    <div class="item-header">关系列表</div>
    <el-table :data="chainInfo.proCompanyList || []" style="width: 100%" border>
      <el-table-column prop="companyType" label="企业类型" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.companyType | valueToLabel(companyTypeOptions) }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="companyName" label="企业名称" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="companyCode" label="企业编号" min-width="100" show-overflow-tooltip></el-table-column>
      <el-table-column
        prop="companyContactsName"
        label="交易员"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="companyContactsMobile"
        label="联系电话"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="settlementAccount"
        label="结算账户"
        min-width="100"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="paymentScale" label="不含税货款比例(%)" min-width="130" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.companyType === 'CONCRETE_PURCHASER' || scope.row.companyType === 'FIN'">-</span>
          <span v-else>{{ scope.row.paymentScale }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="valueAddedTax" label="增值税率(%)" min-width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.companyType === 'CONCRETE_PURCHASER' || scope.row.companyType === 'FIN'">-</span>
          <span v-else>{{ scope.row.valueAddedTax }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="otherTax" label="其他税费税率(%)" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.companyType === 'CONCRETE_PURCHASER' || scope.row.companyType === 'FIN'">-</span>
          <span v-else>{{ scope.row.otherTax }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remainLimitAmount" label="剩余开票额度(元)" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.companyType === 'SANDSTONE_SUPPLIER' || scope.row.companyType === 'AGENT'">
            {{ scope.row.remainLimitAmount | thousands }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="profitScale" label="利润配置比例(%)" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.companyType === 'AGENT'">{{ scope.row.profitScale }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" min-width="300">
        <template
          slot-scope="scope"
          v-if="scope.row.companyType !== 'FIN' && scope.row.companyType !== 'CONCRETE_PURCHASER'"
        >
          <!-- 项目初始化(INITIALIZE) 才可以【修改】、【设置结算比例】 -->
          <span v-if="chainInfo.projectStatus === 'INITIALIZE'">
            <span class="font-default pointer mr-10" @click="onShowAddChainDialog('update', scope.row)">修改</span>
            <span
              class="font-default pointer mr-10"
              @click="onSetSettlementPercent(scope.row)"
              v-if="scope.row.companyType !== 'TRADE_AGENT'"
              >设置结算比例</span
            >
          </span>

          <!-- 承运商不看协议&证件 -->
          <span v-if="scope.row.companyType !== 'CARRIER'">
            <span
              class="font-default pointer mr-10"
              v-if="scope.row.fileGroup.length > 0"
              @click="onShowProtocolViewer(scope.row)"
              >查看协议</span
            >
            <span class="font-default pointer mr-10" v-else @click="onShowUploadChainDialog(scope.row)">上传协议</span>

            <span class="font-default pointer mr-10" @click="onShowViewer(scope.row)">查看证件</span>
          </span>

          <!-- 项目生效后(EFFECTED) 才可以对【沙石供应商&经纪人是小规模纳税人】 操作【切换公司】、【查看历史商户】功能-->
          <span v-if="chainInfo.projectStatus === 'EFFECTED'">
            <span
              class="font-default pointer mr-10"
              v-if="scope.row.companyType === 'SANDSTONE_SUPPLIER' || scope.row.companyType === 'AGENT'"
              @click="onShowAddChainDialog('change', scope.row)"
              >切换公司</span
            >
            <span
              class="font-default pointer"
              v-if="scope.row.companyType === 'SANDSTONE_SUPPLIER' || scope.row.companyType === 'AGENT'"
              @click="onShowHistoryDialog(scope.row)"
              >查看历史商户</span
            >
          </span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 设置结算比例 -->
    <el-dialog title="设置结算比例" width="500px" center :visible.sync="addDialog.visable">
      <el-form
        :model="addParamsFrom"
        :rules="addParamsFromRules"
        :validate-on-rule-change="false"
        label-position="right"
        label-width="150px"
        ref="addParamsFrom"
      >
        <el-form-item label="商户类型">
          <el-select
            v-model="addDialog.type"
            clearable
            placeholder="请选择商户类型"
            :disabled="true"
            style="width:240px"
          >
            <el-option
              v-for="item in companyTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="不含税货款比例(%)" prop="paymentScale">
          <el-input
            v-model.trim="addParamsFrom.paymentScale"
            placeholder="请输入不含税货款比例"
            maxlength="30"
            clearable
            style="width:240px"
          ></el-input>
        </el-form-item>
        <!-- 只有【经纪人】商户类型，才需设置利润配置比例 -->
        <el-form-item v-if="addDialog.type === 'AGENT'" label="利润配置比例(%)" prop="profitScale">
          <el-input
            v-model.trim="addParamsFrom.profitScale"
            clearable
            placeholder="请输入利润配置比例"
            maxlength="30"
            style="width:240px"
          ></el-input>
        </el-form-item>
        <!-- 预付款模式，砂石、水泥、加工、采购经纪人的税率不能配置 -->
        <el-form-item label="增值税率(%)" prop="valueAddedTax">
          <el-input
            v-model.trim="addParamsFrom.valueAddedTax"
            clearable
            placeholder="请输入增值税率"
            maxlength="30"
            style="width:240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="其他税费税率(%)" prop="otherTax">
          <el-input
            v-model.trim="addParamsFrom.otherTax"
            clearable
            placeholder="请输入其他税费税率"
            maxlength="30"
            style="width:240px"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleAddSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增&切换关联企业 -->
    <el-dialog :title="addChainDialog.title" width="800px" center :visible.sync="addChainDialog.visible">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">商户类型</span>
          <el-select
            v-model="tableOptions.companyType"
            clearable
            placeholder="请选择商户类型"
            @change="handleChangeSearch"
            :disabled="isDisabled"
            style="width:140px"
          >
            <!-- 结算方式为月结的情况下，是不支持贸易经纪人 -->
            <el-option
              v-for="item in companyTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="
                item.value === 'CONCRETE_PURCHASER' ||
                  item.value === 'FIN' ||
                  (item.value === 'TRADE_AGENT' && statementMode === 1)
              "
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="carrier-dialog-content mb-10">
        <!-- 承运商列表 -->
        <template v-if="tableOptions.companyType === 'CARRIER'">
          <el-table :data="addCarrierTableData.list" border :key="1" @row-click="row => onAddChain(row)">
            <el-table-column
              label="承运商名称"
              prop="sjbCarrierName"
              min-width="200"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="联系人"
              prop="sjbCarrierContact"
              min-width="60"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="注册账号"
              prop="sjbCarrierPhone"
              min-width="90"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              label="联系地址"
              prop="sjbCarrierAddress"
              min-width="120"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="创建时间" prop="createTime" min-width="130" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{ scope.row.createTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="50">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.stop="onAddChain(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <!-- 其他商户类型列表 -->
        <template v-else>
          <el-table :data="addTableData.list" border :key="2" @row-click="row => onAddChain(row)">
            <el-table-column
              label="企业编号"
              prop="companyCode"
              min-width="100"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="商户名称" prop="fullName" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column label="剩余开票额度(元)" prop="remainLimitAmount" min-width="100">
              <template slot-scope="scope">
                <span>{{ scope.row.remainLimitAmount | thousands }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" min-width="130">
              <template slot-scope="scope">
                <span>{{ scope.row.createTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
              </template>
            </el-table-column>
            <el-table-column label="联系人" prop="contactPeople" min-width="60" show-overflow-tooltip></el-table-column>
            <el-table-column
              label="登录手机号"
              prop="loginAdminName"
              min-width="90"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column label="操作" min-width="50">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click.stop="onAddChain(scope.row)">选择</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </div>
      <el-pagination
        :page-size="pageSize"
        :current-page.sync="page"
        :total="tableOptions.companyType === 'CARRIER' ? addCarrierTableData.count : addTableData.count"
        @current-change="handleCurrentChange"
        layout="total, prev, pager, next, jumper"
      ></el-pagination>
    </el-dialog>
    <!-- 查看历史商户 -->
    <el-dialog title="查看历史商户" width="800px" center :visible.sync="historyVisible">
      <div class="toolbar-panel">
        <div class="toolbar-item">
          <span class="item-label">商户类型</span>
          <el-select
            v-model="historyOptions.companyType"
            clearable
            placeholder="请选择商户类型"
            @change="handleChangeHistorySearch"
            :disabled="true"
          >
            <el-option
              v-for="item in companyTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="mb-10">
        <el-table :data="historyTableData" border>
          <el-table-column label="企业编号" prop="companyCode" min-width="100" show-overflow-tooltip></el-table-column>
          <el-table-column label="商户名称" prop="companyName" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column label="切入时间" prop="inTime" min-width="130" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.inTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="切出时间" prop="outTime" min-width="130" show-overflow-tooltip>
            <template slot-scope="scope">
              <span>{{ scope.row.outTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="联系人"
            prop="companyContactsName"
            min-width="100"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            label="登录手机号"
            prop="companyContactsMobile"
            min-width="100"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 上传商户协议 -->
    <el-dialog
      :title="uploadChainCompanyDialog.title"
      width="600px"
      center
      :visible.sync="uploadChainCompanyDialog.visible"
    >
      <el-row>
        <el-col :span="4">
          <span>上传协议:</span>
        </el-col>
        <el-col :span="20">
          <img-upload-viewer ref="chainCompanyProtocol" viewerTitle="商户协议" :limit="10"></img-upload-viewer>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="onInitUploadChainDialog">取 消</el-button>
        <el-button type="primary" @click="onSubmitChainCompanyProtocol">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 商户证件 -->
    <fe-viewer ref="SANDSTONE_SUPPLIER" title="砂石供应商证件" :source="viewerSandstoneSupplierSource"></fe-viewer>
    <fe-viewer ref="AGENT" title="采购经纪人证件" :source="viewerAgentSource"></fe-viewer>
    <fe-viewer ref="TRADE_AGENT" title="贸易经纪人证件" :source="viewerTradeAgentSource"></fe-viewer>
    <fe-viewer ref="CEMENT_SUPPLIER" title="水泥供应商证件" :source="viewerCementSupplierSource"></fe-viewer>
    <fe-viewer ref="CONVERTER" title="加工商证件" :source="viewerConverterSource"></fe-viewer>
    <!-- 商户协议 -->
    <fe-viewer
      ref="SANDSTONE_SUPPLIER_PROTOCOL"
      title="砂石供应商协议"
      :source="sandstoneSupplierProtocolSource"
    ></fe-viewer>
    <fe-viewer ref="AGENT_PROTOCOL" title="采购经纪人协议" :source="agentProtocolSource"></fe-viewer>
    <fe-viewer ref="TRADE_AGENT_PROTOCOL" title="贸易经纪人协议" :source="tradeAgentProtocolSource"></fe-viewer>
    <fe-viewer ref="CEMENT_SUPPLIER_PROTOCOL" title="水泥供应商协议" :source="cementSupplierProtocolSource"></fe-viewer>
    <fe-viewer ref="CONVERTER_PROTOCOL" title="加工商协议" :source="converterProtocolSource"></fe-viewer>
  </div>
</template>

<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import listMixin from '@/utils/listMixin';
import utils from '@/utils/utils';
import Validator from '@/utils/Validator';
import { mapState, mapActions } from 'vuex';
import ImgUploadViewer from '@/components/ImgUploadViewer';
import calc from '@/utils/calc';

export default {
  mixins: [listMixin],
  components: {
    ImgUploadViewer
  },
  props: {
    projectId: {
      type: String,
      required: true,
      default: ''
    },
    //结算方式 0表示预付款 1表示月结
    statementMode: {
      required: true,
      default: ''
    }
  },

  data() {
    // 税率百分比验证
    var validateTaxPercent = (rule, value, callback) => {
      if (!Validator.number(value, false)) {
        callback(new Error(rule.message));
      }
      callback();
    };
    // 税率百分比验证(可以为0)
    var validateTaxPercentZero = (rule, value, callback) => {
      if (!Validator.number(value, true)) {
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
    return {
      addChainDialog: {
        visible: false,
        title: '新增关联企业'
      },
      addChainVisible: false,
      tableOptions: {
        companyType: ''
      },
      addTableData: {},
      addCarrierTableData: {},
      addDialog: {
        id: '',
        type: '',
        visable: false
      },
      addParamsFrom: {
        projectCompanyId: '', // 项目关联企业ID ,
        otherTax: '', // 其他税费税率 ,
        paymentScale: '', // 不含税货款比例
        valueAddedTax: '', // 增值税率
        profitScale: '' // 利润配置比例
      },
      addParamsFromRules: {
        otherTax: [
          { required: true, message: '请输入其他税费税率', trigger: 'blur' },
          { validator: validateTaxPercentZero, message: '请输入正确的其他税费税率，最多2位小数', trigger: 'blur' },
          { validator: validateTaxMax, message: '其他税费税率不能超过100%', trigger: 'blur' }
        ],
        paymentScale: [
          { required: true, message: '请输入不含税货款比例', trigger: 'blur' },
          { validator: validateTaxPercent, message: '请输入正确的不含税货款比例，最多2位小数', trigger: 'blur' },
          { validator: validateTaxMax, message: '不含税货款比例不能超过100%', trigger: 'blur' }
        ],
        valueAddedTax: [
          { required: true, message: '请输入增值税率', trigger: 'blur' },
          { validator: validateTaxPercentZero, message: '请输入正确的增值税率，最多2位小数', trigger: 'blur' },
          { validator: validateTaxMax, message: '增值税率不能超过100%', trigger: 'blur' }
        ],
        profitScale: [
          { required: true, message: '请输入利润配置比例', trigger: 'blur' },
          { validator: validateTaxPercentZero, message: '请输入正确的利润配置比例，最多2位小数', trigger: 'blur' },
          { validator: validateTaxMax, message: '利润配置比例不能超过100%', trigger: 'blur' }
        ]
      },

      historyVisible: false,
      historyOptions: {
        companyType: ''
      },
      historyTableData: [],
      isDisabled: false, // 控制关联企业弹窗的商户类型选择器
      currentAction: '', // 记录当前开启弹窗的操作（新增、修改、切换、历史）
      addParamsOptions: {
        type: ''
      },
      companyTypeOptions: [],
      chainInfo: {}, // 关系信息
      actionType: '', // action类型（切换公司，选择时用）
      switchCompanyOptions: {
        companyId: '', // newId
        projectCompanyId: '' // 项目关联商户ID
      }, // 切换公司入参
      hisTableOptions: {
        projectCompanyId: 0 // 项目关联商户ID
      },
      viewerSandstoneSupplierSource: [], //砂石供应商证件
      viewerAgentSource: [], //贸易经纪人证件
      viewerTradeAgentSource: [], //贸易经纪人证件
      viewerCementSupplierSource: [], //水泥供应商证件
      viewerConverterSource: [], // 加工商证件
      uploadChainCompanyDialog: {
        title: '', // 上传商户协议
        visible: false
      },
      fileGroup: [
        {
          fileType: '',
          fileName: '商户协议',
          operatorId: '',
          operatorName: '',
          fileInfo: [
            {
              filePath: ''
            }
          ]
        }
      ], //上传附件信息 ,
      uploadProjectCompanyId: '', // 上传商户协议的关联商户ID
      sandstoneSupplierProtocolSource: [], //砂石供应商协议
      agentProtocolSource: [], //采购经纪人协议
      tradeAgentProtocolSource: [], //贸易经纪人协议
      cementSupplierProtocolSource: [], //水泥供应商协议
      converterProtocolSource: [] // 加工商协议
    };
  },
  async created() {
    // 结算方式字典
    this.companyTypeArr = await utils.getSysDict('company_type');
    this.companyTypeOptions = [...this.companyTypeArr, { label: '承运商', value: 'CARRIER' }];
  },
  methods: {
    ...mapActions(['changeProjectStatus']),
    onSetSettlementPercent(row) {
      // 初始化
      this.addParamsFrom = {};
      this.addDialog = {
        id: row.id,
        type: row.companyType,
        visable: true
      };
      // 查找对应的商户类型数据
      let activeCompanyData = this.chainInfo.proCompanyList.filter(item => {
        return item.companyId === row.companyId;
      })[0];
      this.addParamsFrom = {
        projectCompanyId: activeCompanyData.id, // 项目关联企业ID ,
        otherTax: activeCompanyData.otherTax, // 其他税费税率 ,
        paymentScale: activeCompanyData.paymentScale, // 不含税货款比例
        valueAddedTax: activeCompanyData.valueAddedTax, // 增值税率
        profitScale: activeCompanyData.profitScale // 利润配置比例
      };
    },
    onShowAddChainDialog(action = '', row = {}) {
      this.currentAction = action;
      switch (action) {
        case 'add': // 新增关联企业
          this.addChainDialog.title = '新增关联企业';
          this.tableOptions.companyType = '';
          this.addTableData = {
            list: [],
            count: 0
          };
          this.isDisabled = false;
          break;
        case 'update': // 修改关联企业
          this.addChainDialog.title = '修改关联企业';
          this.isDisabled = true;
          this.tableOptions.companyType = row.companyType;
          this.handleChangeSearch();
          break;
        case 'change': // 切换公司
          this.addChainDialog.title = '切换关联企业';
          this.isDisabled = true;
          this.tableOptions.companyType = row.companyType;
          // 缓存action类型，当前公司id
          this.actionType = 'change';
          this.switchCompanyOptions.projectCompanyId = row.id;
          this.handleChangeSearch();
          break;
      }
      this.addChainDialog.visible = true;
    },
    handleChangeSearch() {
      if (!this.tableOptions.companyType) return;
      this.handleSearch();
    },

    async fetchData(opts) {
      const options = { page: this.page, pageSize: this.pageSize, ...this.sendOptions, ...opts };
      let result = {};
      if (this.tableOptions.companyType === 'CARRIER') {
        result = await axios.post(api.querySjbCarrierList, {
          page: this.page,
          pageSize: this.pageSize,
          fullName: ''
        });
        this.addCarrierTableData = result.data || {};
      } else {
        result = await axios.post(api.companyList, options);
        this.addTableData = result.data || {};
      }
    },
    async onAddChain(row) {
      let options = {},
        path = '';
      if (this.tableOptions.companyType === 'CARRIER') {
        options = { companyId: row.companyCarrierId, projectId: this.projectId, companyType: 'CARRIER' };
        path = api.buildProjectRelation;
      } else {
        if (this.actionType === 'change') {
          this.switchCompanyOptions.companyId = row.companyId; // 切换公司companyId
          options = this.switchCompanyOptions;
          path = api.projectSwitchCompany; // 切换公司
        } else {
          options = { companyId: row.companyId, projectId: this.projectId };
          path = api.buildProjectRelation;
        }
      }
      await axios.post(path, options);
      this.$message.success('关联成功');
      this.addChainDialog.visible = false;
      // 刷新关联关系列表
      this.handleChainData();
    },
    initDialog() {
      this.addOptions = [];
      this.addParamsFrom = {};
      this.addDialog = {
        id: '',
        type: '',
        visable: false
      };
    },
    //结算方式为预付款模式下，预付款模式，砂石、水泥、加工、采购经纪人的税率不能配置
    isDisableTax(type) {
      return (
        this.statementMode === 0 &&
        (type === 'CEMENT_SUPPLIER' || type === 'SANDSTONE_SUPPLIER' || type === 'CONVERTER' || type === 'AGENT')
      );
    },
    handleCancel() {
      this.initDialog();
    },
    async handleAddSubmit() {
      this.$refs.addParamsFrom.validate(async valid => {
        if (valid) {
          // 提交
          this.addParamsFrom.projectCompanyId = this.addDialog.id;
          await axios.post(api.setPaymentScale, this.addParamsFrom);
          // 关闭dialog
          this.initDialog();
          // 更新对应列表
          this.handleChainData();
        }
      });
    },
    // 确认项目生效
    async handleTakeEffectChain() {
      // 判断5家商户的“不含税货款比例”的和是否为100%
      let hasPass = this.onCheckPaymentScale();
      if (!hasPass) {
        return;
      }
      // 触发项目生效
      await axios.post(api.confirmProjectEnable, {
        projectId: this.projectId,
        version: this.chainInfo.version
      });
      // 更新对应列表
      this.handleChainData();
    },
    onCheckPaymentScale() {
      let proCompanyList = this.chainInfo.proCompanyList || [];
      // 6家供应链商户+2家合同商户(采购商+供应商)
      if (this.statementMode === 0 && proCompanyList.length !== 8) {
        //预付款模式下，需要额外绑定贸易经纪人
        this.$message.error('请先关联完供应链关系');
        return false;
      } else if (this.statementMode === 1 && proCompanyList.length !== 7) {
        //月结模式
        this.$message.error('请先关联完供应链关系');
        return false;
      }
      // 供应链关系配置完后，判断5家商户的“不含税货款比例”的和
      let sum = 0;
      proCompanyList.forEach(item => {
        if (typeof item.paymentScale === 'number' && !isNaN(item.paymentScale)) {
          sum = calc.add(sum, item.paymentScale);
        } else {
          return false;
        }
      });
      if (sum !== 100) {
        this.$message.error('5家商户的不含税货款比例不是100%，请确认。');
        return false;
      }
      return true;
    },
    // 完成项目
    async handleCompleteProject() {
      await axios.post(api.projectCompleteProject, {
        projectId: this.projectId,
        version: this.chainInfo.version
      });
      // 更新对应列表
      this.handleChainData();
    },
    // 终止项目
    async handleCloseProject() {
      await axios.post(api.projectCloseProject, {
        projectId: this.projectId,
        version: this.chainInfo.version
      });
      // 更新对应列表
      this.handleChainData();
    },
    // 历史商户
    onShowHistoryDialog(row) {
      // 初始化
      this.historyTableData = [];
      this.historyOptions.companyType = row.companyType;
      this.hisTableOptions.projectCompanyId = row.id;
      this.historyVisible = true;
      this.handleChangeHistorySearch();
    },
    // 查看商户证件
    async onShowViewer(row) {
      let fileList = await utils.queryCompanyFileList([row.companyId]);
      fileList = fileList[0];
      switch (row.companyType) {
        case 'SANDSTONE_SUPPLIER': //砂石供应商证件
          this.viewerSandstoneSupplierSource = fileList;
          break;
        case 'AGENT': //采购经纪人证件
          this.viewerAgentSource = fileList;
          break;
        case 'TRADE_AGENT': //贸易经纪人证件
          this.viewerTradeAgentSource = fileList;
          break;
        case 'CEMENT_SUPPLIER': //水泥供应商证件
          this.viewerCementSupplierSource = fileList;
          break;
        case 'CONVERTER': // 加工商证件
          this.viewerConverterSource = fileList;
          break;
        default:
          return;
      }
      this.$nextTick(() => {
        this.$refs[row.companyType].show();
      });
    },
    handleChangeHistorySearch() {
      if (!this.historyOptions.companyType) return;

      this.onGetHistoryData();
    },
    async onGetHistoryData() {
      const options = this.hisTableOptions;
      let result = await axios.post(api.projectHisCompany, options);
      this.historyTableData = result.data || [];
    },
    async handleChainData() {
      let result = await axios.post(api.projectRelationDetail, { projectId: this.projectId });
      // 关系列表
      this.chainInfo = result.data;
      // 缓存项目状态到store
      this.changeProjectStatus(this.chainInfo.projectStatus || '');
    },
    onShowUploadChainDialog(row) {
      switch (row.companyType) {
        case 'SANDSTONE_SUPPLIER': //砂石供应商证件
          this.uploadChainCompanyDialog.title = '上传【砂石供应商】商户协议';
          break;
        case 'AGENT': //经纪人证件
          this.uploadChainCompanyDialog.title = '上传【经纪人】商户协议';
          break;
        case 'CEMENT_SUPPLIER': //水泥供应商证件
          this.uploadChainCompanyDialog.title = '上传【水泥供应商】商户协议';
          break;
        case 'CONVERTER': // 加工商证件
          this.uploadChainCompanyDialog.title = '上传【加工商】商户协议';
          break;
      }
      this.uploadChainCompanyDialog.visible = true;
      // 缓存当前上传商户id
      this.uploadProjectCompanyId = row.id;
    },
    async onSubmitChainCompanyProtocol() {
      // 处理上传商户协议图片
      const AgreementList = this.$refs.chainCompanyProtocol.getUploadFiles() || [];
      if (AgreementList.length === 0) {
        this.$message.error('请先上传商户协议');
        return;
      }
      const fileInfo = AgreementList.map(item => {
        return { filePath: item };
      });
      this.fileGroup[0].fileInfo = fileInfo;

      await axios.post(api.projectUploadFile, {
        fileGroup: this.fileGroup,
        projectCompanyId: this.uploadProjectCompanyId
      });
      // 初始化上传dialog
      this.onInitUploadChainDialog();
      // 刷新关联关系列表
      this.handleChainData();
    },
    onInitUploadChainDialog() {
      this.$refs.chainCompanyProtocol.clearImgFileList(); // 清空缓存的图片
      this.uploadProjectCompanyId = '';
      this.uploadChainCompanyDialog = { title: '', visible: false };
    },
    // 查看商户协议
    async onShowProtocolViewer(row) {
      let fileGroupRes = await axios.post(api.projectViewCompanyFile, { bizId: row.id });
      fileGroupRes = fileGroupRes.data || [];
      let fileList = fileGroupRes.map(el => {
        return { url: el.filePath || '', title: el.fileName || '' };
      });
      switch (row.companyType) {
        case 'SANDSTONE_SUPPLIER': //砂石供应商协议
          this.sandstoneSupplierProtocolSource = fileList;
          break;
        case 'AGENT': //采购经纪人协议
          this.agentProtocolSource = fileList;
          break;
        case 'TRADE_AGENT': //贸易经纪人协议
          this.tradeAgentProtocolSource = fileList;
          break;
        case 'CEMENT_SUPPLIER': //水泥供应商协议
          this.cementSupplierProtocolSource = fileList;
          break;
        case 'CONVERTER': // 加工商协议
          this.converterProtocolSource = fileList;
          break;
      }

      this.$nextTick(() => {
        this.$refs[`${row.companyType}_PROTOCOL`].show();
      });
    }
  },
  watch: {
    projectId(newValue, oldValue) {
      this.handleChainData();
    }
  }
};
</script>
