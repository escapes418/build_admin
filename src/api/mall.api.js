import baseApi from './base.api';

const baseURL = baseApi.baseURL;
let api = { ...baseApi };

/* ----------筑链社商城---------- */

// 合同列表
api.selectBopProtocolList = baseURL + '/tradeProtocolOrder/selectBopProtocolList';
// 合同详情
api.selectBopProtocolDetail = baseURL + '/tradeProtocolOrder/selectBopProtocolDetail';
// 合同日志
api.selectProjectLogList = baseURL + '/tradeProtocolOrder/selectProjectLogList';
// 待确认订单列表
api.queryBopProtocolOrderList = baseURL + '/tradeProtocolOrder/queryBopProtocolOrderList';
// 待确认订单详情
api.queryBopProtocolOrderDtail = baseURL + '/tradeProtocolOrder/queryBopProtocolOrderDtail';
// 确认订单
api.confirmCarrier = baseURL + '/tradeProtocolOrder/confirmCarrier';
// 关闭订单
api.finClose = baseURL + '/tradeProtocolOrder/finClose';
// 查询物流公司
api.queryFullName = baseURL + '/tradeProtocolOrder/queryFullName';
// 查询煤款流向的供应链账户信息
api.getAcctExternalByUserCode = baseURL + '/acctExternalChgInfo/getAcctExternalByUserCode';
// 查询煤款流向的收购点账户信息
api.queryBdCoalMineAccout = baseURL + '/tradeProtocolOrder/queryBdCoalMineAccout';
// 查询审核日志
api.selectGoodsAuditList = baseURL + '/tradeGoods/selectGoodsAuditList';

// 运单列表
api.selectProtocolOrderWaybillBopList = baseURL + '/tradeProtocolOrder/selectProtocolOrderWaybillBopList';
// 运单详情
api.selectProtocolOrderWaybillBopDetail = baseURL + '/tradeProtocolOrder/selectProtocolOrderWaybillBopDetail';
// 运单轨迹
api.selectHisLocation = baseURL + '/tradeProtocolOrder/selectHisLocation';

// 查询商户已关联的收购点列表
api.selectCompanyCoalMineList = baseURL + '/trade/selectCompanyCoalMineList';
// 查询未关联的收购点列表
api.selectNotCompanyCoalMineList = baseURL + '/trade/selectNotCompanyCoalMineList';
// 商户新增收购点关联
api.saveCompanyCoalMine = baseURL + '/trade/saveCompanyCoalMine';

// 查询经纪人已关联的供应链列表
api.selectCompanyRelation = baseURL + '/trade/selectCompanyRelation';
// 查询经纪人未关联的供应链列表
api.selectNotCompanyRelation = baseURL + '/trade/selectNotCompanyRelation';
// 经纪人新增供应链关联关系
api.saveCompanyRelationship = baseURL + '/trade/saveCompanyRelationship';

// 商户删除关联关系
api.deleteCompanyCoalMine = baseURL + '/trade/deleteCompanyCoalMine';

// 贸易公司列表
api.companyList = baseURL + '/trade/companyList';

// 审核商品
api.goodsAudit = baseURL + '/tradeGoods/audit';
// 商品详情
api.goodsFindDetail = baseURL + '/tradeGoods/findDetail';
// 商品矿发煤价列表
api.selectGoodsMinePrice = baseURL + '/tradeGoods/selectGoodsMinePrice';
// 新增商品矿发煤价
api.saveGoodsMinePrice = baseURL + '/tradeGoods/saveGoodsMinePrice';

// 收购点列表 全部
api.selectCoalMineList = baseURL + '/tradeBdCoalMine/selectCoalMineList';
// 收购点详情
api.selectCoalMineDetail = baseURL + '/tradeBdCoalMine/selectCoalMineDetail';
// 查询供应链已关联收购点列表
api.selectCompanyCoalMineRealtionList = baseURL + '/trade/selectCompanyCoalMineRealtionList';
// 查询供应链未关联收购点列表
api.selectNotCompanyCoalMineRealtionList = baseURL + '/trade/selectNotCompanyCoalMineRealtionList';

// 收购点基础数据新增
api.addCoalmineAccount = baseURL + '/tradeBdCoalMine/saveBdCoalMine';
// 收购点基础数据修改
api.editCoalmineAccount = baseURL + '/tradeBdCoalMine/updateBdCoalMine';
// 收购点数据禁用或启用
api.disableBdCoalMine = baseURL + '/tradeBdCoalMine/disableBdCoalMine';
// 查询收购点账户
api.selectBdCoalMineAccountList = baseURL + '/tradeBdCoalMine/selectBdCoalMineAccountList';
// 新增收购点账号
api.saveBdCoalMineAccount = baseURL + '/tradeBdCoalMine/saveBdCoalMineAccount';
// 收购点状态修改
api.updateBdCoalMineAccountStatus = baseURL + '/tradeBdCoalMine/updateBdCoalMineAccountStatus';
// 优惠价配置查询
api.getCompanyValidConfig = baseURL + '/trade/getCompanyValidConfig';
// 优惠价配置新增
api.saveCompanyValidConfig = baseURL + '/trade/saveCompanyValidConfig';
// 优惠价配置公司查询
api.selectCompanyValidConfig = baseURL + '/trade/selectCompanyValidConfig';

