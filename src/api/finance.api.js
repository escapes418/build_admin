import baseApi from './base.api';

const baseURL = baseApi.baseURL;
let api = { ...baseApi };

/* ----------设置模块---------- */

// 签约信息列表
api.queryFinOpenEbankApplyPage = baseURL + '/openEbankApply/queryFinOpenEbankApplyPage';

// 交易数据-查询充值充正列表 post
api.queryMaintainApprove = baseURL + '/maintainApprove/queryMaintainApprove';
// 云章合同文档列表 POST
// 签章管理-云章合同文档列表 POST
api.queryFinCloudSignContractLimit = baseURL + '/cloudSign/queryFinCloudSignContractLimit';
// 签章管理-云章合同模板列表 POST
api.queryFinCloudSignTemplateLimit = baseURL + '/cloudSign/queryFinCloudSignTemplateLimit';
// 订单结算报表
api.selectProtocolOrderSettlementList = baseURL + '/tradeProtocolOrder/selectProtocolOrderSettlementList';
// 订单结算报表-导出
api.selectProtocolOrderSettlementListExport = baseURL + '/download/selectProtocolOrderSettlementListExport';
// 运单结算报表
api.queryProtocolWaybill = baseURL + '/tradeProtocolOrder/queryProtocolWaybill';
// 运单结算报表-导出
api.wayBillListExport = baseURL + '/download/wayBillListExport';
// 发票管理- 待开票运单 列表
api.pendingTaxProtocol = baseURL + '/tax/pendingTaxProtocol';
// 发票管理- 发票登记 列表
api.taxApplyFlow = baseURL + '/tax/taxApplyFlow';
// 发票管理- 发票登记-开票信息 发票编辑查询
api.taxTicketQuery = baseURL + '/tax/taxTicketQuery';
// 发票管理- 发票登记-发票登记保存
api.saveTaxTicket = baseURL + '/tax/saveTaxTicket';
// 发票管理- 发票登记-发票详情
api.taxTicketDetail = baseURL + '/tax/taxTicketDetail';
// 发票管理- 发票列表 post
api.taxTicket = baseURL + '/tax/taxTicket';

// 发票管理- 发票订单列表 get
api.taxTicketOrder = baseURL + '/tax/taxTicketOrder';
// 发票管理- 发票运单列表 post
api.taxTicketWaybill = baseURL + '/tax/taxTicketWaybill';
// 发票管理- 待开票运单导出
api.pendingTaxProtocolExcel = baseURL + '/tax/pendingTaxProtocolExcel';
// 发票管理- 发票登记-发票驳回
api.rejectTaxApplyFlow = baseURL + '/tax/rejectTaxApplyFlow';
// 发票管理- 发票登记-运单分票导入
api.taxExcelImport = baseURL + '/tax/taxExcelImport';
// 发票管理- 发票登记-发票同步
api.sysTaxWaybill = baseURL + '/tax/sysTaxWaybill';
// 查询预付款列表
api.queryAdvancePaymentList = baseURL + '/advance/queryAdvancePaymentList';
// 预付款退款
api.refundAdvancePayment = baseURL + '/advance/refundAdvancePayment';
// 预付款-电子承兑列表
api.queryVoucherList = baseURL + '/advance/queryVoucherList';
// 电子承兑-上账
api.booking = baseURL + '/advance/booking';
// 电子承兑-上传付款单据
api.updateVoucherSendUrl = baseURL + '/advance/updateVoucherSendUrl';
// 电子承兑-取消上账
api.cancelBooking = baseURL + '/advance/cancelBooking';

//--------------------资金明细------------------------
// 外部账户资金变动 查询外部账户资金变动列表
api.queryAccountChangePage = baseURL + '/fundsDetail/queryAccountChangePage';
// 支付订单管理 查询支付订单列表
api.queryPaymentPage = baseURL + '/fundsDetail/queryPaymentPage';
// 查询支付订单详情
api.queryPaymentDetail = baseURL + '/fundsDetail/queryPaymentDetail';
// 补偿支付订单
api.compensateOrderPay = baseURL + '/payOrder/compensateOrderPay';

// 交易流水管理 查询交易流水列表
api.queryTransFlowPage = baseURL + '/fundsDetail/queryTransFlowPage';
// 查询交易流水详情
api.queryTransFlowDetail = baseURL + '/fundsDetail/queryTransFlowDetail';
//获取结算单ID
api.statementView = baseURL + '/statement/view';

// 查询账户信息列表
api.queryFinanceAccountPage = baseURL + '/signBankApply/queryFinanceAccountPage';
// 查询银行卡信息GET
api.queryBankList = baseURL + '/signBankApply/queryBankList';
// 签约信息GET
api.singBankApplyInfo = baseURL + '/signBankApply/singBankApplyInfo';
// 新增签约信息post
api.saveBankApply = baseURL + '/signBankApply/saveBankApply';

//充值列表
api.queryRechargePage = baseURL + '/fundsDetail/queryRechargePage';
//添加充值凭证
api.chargeVoucherUpload = baseURL + '/fundsDetail/chargeVoucherUpload';
//修改充值凭证
api.changeChargeVoucher = baseURL + '/fundsDetail/changeChargeVoucher';

// 提现管理
api.queryWithdrawalPage = baseURL + '/payOrder/queryWithdrawalPage';
//提现结果确认
api.withdrawalFailOrSuccess = baseURL + '/payOrder/withdrawalFailOrSuccess';

//查询付款方企业名称
api.queryCompanyTypeList = baseURL + '/company/queryCompanyTypeList';

export default api;
