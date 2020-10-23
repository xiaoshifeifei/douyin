<template>
  <el-card>
    <el-row type="flex" justify="space-between" >
    </el-row>
    <el-card>
      <el-table
        v-loading="app.tableLoading"
        :data="app.tableData.list"
        style="width:100%"
        border
        ref="table"
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
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="primary"
              @click="handleEditApp(scope.row)"
              size="mini"
              >编辑</el-button
            >
            <!-- <el-button
              type="success"
              @click="handleApp(scope.row.sellvip_id)"
              size="mini"
              >编辑</el-button
            >
            <el-button
              type="danger"
              @click="handleDelete(scope.row.sellvip_id)"
              size="mini"
              >删除</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
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
        <el-form-item label="协议类型" prop="typename">
          <el-input v-model="app.detail.typename" :disabled="isCreate == '查看' || isCreate == '编辑'"></el-input>
        </el-form-item>
        <!-- <el-form-item label="协议内容">
          <el-input
            v-model="app.detail.content"
            rows="5"
            type="textarea"
            :disabled="isCreate == '查看'"
          />
        </el-form-item> -->

         <el-form-item label="协议内容" class="zy_tinymmm" prop="Content">
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
  </el-card>
</template>

<script>
import { getToken } from "@/utils/auth";
import Tinymce from '@/components/Tinymce'

import {

  // sellVipList, //获取商家会员详情
  // rellVipRead, //商家会员详情
  // sellVipUpdate, //修改会员详情
  // sellVipSave, //会员添加
  // rellVipDelete, //会员删除

  stoTreaty,  // 协议列表
  stoTreatyRead, //协议查看
  stoTreatySave, //协议编辑
} from "@/api/listvip";
export default {
   components: {
    // eslint-disable-next-line vue/no-unused-components
    Tinymce
  },
  data() {
    return {
      maxHeight:100,
      upUrl: process.env.VUE_APP_BASE_API + '/treaty/upload',
      randomKey:'',
      value1: "", //日期
      uploadHeaders: {
        Authorization: getToken()
      },
      columns: [
        { prop: "typename", label: "协议类型", width: 100 },
        { prop: "operater", label: "操作人", width: 100 },
        { prop: "create_time", label: "操作时间", width: 100 },
      ],
      app: {
        tableData: {
          list: [],
          page: 1,
          totalItem: 0,
          limit: 10
        },
        detail: {
          treaty_id: '',
          typename: '',
          content:'',
          vip_type: "",
          spread_count: "",
          poster_count: "",
          name: "",
          price: "",
          id: "",
          radio: "2"
        },
        loading: false,
        rules: {
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
          price: [{ required: true, message: "价格", trigger: "blur" }]
        },
        tableLoading: false,
        saveLoading: false
      },
      showDetail: false,
      isCreate: '', // true 创建 false 编辑
      keywords: "",
      fileList: [] //此数组中存入所有提交的文档信息
    };
  },
  created() {
    this.windowHeight = window.innerHeight - 300 + "px";
  },
  mounted() {
    this.$nextTick(function() {
      // console.log(this.$refs.table.$el)
      this.maxHeight =
        window.innerHeight - this.$refs.table.$el.offsetTop - 250
      window.onresize = () => {
        this.maxHeight =
          window.innerHeight - this.$refs.table.$el.offsetTop - 100
      }
    })
    this.getVersionList(1);
  },
  methods: {
    // 新增
    add() {
      this.showDetail = true
      this.isCreate = '新增'
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
    async handleDelete(id) {
      let res = await rellVipDelete(id);
      if (res.code == 0) {
        this.$message.error("删除成功");
        this.getVersionList();
      }
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
      this.app.tableLoading = true;
      this.app.tableData.page = page;
      try {
        let res = await stoTreaty();
        console.log("res",res);
        if (res.code === 0) {
          this.app.tableData.list = res.data;
        } else {
          this.$message.error("获取列表失败");
        }
      } catch (error) {}
      this.randomKey = Math.random()
      this.app.tableLoading = false;
    },
    // 编辑
    async handleEditApp(params) {
      console.log('params',params);
      this.isCreate = '编辑'
      this.app.tableLoading = true;
      this.app.detail.id = params.treaty_id;
      try {
        console.log(222);
        let res = await stoTreatyRead(params.treaty_id);
        console.log("res",res);
        this.app.detail.typename = res.data.typename;
        this.app.detail.content = res.data.content;

        this.showDetail = true;
      } catch (error) {}
      this.app.tableLoading = false;
    },
    // 编辑
    async handleApp(id) {
      this.isCreate = '编辑'
      this.app.tableLoading = true;
      this.app.detail.id = id;
      try {
        let res = await rellVipRead(id);
        this.app.detail.vip_type = res.data.vip_type;
        this.app.detail.spread_count = res.data.spread_count;
        this.app.detail.poster_count = res.data.poster_count;
        this.app.detail.name = res.data.name;
        this.app.detail.price = res.data.price;
        this.app.detail.upgradedesc = res.data.remark;
        this.app.detail.jilu = res.data.memo;
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
        typename:'',
        content:'',
        versionnotype: null,
        mustupdate: null,
        cdnurl: "",
        isuse: false,
        savepath: "",
        saveurl: "",
        upgradedesc: "",
        versionno: "",
        jilu: "",
        url: ""
      };
      this.value1 = "";
      this.randomKey = Math.random()
      this.$refs.detail.resetFields();
      this.showDetail = false;
    },
    //  修改协议提交
    onSaveDetail() {
      this.$refs.detail.validate(async valid => {
        if (!valid) return;
        let data = {
            content: this.app.detail.content
        };
        //  data.exp_time = dataPa
        if (this.isCreate == '编辑') {
          data.treaty_id = this.app.detail.id;
        }
        this.app.saveLoading = true;
        try {
            let res = await stoTreatySave(data);
            if (res.code == 0) {
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
</style>
