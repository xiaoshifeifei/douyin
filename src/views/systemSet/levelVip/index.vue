<template>
  <el-card>
    <div ref="heightTop">
    <div class="cell">
      <el-button class="btnAdd" type="primary" size="small" @click="add"
        >视频数量设置</el-button
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
        <el-table-column label="操作" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button type="success" @click="handleApp(scope.row)" size="mini"
              >编辑</el-button
            >
            <!-- <el-button
              type="danger"
              @click="handleDelete(scope.row)"
              size="mini"
              >删除</el-button
            > -->
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
      width="40%"
    >
      <el-form
        ref="detail"
        :model="app.detail"
        :rules="app.rules"
        label-width="150px"
        label-position="left"
      >
        <el-form-item label="普通会员视频限制" prop="normal_video">
          <el-input
            v-model="app.detail.normal_video"
          ></el-input>
        </el-form-item>
        <el-form-item label="VIP会员视频限制" prop="vip_video">
          <el-input
            v-model="app.detail.vip_video"
          ></el-input>
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
      :visible="showDetails"
      :title="isCreate"
      :before-close="resetDetails"
      :close-on-click-modal="false"
    >
      <el-form
        ref="detail"
        :model="app.detail"
        :rules="app.rules"
        label-width="150px"
        label-position="right"
      >
        <el-form-item label="VIP类型" prop="vip_type">
          <el-select v-model="app.detail.myValue" placeholder="请选择">
            <el-option label="月度会员" value="10"></el-option>
            <el-option label="季度会员" value="20"></el-option>
            <el-option label="半年度会员" value="30"></el-option>
            <el-option label="年度会员" value="40"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员名称" prop="name">
          <el-input
            v-model="app.detail.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="会员时长" prop="poster_count">
          <el-input
            v-model="app.detail.poster_count"
            :disabled="isCreate == '编辑'"
          ></el-input>
        </el-form-item>
        <el-form-item label="每月推广次数" prop="spread_count">
          <el-radio v-model="radio" label="1" :disabled="isCreate == '编辑'">不限推广次数</el-radio>
          <el-radio v-model="radio" label="2" :disabled="isCreate == '编辑'">限制推广次数</el-radio>
          <el-input
            v-model="app.detail.spread_count"
            :disabled="isCreate == '编辑'"
          ></el-input>
        </el-form-item>
        <el-form-item label="现价" prop="price">
          <el-input
            v-model="app.detail.price"
            :disabled="isCreate == '查看'"
          ></el-input>
        </el-form-item>
         <el-form-item label="价格" prop="origin_price">
          <el-input
            v-model="app.detail.origin_price"
            :disabled="isCreate == '查看'"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="resetDetails">取消</el-button>
        <el-button
          v-loading="app.saveLoading"
          type="primary"
          @click="onSaveDetails"
          >保存</el-button
        >
      </span>
    </el-dialog>
    </div>
  </el-card>
</template>

