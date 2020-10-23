<template>
  <el-card>
    <div class="table_top" ref="heightTop">
      <div class="cell">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          class="btnCL"
          @click="add"
          >新增</el-button
        >
      </div>
      <el-card>
        <el-table
          ref="table"
          v-loading="app.tableLoading"
          :data="app.tableData.list"
          style="width:100%"
          border
          :height="maxHeight"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50"
          ></el-table-column>
          <el-table-column
            v-for="(item, index) in columns"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            align="center"
            :min-width="item.width"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            fixed="right"
            min-width="150"
          >
            <template slot-scope="scope">
              <el-button
                type="primary"
                @click="handleEditApp(scope.row)"
                size="mini"
                v-if="scope.row.is_publish == 0"
                >发布</el-button
              >
              <el-button
                type="success"
                @click="handleApp(scope.row)"
                size="mini"
                >编辑</el-button
              >
              <el-button
                type="danger"
                @click="handleDelete(scope.row)"
                size="mini"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          background
          layout="total,sizes, prev, pager, next, jumper"
          @current-change="getVersionLists"
          @size-change="handleSizeChange"
          :current-page="app.tableData.page"
          :page-size="app.tableData.limit"
          :total="app.tableData.totalItem"
          :page-sizes="[10, 20, 50, 100]"
        ></el-pagination>
      </el-card>

      <el-dialog
        :visible="showDetail"
        :title="isCreate"
        :before-close="resetDetail"
        :close-on-click-modal="false"
      >
        <el-form
          ref="detail"
          :model="app.detail"
          :rules="app.rules"
          label-width="100px"
          label-position="right"
        >
          <el-form-item label="消息标题" prop="title">
            <el-input
              v-model="app.detail.title"
              :disabled="isCreate == '查看'"
            ></el-input>
          </el-form-item>
          <el-form-item label="消息内容" class="zy_tinymmm" prop="Content">
            <Tinymce
              ref="editor"
              v-model="app.detail.content"
              :key="randomKey"
              :height="250"
              :action="upUrl"
              imgFile="image"
            />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="resetDetail">取消</el-button>
          <el-button
            v-loading="app.saveLoading"
            type="primary"
            @click="onSaveDetail"
            >保存</el-button
          >
        </span>
      </el-dialog>

      <el-dialog
        title="删除"
        :before-close="isShowClick"
        :visible.sync="isShowP"
        width="30%"
        :show-close="false"
      >
        <el-form
          ref="Infoss"
          label-position="right"
          :hide-required-asterisk="false"
          label-width="100px"
        >
          <div class="title-t">确定要删除该消息吗？</div>
          <div class="pl_20">
            <el-button class="btn1" @click="isShowClick">取消</el-button>
            <el-button class="btn2" type="primary" @click="commitClick"
              >确定</el-button
            >
          </div>
        </el-form>
      </el-dialog>

      <el-dialog
        title="发布"
        :before-close="isFb"
        :visible.sync="isFbP"
        width="30%"
      >
        <el-form
          ref="Infoss"
          label-position="right"
          :hide-required-asterisk="false"
          label-width="100px"
        >
          <div class="title-t">确定要发布该消息吗？</div>
          <div class="pl_20">
            <el-button class="btn1" @click="isFb">取消</el-button>
            <el-button class="btn2" type="primary" @click="commitFb"
              >确定</el-button
            >
          </div>
        </el-form>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>

