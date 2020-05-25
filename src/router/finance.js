import routerDefault from './routerDefault';

var router = [
  {
    path: '/finance',
    redirect: to => routerDefault('finance')
  },
  {
    path: '/capital/detail/list',
    name: 'CapitalDetailList',
    component: () => import('@/views/finance/CapitalDetailList'),
    meta: {
      active: '/capital/detail/list',
      title: '资金变动查询',
      permission: 'finance:capital:detail:view'
    }
  },
  {
    path: '/capital/order/list',
    name: 'CapitalOrderList',
    component: () => import('@/views/finance/CapitalOrderList'),
    meta: {
      active: '/capital/order/list',
      title: '资金订单列表',
      permission: 'finance:capital:order:view'
    }
  },
  {
    path: '/capital/tranflow/list',
    name: 'CapitaltranFlowList',
    component: () => import('@/views/finance/CapitaltranFlowList'),
    meta: {
      active: '/capital/tranflow/list',
      title: '交易流水',
      permission: 'finance:capital:tranflow:view'
    }
  },
  {
    path: '/sign/signed/list',
    name: 'SignedList',
    component: () => import('@/views/finance/SignedList'),
    meta: {
      active: '/sign/signed/list',
      title: '签约信息列表',
      permission: 'finance:sign:signed:view'
    }
  },
  {
    path: '/externalacc/list',
    name: 'ExternalAccountsList',
    component: () => import('@/views/finance/ExternalAccountsList'),
    meta: {
      active: '/externalacc/list',
      title: '外部账户列表',
      permission: 'finance:externalacc:list:view'
    }
  },
  {
    path: '/externalacc/add/:id',
    name: 'ExternalAccountsAdd',
    component: () => import('@/views/finance/ExternalAccountsAdd'),
    meta: {
      active: '/externalacc/list',
      title: '签约',
      permission: 'finance:externalacc:list:view'
    }
  },
  {
    path: '/withdraw/list',
    name: 'WithdrawList',
    component: () => import('@/views/finance/WithdrawList'),
    meta: {
      active: '/withdraw/list',
      title: '提现管理',
      permission: 'finance:trade:withdraw:view'
    }
  },
  {
    path: '/topup/list',
    name: 'TopupList',
    component: () => import('@/views/finance/TopupList'),
    meta: {
      active: '/topup/list',
      title: '充值管理',
      permission: 'finance:trade:topup:view'
    }
  },
  {
    path: '/recharge/list',
    name: 'RechargeList',
    component: () => import('@/views/finance/RechargeList'),
    meta: {
      active: '/recharge/list',
      title: '数据维护',
      permission: 'finance:trade:recharge:view'
    }
  },
  {
    path: '/contract/list',
    name: 'ContractList',
    component: () => import('@/views/finance/ContractList'),
    meta: {
      active: '/contract/list',
      title: '合同列表',
      permission: 'finance:seal:contract:view'
    }
  },
  {
    path: '/contract/template/list',
    name: 'ContractTemplateList',
    component: () => import('@/views/finance/ContractTemplateList'),
    meta: {
      active: '/contract/template/list',
      title: '合同模板',
      permission: 'finance:seal:contracttpl:view'
    }
  },
  {
    path: '/report/order/settle/list',
    name: 'ReportOrderSettle',
    component: () => import('@/views/finance/ReportOrderSettle'),
    meta: {
      active: '/report/order/settle/list',
      title: '订单结算报表',
      permission: 'finance:report:ordersettle:view'
    }
  },
  {
    path: '/report/waybill/settle/list',
    name: 'ReportWaybillSettle',
    component: () => import('@/views/finance/ReportWaybillSettle'),
    meta: {
      active: '/report/waybill/settle/list',
      title: '运单结算报表',
      permission: 'finance:report:waybillsettle:view'
    }
  },
  {
    path: '/invoiced/waybill/list',
    name: 'InvoicedWaybillList',
    component: () => import('@/views/finance/InvoicedWaybillList'),
    meta: {
      active: '/invoiced/waybill/list',
      title: '待开票运单',
      permission: 'finance:invoice:waybill:view'
    }
  },
  {
    path: '/invoice/check/list',
    name: 'InvoiceCheckList',
    component: () => import('@/views/finance/InvoiceCheckList'),
    meta: {
      active: '/invoice/check/list',
      title: '发票登记',
      permission: 'finance:invoice:check:view'
    }
  },
  {
    path: '/invoice/detail/edit/:id/:flowCode',
    name: 'InvoiceCheckDetailEdit',
    component: () => import('@/views/finance/InvoiceCheckDetailEdit'),
    meta: {
      active: '/invoice/check/list',
      title: '维护发票信息',
      permission: 'finance:invoice:check:view'
    }
  },
  {
    path: '/invoice/list',
    name: 'InvoiceList',
    component: () => import('@/views/finance/InvoiceList'),
    meta: {
      active: '/invoice/list',
      title: '发票列表',
      permission: 'finance:invoice:list:view'
    }
  },
  {
    path: '/invoice/detail/:id',
    name: 'InvoiceDetail',
    component: () => import('@/views/finance/InvoiceDetail'),
    meta: {
      active: '/invoice/list',
      title: '发票详情',
      permission: 'finance:invoice:list:view'
    }
  },

  {
    path: '/capital/order/detail/:id',
    name: 'CapitalOrderDetail',
    component: () => import('@/views/finance/CapitalOrderDetail'),
    meta: {
      active: '/capital/order/list',
      title: '金融订单详情',
      permission: 'finance:capital:order:view'
    }
  },
  {
    path: '/capital/tranflow/detail/:id',
    name: 'CapitaltranFlowDetail',
    component: () => import('@/views/finance/CapitaltranFlowDetail'),
    meta: {
      active: '/capital/tranflow/list',
      title: '交易流水详情',
      permission: 'finance:capital:tranflow:view'
    }
  }
];
export default router;
