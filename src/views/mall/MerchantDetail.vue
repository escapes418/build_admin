<template>
  <layout navActive="mall">
    <div>
      <el-breadcrumb separator=">">
        <el-breadcrumb-item>供应链管理</el-breadcrumb-item>
        <el-breadcrumb-item v-if="type === 'FIN'" to="/merchant/fin/list">平台公司管理</el-breadcrumb-item>
        <el-breadcrumb-item v-else to="/merchant/list">供应链商户管理</el-breadcrumb-item>
        <el-breadcrumb-item>商户详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="detail-hander-panel">
        <div class="detail-hander-content">
          <span class="font-label">商户编号：</span>
          <span class="font-default">{{ detailData.companyCode }}</span>
          <span class="font-label ml-40">商户名称：</span>
          <span class="font-default">{{ detailData.fullName }}</span>
          <!-- 平台公司隐藏 -->
          <template v-if="type!=='FIN'">
            <span class="font-label ml-40">商户状态：</span>
            <span v-if="detailData.isDisable" class="font-red">已停用</span>
            <span v-else class="font-green">已启用</span>
          </template>
        </div>
        <div class="detail-hander-toolbtn">
          <!-- 平台公司隐藏 -->
          <template v-if="type!=='FIN'">
            <el-button v-if="detailData.isDisable" type="primary" @click="onChangeDisable(false)">启用</el-button>
            <el-button v-else type="primary" @click="onChangeDisable(true)">停用</el-button>
          </template>
          <el-button class="ml-10" @click="onJumpBack">返回列表</el-button>
        </div>
      </div>
      <!-- 商户信息 -->
      <div class="segment">
        <div class="segment-header">商户信息</div>
        <div class="segment-area flex-area" :span="3">
          <div class="segment-item">
            <div class="segment-label">商户类型</div>
            <div class="segment-content">{{ detailData.companyTypeValue }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">社会统一信用代码</div>
            <div class="segment-content">
              <span>{{ detailData.socialCreditCode }}</span>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">法人姓名</div>
            <div
              class="segment-content"
              :title="detailData.legalPersonName"
            >{{ detailData.legalPersonName }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">法人身份证号</div>
            <div class="segment-content">
              <span>{{ detailData.legalPersionIdentity }}</span>
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">企业联系地址</div>
            <div class="segment-content">{{ detailData.contactAddress }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">企业电话</div>
            <div class="segment-content">{{ detailData.loginAdminName }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">企业联系人</div>
            <div class="segment-content">{{ detailData.contactPeople }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">联系人手机号</div>
            <div class="segment-content">{{ detailData.contactNumber }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">联系人电子邮箱</div>
            <div class="segment-content">{{ detailData.email }}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">营业执照有效期</div>
            <div class="segment-content">
              {{ detailData.licenseStartTime | dateFormat('YYYY-MM-DD') }} 至
              {{ detailData.licenseEndTime | dateFormat('YYYY-MM-DD') }}
            </div>
          </div>
          <div class="segment-item">
            <div class="segment-label">纳税人类型</div>
            <div
              class="segment-content"
            >{{ detailData.taxpayerType | valueToLabel(taxpayerTypeOptions) }}</div>
          </div>
          <div class="segment-item haslink">
            <div class="segment-label">企业证件</div>
            <div class="segment-content">
              <el-button type="text" @click="onShowCompanyCert">查看证件</el-button>
            </div>
          </div>
        </div>
      </div>
      <!-- 结算信息 -->
      <div class="segment">
        <div class="segment-header">结算信息</div>
        <div class="segment-area flex-area" :span="2">
          <div class="segment-item">
            <div class="segment-label">结算账户开户名</div>
            <div class="segment-content">{{detailData.bankAccount}}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">结算银行账号</div>
            <div class="segment-content">{{detailData.cardNo}}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">开户银行联行号</div>
            <div class="segment-content">{{detailData.bank}}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">开户银行名称</div>
            <div class="segment-content">{{detailData.bankName}}</div>
          </div>
        </div>
      </div>
      <!-- 开票额度 -->
      <!-- 小规模纳税人可见 -->
      <div class="segment" v-if="detailData.taxpayerType === 20">
        <div class="segment-header">开票额度</div>
        <div class="segment-area flex-area" :span="2">
          <div class="segment-item">
            <div class="segment-label">已开票额度(元)</div>
            <div class="segment-content">{{detailData.hadInvoice}}</div>
          </div>
          <div class="segment-item">
            <div class="segment-label">剩余开票额度(元)</div>
            <div class="segment-content">{{detailData.remainLimit}}</div>
          </div>
        </div>
      </div>
      <fe-viewer ref="companyCertViewer" title="企业证件" :source="companyCertList"></fe-viewer>
    </div>
  </layout>
</template>
<script>
import axios from '@/utils/axios';
import api from '@/api/mall.api';
import utils from '@/utils/utils';

export default {
  data: function() {
    return {
      type: '',
      companyId: '',
      companyCertList: [],
      detailData: {},
      taxpayerTypeOptions: []
    };
  },
  async created() {
    this.companyId = this.$route.params.companyId;

    this.taxpayerTypeOptions = await utils.getSysDict('taxpayer_type');

    let detailData = await axios.get(api.queryCompayDetailById, {
      params: { companyId: this.$route.params.companyId }
    });

    // 商户类型
    this.type = detailData.data.companyType;
    this.detailData = detailData.data;

    // 查询企业证件
    const fileList = await utils.queryCompanyFileList([this.companyId]);
    this.companyCertList = fileList[0];
  },
  methods: {
    onJumpBack() {
      let path = '/merchant/list';
      if (this.type === 'FIN') path = '/merchant/fin/list';
      this.$router.push({ path: path });
    },
    // 企业证件
    async onShowCompanyCert() {
      this.$nextTick(() => {
        this.$refs.companyCertViewer.show();
      });
    },
    onChangeDisable(val) {
      let content = val ? '确定要停用此供应链商户吗？' : '确定要启用此供应链商户吗？';
      this.$confirm(content, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await axios.get(api.forbidLogin, {
          params: { companyId: this.companyId, disable: val }
        });
        this.detailData.isDisable = val;
      });
    }
  }
};
</script>
