var router = [
  {
    path: '/mycenter',
    redirect: '/welcome'
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: () => import('@/views/mycenter/Welcome'),
    meta: {
      active: '/welcome',
      title: '欢迎页',
      permission: 'my:workplace:wlecome:view'
    }
  }
];
export default router;
