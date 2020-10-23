<template>
  <div id="jurisdiction" class="LoadingArea">
    <el-card>
      <div class="table_top" ref="heightTop">
        <div>
          <el-select v-model="value1" placeholder="会员类型">
            <el-option label="VIP会员" value="1"></el-option>
            <el-option label="普通会员" value="0"></el-option>
          </el-select>
          <el-select
            style="margin-left:20px"
            v-model="value2"
            placeholder="是否蓝V"
          >
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
          <el-date-picker
            style="margin-left:20px"
            v-model="valueTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <el-input
            v-model="keywords"
            prefix-icon="el-icon-search"
            placeholder="输入手机号/门店名称/抖音号搜索"
            style="min-width:350px;margin-left:20px"
            class="input-search"
          ></el-input>
          <el-button type="primary" @click="getLists" icon="el-icon-search"
            >查询</el-button
          >
          <el-button type="primary" @click="reaseList">重置条件</el-button>
        </div>
        <div class="btnCon">
          <el-button class="btnCli" type="primary" @click="addProduct()"
            >导出</el-button
          >
          <!-- <el-button type="primary" @click="createRole()">新增角色</el-button> -->
        </div>
        <div style="clear:both"></div>
      </div>

      <div class="table_list">
        <!-- 表格列表 -->
        <tablepublicss
          :tableData="pageData.rows"
          :columns="columns"
          :height="tableHeight"
          :pagesizes="pageSizes"
          @handleDelete="handleDelete"
          @handleSelectionChange="handleSelectionChange"
          @clickTable="clickTable"
          @handleEdit="handleEdit"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          @onAccountStatusChange="onAccountStatusChange"
          :total="pageData.total"
          :pageSize="limit"
          ref="chiidTable"
        >
        </tablepublicss>
      </div>
      <el-dialog
        title="分配帐号"
        :visible.sync="dialogAccount"
        width="800"
        :show-close="true"
        @close="onAccountEditorClose"
      >
        <div class="formStyle">
          <el-form label-width="100px">
            <el-form-item label="角色名称">
              <el-input :value="accountData.role.name" readonly></el-input>
            </el-form-item>
            <el-form-item label="选择帐号">
              <el-col :span="10">
                <el-input
                  v-model="accountData.keywords"
                  prefix-icon="el-icon-search"
                  placeholder="输入帐号名搜索"
                >
                </el-input>
              </el-col>
              <el-button
                type="primary"
                @click="onSearchAccounts"
                style="margin-left:50px;"
                >搜索</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-table
                max-height="300"
                :data="accountData.list"
                @selection-change="onAccountCheck"
                border
                size="mini"
              >
                <el-table-column
                  type="selection"
                  width="100"
                  align="center"
                  :resizable="false"
                >
                </el-table-column>
                <el-table-column
                  prop="name"
                  label="帐号名"
                  min-width="100"
                  align="center"
                  :resizable="false"
                >
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item>
              <el-button @click="onAccountEditorClose">取消</el-button>
              <el-button type="primary" @click="saveAccountChecked"
                >保存</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </el-dialog>
      <el-dialog :title="edatPa" :visible.sync="dialoInfo" width="60%">
        <div class="formStyle">
          <el-form
            :model="myInfo.base_info"
            :rules="myInfo.myRules"
            ref="Info"
            label-position="right"
            :hide-required-asterisk="false"
            label-width="200px"
          >
            <el-form-item
              label="注册手机号"
              prop="tel"
              class="bgctable bordertable"
            >
              <el-input v-model="myInfo.base_info.tel" readonly></el-input>
            </el-form-item>
            <el-form-item
              label="门店名称"
              prop="store_name"
              class="bgctable bortop"
            >
              <el-input
                v-model="myInfo.base_info.store_name"
                readonly
              ></el-input>
            </el-form-item>
            <el-form-item
              label="抖音号"
              prop="tiktok_num"
              class="bgctable bortop"
            >
              <el-input
                v-model="myInfo.base_info.tiktok_num"
                readonly
              ></el-input>
            </el-form-item>
            <el-form-item
              label="是否蓝V"
              prop="is_apply_bluev_text"
              class="bgctable bortop"
            >
              <el-input
                v-model="myInfo.base_info.is_apply_bluev_text"
                readonly
              ></el-input>
            </el-form-item>
            <el-form-item
              label="会员类型"
              prop="is_vip_text"
              class="bgctable bortop"
            >
              <el-input
                v-model="myInfo.base_info.is_vip_text"
                readonly
              ></el-input>
            </el-form-item>
            <el-form-item
              label="会员到期时间"
              prop="create_time"
              class="bgctable bortop"
            >
              <el-input
                v-model="myInfo.base_info.invalid_time"
                readonly
              ></el-input>
            </el-form-item>
            <el-form-item
              label="注册时间"
              class="bgctable bortop"
              prop="create_time"
            >
              <el-input
                v-model="myInfo.base_info.create_time"
                readonly
              ></el-input>
            </el-form-item>
            <!-- <el-form-item>
              <el-button @click="dialoInfo = false">取消</el-button>
              <el-button
                type="primary"
                @click="onSaveRole"
                :disabled="edatPa == '详情'"
                >保存</el-button
              >
            </el-form-item> -->
          </el-form>
          <div class="shinfo">门店信息</div>

          <el-form
            :model="myInfo.store_info"
            :rules="myInfo.myRules"
            ref="Info"
            label-position="right"
            :hide-required-asterisk="false"
            label-width="200px"
          >
            <div class="divbox1">
              <div class="box-l">
                门店营业执照
              </div>
              <div class="box-r">
                <el-image
                class="imgShow"
                :preview-src-list="[myInfo.store_info.business_license_url]"
                :src="myInfo.store_info.business_license_url"
                alt
              ></el-image>
              </div>
            </div>
            <div class="divbox1">
              <div class="box-l">
                门店logo
              </div>
              <div class="box-r">
                <el-image
                class="imgShow"
                :preview-src-list="[myInfo.store_info.avatar]"
                :src="myInfo.store_info.avatar"
                alt
              ></el-image>
              </div>
            </div>
            <!-- <el-form-item label="门店营业执照" prop="business_license_url">
              <el-image
                class="imgShow"
                :preview-src-list="[myInfo.store_info.business_license_url]"
                :src="myInfo.store_info.business_license_url"
                alt
              ></el-image>
            </el-form-item> -->
            <!-- <el-form-item label="门店logo" prop="avatar">
              <el-image
                class="imgShow"
                :preview-src-list="[myInfo.store_info.avatar]"
                :src="myInfo.store_info.avatar"
                alt
              ></el-image>
            </el-form-item> -->
            <el-form-item
              label="联系人"
              prop="contacts"
              class="bgctable bortop"
            >
              <el-input
                v-model="myInfo.store_info.contacts"
                readonly
              ></el-input>
            </el-form-item>
            <el-form-item
              label="联系人手机号"
              prop="tel"
              class="bgctable bortop"
            >
              <el-input v-model="myInfo.store_info.tel" readonly></el-input>
            </el-form-item>
            <el-form-item
              label="所在省市区"
              prop="province_name"
              class="bgctable bortop"
            >
              <!-- <el-input
                 v-model="myInfo.store_info.province_name"
                readonly
              ></el-input> -->
              <template slot-scope="scope" >
               <div class="scopBg" v-if="myInfo.store_info.province_name">
                {{myInfo.store_info.province_name || ''}} {{myInfo.store_info.city_name}} {{myInfo.store_info.district_name}}
               </div>
               <el-input
              v-else
                 v-model="myInfo.store_info.province_name"
                readonly
              ></el-input>
              </template>
              
            </el-form-item>
            <el-form-item
              label="具体地址"
              prop="address"
              class="bgctable bortop"
            >
              <el-input v-model="myInfo.store_info.address" readonly></el-input>
              
            </el-form-item>
            <el-form-item label="门店介绍" class="bgctable bortop" prop="des">
              <el-input v-model="myInfo.store_info.des" readonly></el-input>
            </el-form-item>
          </el-form>

          <div class="shinfo" v-if="myInfo.vip_order.length != 0">会员记录</div>
          <el-form
            :model="myInfo"
            :rules="myInfo.myRules"
            ref="Infoss"
            label-position="right"
            :hide-required-asterisk="false"
            label-width="50px"
            style="width:100%;margin:auto"
          >
            <div v-for="(item, index) in myInfo.vip_order" :key="index">
              <div class="divbox">
                <div class="box-l">
                  {{ item.create_time }}
                </div>
                <div class="box-r">
                  {{ item.remark }}
                </div>
              </div>
            </div>
          </el-form>
        </div>
        <div >
          <el-button @click="dialoInfo = false" class="diafooter">取消</el-button>
        </div>
      </el-dialog>
      <el-dialog
        title="申请"
        :before-close="isShowClick"
        :visible.sync="isShowP"
        width="800"
        :show-close="false"
      >
        <el-form
          :model="Info"
          :rules="roleRuless"
          ref="Infoss"
          label-position="right"
          :hide-required-asterisk="false"
          label-width="150px"
        >
          <el-form-item label="申请理由" prop="remark">
            <el-input
              type="textarea"
              v-model="Info.remark"
              placeholder="请输入天数"
            ></el-input>
          </el-form-item>
          <div class="pl_20">
            <el-button class="btnA" type="primary" @click="commitClick"
              >保存</el-button
            >
            <el-button class="btnB" @click="isShowClick">取消</el-button>
            <div style="clear:both"></div>
          </div>
        </el-form>
      </el-dialog>
      <!-- 导出部分 -->
      <el-dialog
        title="导出"
        v-loading="tableLoading"
        :visible.sync="addEmpShow1"
        width="80%"
        :before-close="handleDialogClose3"
      >
        <el-table
          id="table_out"
          ref="multipleTable"
          :data="allArray"
          border
          class="table"
          height="300"
          header-cell-class-name="table-header"
          style="width: 100%;margin:30px auto 0 auto;"
        >
          <el-table-column label="序号" type="index" width="80" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="avatar" align="center" label="门店图标">
            <template slot-scope="scope">
              <div v-show="false">
                {{scope.row.avatar}}
              </div>
              <el-image
                :preview-src-list="[scope.row.avatar]"
                :src="scope.row.avatar == '' ? '加载中...' : scope.row.avatar"
                alt
              ></el-image>
            </template>
          </el-table-column> -->
          <el-table-column prop="tel" align="center" label="注册手机号" />
          <el-table-column prop="store_name" align="center" label="门店名称" />
          <el-table-column prop="tiktok_num" align="center" label="抖音号" />
          <el-table-column
            prop="is_apply_bluev_text"
            align="center"
            label="是否蓝V"
          />
          <el-table-column prop="is_vip_text" align="center" label="会员类型" />
          <el-table-column
            prop="invalid_time"
            align="center"
            label="会员到期时间"
          />
          <el-table-column prop="parentTel" align="center" label="推广者手机号" />
          <el-table-column prop="create_time" align="center" label="注册时间" />
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleDialogClose3">取 消</el-button>
          <el-button type="primary" @click="exportExcel()">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import {
  GetTableList,
  UpdatePassword,
  SettingLimits,
  DeleteLimits,
  DeleteBatch,
  deleteRole,
  updateRole,
  updateRoleEdit,
  getSystemMenus,
  roleGrant,
  getRoleInfo,
  getAccountList,
  allotAccounts
} from "@/api/jurisdiction";
import { getList } from "../../../api/table";
import {
  stoList, //列表获取
  stoRead, //获取详情
  storeSellvip, //会员赠送
  stoExport //门店导出
} from "@/api/listvip";
import XLSX from "xlsx";
import { thirteenBitTimestamp } from "@/utils/index";
import FileSaver from "file-saver";

