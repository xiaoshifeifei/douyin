let dic = {
    dashboard: () =>
        import ("@/views/dashboard"), // 首页

    // 系统管理
    jurisdiction: () =>
        import ("@/views/systemSet/jurisdiction"), // 系统管理/权限管理
    miniprogram: () =>
        import ("@/views/systemSet/miniprogram"), // 系统管理/小程序管理
    BaseSys: () =>
        import ("@/views/systemSet/basicSet"), // 系统管理/基本设置
    //  role: () => import('@/views/systemSet/jurisdiction/CreateRole'), // 系统管理/新建角色 hidden: true hidden: true hidden: true
    Role: () =>
        import ("@/views/systemSet/jurisdiction"), // 系统管理/权限管理
    Admin: () =>
        import ("@/views/systemSet/accountManage/AccountManage"), //  系统管理/新建管理 hidden: true hidden: true hidden: true
    Adm: () =>
        import ("@/views/systemSet/jurisdiction/CreateRole"), // 系统管理/新建管理 hidden: true hidden: true hidden: true


    // login
    login: () =>
        import ("@/views/login"), // login

    // 用户管理
    StoreUser: () =>
        import ("@/views/userManagement/businessList"), // 用户管理/用户列表

    // 订单管理
    BlueOrderList: () =>
        import ("@/views/orderManagement/exportList"), // 订单管理/蓝V订单
    VipOrderList: () =>
        import ("@/views/orderManagement/listVIP"), // 订单管理/会员订单


    // 审核管理
    StoreDouCheck: () =>
        import ("@/views/storeDoc/storeDocList"), // 审核管理/门店抖音号审核
    CheckVideo: () =>
        import ("@/views/storeDoc/videoList"), // 审核管理/视频审核

    // 系统管理
    Version: () =>
        import ("@/views/systemSet/versionsTongJi"), // 系统管理/版本管理
    Sellvip: () =>
        import ("@/views/systemSet/levelVip"), // 系统管理/会员等级设置
    SystemNotice: () =>
        import ("@/views/systemSet/systemMessage"), // 系统管理/系统消息
    Treaty: () =>
        import ("@/views/systemSet/ProtocolManagement"), // 系统管理/协议管理

};
export default dic;