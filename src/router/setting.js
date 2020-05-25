import routerDefault from './routerDefault';

// 布局设置
const LayoutSet = () => import('@/views/setting/LayoutSet');
// 菜单管理
const MenuMng = () => import('@/views/setting/MenuMng');
// 菜单编辑
const MenuEdit = () => import('@/views/setting/MenuEdit');
// 角色权限管理
const RoleList = () => import('@/views/setting/RoleList');
// 角色查看/添加/编辑
const RoleEdit = () => import('@/views/setting/RoleEdit');
// 用户管理
const UserList = () => import('@/views/setting/UserList');
// 用户添加/编辑
const UserEdit = () => import('@/views/setting/UserEdit');
// 字典管理列表
const DictionaryList = () => import('@/views/setting/DictionaryList');
// 单个字典详情
const DictionaryDetail = () => import('@/views/setting/DictionaryDetail');
// 黑名单管理
const BlackList = () => import('@/views/setting/BlackList');
// 黑名单新增
const BlackAdd = () => import('@/views/setting/BlackAdd');
// 验证码查询
const CodeQuery = () => import('@/views/setting/CodeQuery');

var router = [
  {
    path: '/setting',
    redirect: to => routerDefault('setting')
  },
  {
    path: '/menu/mng',
    name: 'MenuMng',
    component: MenuMng,
    meta: {
      active: '/menu/mng',
      title: '菜单管理',
      permission: 'setting:sys:menu:view'
    }
  },
  {
    path: '/menu/add',
    name: 'MenuAdd',
    component: MenuEdit,
    meta: {
      active: '/menu/mng',
      title: '添加菜单',
      permission: 'setting:sys:menu:add'
    }
  },
  {
    path: '/menu/add/:parentId',
    name: 'MenuSubAdd',
    component: MenuEdit,
    meta: {
      active: '/menu/mng',
      title: '添加菜单',
      permission: 'setting:sys:menu:add'
    }
  },
  {
    path: '/menu/edit/:menuid',
    name: 'MenuEdit',
    component: MenuEdit,
    meta: {
      active: '/menu/mng',
      title: '修改菜单',
      permission: 'setting:sys:menu:edit'
    }
  },
  {
    path: '/role/list',
    name: 'RoleList',
    component: RoleList,
    meta: {
      active: '/role/list',
      title: '角色管理',
      permission: 'setting:sys:role:view'
    }
  },
  {
    path: '/role/add',
    name: 'RoleAdd',
    component: RoleEdit,
    meta: {
      active: '/role/list',
      title: '添加角色',
      permission: 'setting:sys:role:add'
    }
  },
  {
    path: '/role/edit/:id',
    name: 'RoleEdit',
    component: RoleEdit,
    meta: {
      active: '/role/list',
      title: '修改角色',
      permission: 'setting:sys:role:edit'
    }
  },
  {
    path: '/role/view/:id',
    name: 'RoleView',
    component: RoleEdit,
    meta: {
      active: '/role/list',
      title: '角色详情',
      permission: 'setting:sys:role:view'
    }
  },
  {
    path: '/user/list',
    name: 'UserList',
    component: UserList,
    meta: {
      active: '/user/list',
      title: '用户管理',
      permission: 'setting:sys:user:view'
    }
  },
  {
    path: '/user/view/:id',
    name: 'UserView',
    component: UserEdit,
    meta: {
      active: '/user/list',
      title: '用户信息',
      permission: 'setting:sys:user:view'
    }
  },
  {
    path: '/user/add',
    name: 'userAdd',
    component: UserEdit,
    meta: {
      active: '/user/list',
      title: '添加用户',
      permission: 'setting:sys:user:add'
    }
  },
  {
    path: '/user/edit/:id',
    name: 'UserEdit',
    component: UserEdit,
    meta: {
      active: '/user/list',
      title: '修改用户信息',
      permission: 'setting:sys:user:edit'
    }
  },
  {
    path: '/layoutset',
    name: 'LayoutSet',
    component: LayoutSet,
    meta: {
      active: '/layoutset',
      title: '布局设置',
      permission: 'setting:sys:layout:view'
    }
  },
  {
    path: '/dictionary/list',
    name: 'DictionaryList',
    component: DictionaryList,
    meta: {
      active: '/dictionary/list',
      title: '字典管理',
      permission: 'setting:sys:dictionary:view'
    }
  },
  {
    path: '/dictionary/detail/view/:id',
    name: 'DictionaryDetailView',
    component: DictionaryDetail,
    meta: {
      active: '/dictionary/list',
      title: '字典详情',
      permission: 'setting:sys:dictionary:view'
    }
  },
  {
    path: '/dictionary/detail/edit/:id',
    name: 'DictionaryDetailEdit',
    component: DictionaryDetail,
    meta: {
      active: '/dictionary/list',
      title: '编辑字典',
      permission: 'setting:sys:dictionary:view'
    }
  },
  {
    path: '/dictionary/detail/add/value/:id/:type',
    name: 'DictionaryDetailAddValue',
    component: DictionaryDetail,
    meta: {
      active: '/dictionary/list',
      title: '新增键值',
      permission: 'setting:sys:dictionary:view'
    }
  },
  {
    path: '/dictionary/add',
    name: 'DictionaryAdd',
    component: DictionaryDetail,
    meta: {
      active: '/dictionary/list',
      title: '新增字典',
      permission: 'setting:sys:dictionary:view'
    }
  },
  {
    path: '/black/list',
    name: 'BlackList',
    component: BlackList,
    meta: {
      active: '/black/list',
      title: '黑名单管理',
      permission: 'setting:sms:blacklist:view'
    }
  },
  {
    path: '/black/add',
    name: 'BlackAdd',
    component: BlackAdd,
    meta: {
      active: '/black/list',
      title: '新增黑名单',
      permission: 'setting:sms:blacklist:view'
    }
  },
  {
    path: '/code/query',
    name: 'CodeQuery',
    component: CodeQuery,
    meta: {
      active: '/code/query',
      title: '验证码查询',
      permission: 'setting:sms:codequery:view'
    }
  }
];
export default router;
