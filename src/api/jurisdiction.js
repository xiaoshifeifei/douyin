/*
 * @Descripttion: des
 * @version: v
 * @Author: ldh
 * @Date: 2020-07-07 16:28:17
 * @LastEditors: ldh
 * @LastEditTime: 2020-07-17 17:12:53
 */
import request from "@/utils/request";
// 系统设置---权限管理--版本管理列表
export function GetVersionsList() {
    return request({
        url: "/version/list",
        method: "get",
        // params: { keywords: Keywords, page: Page, limit: Limit }
    });
}





// 系统设置---权限管理--获取角色列表
export function GetTableList({ Keywords, Page, Limit }) {
    return request({
        url: "/role/list",
        method: "get",
        params: { keywords: Keywords, page: Page, limit: Limit }
    });
}
// 系统设置---权限管理--角色更新状态
export function upDateRole({ Keywords, Page, Limit }) {
    return request({
        url: "/role/list",
        method: "get",
        params: { keywords: Keywords, page: Page, limit: Limit }
    });
}
// 编辑角色
export function updateRoleEdit({ id, name, remark }) {
    return request({
        url: "/role/update",
        method: "post",
        data: { id, name, remark, status: 1 }
    });
    id;
}
// 删除角色
export function deleteRole({ id }) {
    return request({
        url: "/role/delete",
        method: "post",
        data: { id }
    });
}

// 系统设置---权限管理--修改密码
export function UpdatePassword(params = {}) {
    return request({
        url: "/xcxmenu/list",
        method: "get",
        params
    });
}
// 系统设置---权限管理--权限设置
export function SettingLimits(data) {
    return request({
        url: "/xcxmenu/list",
        method: "get",
        data
    });
}
// 系统设置---权限管理--删除
export function DeleteLimits(data) {
    return request({
        url: "/xcxmenu/list",
        method: "post",
        data
    });
}
// 系统设置---权限管理--批量删除
export function DeleteBatch(data) {
    return request({
        url: "/xcxmenu/list",
        method: "post",
        data
    });
}
// 系统设置---权限管理--新增管理
export function CreateManagement(data) {
    return request({
        url: "/xcxmenu/list",
        method: "post",
        data
    });
}
// 系统设置---权限管理--新增角色
export function CreateRole({ RoleName, Remark }) {
    return request({
        url: "/role/save",
        method: "post",
        data: { name: RoleName, remark: Remark, status: 1 }
    });
}

// 获取 菜单列表
export function getSystemMenus() {
    return request({
        url: "/menu/list",
        method: "get"
    });
}

// 授权
export function roleGrant(roleId, menuIds) {
    return request({
        url: "/role/grant",
        method: "post",
        data: {
            id: roleId,
            menu_ids: menuIds
        }
    });
}
// 分配 帐号
export function allotAccounts(RoleID, Accounts) {
    return request({
        url: "/role/allot",
        method: "post",
        data: { id: RoleID, admin_ids: Accounts }
    });
}
// 角色详情
export function getRoleInfo(roleId) {
    return request({
        url: "/role/read",
        method: "get",
        params: { id: roleId }
    });
}

// 管理员列表
export function getAccountList(data) {
    return request({
        url: "/admin/list",
        method: "get",
        params: { keywords: data.Keywords, page: data.Page, limit: data.Limit }
    });
}
// 创建管理员
export function createAccount(accountObjData) {
    return request({
        url: "/admin/save",
        method: "post",
        data: accountObjData
    });
}
// 更新管理员
export function updateAccount(accountObjData) {
    return request({
        url: "/admin/update",
        method: "post",
        data: accountObjData
    });
}
// 管理员信息
export function getAccountInfo(id) {
    return request({
        url: "/admin/read",
        method: "get",
        params: { id }
    });
}

// 删除管理员
export function deleteAccount(id) {
    return request({
        url: "/admin/delete",
        method: "post",
        data: { id }
    });
}

// 启用 禁用帐号
export function updateAccountStatus({ AdminID, AdminStatus }) {
    return request({
        url: "/s_admin/status",
        method: "post",
        data: { AdminID, AdminStatus }
    });
}