/*
 * @Descripttion: des
 * @version: v
 * @Author: ldh
 * @Date: 2020-07-30 17:06:31
 * @LastEditors: ldh
 * @LastEditTime: 2020-07-30 18:22:57
 */
import request from '@/utils/request'

/**
 * app 上传
 * @param {Object} file
 * @param {Number} type  0 上传图片 1 app
 * @return: {Promise}
 */
export const reqUploadFile = function(file) {
        return request({
            headers: { 'Content-Type': 'multipart/form-data;' },
            url: `/version/upload`,
            method: 'POST',
            data: file
        })
    }
    /**
     * 创建版本号
     * @param {Object} data
     * @return: {Promise}
     */
export const reqAddAppVersion = function(data) {
        return request({
            url: '/version/save',
            method: 'POST',
            data
        })
    }
    /**
     * 获取版本列表
     * @param {Object} data
     * @return: {Promise}
     */
export const reqVersionList = function() {
    return request({
        url: "/version/list",
        method: "get",
    })
}

// 系统设置---权限管理--版本管理列表
// export function GetVersionsList() {
//   return request({
//       url: "/version/list",
//       method: "get",
//       // params: { keywords: Keywords, page: Page, limit: Limit }
//   });
// }


/**
 * 更新版本
 * @param {Object} data
 * @return: {Promise}
 */
export const updateVersion = function(data) {
        return request({
            url: `/version/update`,
            method: 'POST',
            data
        })
    }
    /**
     * 获取版本详情
     * @param {Number} id
     * @return: {Promise}
     */
export const reqVersionDetail = function(id) {
    return request({
        url: `/version/read?id=${id}`
    })
}

// 获取商家会员列表
export function sellVipList(params) {
    return request({
        url: '/sellvip/index',
        method: 'get',
        params
    })
}
/**
 * 商家会员详情
 * @param {Number} id
 * @return: {Promise}
 */
export const rellVipRead = function(id) {
    return request({
        url: `/sellvip/read/${id}`
    })
}


// 修改会员详情
export function sellVipUpdate(data) {
    return request({
        url: '/sellvip/update',
        method: 'post',
        data
    })
}


// 视频数量设置
export function sellVideoNumber(data) {
    return request({
        url: '/sellvip/video_number_update',
        method: 'post',
        data
    })
}

// 会员添加
export function sellVipSave(data) {
    return request({
        url: '/sellvip/save',
        method: 'post',
        data
    })
}

// /**
//  * 商家会员删除
//  * @param {Number} id
//  * @return: {Promise}
//  */
// export const rellVipDelete = function(id) {
//     return request({
//         url: `/sellvip/delete/${id}`
//     })
// }

// 会员添加
export function rellVipDelete(id) {
    return request({
        url: `/sellvip/delete/${id}`,
        method: 'post',
    })
}









// 获取商家列表
export function sellList(params) {
    return request({
        url: '/sell/index',
        method: 'get',
        params
    })
}
/**
 * 商家详情
 * @param {Number} id
 * @return: {Promise}
 */
export const rellRead = function(id) {
    return request({
        url: `/sell/read/${id}`
    })
}


// 获取门店列表
export function storeLists(params) {
    return request({
        url: '/check/store/list',
        method: 'get',
        params
    })
}

// 获取门店详情
export function storeRead(id) {
    return request({
        url: `/check/store/read?store_id=${id}`,
    })
}



// 获取门店驳回
export function storeReject(data) {
    return request({
        url: '/check/store/reject',
        method: 'post',
        data
    })
}


// 门店通过
export function storeAdopts(data) {
    return request({
        url: '/check/store/adopt',
        method: 'post',
        data
    })
}


// 视频审核列表
export function videoList(params) {
    return request({
        url: '/check/video/index',
        method: 'get',
        params
    })
}

// 获取门店驳回
export function videoReject(data) {
    return request({
        url: '/check/video/reject',
        method: 'post',
        data
    })
}


