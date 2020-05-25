import routerDefault from './routerDefault';

var router = [
  {
    path: '/mall',
    redirect: to => routerDefault('mall')
  },
  {
    path: '/order/list',
    name: 'OrderList',
    component: () => import('@/views/mall/OrderList'),
    meta: {
      active: '/order/list',
      title: '订单列表',
      onetab: 'OrderList',
      permission: 'mall:order:list:view'
    }
  },
  {
    path: '/order/list/:projectSn',
    name: 'OrderListSn',
    component: () => import('@/views/mall/OrderList'),
    meta: {
      active: '/order/list',
      title: '订单列表',
      onetab: 'OrderList',
      permission: 'mall:order:list:view'
    }
  },
  {
    path: '/order/detail/:id',
    name: 'OrderDetail',
    component: () => import('@/views/mall/OrderDetail'),
    meta: {
      active: '/order/list',
      title: '订单详情',
      permission: 'mall:order:list:view'
    }
  },
  {
    path: '/waybill/list',
    name: 'WaybillList',
    component: () => import('@/views/mall/WaybillList'),
    meta: {
      active: '/waybill/list',
      title: '运单列表',
      onetab: 'WaybillList',
      permission: 'mall:waybill:list:view'
    }
  },
  {
    path: '/waybill/list/:orderSn',
    name: 'WaybillListSn',
    component: () => import('@/views/mall/WaybillList'),
    meta: {
      active: '/waybill/list',
      title: '运单列表',
      onetab: 'WaybillList',
      permission: 'mall:waybill:list:view'
    }
  },
  {
    path: '/waybill/detail/:waybillSn',
    name: 'WaybillDetail',
    component: () => import('@/views/mall/WaybillDetail'),
    meta: {
      active: '/waybill/list',
      title: '运单详情',
      permission: 'mall:waybill:list:view'
    }
  },
  {
    path: '/waybill/track/:waybillSn',
    name: 'WaybillTrack',
    component: () => import('@/views/mall/WaybillTrack'),
    meta: {
      active: '/waybill/list',
      title: '运单轨迹',
      permission: 'mall:waybill:list:view'
    }
  },
  {
    path: '/merchant/list',
    name: 'MerchantList',
    component: () => import('@/views/mall/MerchantList'),
    meta: {
      active: '/merchant/list',
      title: '供应链商户管理',
      permission: 'mall:merchant:list:view'
    }
  },
  {
    path: '/merchant/detail/:companyId',
    name: 'MerchantDetail',
    component: () => import('@/views/mall/MerchantDetail'),
    meta: {
      active: '/merchant/list',
      title: '商户详情',
      permission: 'mall:merchant:list:view'
    }
  },
  {
    path: '/merchant/add',
    name: 'MerchantAdd',
    component: () => import('@/views/mall/MerchantAdd'),
    meta: {
      active: '/merchant/list',
      title: '新增商户',
      permission: 'mall:merchant:list:view'
    }
  },
  {
    path: '/merchant/fin/list',
    name: 'MerchantFinList',
    component: () => import('@/views/mall/MerchantFinList'),
    meta: {
      active: '/merchant/fin/list',
      title: '平台公司管理',
      permission: 'mall:merchant:fin:list:view'
    }
  },
  {
    path: '/merchant/fin/detail/:companyId',
    name: 'MerchantFinDetail',
    component: () => import('@/views/mall/MerchantDetail'),
    meta: {
      active: '/merchant/fin/list',
      title: '平台公司详情',
      permission: 'mall:merchant:fin:list:view'
    }
  },
  {
    path: '/merchant/fin/add',
    name: 'MerchantFinAdd',
    component: () => import('@/views/mall/MerchantAdd'),
    meta: {
      active: '/merchant/fin/list',
      title: '新增平台公司',
      permission: 'mall:merchant:fin:list:view'
    }
  },
  {
    path: '/goods/list',
    name: 'GoodsList',
    component: () => import('@/views/mall/GoodsList'),
    meta: {
      active: '/goods/list',
      title: '商品列表',
      permission: 'mall:goods:list:view'
    }
  },
  {
    path: '/goods/attr/list',
    name: 'GoodsAttrList',
    component: () => import('@/views/mall/GoodsAttrList'),
    meta: {
      active: '/goods/attr/list',
      title: '浇筑及属性管理',
      permission: 'mall:goods:attr:list:view'
    }
  },

  {
    path: '/refund/pay/:protocolOrderId/:protocolOrderSn',
    name: 'RefundPay',
    component: () => import('@/views/mall/RefundPay'),
    meta: {
      active: '/order/list',
      title: '订单余款退款',
      permission: 'mall:order:refund:pay'
    }
  },
  {
    // 从订单详情-贸易凭证
    path: '/trade/cert/fromorder/:waybillSn/:protocolOrderId',
    name: 'TradeCertFormOrderDetail',
    component: () => import('@/views/mall/TradeCertForm'),
    meta: {
      active: '/order/list',
      title: '贸易凭证',
      onetab: 'TradeCertForm',
      permission: 'mall:order:cert:view'
    }
  },
  {
    // 从运单列表-贸易凭证
    path: '/trade/cert/fromlist/:waybillSn',
    name: 'TradeCertFormWaybillList',
    component: () => import('@/views/mall/TradeCertForm'),
    meta: {
      active: '/waybill/list',
      title: '贸易凭证',
      onetab: 'TradeCertForm',
      permission: 'mall:order:cert:view'
    }
  },
  {
    // 从运单详情-贸易凭证
    path: '/trade/cert/fromdetail/:waybillSn',
    name: 'TradeCertFormWaybillDetail',
    component: () => import('@/views/mall/TradeCertForm'),
    meta: {
      active: '/waybill/list',
      title: '贸易凭证',
      onetab: 'TradeCertForm',
      permission: 'mall:order:cert:view'
    }
  },
  {
    path: '/mall/menu/mng',
    name: 'MallMenuMng',
    component: () => import('@/views/mall/MallMenuMng'),
    meta: {
      active: '/mall/menu/mng',
      title: '菜单管理',
      permission: 'mall:sys:menu:view'
    }
  },
  {
    path: '/mall/menu/add',
    name: 'MallMenuAdd',
    component: () => import('@/views/mall/MallMenuEdit'),
    meta: {
      active: '/mall/menu/mng',
      title: '添加菜单',
      permission: 'mall:sys:menu:add'
    }
  },
  {
    path: '/mall/menu/add/:parentId',
    name: 'MallMenuSubAdd',
    component: () => import('@/views/mall/MallMenuEdit'),
    meta: {
      active: '/mall/menu/mng',
      title: '添加菜单',
      permission: 'mall:sys:menu:add'
    }
  },
  {
    path: '/mall/menu/edit/:menuid',
    name: 'MallMenuEdit',
    component: () => import('@/views/mall/MallMenuEdit'),
    meta: {
      active: '/mall/menu/mng',
      title: '修改菜单',
      permission: 'mall:sys:menu:edit'
    }
  },
  {
    path: '/carrier/list',
    name: 'CarrierList',
    component: () => import('@/views/mall/CarrierList'),
    meta: {
      active: '/carrier/list',
      title: '承运商管理',
      permission: 'mall:carrier:trade:view'
    }
  },
  // 项目相关
  {
    path: '/project/add',
    name: 'ProjectAdd',
    component: () => import('@/views/mall/ProjectAdd'),
    meta: {
      active: '/project/list',
      title: '新增项目',
      permission: 'mall:project:list:view'
    }
  },
  {
    path: '/project/list',
    name: 'ProjectList',
    component: () => import('@/views/mall/ProjectList'),
    meta: {
      active: '/project/list',
      title: '项目列表',
      permission: 'mall:project:list:view'
    }
  },
  {
    path: '/project/list/:contractSn',
    name: 'ProjectListAdd',
    component: () => import('@/views/mall/ProjectList'),
    meta: {
      active: '/project/list',
      title: '项目列表',
      permission: 'mall:project:list:view'
    }
  },
  {
    path: '/project/detail/:id',
    name: 'ProjectDetail',
    component: () => import('@/views/mall/ProjectDetail'),
    meta: {
      active: '/project/list',
      title: '项目详情',
      permission: 'mall:project:list:view'
    }
  },
  {
    path: '/project/price/comparison/:id/:projectSn',
    name: 'ProjectPriceComparison',
    component: () => import('@/views/mall/ProjectPriceComparison'),
    meta: {
      active: '/project/list',
      title: '项目单价对照表',
      permission: 'mall:project:list:view'
    }
  },
  {
    path: '/project/modify/price/show/:id/:bizId/:projectSn',
    name: 'ProjectModifyPriceShow',
    component: () => import('@/views/mall/ProjectModifyPriceShow'),
    meta: {
      active: '/project/list',
      title: '项目调价对照表',
      permission: 'mall:project:list:view'
    }
  },
  {
    path: '/settlement/list',
    name: 'SettlementList',
    component: () => import('@/views/mall/SettlementList'),
    meta: {
      active: '/settlement/list',
      title: '结算单列表',
      permission: 'mall:settlement:list:view'
    }
  },
  {
    path: '/settlement/detail/:settlementId',
    name: 'SettlementDetail',
    component: () => import('@/views/mall/SettlementDetail'),
    meta: {
      active: '/settlement/list',
      title: '结算单详情',
      permission: 'mall:settlement:list:view'
    }
  },
  {
    path: '/settlement/modify/price/:settlementId/:settlementSn',
    name: 'SettlementModifyPrice',
    component: () => import('@/views/mall/SettlementModifyPrice'),
    meta: {
      active: '/settlement/list',
      title: '结算单调价',
      permission: 'mall:settlement:list:view'
    }
  },
  {
    path: '/settlement/view/price/:settlementId/:settlementSn',
    name: 'SettlementViewPrice',
    component: () => import('@/views/mall/SettlementModifyPrice'),
    meta: {
      active: '/settlement/list',
      title: '单价对照表',
      permission: 'mall:settlement:list:view'
    }
  },
  // 预付款管理
  {
    path: '/advance/payment/list',
    name: 'AdvancePaymentList',
    component: () => import('@/views/mall/AdvancePaymentList'),
    meta: {
      active: '/advance/payment/list',
      title: '预付款列表',
      permission: 'mall:payment:list:view'
    }
  },
  {
    path: '/advance/payment/add/:projectId',
    name: 'AdvancePaymentForm',
    component: () => import('@/views/mall/AdvancePaymentForm'),
    meta: {
      active: '/advance/payment/list',
      title: '新建预付款',
      permission: 'mall:payment:list:add'
    }
  },
  {
    path: '/advance/payment/remaining/:projectSn/:projectName',
    name: 'AdvancePaymentRemaining',
    component: () => import('@/views/mall/AdvancePaymentRemaining'),
    meta: {
      active: '/advance/payment/list',
      title: '预付款余额',
      permission: 'mall:payment:list:view'
    }
  },
  {
    path: '/advance/payment/detail/:advanceId/:projectName',
    name: 'AdvancePaymentDetail',
    component: () => import('@/views/mall/AdvancePaymentDetail'),
    meta: {
      active: '/advance/payment/list',
      title: '预付款明细',
      permission: 'mall:payment:list:view'
    }
  },
];
export default router;