<script>
import { getToken } from "@/utils/auth";
import {
  // reqUploadFile,
  // reqAddAppVersion,
  // reqVersionList,
  // reqVersionDetail,
  // updateVersion,
  sellVipList, //获取商家会员详情
  rellVipRead, //商家会员详情
  sellVipUpdate, //修改会员详情
  sellVipSave, //会员添加
  rellVipDelete, //会员删除
  sellVideoNumber,  //视频数量设置
  checkVideoNumber,  //系统会员视频数量配置获取
} from "@/api/listvip";
export default {
  data() {
    return {
      maxHeight:250,
      radio:'',
      showDetails: false,
      value1: "", //日期
      uploadHeaders: {
        Authorization: getToken()
      },
      columns: [
        { prop: "vip_type_text", label: "会员类型", width: 100 },
        { prop: "name", label: "会员名称", width: 100 },
        { prop: "spread_count", label: "每月可推广次数", width: 100 },
        { prop: "price", label: "现价", width: 100 },
        { prop: "origin_price", label: "原价", width: 100 }
      ],
      app: {
        tableData: {
          list: [],
          page: 1,
          totalItem: 0,
          limit: 10
        },
        detail: {
          myValue:'',
          vip_video: 0,
          normal_video: 0,
          vip_type: "",
          spread_count: "",
          poster_count: "",
          name: "",
          price: "",
          id: "",
          radio: "2",
          vip_type_text: "",
          origin_price: ""
        },
        loading: false,
        rules: {
          // vip_type: [
          //   { required: true, message: "请选择VIP类型", trigger: "change" }
          // ],
          poster_count: [
            // {
            //   required: true,
            //   trigger: "change"
            // }
          ],
          spread_count: [
            { required: true, message: "请输入每月可传播次数", trigger: "blur" }
          ],
          name: [{ required: true, message: "会员名称", trigger: "blur" }],
          origin_price: [{ required: true, message: "现价不能为空", trigger: "blur" }],
          price: [{ required: true, message: "价格不能为空", trigger: "blur" }],

          normal_video: [{ required: true, message: "普通会员视频限制个数不能为空", trigger: "blur" }],
          vip_video: [{ required: true, message: "VIP会员视频限制个数不能为空", trigger: "blur" }],
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
  created() {
    // this.windowHeight = window.innerHeight - 300 + "px";
    
  },
  mounted() {
    this.$nextTick(function() {
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
    async getParamsD() {
      let res = await checkVideoNumber()
      console.log("res",res);
      const resData = res.data
      resData.forEach(item => {
        console.log(item);
        if (item.key == 'vip_video') {
          this.app.detail.vip_video = item.value
        }else if(item.key == 'normal_video') {
          this.app.detail.normal_video = item.value
        }
      });
    },
    // 新增
    add() {
      this.getParamsD()
      this.showDetail = true;
      this.isCreate = "视频数量设置";
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
        let res = await sellVipList(this.app.tableData);
        if (res.code === 0) {
          this.app.tableData.list = res.data.rows;
          this.app.tableData.pageNo = res.data.current_page;
          this.app.tableData.totalItem = res.data.total;
        } else {
          this.$message.error("获取列表失败");
        }
      } catch (error) {}
      this.app.tableLoading = false;
    },
    // 查看
    async handleEditApp(id) {
      this.isCreate = "查看";
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
    // 编辑
    async handleApp(id) {
      console.log('id',id);
      this.isCreate = "编辑";
      this.app.tableLoading = true;
      this.app.detail.id = id.sellvip_id;
      try {
        let res = await rellVipRead(id.sellvip_id);
        this.app.detail.vip_type = res.data.vip_type;
        this.app.detail.spread_count = res.data.spread_count;
        this.app.detail.poster_count ="";
        // this.app.detail.poster_count = res.data.poster_count;
        this.app.detail.name = res.data.name;
        this.app.detail.price = res.data.price;
        this.app.detail.upgradedesc = res.data.remark;
        this.app.detail.jilu = res.data.memo;
        this.app.detail.myValue = res.data.vip_type == 10 ? '月度会员':res.data.vip_type == 20 ? '季度会员':res.data.vip_type == 30 ? '半年度会员':res.data.vip_type == 40 ? '年度会员':'';
        this.app.detail.origin_price = id.origin_price;
        this.showDetails = true;
      } catch (error) {}
      this.app.tableLoading = false;
    },
    resetDetails() {
      this.app.detail = {
        vip_type: "",
        spread_count: "",
        poster_count: "",
        name: "",
        id: "",
        vip_type_text: "",
        origin_price: "",
        radio: "",
        myValue:''
      };
      this.showDetails = false;
      this.$refs.detail.resetFields();
      this.getVersionList(1)
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
      // this.app.detail = {
      //   radio: "2",
      //   spread_count: "",
      //   poster_count: "",
      //   price: "",
      //   name: "",
      //   versionnotype: null,
      //   mustupdate: null,
      //   cdnurl: "",
      //   isuse: false,
      //   savepath: "",
      //   saveurl: "",
      //   upgradedesc: "",
      //   versionno: "",
      //   jilu: "",
      //   url: ""
      // };
      this.value1 = "";
      this.$refs.detail.resetFields();
      this.showDetail = false;
    },
    onSaveDetail() {
      this.$refs.detail.validate(async valid => {
        if (!valid) return;
        let data = {
          normal_video: this.app.detail.normal_video, //普通会员视频限制
          vip_video: this.app.detail.vip_video, //VIP会员视频限制
        };
        this.app.saveLoading = true;
        try {
          if (this.isCreate == "视频数量设置") {
            await sellVideoNumber(data);
            this.$message.success("添加成功");
            this.showDetail = false
          } 
          this.resetDetail();
          this.getVersionList(1);
        } catch (error) {
          console.log(error);
        }
        this.app.saveLoading = false;
      });
    },
    // 编辑提交
    onSaveDetails() {
      this.$refs.detail.validate(async valid => {
        if (!valid) return;
        let data = {
          vip_type: this.app.detail.radio, //VIP类型
          sellvip_id: this.app.detail.id, //会员ID
          spread_count: this.app.detail.spread_count, //传播数量
          poster_count: this.app.detail.poster_count, //传播数量
          name: this.app.detail.name, //会员名称
          price: this.app.detail.price //价格
        };
        //  data.exp_time = dataPa
        if (this.isCreate == "编辑") {
          data.sellvip_id = this.app.detail.id;
        }
        this.app.saveLoading = true;
        try {
          if (this.isCreate == "新增") {
            await sellVipSave(data);
            this.$message.success("添加成功");
            this.showDetails = false
          } else if (this.isCreate == "编辑") {
            await sellVipUpdate(data);
            this.$message.success("编辑成功");
            this.showDetails = false
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
.btnAdd {
  margin-left: 100%;
  transform: translateX(-100%);
}
</style>