import JSZip from "jszip";
import axios from "axios";

import table2excel from "js-table2excel";
import index from "v-charts/lib/histogram.common";

export default {
  data() {
    return {
      startTime: "",
      endTime: "",
      valueTime: "",
      value1: "", //会员类型
      value2: "", //是否蓝V

      allArrays: [],
      layout: "inline",
      labelCol1: {
        xs: {
          span: 24
        },
        sm: {
          span: 8
        }
      },
      wrapperCol1: {
        xs: {
          span: 24
        },
        sm: {
          span: 16
        }
      },
      labelCol2: {
        xs: {
          span: 12
        },
        sm: {
          span: 18
        }
      },
      wrapperCol2: {
        xs: {
          span: 12
        },
        sm: {
          span: 18
        }
      },
      tableLoading: false,
      edatPa: "",
      addEmpShow1: false, //导出弹窗
      keywords: "", // 搜索
      data: [
        {
          id: 1,
          label: "权限管理",
          children: [
            {
              id: 2,
              label: "人员管理",
              children: [
                {
                  id: 11,
                  label: "查看"
                },
                {
                  id: 12,
                  label: "添加"
                },
                {
                  id: 13,
                  label: "修改"
                },
                {
                  id: 14,
                  label: "删除"
                }
              ]
            },
            {
              id: 3,
              label: "清扫请求",
              children: [
                {
                  id: 15,
                  label: "查看"
                },
                {
                  id: 16,
                  label: "添加"
                },
                {
                  id: 17,
                  label: "修改"
                },
                {
                  id: 18,
                  label: "删除"
                },
                {
                  id: 19,
                  label: "接收订单"
                }
              ]
            },
            {
              id: 4,
              label: "维权请求",
              children: [
                {
                  id: 20,
                  label: "查看"
                },
                {
                  id: 21,
                  label: "添加"
                },
                {
                  id: 22,
                  label: "修改"
                },
                {
                  id: 23,
                  label: "删除"
                },
                {
                  id: 24,
                  label: "接收订单"
                }
              ]
            },
            {
              id: 5,
              label: "退房请求",
              children: [
                {
                  id: 25,
                  label: "查看"
                },
                {
                  id: 26,
                  label: "添加"
                },
                {
                  id: 27,
                  label: "修改"
                },
                {
                  id: 28,
                  label: "删除"
                },
                {
                  id: 29,
                  label: "接收订单"
                }
              ]
            },
            {
              id: 6,
              label: "评论管理",
              children: [
                {
                  id: 30,
                  label: "查看"
                },
                {
                  id: 31,
                  label: "回复"
                }
              ]
            },
            {
              id: 7,
              label: "租赁订单",
              children: [
                {
                  id: 32,
                  label: "查看"
                },
                {
                  id: 33,
                  label: "添加"
                },
                {
                  id: 34,
                  label: "修改"
                },
                {
                  id: 35,
                  label: "删除"
                },
                {
                  id: 36,
                  label: "接收订单"
                }
              ]
            },
            {
              id: 8,
              label: "客户订单",
              children: [
                {
                  id: 37,
                  label: "查看"
                },
                {
                  id: 38,
                  label: "添加"
                },
                {
                  id: 39,
                  label: "修改"
                },
                {
                  id: 40,
                  label: "删除"
                },
                {
                  id: 41,
                  label: "接收订单"
                }
              ]
            },
            {
              id: 9,
              label: "客户服务",
              children: [
                {
                  id: 42,
                  label: "查看"
                },
                {
                  id: 43,
                  label: "添加"
                },
                {
                  id: 44,
                  label: "修改"
                },
                {
                  id: 45,
                  label: "删除"
                },
                {
                  id: 46,
                  label: "接收订单"
                }
              ]
            },
            {
              id: 10,
              label: "banner管理",
              children: [
                {
                  id: 47,
                  label: "查看"
                },
                {
                  id: 48,
                  label: "添加"
                },
                {
                  id: 49,
                  label: "修改"
                },
                {
                  id: 50,
                  label: "删除"
                },
                {
                  id: 51,
                  label: "接收订单"
                }
              ]
            }
          ]
        }
      ],
      dialogSetting: false,
      dialoInfo: false,
      Pswd: {},
      Info: {},
      dialogAccount: false,
      isShowP: false,
      rulesPswd: {
        oldPwd: [
          { required: true, message: "请输入酒店名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        newPwd: [
          { required: true, message: "请输入酒店名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        confirmPwd: [
          { required: true, message: "请输入酒店名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      rulesInfo: {},
      multipleSelectionAll: [], // 多页选择
      multipleSelection: [], // 单页选择
      idKey: "user_store_id",
      tableHeight: 0,
      url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      srcList: [
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
      ],
      activeId: [],
      randomKey: "",
      total: 0, // 总数
      page: 1, // 页码
      limit: 10, // 一页几条
      pageSizes: [10, 20, 50, 100],
      curPage: 1,
      myId: "",
      pageData: {
        // eslint-disable-next-line camelcase
        current_page: 1,
        rows: [],
        total: 0,
        // eslint-disable-next-line camelcase
        total_page: 0
      },
      roleRules: {
        Remark: [
          { required: true, message: "请输入申请理由" },
          { min: 0, max: 1000000, message: "请输入申请理由" }
        ]
      },
      roleRuless: {
        tiktok_num: [{ required: true, message: "请输入抖音号" }],
        share_url: [{ required: true, message: "请填写抖音号分享地址" }],
        remark: [
          { required: true, message: "请输入申请理由" },
          { min: 0, max: 1000000, message: "请输入申请理由" }
        ]
      },
      myInfo: {
        base_info: {
          tel: "",
          store_name: "",
          tiktok_num: "",
          is_apply_bluev: "",
          is_apply_bluev_text: "",
          is_vip: 1,
          is_vip_text: "",
          invalid_time: "",
          create_time: ""
        },
        store_info: {
          store_id: "",
          avata: "",
          store_name: "",
          contacts: "",
          tel: "",
          province_name: "",
          city_name: "",
          district_name: "",
          address: "",
          des: "",
          business_license_url: ""
        },
        vip_order: [
          {
            order_id: "",
            remark: "",
            create_time: ""
          }
        ],
        myRules: {
          // tiktok_num: [{ required: true, message: "请输入抖音号" }],
          share_url: [{ required: true, message: "请填写抖音号分享地址" }],
          remark: [
            { required: true, message: "请输入申请理由" },
            { min: 0, max: 1000000, message: "请输入申请理由" }
          ]
        }
      },
      systemMenus: {
        // 授权 系统菜单列表
        list: [],
        checkedKeys: [],
        halfCheckedKeys: []
      },
      accountData: {
        role: {},
        keywords: "",
        list: [], // 搜索帐号列表
        checked: []
      },
      paramsListArr: [],
      allArray: [], //导出的数组

      // 新
      columns: [
        {
          id: "selection",
          type: "selection",
          label: "",
          fixed: false,
          width: "55",
          prop: "",
          isShow: true,
          align: "center"
        },
        {
          id: "tel",
          type: "",
          label: "注册手机号",
          fixed: false,
          width: "",
          prop: "tel",
          isShow: true,
          align: "center"
        },
        {
          id: "store_name",
          type: "",
          label: "门店名称",
          fixed: false,
          width: "",
          prop: "store_name",
          isShow: true,
          align: "center"
        },
        {
          id: "tiktok_num",
          type: "",
          label: "抖音号",
          fixed: false,
          width: "",
          prop: "tiktok_num",
          isShow: true,
          align: "center"
        },
        {
          id: "is_apply_bluev_text",
          type: "",
          label: "是否蓝V",
          fixed: false,
          width: "",
          prop: "is_apply_bluev_text",
          isShow: true,
          align: "center"
        },
        {
          id: "is_vip_text",
          type: "",
          label: "会员类型",
          fixed: false,
          width: "",
          prop: "is_vip_text",
          isShow: true,
          align: "center"
        },
        {
          id: "invalid_time",
          type: "",
          label: "VIP会员到期时间",
          fixed: false,
          width: "",
          prop: "invalid_time",
          isShow: true,
          align: "center"
        },
         {
          id: "parentTel",
          type: "",
          label: "推广者手机号",
          fixed: false,
          width: "",
          prop: "parentTel",
          isShow: true,
          align: "center"
        },
        {
          id: "create_time",
          type: "",
          label: "注册时间",
          fixed: false,
          width: "200",
          prop: "create_time",
          isShow: true,
          align: "center"
        },
        {
          id: "button",
          type: "button",
          label: "操作",
          fixed: "right",
          width: "270",
          prop: "",
          isShow: true,
          align: "center",
          list: [
            {
              id: "seedit",
              name: "查看",
              type: "primary"
            },
            // {
            //   id: "edit",
            //   name: "编辑",
            //   type: "primary"
            // },
            {
              id: "accountFenPei",
              name: "赠送会员",
              type: "warning"
            }
          ]
        }
      ]
    };
  },
  mounted() {
    this.getList();
    this.$nextTick(function() {
      this.tableHeight =
        window.innerHeight - this.$refs.heightTop.offsetHeight - 350 + "px";
      // 监听窗口大小变化
      let self = this;
      window.onresize = function() {
        self.tableHeight =
          window.innerHeight - self.$refs.heightTop.offsetHeight - 350 + "px";
      };
    });
  },
  methods: {
    getLists() {
      this.page = 1
      this.getList()
    },
    // 重置条件
    reaseList() {
      console.log("重置");
      console.log("valueTime", this.valueTime);
      this.keywords = "";
      this.page = 1;
      this.limit = 10;
      this.value1 = ""; //会员类型
      this.value2 = ""; //是否蓝V
      this.valueTime = ""; //时间日期
      this.getList();
    },
    addProduct11() {
      // 导出
      let newarr = [
        {
          name: "1111",
          baseImg: "/9j/4AAQSkZJRgABAQA"
        }
      ];
      this.StoreDowQrcode(newarr);
    },

    StoreDowQrcode(arr, blogTitle = "二维码") {
      var zip = new JSZip();
      var imgs = zip.folder(blogTitle);
      var baseList = [];
      var _this = this; //var arr = ["/images/bg.png", "/images/bg1.png"];
      for (var i = 0; i < arr.length; i++) {
        //console.log(arr[i].name);
        let name = arr[i].name; //图片名称
        let image = new Image(); // 解决跨域 Canvas 污染问题
        image.setAttribute("crossOrigin", "anonymous");
        image.onload = function() {
          let canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          let context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, image.width, image.height);
          let url = canvas.toDataURL(); // 得到图片的base64编码数据 let url =
          canvas.toDataURL("image/png");
          baseList.push({ name: name, img: url.substring(22) });
          if (baseList.length === arr.length) {
            if (baseList.length > 0) {
              console.log(777);
              _this.$notify({
                title: "成功",
                message: "即将下载",
                type: "success"
              });
              for (let k = 0; k < baseList.length; k++) {
                imgs.file(baseList[k].name + ".png", baseList[k].img, {
                  base64: true
                });
              }
              zip.generateAsync({ type: "blob" }).then(function(content) {
                // see FileSaver.js
                FileSaver.saveAs(content, blogTitle + ".zip");
              });
            } else {
              _this.$notify.error({
                title: "错误",
                message: "暂无图片可下载"
              });
            }
          }
        };
        image.src = arr[i].baseImg = `data:image/png;base64,${arr[i].baseImg}`;
      }
    },

    // // 压缩单张照片
    // down() { // 保存二维码
    //   this.downloadIamge('http://bytetest.oss-cn-zhangjiakou.aliyuncs.com/store/business_license//20200921/0462b32f86b0d2d50acf0ae684b8e125.jpeg', 'pic')
    // },
    //  downloadIamge (imgsrc, name) { // 下载图片地址和图片名
    //   var image = new Image()
    //   // 解决跨域 Canvas 污染问题
    //   image.setAttribute('crossOrigin', 'anonymous')
    //   image.onload = function () {
    //     var canvas = document.createElement('canvas')
    //     canvas.width = image.width
    //     canvas.height = image.height
    //     var context = canvas.getContext('2d')
    //     context.drawImage(image, 0, 0, image.width, image.height)
    //     var url = canvas.toDataURL('image/png') // 得到图片的base64编码数据
    //     var a = document.createElement('a') // 生成一个a元素
    //     var event = new MouseEvent('click') // 创建一个单击事件
    //     a.download = name || 'photo' // 设置图片名称
    //     a.href = url // 将生成的URL设置为a.href属性
    //     a.dispatchEvent(event) // 触发a的单击事件
    //   }
    //   image.src = imgsrc
    // },

    // 压缩一个数组的照片
    getFile(url) {
      return new Promise((resolve, reject) => {
        axios({
          method: "get",
          url,
          responseType: "arraybuffer"
        })
          .then(data => {
            resolve(data.data);
          })
          .catch(error => {
            reject(error.toString());
          });
      });
    },
    // 批量下载
    async handleBatchDownload(selectImgList) {
      console.log("selectImgList", selectImgList);
      const data = this.allArrays; //可传数组的转base64图片
      const zip = new JSZip();
      const cache = {};
      const promises = [];
      await data.forEach(item => {
        const promise = this.getFile(item).then(data => {
          // 下载文件, 并存成ArrayBuffer对象
          const arr_name = item.split("/");
          let file_name = arr_name[arr_name.length - 1]; // 获取文件名
          // if (file_name.indexOf('.png') == -1) {
          //    file_name = file_name + '.png'
          // }
          zip.file(file_name, data, {
            binary: true
          }); // 逐个添加文件
          cache[file_name] = data;
        });
        promises.push(promise);
      });
      Promise.all(promises).then(() => {
        zip
          .generateAsync({
            type: "blob"
          })
          .then(content => {
            // 生成二进制流
            FileSaver.saveAs(content, "用户列表数据.zip"); // 利用file-saver保存文件
          });
      });
      console.log("成功啦");
    },
    // 导出
    addProduct() {
      console.log("multipleSelection65666", this.multipleSelectionAll);
      console.log("multipleSelection", this.multipleSelection);
      if (
        this.multipleSelection.length == 0 &&
        this.multipleSelectionAll == 0
      ) {
        console.log("11111");
        this.page = 1;
        this.limit = 5000;
        this.getList().then(() => {
          // console.log("this.allArray6464",this.allArray);
          // this.allArray.forEach(item=>{
          //   console.log('item222',item);
          //   if(item.business_license_url.indexOf("bytetest.oss-cn-zhangjiakou.aliyuncs.com") != -1){
          //     this.allArrays.push("/oss_file" + item.business_license_url.substring(47,10000))
          //     }
          // })
          this.addEmpShow1 = true;
          return;
        });
      } else if (
        this.multipleSelection.length > 5000 ||
        this.multipleSelectionAll.length > 5000
      ) {
        console.log(2222);
        this.$message("导出数据不能超过1000条");
        return;
      } else if (
        this.multipleSelection.length > 0 ||
        this.multipleSelectionAll.length > 0
      ) {
        console.log(3333);
        const arrayNew = [
          ...new Set(this.multipleSelectionAll.concat(this.multipleSelection))
        ];

        // console.log("arrayNew", arrayNew);
        let ary2 = [];
        for (let val of arrayNew) {
          if (!ary2.some(item => item.user_store_id == val.user_store_id)) {
            ary2.push(val);
          }
        }
        // console.log('ary2',ary2)   this.allArray
        // for(let i=0; i<this.allArray.length; i++) {
        //   for (let index = 0; index < ary2.length; index++) {
        //     console.log('ary2[index]',ary2[index].user_store_id);
        //   }
        //   console.log('i',this.allArray[i].user_store_id);
        // }

        this.allArray = ary2;
        this.addEmpShow1 = true;
      }
    },

    // 导出确定
    exportExcel() {
      // this.addProduct11();
      // this.down()   //压缩单张照片方法
      // this.handleBatchDownload(this.allArrays); //压缩数组照片方法

      // 导出表格
      const xlsxParam = {
        raw: true
      }; // 转换成excel时，使用原始的格式
      let wb = "";
      wb = XLSX.utils.table_to_book(
        document.querySelector("#table_out"),
        xlsxParam
      ); // 这里就是表格
      console.log(wb);
      const wbout = XLSX.write(wb, {
        bookType: "xlsx",
        bookSST: true,
        type: "array"
      });
      console.log(wbout);
      //  eslint-disable-next-line camelcase
      // this.$emit('update:addEmpShow1', false)

      let tittle =
        thirteenBitTimestamp(new Date().getTime()) + "用户列表数据.xlsx";
      try {
        FileSaver.saveAs(
          new Blob([wbout], {
            type: "application/octet-stream"
          }),
          tittle
        ); // table是自己导出文件时的命名，随意
      } catch (e) {
        if (typeof console !== "undefined") {
          console.log(e, wbout);
        }
      }
      // history.go(0)
    },
    // 当前页选择
    handleSelectionChange(val) {
      console.log("当前页选择", val.val);
      this.multipleSelection = val.val;
      console.log("this.multipleSelection", this.multipleSelection);
      if (this.multipleSelectionAll.length == 0) {
        this.multipleSelectionAll = this.multipleSelection;
      }
      console.log("this.multipleSelectionAll78946", this.multipleSelectionAll);
      // 此处如果当前页选择为0 去掉所有数据中重复的数据

      val.val.forEach((m, i) => {
        this.activeId.push(m[this.idKey]);
        this.activeId = this.activeId.filter(function(x, index, self) {
          return self.indexOf(x) === index;
        });
        // this.activeId.filter(())
      });
      console.log("this.activeId", this.activeId);
      // this.changePageCoreRecordData();
    },
    // 切换每页展示条数
    handleSizeChange(val) {
      console.log("val切换每页展示条数", val);
      this.changePageCoreRecordData();
      this.limit = +val;
      this.getList();
    },
    // 切换page
    handleCurrentChange(val) {
      console.log("切换page", val);
      // eslint-disable-next-line camelcase
      // this.pageData.current_page = +val
      this.page = val;
      this.changePageCoreRecordData();
      this.getList();
    },
    // 导出取消
    handleDialogClose3() {
      // this.$refs.multipleTable.resetFields()
      this.addEmpShow1 = false;
      this.limit = 10;
    },
    // 申请取消
    isShowClick() {
      this.Info = {
        tiktok_num: "",
        share_url: "",
        remark: ""
      };
      this.$refs.Infoss.resetFields();
      this.isShowP = false;
    },
    // 申请保存
    async commitClick() {
      console.log(111);
      const data = {
        // tiktok_num: this.Info.tiktok_num,
        // share_url: this.Info.share_url,
        days: this.Info.remark,
        store_id: this.myId
      };
      try {
        let res = await storeSellvip(data);
        if (res.code === 0) {
          this.$message.success("申请成功");
          this.$refs.Infoss.resetFields();
          this.isShowP = false;
        } else {
          this.$message.error("申请失败");
        }
      } catch (error) {
        // this.$message.error("申请失败");
      }
    },
    //按钮
    handleEdit(item) {
      if (item.row == "seedit") {
        console.log("查看");
        this.handleInfo(item.index);
      } else if (item.row == "edit") {
        console.log("编辑");
        // this.onAuth(item.index);
      } else if (item.row == "accountFenPei") {
        // console.log("会员申请", item);
        this.onAccount(item.index);
      }
    },
    clickTable() {},

    // 分配帐号搜索
    async onSearchAccounts() {
      try {
        let res = await getAccountList({
          Keywords: this.accountData.keywords,
          Page: 1,
          Limit: 500
        });
        if (res.code === 0) {
          this.accountData.list = res.data.rows;
        } else {
          this.$message.error("搜索帐号失败");
        }
      } catch (error) {
        this.$message.error("搜索帐号失败");
      }
    },
    // 分配帐号
    onAccountCheck(e) {
      this.accountData.checked = e.reduce((ids, item) => {
        ids.push(item.id);
        return ids;
      }, []);
    },
    // 关闭 分配帐号 面板
    onAccountEditorClose() {
      this.accountData.list = [];
      this.accountData.checked = [];
      this.accountData.keywords = "";
    },
    // 保存 帐号分配
    async saveAccountChecked() {
      let res = await allotAccounts(
        this.accountData.role.id,
        this.accountData.checked.join(",")
      );
      if (res.code === 0) {
        this.$message.success("帐号分配保存成功");
        this.onAccountEditorClose();
      } else {
        this.$message.error("帐号分配保存失败");
      }
    },
    // 获取角色列表
    async getList() {
      this.tableLoading = true;
      if (this.valueTime != "") {
        this.startTime =
          this.valueTime[0].getFullYear() +
          "-" +
          (this.valueTime[0].getMonth() + 1) +
          "-" +
          this.valueTime[0].getDate();
        this.endTime =
          this.valueTime[1].getFullYear() +
          "-" +
          (this.valueTime[1].getMonth() + 1) +
          "-" +
          this.valueTime[1].getDate();
      } else {
        this.startTime = "";
        this.endTime = "";
      }

      let res = await stoList({
        keywords: this.keywords,
        page: this.page,
        limit: this.limit,
        is_apply_bluev: this.value2,
        is_vip: this.value1,
        from_time: this.startTime,
        to_time: this.endTime
      })
        .then(res => {
          console.log("res555", res);
          this.allArray = res.data.rows;
          console.log("this.allArray666666", this.allArray);
          this.pageData = res.data;
          console.log(
            "this.multipleSelectionAll5555",
            this.multipleSelectionAll
          );
          setTimeout(() => {
            this.$refs.chiidTable.setSelectRow(
              this.multipleSelectionAll,
              this.pageData.rows
            );
          }, 500);

          this.tableLoading = false;
        })
        .catch(err => {
          this.$message.error("获取列表失败");
        });

      // try {
      //   let res = await bluevList({
      //     keywords: this.keywords,
      //     page: this.page,
      //     limit: this.limit
      //   });
      //   this.tableLoading = true
      //   if (res.code === 0) {
      //     this.allArray = res.data.rows

      //     // setTimeout(() => {
      //     //   this.allArray = res.data.rows
      //     //   console.log('this.allArray',this.allArray);
      //     //   const arrayList = []
      //     //   for (let index = 0; index < this.allArray.length; index++) {
      //     //     console.log('index.business_license_url',this.allArray[index].business_license_url);
      //     //     this.imageUrlToBase64(this.allArray[index].business_license_url)
      //     //     console.log(111);
      //     //   }

      //     //   // this.allArray.forEach(item => {
      //     //   //   arrayList.push(item.business_license_url)
      //     //   // })
      //     //   // console.log('arrayList',arrayList);
      //     //   // this.paramsListArr = arrayList
      //     //   this.tableLoading = false
      //     // }, 800);

      //     this.pageData = res.data;
      //     setTimeout(() => {
      //       this.$refs.chiidTable.setSelectRow(
      //         this.multipleSelectionAll,
      //         this.pageData.rows
      //       );
      //       this.tableLoading = false
      //     }, 200);
      //   } else {
      //     this.$message.error("获取列表失败");
      //     this.tableLoading = false
      //   }
      // } catch (error) {
      //   // console.log(error);
      //   this.$message.error("获取列表失败");
      // }
    },

    // 删除角色
    onDeleteRole(roleData) {
      const { id, name } = roleData;
      this.$confirm(`确认要删除角色 【${name}】  吗?`, "提示", {
        type: "warning"
      }).then(async () => {
        id;
        try {
          let res = await deleteRole({ id });
          this.$message.success(`删除角色  ${name}  成功`);
          this.getList();
        } catch (error) {
          console.log(error);
        }
      });
    },
    // 编辑保存 角色
    onSaveRole() {
      this.$refs.Info.validate(async valid => {
        if (!valid) return;
        await this.$confirm("确认要保存对该角色的编辑吗", "提示", {
          type: "warning"
        });
        const { id, name, remark } = this.Info;
        try {
          let res = await updateRoleEdit({ id, name, remark });
          console.log(res);
          if (res.code === 0) {
            this.dialoInfo = false;
            this.$message.success("角色编辑保存成功");
            this.getList();
          } else {
            throw new Error();
          }
        } catch (error) {
          this.$message.error("角色编辑保存失败");
        }
      });
    },
    // 批量删除
    handleDelete() {
      let selectIdArr = [];
      this.multipleSelectionAll.forEach(row => {
        selectIdArr.push(row.MenuID);
      });
      this.$confirm("确认上架选中的数据?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // 代换接口
        DeleteBatch({ MenuIDArr: selectIdArr })
          .then(res => {
            this.$message.success(res.msg);
            this.getList();
            this.multipleSelectionAll = [];
          })
          .catch(err => {
            this.$message.error(err.msg);
          });
      });
    },

    // 记忆选择核心方法
    changePageCoreRecordData() {
      let idKey = this.idKey;
      let that = this;

      if (this.multipleSelectionAll.length <= 0) {
        console.log(111);
        // 选中的数组
        // this.multipleSelectionAll = this.multipleSelection;
        // return;
      }
      console.log(222);
      let selectAllIds = [];
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      let selectIds = [];
      this.multipleSelection.forEach(row => {
        selectIds.push(row[idKey]);
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          // 选中的数组
          that.multipleSelectionAll.push(row);
          console.log(
            "that.multipleSelectionAll111",
            that.multipleSelectionAll
          );
        }
      });
      // 当也未选中ID
      let noSelectIds = [];
      this.pageData.rows.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey]);
        }
      });

      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < that.multipleSelectionAll.length; i++) {
            if (that.multipleSelectionAll[i][idKey] == id) {
              that.multipleSelectionAll.splice(i, 1);
              console.log(
                "that.multipleSelectionAll222",
                that.multipleSelectionAll
              );
              break;
            }
          }
        }
      });
    },

    createRole() {
      this.$router.push("/systemSet/addRole");
    },
    createManage() {
      this.$router.push("/systemSet/mana");
    },
    handleUpdate() {
      this.dialogPsw = true;
    },
    /**
     * 授权编辑窗口
     */
    async onAuth(roleData) {
      this.systemMenus.checkedKeys = [];
      this.systemMenus.halfCheckedKeys = [];
      this.dialogSetting = true;
      this.systemMenus.roleId = roleData.id;
      // 获取角色已有权限信息
      try {
        let info = await getRoleInfo(roleData.id);
        if (info.code === 0) {
          this.systemMenus.checkedKeys = info.data.rules
            ? info.data.rules.split(",")
            : [];
        } else {
          this.dialogSetting = false;
        }
      } catch (error) {
        this.dialogSetting = false;
      }
      // 菜单列表
      if (this.systemMenus.list.length) {
        let list = this.systemMenus.list;
        this.systemMenus.list = [];
        return this.$nextTick(() => {
          this.systemMenus.list = list;
        });
      }
      try {
        let res = await getSystemMenus();
        if (res.code === 0) {
          this.meuns2Class(res.data);
        } else {
          throw new Error("获取权限菜单失败");
        }
      } catch (error) {
        this.$message.error("获取权限菜单失败");
        this.dialogSetting = true;
      }
    },
    /**
     * 菜单归类整理
     */
    meuns2Class(menus) {
      if (!menus.length) return [];
      menus.sort((a, b) => b.Sort - a.Sort);
      let mArr = [];
      console.log(menus);
      menus.forEach(m => {
        if (m.parent_id === 0) {
          mArr.push({
            ...m,
            children: []
          });
        } else {
          this.children2Class(mArr, m);
        }
      });
      console.log(mArr);
      this.systemMenus.list = [
        {
          id: -1,
          title: "全选",
          children: mArr
        }
      ];
    },
    // 子菜单归类
    children2Class(mArr, menu) {
      return mArr.forEach(v => {
        if (v.id === menu.parent_id) {
          v.children.push({
            ...menu,
            children: []
          });
        } else {
          this.children2Class(v.children, menu);
        }
      });
    },
    // 授权菜单 check事件
    onMenuTreeCheck(menu, node) {
      this.systemMenus.checkedKeys = node.checkedKeys;
      this.systemMenus.halfCheckedKeys = node.halfCheckedKeys;
    },
    // 保存 授权
    async onRoleGrant() {
      const { roleId, checkedKeys } = this.systemMenus;
      if (!checkedKeys.length) {
        return this.$message.warning("角色权限不能为空");
      }
      try {
        let menuIds = checkedKeys.sort((a, b) => parseInt(a) - parseInt(b));
        // // if (menuIds.includes("-1") || menuIds.includes(1)) {
        // //   menuIds.shift();
        // // }
        let res = await roleGrant(roleId, menuIds.join(","));
        if (res.code === 0) {
          this.$message.success("角色权限保存成功");
          this.dialogSetting = false;
        }
      } catch (error) {
        // console.log(error);
        this.$message.error("角色权限保存失败");
      }
    },
    /**
     * 打开详情窗口
     */
    async handleInfo(roleData) {
      let res = await stoRead({
        user_id: roleData.user_id,
        store_id: roleData.store_id
      });
      console.log(res);
      this.myInfo.base_info = { ...res.data.base_info };
      this.myInfo.store_info = { ...res.data.store_info };
      this.myInfo.vip_order = [...res.data.vip_order];
      this.dialoInfo = true;
      this.edatPa = "详情";
    },
    // 申请
    onAccount(roleData) {
      console.log("roleData", roleData);
      this.accountData.role = roleData;
      this.myId = roleData.store_id;
      this.isShowP = true;
    },
    // 启用 禁用状态
    async onAccountStatusChange(status, rowData) {
      console.log(status, rowData);
      let res = await upDateRole({
        AdminID: rowData.AdminID,
        AdminStatus: status ? 1 : 0
      });
      if (res.code === 0) {
        if (status) {
          this.$message.success("帐号已启用");
        } else {
          this.$message.warning("帐号已禁用");
        }
        this.getTableList();
      } else {
        this.$message.error("帐号状态操作失败");
      }
    }
  }
};
</script>
<style lang="less" scoped>
#jurisdiction {
  .input-search {
    width: 200px;
    margin-right: 20px;
  }
  .text {
    padding-left: 10px;
  }
  .text span:nth-child(2) {
    padding-left: 15px;
    font-weight: bold;
  }
  .pl_20 {
    padding: 20px 0 0 40px;
    .btnB {
      float: right;
    }
    .btnA {
      float: right;
      margin-left: 20px;
    }
  }
  .table_top {
    margin-bottom: 20px;
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    .btnCon {
      .btnCli {
        margin-left: 100%;
        transform: translateX(-100%);
      }
    }
  }
  .el-dialog__title {
    font-size: 18px;
    color: #000;
  }
  .el-dialog__header {
    padding: 10px;
    // background: #1890ff;
  }
  .btnRole {
    margin-left: 20px;
  }
}
.btn-action {
  font-size: 15px;
}