// 订单余额退款查询
api.displayRefundPay = baseURL + '/tradeProtocolOrder/displayRefundPay';
// 订单余额退款支付
api.refundPay = baseURL + '/tradeProtocolOrder/refundPay';

// 查询运营运单详情
api.selectProtocolOrderWaybillDetail = baseURL + '/tradeProtocolOrder/selectProtocolOrderWaybillDetail';

// 查询运单凭证
api.selectVoucherList = baseURL + '/tradeProtocolOrder/selectVoucherList';
// 运单详情 银行回单
api.selectRecordRealUrl = baseURL + '/tradeProtocolOrder/selectRecordRealUrl';

// 运单凭证添加/修改
api.saveVoucher = baseURL + '/tradeProtocolOrder/saveVoucher';

// 商品基础信息列表
api.queryGoodsBaseList = baseURL + '/tradeGoods/queryGoodsBaseList';
// 商品基础信息详情
api.getGoodsBaseDetail = baseURL + '/tradeGoods/getGoodsBaseDetail';
// 商品基础信息新增
api.saveGoodsBase = baseURL + '/tradeGoods/saveGoodsBase';
// 商品基础信息修改
api.updateGoodsBase = baseURL + '/tradeGoods/updateGoodsBase';
// 商品基础信息-更新说明
api.updateGoodsBaseNorm = baseURL + '/tradeGoods/updateGoodsBaseNorm';
// 商品基础信息 状态:启用/停用
api.updateGoodsBaseStatus = baseURL + '/tradeGoods/updateGoodsBaseStatus';
// 查询企业运价结算公式
api.queryCompanySettlement = baseURL + '/company/queryCompanySettlement';
// 保存企业运价结算公式
api.saveCompanySettlement = baseURL + '/company/saveCompanySettlement';

// 供应链提现出金
api.finWithdraw = baseURL + '/trade/finWithdraw';
// 贸易商添加
api.saveCompanyConfig = baseURL + '/trade/saveCompanyConfig';

// 商城菜单  删除菜单信息
api.deleteMenuInfo = baseURL + '/tradeMenu/delete';
// 商城菜单  查询菜单信息
api.queryAllTradeMenu = baseURL + '/tradeMenu/queryAll';
// 商城菜单  查询菜单树信息
api.queryAllMenuListTree = baseURL + '/tradeMenu/queryAllTree';
// 商城菜单  查询菜单信息
api.queryMenuDetailForId = baseURL + '/tradeMenu/queryMenuDetailForId';
// 商城菜单  保存菜单信息
api.saveMenuInfo = baseURL + '/tradeMenu/save';

// -------------------项目管理-------------------
// 交易管理-项目管理-新增项目
api.addProject = baseURL + '/project/addProject';
// 交易管理-项目管理-查看项目特殊属性（泵送）单价
api.attrPrice = baseURL + '/project/attrPrice';
// 交易管理-项目管理-查询类型企业列表
api.queryCompanyTypeList = baseURL + '/company/queryCompanyTypeList';
// 交易管理-项目管理-选择属性/泵车
api.chooseAttr = baseURL + '/project/chooseAttr';
// 交易管理-项目管理-选择商品
api.chooseGoods = baseURL + '/project/chooseGoods';
// 交易管理-项目管理-项目列表
api.projectList = baseURL + '/project/projectList';
// 交易管理-项目管理-项目详情
api.projectDetail = baseURL + '/project/detail';
// 交易管理-项目管理-新增（修改）关联企业
api.buildProjectRelation = baseURL + '/project/buildProjectRelation';
// 交易管理-项目管理-供应链关系详情
api.projectRelationDetail = baseURL + '/project/projectRelationDetail';
// 交易管理-项目管理-查看项目商品单价
api.goodPrice = baseURL + '/project/goodPrice';
// 交易管理-项目管理-设置结算比例
api.setPaymentScale = baseURL + '/project/setPaymentScale';
// 交易管理-项目管理-确认项目生效
api.confirmProjectEnable = baseURL + '/project/confirmProjectEnable';
// 交易管理-项目管理-项目日志
api.projectLogList = baseURL + '/project/logList';
// 交易管理-项目管理-终止项目
api.projectCloseProject = baseURL + '/project/closeProject';
// 交易管理-项目管理-切换公司
api.projectSwitchCompany = baseURL + '/project/switchCompany';
// 交易管理-项目管理-查看历史商户
api.projectHisCompany = baseURL + '/project/hisCompany';
// 交易管理-项目管理-查看商户协议
api.projectViewCompanyFile = baseURL + '/project/viewCompanyFile';
// 交易管理-项目管理-项目完工
api.projectCompleteProject = baseURL + '/project/completeProject';
// 交易管理-项目管理-合同日志-查看调价对照表
api.viewProjectPriceList = baseURL + '/project/viewProjectPriceList';
// 交易管理-项目管理-上传协议
api.projectUploadFile = baseURL + '/project/uploadFile';