import { getToken } from "@/utils/auth";
import Tinymce from "@/components/Tinymce";
import {
  sellVipList, //获取商家会员详情
  rellVipRead, //商家会员详情
  sellVipUpdate, //修改会员详情
  sellVipSave, //会员添加
  rellVipDelete, //会员删除
  publishMsg, //获取列表
  stoMsgSave, //新增
  msgDelete, //删除
  publish, //发布
  publishBackend, //详情
  publishUpdate //编辑
} from "@/api/listvip";
export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Tinymce,
  },
  data() {
    return {
      // 富文本
      isClear: true,
      detail: "",
     
      maxHeight: 100,
      upUrl: process.env.VUE_APP_BASE_API + "/msg/upload",
      randomKey: "",
      editId: "",
      myIds: "",
      isFbP: false,
      myIDs: "",
      isShowP: false,
      value1: "", //日期
      uploadHeaders: {
        Authorization: getToken()
      },
      columns: [
        { prop: "title", label: "消息标题", width: 100 },
        // { prop: "content", label: "消息内容", width: 100 },
        { prop: "is_publish_text", label: "状态", width: 100 },
        { prop: "create_time", label: "创建时间", width: 100 },
        { prop: "publish_time", label: "发布时间", width: 100 },
        { prop: "operater", label: "操作人", width: 100 }
      ],
      app: {
        tableData: {
          list: [],
          page: 1,
          totalItem: 0,
          limit: 10
        },
        detail: {
          vip_type: "",
          spread_count: "",
          poster_count: "",
          name: "",
          price: "",
          id: "",
          radio: "2",

          title: "",
          content: ""
        },
        loading: false,
        rules: {
          // vip_type: [
          //   { required: true, message: "请选择VIP类型", trigger: "change" }
          // ],
          poster_count: [
            {
              required: true,
              message: "请输入每月海报制作数",
              trigger: "change"
            }
          ],
          spread_count: [
            { required: true, message: "请输入每月可传播次数", trigger: "blur" }
          ],
          name: [{ required: true, message: "会员名称", trigger: "blur" }],
          price: [{ required: true, message: "价格", trigger: "blur" }],
          title: [
            { required: true, message: "消息标题不能为空", trigger: "blur" }
          ],
          content: [
            { required: true, message: "消息内容不能为空", trigger: "blur" }
          ]
        },
        tableLoading: false,
        saveLoading: false
      },
      showDetail: false,
      isCreate: "", // true 创建 false 编辑
      keywords: "",
      fileList: [] //此数组中存入所有提交的文档信息
    };
  },
  created() {},
  mounted() {
    this.getVersionList(1);
    this.$nextTick(function() {
      // console.log(this.$refs.table.$el)
      this.maxHeight =
        window.innerHeight - this.$refs.table.$el.offsetTop - 250;
      window.onresize = () => {
        this.maxHeight =
          window.innerHeight - this.$refs.table.$el.offsetTop - 100;
      };
    });
  },
  methods: {
    change(val) {
      this.detail = val;
    },
    // 新增
    add() {
      this.app.detail.content = ''
      this.showDetail = true;
      this.isCreate = "新增";
    },
    isShowClick() {
      this.isShowP = false;
    },
    // 删除确认
    async commitClick() {
      let res = await msgDelete(this.myIDs);
      if (res.code == 0) {
        this.$message.success(res.msg);
        this.isShowP = false;
        this.getVersionList(1);
      }
    },
    getVersionLists(val) {
      // console.log(`每21111页 ${val} 条`)
      this.getVersionList(val);
    },
    handleSizeChange(val) {
      //  console.log(`每页 ${val} 条`)
      this.app.tableData.limit = val;
      this.getVersionList(1);
    },
    selectFile(file) {},
    beyondFile() {
      if (this.fileList.length > 0) {
        this.$message.error("只能上传一个app安装包,请删除后重新上传");
        return false;
      }
    },
    async handleDelete(row) {
      console.log("row", row);
      this.myIDs = row.msg_id;
      this.isShowP = true;
      // let res = await rellVipDelete(id);
      // if (res.code == 0) {
      //   this.$message.error("删除成功");
      //   this.getVersionList();
      // }
    },
    beforeUpload(file) {
      this.fileList.push(file);
      this.app.loading = true;
    },
    handlesuccess(response, file, fileList) {
      //response即为后台返回的全部内容
      if (response.code == 0) {
        this.app.loading = false;
        this.app.detail.cdnurl = response.data.url;
      } else {
        this.$refs.upload.clearFiles();
      }
    },
    onRmove() {
      this.app.detail.cdnurl = "";
      this.fileList = [];
      this.$refs.upload.clearFiles();
    },
    async getVersionList(page) {
      console.log(111);
      this.app.tableLoading = true;
      this.app.tableData.page = page;
      try {
        let res = await publishMsg(this.app.tableData);
        console.log(222, res);
        if (res.code === 0) {
          this.app.tableData.list = res.data.rows;
          this.app.tableData.pageNo = res.data.current_page;
          this.app.tableData.totalItem = res.data.total;
        } else {
          this.$message.error("获取列表失败");
        }
      } catch (error) {}
      this.randomKey = Math.random();
      this.app.tableLoading = false;
    },
    // 查看
    async handleEditApp(id) {
      console.log("id", id);
      this.myIds = id.msg_id;
      this.isFbP = true;
    },
    //  发布关闭
    isFb() {
      this.isFbP = false;
    },
    // 发布确认
    async commitFb() {
      let res = await publish(this.myIds);
      if (res.code == 0) {
        this.$message.success(res.msg);
        this.isFbP = false;
        this.getVersionList(1);
      }
    },
    // 编辑
    async handleApp(id) {
      this.app.detail.content = ''
      this.isCreate = "编辑";
      this.editId = id.msg_id;
      this.app.tableLoading = true;
      try {
        let res = await publishBackend(id.msg_id);
        this.app.detail.title = res.data.title;
        this.app.detail.content = res.data.content;
        this.showDetail = true;
      } catch (error) {}
      this.app.tableLoading = false;
    },
    async uploadApp(file) {
      // console.log(file);
      let formData = new FormData();
      formData.append("file", file.file);
      this.app.loading = true;
      try {
        let res = await reqUploadFile(formData);

        // if (res.cdnUrl) {
        //   this.app.detail.cdnurl = res.cdnUrl;
        //   this.app.detail.saveurl = res.saveUrl;
        // } else {
        //   this.$refs.upload.clearFiles();
        // }
      } catch (error) {
        console.log(error);
        // this.$refs.upload.clearFiles();
      }
      this.app.loading = false;
    },
    resetDetail() {
      this.app.detail = {
        radio: "2",
        spread_count: "",
        poster_count: "",
        price: "",
        name: "",

        versionnotype: null,
        mustupdate: null,
        cdnurl: "",
        isuse: false,
        savepath: "",
        saveurl: "",
        upgradedesc: "",
        versionno: "",
        jilu: "",
        url: "",
        title: "",
        content: ""
      };
      this.value1 = "";
      this.randomKey = Math.random();
      this.$refs.detail.resetFields();
      this.showDetail = false;
    },
    onSaveDetail() {
      this.$refs.detail.validate(async valid => {
        if (!valid) return;
        let data = {
          title: this.app.detail.title, //VIP类型
          content: this.app.detail.content //传播数量
        };
        //  data.exp_time = dataPa
        if (this.isCreate == "编辑") {
          data.msg_id = this.editId;
        }
        this.app.saveLoading = true;
        try {
          if (this.isCreate == "新增") {
            await stoMsgSave(data);
            this.$message.success("添加成功");
          } else if (this.isCreate == "编辑") {
            await publishUpdate(data);
            this.$message.success("编辑成功");
          }
          this.resetDetail();
          this.getVersionList(1);
        } catch (error) {
          console.log(error);
        }
        this.app.saveLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>


.cell {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  .cell-label {
    width: 100px;
  }
  .el-input {
    max-width: 300px;
    margin-right: 20px;
  }
}
.btnCL {
  margin-left: 100%;
  transform: translateX(-100%);
}
.title-t {
  width: 90%;
  height: 50px;
  text-align: center;
  margin: auto;
  font-size: 16px;
  font-weight: 700;
}
.pl_20 {
  padding: 20px 0 0 40px;
  .btn1 {
    margin-left: 33%;
    transform: translateX(-50%);
  }
  .btn2 {
    margin-left: 20px;
  }
}
</style>