.status-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  .status-text {
    color: #999;
    margin-right: 20px;
    &.active {
      color: #1890ff;
    }
  }
}
.shinfo {
  margin: 20px 0;
  width: 100%;
  height: 30px;
  line-height: 30px;
  font-size: 15px;
  font-weight: 700;
}

.diafooter {
  margin-top: 20px;
  margin-left: 50%;
  transform: translateX(-50%);
}
.btn-action {
  font-size: 15px;
}
/deep/ .el-form-item__label {
  text-align: center !important;
  padding: 0;
}
/deep/ .el-form-item {
  margin-bottom: 0;
}

.bgctable {
  background-color: #f2f2f2;
}
.bordertable {
  border: 1px solid #e6e6e6;
}
.bortop {
  border: 1px solid #e6e6e6;
  border-top: transparent;
}
/deep/ .el-input__inner {
  border-radius: 0;
  // border: 1px solid transparent !important;
}
.divbox {
  width: 100%;
  height: 50px;
  .box-l {
    display: inline-block;
    width: 200px;
    height: 50px;
    line-height: 50px;
    background-color: #f2f2f2;
    border: 1px solid #e6e6e6;
    text-align: center;
    border-right: transparent;
  }
  .box-r {
    display: inline-block;
    width: calc(100% - 200px);
    height: 50px;
    line-height: 50px;
    border: 1px solid #e6e6e6;
    text-align: left;
    vertical-align: top;
    padding: 0 20px;
  }
}
.divbox1 {
  width: 100%;
  margin: 20px 0;
  .box-l {
    display: inline-block;
    width: 200px;
    height: 50px;
    line-height: 50px;
    background-color: #f2f2f2;
    border: 1px solid #e6e6e6;
    text-align: center;
    border-right: transparent;
  }
  .box-r {
    display: inline-block;
    width: calc(100% - 200px);
    text-align: left;
    vertical-align: top;
    padding: 0 20px;
  }
}

.videoGo {
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  text-align: center;
}
.imgShow {
  width: 200px;
  height: 200px;
}
.scopBg {
  background-color: #fff;
  border: 1px solid #e6e6e6;
}
</style>
