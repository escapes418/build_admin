var router = [
  {
    path: '/',
    redirect: '/notice/list'
  },
  {
    path: '/notice/list',
    name: 'NoticeList',
    component: () => import('@/views/notice/NoticeList'),
    meta: {
      active: '/notice/list',
      permission: 'notice:system:view'
    }
  },
  {
    path: '/notice/detail/:messageId',
    name: 'NoticeDetail',
    component: () => import('@/views/notice/NoticeDetail'),
    meta: {
      active: '/notice/list',
      permission: 'notice:system:view'
    }
  }
];
export default router;
