<template>
  <el-card>
    <div ref="heightTop">
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
          </template>
        </el-table-column>
      </el-table>

      <!-- <el-pagination
        background
        layout="total,sizes, prev, pager, next, jumper"
        @current-change="getVersionLists"
        @size-change="handleSizeChange"
        :current-page="app.tableData.page"
        :page-size="app.tableData.limit"
        :total="app.tableData.totalItem"
        :page-sizes="[10, 20, 50, 100]"
      ></el-pagination> -->
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
     <el-dialog
      :visible="showDetail1"
      :title="isCreate"
      :before-close="resetDetail1"
      width="40%"
    >
      <el-form
        ref="detail"
        :model="paramsArray"
        :rules="rules"
        label-width="200px"
        label-position="left"
      >
        <el-form-item v-if="isShowOr == '0'" :label="isCreate" prop="value">
          <el-input
            v-model="paramsArray.value"
          ></el-input>
        </el-form-item>


        <el-form-item v-if="isShowOr == '2'" :label="isCreate" prop="value">
         <el-upload
            :key="randomKey"
            action="#"
            class="upload-demo gmr-10"
            :show-file-list="false"
            list-type="picture-card"
            :http-request="uploadImg"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="paramsArray.value"
              width="100"
              class="zy_imgChange"
              :src="paramsArray.value"
              alt=""
            />
            <i v-else class="el-icon-plus"></i>
          </el-upload>
          <div>
            建议尺寸宽高500px*311px
          </div>
        </el-form-item>


        <el-form-item v-if="isShowOr == '4'" label="普通会员视频限制" prop="value">
          <el-input
            v-model="paramsArray.value"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="isShowOr == '4'" label="VIP会员视频限制" prop="value">
          <el-input
            v-model="paramsArray.value"
          ></el-input>
        </el-form-item>
        


      </el-form>
      <span slot="footer">
        <el-button @click="resetDetail1">取消</el-button>
        <el-button
          type="primary"
          @click="onSaveDetail1"
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
  publishConfig, //配置列表获取
  configRead, //配置详情
  configUpdate, //配置修改
} from "@/api/listvip";
export default {
  data() {
    return {
      isShowOr:"",
      showDetail1:false,
      maxHeight:250,
      radio:'',
      showDetails: false,
      value1: "", //日期
      uploadHeaders: {
        Authorization: getToken()
      },
      columns: [
        { prop: "name", label: "基础内容", width: 100 },
        { prop: "update_time", label: "操作时间", width: 100 },
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
          value: [{ required: true, message: "地址不能为空", trigger: "blur" }],

          normal_video: [{ required: true, message: "普通会员视频限制个数不能为空", trigger: "blur" }],
          vip_video: [{ required: true, message: "VIP会员视频限制个数不能为空", trigger: "blur" }],
        },
        tableLoading: false,
        saveLoading: false
      },
       rules: {
          value: [{ required: true, message: "地址不能为空", trigger: "blur" }],
        },
      showDetail: false,
      isCreate: "", // true 创建 false 编辑
      keywords: "",
      fileList: [], //此数组中存入所有提交的文档信息
      paramsArray:{
        value:'',
        configs_id:'',
      }
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

     uploadImg(f) {
      // console.log(f)
      // eslint-disable-next-line camelcase
      // this.form.home_img = ''
      this.progressFlag = true
      let formdata = new FormData()
      formdata.append('CoverImgFile', f.file)
      axios({
        url: process.env.VUE_APP_BASE_API + '/config/upload',
        method: 'post',
        data: formdata,
        headers: {
          'Content-Type': 'multipart/form-data',
          // eslint-disable-next-line no-useless-concat
          Authorization: 'Bearer' + ' ' + getToken()
        },
        onUploadProgress: progressEvent => {
          /*
           *  progressEvent.loaded:已上传文件大小
           *  progressEvent.total:被上传文件的总大小
           */
          /*
           * console.log(progressEvent.loaded)
           * console.log(progressEvent.total)
           */
          this.progressPercent =
            (progressEvent.loaded / progressEvent.total) * 100
        }
      })
        .then(res => {
          /*
           * console.log(res)
           * console.log(this.progressPercent)
           */
          if (this.progressPercent === 100) {
            setTimeout(() => {
              this.progressFlag = false
              this.progressPercent = 0
              // eslint-disable-next-line camelcase
              // console.log(res)
              this.paramsArray.value = res.data.data.url
            }, 200)
          }
          // console.log(that.formInline.CoverImgUrl)
        })
        .catch(error => {
          console.log(error)
        })
    },
     handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
     beforeAvatarUpload(file) {
      /*
       * const isJPG =
       *   file.type === 'image/jpeg' ||
       *   file.type === 'image/jpg' ||
       *   file.type === 'image/png' ||
       *   file.type === 'image/gif' ||
       *   file.type === 'image/bmp'
       * const isLt2M = file.size / 500 / 500 < 1
       */

      /*
       * if (!isJPG) {
       *   this.$message.error('请上传JPG，JPEG，PNG，GIF，BMP格式的图片并且小于500k，仅能上传一张图片')
       *   return false
       * }
       * if (!isLt2M) {
       *   this.$message.error('上传头像图片大小不能超过 500kb!')
       *   return false
       * }
       * return isJPG && isLt2M
       */
      switch (file.type) {
      case 'image/jpeg':
        this.isJPG = true
        break
      case 'image/png':
        this.isJPG = true
        break
      case 'image/jpg':
        this.isJPG = true
        break
      case 'image/gif':
        this.isJPG = true
        break
      case 'image/bmp':
        this.isJPG = true
        break
      default:
        this.isJPG = false
        break
      }
      this.isLt500k = (file.size / 1024 / 500) <= 1
      console.log(this.isLt500k)
      if (!this.isJPG) {
        this.$message.error('上传物品图片只能是 JPG / PNG /JPEG 格式!')
        return
      }
      if (!this.isLt500k) {
        this.$message.error('上传物品图片大小不能超过 500KB!')
        return
      }
      return this.isJPG && this.isLt500k
    },
    
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
        let res = await publishConfig();
        if (res.code === 0) {
          this.app.tableData.list = res.data;
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
    async handleApp(params) {
      this.paramsArray.value = "";
      console.log("params",params);
      try {
        let res = await configRead(params.configs_id);
        if (res.code == 0) {
          this.$message.success(res.msg)
          this.paramsArray.value = res.data.value
          this.paramsArray.configs_id = res.data.configs_id
          this.showDetail1 = true
          
          if (res.data.type == 0) {
            this.isCreate =res.data.name
            this.isShowOr = "0"
          }else if (res.data.type == 1) {
            this.isShowOr = "1"
          }else if (res.data.type == 2) {
            this.isShowOr = "2"
             this.isCreate = res.data.name
          }else if (res.data.type == 3) {
            this.isShowOr = "3"
          }else if (res.data.type == 4) {
            this.isShowOr = "0"
            this.isCreate = res.data.name
          }
        }

      } catch (error) {}
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
      this.value1 = "";
      this.$refs.detail.resetFields();
      this.showDetail = false;
    },
    resetDetail1() {
      this.paramsArray.value = "";
      this.$refs.detail.resetFields();
      this.showDetail1 = false;
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
     onSaveDetail1() {
      this.$refs.detail.validate(async valid => {
        if (!valid) return;
        let data = {
          value: this.paramsArray.value , 
          configs_id: this.paramsArray.configs_id ,
        };
        try {
            await configUpdate(data);
            this.$message.success("编辑成功");
            this.showDetail1 = false
          this.resetDetail();
          this.getVersionList(1);
        } catch (error) {
          console.log(error);
        }
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