// 门店通过
export function videoAdopt(data) {
    return request({
        url: '/check/video/adopt',
        method: 'post',
        data
    })
}

// 获取蓝V申请列表
export function bluevList(params) {
    return request({
        url: '/check/bluev_apply/list',
        method: 'get',
        params
    })
}

// 获取蓝V申请详情
export function bluevApplyList(params) {
    return request({
        url: '/check/bluev_apply/read',
        method: 'get',
        params
    })
}

// 获取蓝V申请导出
export function bluevExport(params) {
    return request({
        url: '/check/bluev_apply/export',
        method: 'get',
        params
    })
}

// 蓝V申请处理
export function videOperate(data) {
    return request({
        url: '/check/bluev_apply/operate',
        method: 'post',
        data
    })
}

// 门店管理==》门店列表
export function stoList(params) {
    return request({
        url: '/store/list',
        method: 'get',
        params
    })
}

// 门店管理==》门店详情
export function stoRead(params) {
    return request({
        url: '/store/read',
        method: 'get',
        params
    })
}

// 门店管理==》门店导出
export function stoExport(params) {
    return request({
        url: '/store/export',
        method: 'get',
        params
    })
}


//门店管理==》会员赠送
export function storeSellvip(data) {
    return request({
        url: '/store/vip_give',
        method: 'post',
        data
    })
}


//系统设置 ==> 协议管理 列表


export function stoTreaty(params) {
    return request({
        url: 'treaty/index',
        method: 'get',
        params
    })
}

//系统设置 ==> 协议管理 查看


export function stoTreatyRead(id) {
    console.log("id", id);
    return request({
        url: `/treaty/read/${id}`,
    })
}


//系统设置 ==> 协议管理 编辑
export function stoTreatySave(data) {
    return request({
        url: '/treaty/save',
        method: 'post',
        data
    })
}


//系统设置 ==> 协议管理 列表

export function VIPOrder(params) {
    return request({
        url: '/vip_order/list',
        method: 'get',
        params
    })
}


//系统设置 ==》 系统消息
export function publishMsg(params) {
    return request({
        url: '/msg/index',
        method: 'get',
        params
    })
}


//系统设置 ==> 系统消息 新增
export function stoMsgSave(data) {
    return request({
        url: 'msg/save',
        method: 'post',
        data
    })
}

//系统设置 ==> 系统消息 删除
export function msgDelete(id) {
    return request({
        url: `/msg/del/${id}`,
        method: 'post',
    })
}

//系统设置 ==> 系统消息 编辑
export function msgUpdate(data) {
    return request({
        url: 'msg/save',
        method: 'post',
        data
    })
}



//系统设置 ==> 系统消息 发布
export function publish(id) {
    return request({
        url: `/msg/publish/${id}`,
        method: 'post',
    })
}

//系统设置 ==> 系统消息 修改
export function publishUpdate(data) {
    return request({
        url: "/msg/update",
        method: 'post',
        data
    })
}


//系统设置 ==》 系统消息  详情
export function publishBackend(id) {
    return request({
        url: `/msg/read/${id}`,
    })
}


//审核管理 ==》 视频审核  详情
export function checkVideo(id) {
    return request({
        url: `/check/video/read/${id}`,
    })
}

//系统会员视频数量配置获取
export function checkVideoNumber(id) {
    return request({
        url: '/sellvip/get_video_number',
    })
}


//系统设置 ==》  基础配置  ==》 配置列表
export function publishConfig(params) {
    return request({
        url: '/config/index',
        method: 'get',
        params
    })
}

//系统设置 ==》  基础配置  ==》 配置详情信息
export function configRead(id) {
    return request({
        url: `/config/read/${id}`,
    })
}

//系统设置 ==》  基础配置  ==》 配置修改
export function configUpdate(data) {
    return request({
        url: "/config/update",
        method: 'post',
        data
    })
}