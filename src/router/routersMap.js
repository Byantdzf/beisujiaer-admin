const Main = () => import('@/view/main')
const Login = () => import('@/view/login/login.vue')
const reset = () => import('@/view/login/reset.vue')
const Home = () => import('@/view/home/home.vue')
const Error401 = () => import('@/view/error-page/401.vue')
const Error500 = () => import('@/view/error-page/500.vue')
const Error404 = () => import('@/view/error-page/404.vue')

export const routerMap = {
  Main,
  Login, Home,
  reset,
  Error401,
  Error500,
  Error404
}
const data = [
  {
    title: '数据统计',
    path: 'statistics',
    icon: 'md-analytics',
    meta: {
      access: ['admin', 'paas_admin'],
      hideInMenu: false,
      notCache: true
    },
    component: () => import('@/view/home/home.vue')
  },
  // {
  //   title: '广告管理',
  //   path: 'advertising',
  //   icon: 'md-cog',
  //   meta: {
  //     access: ['admin', 'paas_admin'],
  //     hideInMenu: false,
  //     notCache: true
  //   },
  //   component: () => import('@/view/advertising/list.vue')
  // },
  // {
  //   title: '文章管理',
  //   path: 'article',
  //   icon: 'ios-ionic-outline',
  //   meta: {
  //     access: ['admin'],
  //     hideInMenu: false,
  //     notCache: true
  //   },
  //   component: () => import('@/view/article/list.vue')
  // },
  {
    title: '用户管理',
    path: 'userlist',
    icon: 'ios-contact',
    meta: {
      access: ['admin', 'paas_admin'],
      hideInMenu: false,
      notCache: false
    },
    component: () => import('@/view/users/list.vue')
  },
  // {
  //   title: '用户管理',
  //   path: 'orders',
  //   icon: 'ios-paper',
  //   meta: {
  //     access: ['admin', 'paas_admin'],
  //     hideInMenu: false,
  //     notCache: true
  //   },
  //   component: () => import('@/view/orders/list.vue')
  // },
  // {
  //   title: '检测管理',
  //   path: 'detection-list',
  //   icon: 'md-cog',
  //   meta: {
  //     access: ['admin', 'paas_admin'],
  //     hideInMenu: false
  //   },
  //   component: () => import('@/view/detection/list.vue')
  // },
  {
    title: '检测类型',
    path: 'jobList',
    icon: 'md-cog',
    meta: {
      access: ['admin', 'paas_admin'],
      hideInMenu: false
    },
    component: () => import('@/view/job/list.vue')
  },
  // {
  //   title: '兼职类型',
  //   path: 'md-contacts',
  //   icon: 'md-cog',
  //   meta: {
  //     access: ['admin', 'paas_admin'],
  //     hideInMenu: false
  //   },
  //   component: () => import('@/view/activity/list.vue')
  // },
  {
    title: '后台权限',
    path: 'admin',
    icon: 'ios-paw',
    meta: {
      access: ['admin'],
      hideInMenu: false,
      notCache: true
    },
    component: () => import('@/view/admin/list.vue')
  }
]
const setRouter = () => {
  const routerList = []
  for (let item of data) {
    routerList.push(
      {
        path: '/',
        name: '_' + item.path,
        component: routerMap['Main'],
        meta: item.meta,
        children: [
          {
            path: '/' + item.path,
            name: item.path,
            meta: {
              access: item.meta.access,
              icon: item.icon,
              title: item.title,
              notCache: false,
            },
            component: item.component
          }
        ]
      }
    )
  }
  return routerList
}
export const staticRouters = [
  {path: '/login', name: 'login', meta: {title: 'Login - 登录', hideInMenu: true}, component: routerMap['Login']},
  {path: '/reset', name: 'reset', meta: {title: 'Login - 修改密码', hideInMenu: true}, component: routerMap['reset']},
  {path: '/401', name: 'error_401', meta: {hideInMenu: true}, component: routerMap['Error401']},
  {path: '/500', name: 'error_500', meta: {hideInMenu: true}, component: routerMap['Error500']},
  {path: '*', name: 'error_404', meta: {hideInMenu: true}, component: routerMap['Error404']},
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    meta: {notCache: true, hideInMenu: true},
    component: routerMap['Main'],
    children: [{
      path: '/home',
      name: 'home',
      meta: {notCache: true, hideInMenu: true, title: '首页'},
      component: routerMap['Home']
    }]
  },
  ...setRouter(),
  // {
  //   path: '/',
  //   name: '设置',
  //   meta: {
  //     access: ['admin', 'paas_admin'],
  //     notCache: true, hideInMenu: false,
  //     icon: 'logo-sass',
  //   },
  //   component: routerMap['Main'],
  //   children: [
  //     {
  //       path: 'homeSet',
  //       name: '首页通知',
  //       icon: 'md-cog',
  //       meta: {
  //         access: ['admin', 'paas_admin'],
  //         hideInMenu: false,
  //         notCache: true
  //       },
  //       component: () => import('@/view/home/homeSet.vue')
  //     },
  //     {
  //       path: 'homeRecommend',
  //       name: '首页推荐',
  //       icon: 'md-cog',
  //       meta: {
  //         access: ['admin', 'paas_admin'],
  //         hideInMenu: false,
  //         notCache: true
  //       },
  //       component: () => import('@/view/home/homeRecommend.vue')
  //     },
  //     {
  //       path: 'massTexting',
  //       name: '群发信息',
  //       icon: 'md-cog',
  //       meta: {
  //         access: ['admin', 'paas_admin'],
  //         hideInMenu: false,
  //         notCache: true
  //       },
  //       component: () => import('@/view/home/massTexting.vue')
  //     },
  //   ]
  // },
  {
    path: '/',
    name: '二级页面',
    meta: {
      icon: 'logo-windows',
      title: 'admin',
      access: ['admin', 'paas_admin', 'matcher', 'worker'],
      // notCache: "true",
      hideInMenu: true
    },
    component: routerMap['Main'],
    children: [
      {
        path: 'articleDetail/:id',
        name: 'articleDetail',
        meta: {
          title: '文章详情',
          hideInMenu: true
        },
        component: () => import('@/view/article/detail.vue')
      },
      {
        path: 'jobDetail/:id',
        name: 'jobDetail',
        meta: {
          title: '兼职详情',
          hideInMenu: true
        },
        component: () => import('@/view/job/activity.vue')
      },
      // ---分------
      {
        path: 'paasDetail/:id',
        name: 'paasDetail',
        meta: {
          title: '活动详情',
          hideInMenu: true
        },
        component: () => import('@/view/paas/index.vue')
      },
      {
        path: 'user_detail/:id',
        name: 'user_detail',
        meta: {
          title: '用户详情',
          hideInMenu: true,
          notCache: false,
          // access: ['super_admin']
        },
        component: () => import('@/view/users/user_detail.vue')
      },
      {
        path: 'createMassText',
        name: 'createMassText',
        meta: {
          title: '群发消息',
          hideInMenu: true,
          notCache: false,
          // access: ['super_admin']
        },
        component: () => import('@/view/home/createMassText.vue')
      },
      {
        path: 'messageDetail/:id',
        name: 'messageDetail',
        meta: {
          title: '群发详情',
          hideInMenu: true,
          notCache: false,
          // access: ['super_admin']
        },
        component: () => import('@/view/home/messageDetail.vue')
      },
      {
        path: 'userMembers/:id',
        name: 'userMembers',
        meta: {
          title: '用户会员',
          hideInMenu: true,
          notCache: false,
          // access: ['super_admin']
        },
        component: () => import('@/view/users/userMembers.vue')
      },
      {
        path: 'user_recommend/:id',
        name: 'user_recommend',
        meta: {
          title: '推荐',
          hideInMenu: true
        },
        component: () => import('@/view/users/user_recommend.vue')
      },
      {
        path: 'record/:id',
        name: 'record',
        meta: {
          title: '收益记录',
          hideInMenu: true,
          access: ['admin', 'paas_admin']
        },
        component: () => import('@/view/referres/record.vue')
      },
      {
        path: 'referralBonuses/:id',
        name: 'referralBonuses',
        meta: {
          title: '推荐奖励',
          access: ['admin'],
          hideInMenu: true,
        },
        component: () => import('@/view/referres/referralBonuses.vue')
      },
      {
        path: 'referrer/:id',
        name: 'referrer',
        meta: {
          title: '推荐记录',
          hideInMenu: true,
          access: ['admin', 'paas_admin']
        },
        component: () => import('@/view/paas/referrers.vue')
      },
      {
        path: 'user_note/:id',
        name: 'user_note',
        meta: {
          title: '备注管理',
          hideInMenu: true,
          notCache: true
        },
        component: () => import('@/view/users/user_note.vue')
      },
      {
        path: 'note_detail/:id',
        name: 'note_detail',
        meta: {
          title: '备注详情',
          hideInMenu: true
        },
        component: () => import('@/view/users/noteDetail.vue')
      },
      {
        path: 'order/:id',
        name: 'order-detail',
        meta: {
          title: '订单详情',
          hideInMenu: true
        },
        component: () => import('@/view/orders/detail.vue')
      },
      {
        path: 'clients/:id',
        name: 'clients',
        meta: {
          title: '客户列表',
          hideInMenu: true
        },
        component: () => import('@/view/users/clientlist.vue')
      },
      {
        path: 'edit_user_detail/:id',
        name: 'edit_user_detail',
        meta: {
          title: '编辑用户',
          access: ['admin', 'paas_admin'],
          hideInMenu: true
        },
        component: () => import('@/view/users/edituserDetail.vue')
      },
      {
        path: 'user_order/:id',
        name: 'user_order',
        meta: {
          title: '订单列表',
          access: ['admin', 'paas_admin'],
          hideInMenu: true
        },
        component: () => import('@/view/users/user_order.vue')
      },
      {
        path: 'user_gift/:id',
        name: 'user_gift',
        meta: {
          title: '礼物列表',
          access: ['admin', 'paas_admin'],
          hideInMenu: true
        },
        component: () => import('@/view/users/user_gift.vue')
      },
      {
        path: 'user_integral/:id',
        name: 'user_integral',
        meta: {
          title: '福分记录',
          hideInMenu: true
        },
        component: () => import('@/view/users/user_integral.vue')
      },
      {
        path: 'activity/:id',
        name: 'activity',
        meta: {
          title: '活动详情',
          hideInMenu: true
        },
        component: () => import('@/view/activity/activity.vue')
      },
      {
        path: 'activity_detail/:id',
        name: 'activity_detail',
        meta: {
          title: '活动现场',
          hideInMenu: true
        },
        component: () => import('@/view/activity/index.vue')
      },
      {
        path: 'member_detail/:id',
        name: 'member_detail',
        meta: {
          title: '会员详情',
          hideInMenu: true
        },
        component: () => import('@/view/activity/member_detail.vue')
      }
    ]
  }
]