// -------------------商品管理-------------------
// 商品列表
api.queryGoodsList = baseURL + '/goods/queryGoodsList';
// 保存商品
api.saveGoodsSpu = baseURL + '/goods/saveGoodsSpu';
//商品属性列表
api.queryAttrList = baseURL + '/goods/queryAttrList';
//保存商品属性
api.saveAttrValue = baseURL + '/goods/saveAttrValue';
//查询商品属性类型
api.getTypeList = baseURL + '/goods/getTypeList';

// -------------------供应链管理-------------------
// 商户列表
api.companyList = baseURL + '/trade/companyList';
//查询账户余额
api.queryMoneyAvailable = baseURL + '/payOrder/queryMoneyAvailable';
//提现
api.cashWithdrawal = baseURL + '/payOrder/cashWithdrawal';

// 平台公司列表
api.companyListFin = baseURL + '/trade/companyListFin';
// 启用禁用商户或平台公司
api.forbidLogin = baseURL + '/trade/forbidLogin';
// 新增商户或平台公司
api.saveCompany = baseURL + '/company/saveCompany';
// 查询商户或平台公司详情
api.queryCompayDetailById = baseURL + '/trade/queryCompayDetailById';
//查看证件
api.queryCompanyFileList = baseURL + '/company/queryCompanyFileList';
// 查询承运商
api.querySjbCarrierList = baseURL + '/carrier/querySjbCarrierList';
// 删除承运商
api.deleteCompanyCarrier = baseURL + '/carrier/deleteCompanyCarrier';
// 查询物流承运商
api.queryLogisticsCarrier = baseURL + '/carrier/queryLogisticsCarrier';
// 保存承运商
api.saveCompanyCarrier = baseURL + '/carrier/saveCompanyCarrier';

// ------------------订单模块-------------------
// 订单列表
api.orderQueryList = baseURL + '/order/queryList';
// 订单详情
api.orderDetail = baseURL + '/order/detail';
// 关闭订单
api.orderClose = baseURL + '/order/close';

// ------------------运单模块-------------------
//  运单列表
api.waybillQueryList = baseURL + '/waybill/queryList';
//  运单详情
api.waybillDetail = baseURL + '/waybill/detail';
//  车辆轨迹
api.waybillTrack = baseURL + '/waybill/track';
//  银行回单Url
api.waybillBankFileUrl = baseURL + '/waybill/bankFileUrl';

// ------------------结算单模块-------------------

// 结算单列表
api.settlementList = baseURL + '/statement/list';
// 结算单导出
api.settlementExport = baseURL + '/statement/export';
// 新建结算单
api.settlementAdd = baseURL + '/statement/add';
// 查询结算单开始时间
api.settlementStarttime = baseURL + '/statement/starttime';
// 结算单详情
api.settlementDetail = baseURL + '/statement/detail';
// 结算单详情-查询特殊属性方量
api.settlementOrderCubeAttr = baseURL + '/statement/order/cube/attr';

// 结算单详情-订单列表
api.settlementOrderList = baseURL + '/statement/order/list';
//结算单详情-订单扣款扣方
api.settlementDeduction = baseURL + '/statement/deduction';
// 结算单详情-订单上传附件
api.settlementOrderUpload = baseURL + '/statement/order/upload/attachment';
// 结算单详情-订单查看附件
api.settlementOrderAttachment = baseURL + '/statement/order/attachment';

// 结算单调价-查询
api.settlementPrice = baseURL + '/statement/price';
// 结算单调价-保存
api.settlementPricing = baseURL + '/statement/pricing';

// 结算单调价
api.settlementPricing = baseURL + '/statement/pricing';

// 结算单 导出对账单
api.settlementExport = baseURL + '/statement/export';

// 确认对账信息
api.settlementConfirm = baseURL + '/statement/confirm';
// 结算单上传凭证
api.settlementUploadAttachment = baseURL + '/statement/upload/attachment';

// 结算单 确认支付
api.settlementPaymentPay = baseURL + '/statement/payment/pay';
// 结算单 付款记录
api.settlementPaymentRecord = baseURL + '/statement/payment/record';

// -------------------预付款管理-------------------
// 预付款管理-预付款余额管理
api.advanceBalance = baseURL + '/advance/balance';
// 预付款管理-预付款明细
api.advanceBalanceDetail = baseURL + '/advance/balanceDetail';
// 预付款管理-预付款充值
api.advanceRecharge = baseURL + '/advance/recharge';
// 预付款管理-供应链账户余额
api.queryFinanceAccountInfo = baseURL + '/signBankApply/queryFinanceAccountInfo';
// 预付款管理-预付款列表
api.projectAdvance = baseURL + '/project/projectAdvance';

// -------------------系统参数设置-------------------
// 根据参数英文名查参数详情（结算单列表，新增结算单）
api.getByEnName = baseURL + '/params/getByEnName';

export default api;
