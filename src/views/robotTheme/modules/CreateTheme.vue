<template>
  <!-- 新增弹框 -->
  <a-modal
    title="新建"
    :width="700"
    style="top: 0px;"
    v-model="visible"
    @ok="handleSubmit"
    v-preventReClick
    :destroyOnClose="true"
    :maskClosable="false"
    :keyboard="true"
  >
    <a-form :form="form">
      <!-- 名称 -->
      <a-form-item label="模版名称" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom:0px">
        <a-input v-decorator="['name', { rules: [{ required: true, message: '名称' }] }]" placeholder="名称" />
      </a-form-item>
      <!-- 版本号 -->
      <a-form-item label="机器人版本号" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom:0px">
        <a-input
          v-decorator="['robot_Version', { rules: [{ required: true, message: '版本号' }] }]"
          placeholder="使用的版本"
        />
      </a-form-item>
      <!-- 内容区显示地址 -->
      <a-form-item label="内容区显示地址" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom:0px">
        <a-input
          v-decorator="['content_Area', { rules: [{ required: true, message: '内容区地址' }] }]"
          placeholder="网页地址"
        />
      </a-form-item>
      <!-- 内容区背景色 -->
      <a-form-item label="内容区背景色" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom:0px">
        <colorPicker style="z-index:206"
          v-decorator="['content_Area_Background_Colour', { rules: [{ required: true, message: '选择一个颜色' }] }]"
          defaultColor="#FF0000"
        />
      </a-form-item>
      <!-- 聊天区背景色 -->
      <a-form-item label="对话区背景色" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom:0px">
        <colorPicker style="z-index:205"
          v-decorator="['chat_Background_Colour', { rules: [{ required: true, message: '选择一个颜色' }] }]"
          defaultColor="#FF7D00"
        />
      </a-form-item>
      <!-- 机器人聊天区文字色 -->
      <a-form-item label="机器人对话气泡背景色" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom:0px">
        <colorPicker style="z-index:204"
          v-decorator="['robot_Text_Colour', { rules: [{ required: true, message: '选择一个颜色' }] }]"
          defaultColor="#FFFF00"
        />
      </a-form-item>
      <!-- 机器人聊天区文字背景色 -->
      <a-form-item label="机器人对话文字背景色" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom:0px">
        <colorPicker style="z-index:203"
          v-decorator="['robot_Text_Background_Colour', { rules: [{ required: true, message: '选择一个颜色' }] }]"
          defaultColor="#00FF00"
        />
      </a-form-item>
      <!-- 客户聊天区文字色 -->
      <a-form-item label="客户对话气泡背景色" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom:0px">
        <colorPicker style="z-index:202"
          v-decorator="['client_Text_Colour', { rules: [{ required: true, message: '选择一个颜色' }] }]"
          defaultColor="#00FFFF"
        />
      </a-form-item>
      <!-- 客户聊天区文字背景色 -->
      <a-form-item label="客户对话文字背景色" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom:0px">
        <colorPicker style="z-index:201"
          v-decorator="['client_Text_Background_Colour', { rules: [{ required: true, message: '选择一个颜色' }] }]"
          defaultColor="#0000FF"
          width="300px"
        />
      </a-form-item>
      <!-- 开机图上传文件 -->
      <a-form-item label="开机图片" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom:0px">
        <a-upload
          :action="url"
          listType="picture-card"
          :fileList="createData.boot_Screen"
          :remove="handleRemoveFile"
          @preview="boot_Screen_Preview"
          @change="boot_Screen_Change"
          v-decorator="['createData.boot_Screen_FileName', { rules: [{ required: true, message: '请上传文件' }]}]"
        >
          <div v-if="createData.boot_Screen.length < 1" >
            <a-icon type="plus" />
            <div class="ant-upload-text">点击上传</div>
          </div>
        </a-upload>
        <a-modal :visible="createData.boot_Screen_Visible" :footer="null" @cancel="boot_Screen_Cancel">
          <img alt="example" style="width: 100%" :src="createData.boot_Screen_Image" />
        </a-modal>
      </a-form-item>
      <!-- 休息图上传文件 -->
      <a-form-item label="休息、待机图片" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom:0px">
        <a-upload
          :action="url"
          listType="picture-card"
          :fileList="createData.standby_Screen"
          :remove="handleRemoveFile"
          @preview="standby_Screen_Preview"
          @change="standby_Screen_Change"
          v-decorator="['createData.standby_Screen_FileName', { rules: [{ required: true, message: '请上传文件' }]}]"
        >
          <div v-if="createData.standby_Screen.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">点击上传</div>
          </div>
        </a-upload>
        <a-modal :visible="createData.standby_Screen_Visible" :footer="null" @cancel="standby_Screen_Cancel">
          <img alt="example" style="width: 100%" :src="createData.standby_Screen_Image" />
        </a-modal>
      </a-form-item>
      <!-- logo图上传文件 -->
      <a-form-item label="logo" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom:0px">
        <a-upload
          :action="url"
          listType="picture-card"
          :fileList="createData.robot_Logo"
          :remove="handleRemoveFile"
          @preview="robot_Logo_Preview"
          @change="robot_Logo_Change"
          v-decorator="['createData.robot_Logo_FileName', { rules: [{ required: true, message: '请上传文件' }]}]"
        >
          <div v-if="createData.robot_Logo.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">点击上传</div>
          </div>
        </a-upload>
        <a-modal :visible="createData.robot_Logo_Visible" :footer="null" @cancel="robot_Logo_Cancel">
          <img alt="example" style="width: 100%" :src="createData.robot_Logo_Image" />
        </a-modal>
      </a-form-item>
      <!-- 内容区背景图上传文件 -->
      <a-form-item label="内容区图片" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom:0px">
        <a-upload
          :action="url"
          listType="picture-card"
          :fileList="createData.content_Area_Background_Picture"
          :remove="handleRemoveFile"
          @preview="content_Area_Background_Picture_Preview"
          @change="content_Area_Background_Picture_Change"
          v-decorator="['createData.content_Area_Background_Picture_FileName', { rules: [{ required: true, message: '请上传文件' }]}]"
        >
          <div v-if="createData.content_Area_Background_Picture.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">点击上传</div>
          </div>
        </a-upload>
        <a-modal :visible="createData.content_Area_Background_Picture_Visible" :footer="null" @cancel="content_Area_Background_Picture_Cancel">
          <img alt="example" style="width: 100%" :src="createData.content_Area_Background_Picture_Image" />
        </a-modal>
      </a-form-item>
      <!-- 聊天区背景图上传文件 -->
      <a-form-item label="聊天背景图片" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom:0px">
        <a-upload
          :action="url"
          listType="picture-card"
          :fileList="createData.chat_Background_Picture"
          :remove="handleRemoveFile"
          @preview="chat_Background_Picture_Preview"
          @change="chat_Background_Picture_Change"
          v-decorator="['createData.chat_Background_Picture_FileName', { rules: [{ required: true, message: '请上传文件' }]}]"
        >
          <div v-if="createData.chat_Background_Picture.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">点击上传</div>
          </div>
        </a-upload>
        <a-modal :visible="createData.chat_Background_Picture_Visible" :footer="null" @cancel="chat_Background_Picture_Cancel">
          <img alt="example" style="width: 100%" :src="createData.chat_Background_Picture_Image" />
        </a-modal>
      </a-form-item>
      <!-- 机器人聊天区头像上传文件 -->
      <a-form-item label="机器人对话气泡头像" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom:0px">
        <a-upload
          :action="url"
          listType="picture-card"
          :fileList="createData.robot_Head_Portrait"
          :remove="handleRemoveFile"
          @preview="robot_Head_Portrait_Preview"
          @change="robot_Head_Portrait_Change"
          v-decorator="['createData.robot_Head_Portrait_FileName', { rules: [{ required: true, message: '请上传文件' }]}]"
        >
          <div v-if="createData.robot_Head_Portrait.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">点击上传</div>
          </div>
        </a-upload>
        <a-modal :visible="createData.robot_Head_Portrait_Visible" :footer="null" @cancel="robot_Head_Portrait_Cancel">
          <img alt="example" style="width: 100%" :src="createData.robot_Head_Portrait_Image" />
        </a-modal>
      </a-form-item>
      <!-- 机器人聊天区文字背景上传文件 -->
      <a-form-item label="机器人对话区文字背景图" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom:0px">
        <a-upload
          :action="url"
          listType="picture-card"
          :fileList="createData.robot_Text_Picture"
          :remove="handleRemoveFile"
          @preview="robot_Text_Picture_Preview"
          @change="robot_Text_Picture_Change"
          v-decorator="['createData.robot_Text_Picture_FileName', { rules: [{ required: true, message: '请上传文件' }]}]"
        >
          <div v-if="createData.robot_Text_Picture.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">点击上传</div>
          </div>
        </a-upload>
        <a-modal :visible="createData.robot_Text_Picture_Visible" :footer="null" @cancel="robot_Text_Picture_Cancel">
          <img alt="example" style="width: 100%" :src="createData.robot_Text_Picture_Image" />
        </a-modal>
      </a-form-item>
      <!-- 客户聊天区头像上传文件 -->
      <a-form-item label="客户对话气泡头像" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom:0px">
        <a-upload
          :action="url"
          listType="picture-card"
          :fileList="createData.client_Head_Portrait"
          :remove="handleRemoveFile"
          @preview="client_Head_Portrait_Preview"
          @change="client_Head_Portrait_Change"
          v-decorator="['createData.client_Head_Portrait_FileName', { rules: [{ required: true, message: '请上传文件' }]}]"
        >
          <div v-if="createData.client_Head_Portrait.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">点击上传</div>
          </div>
        </a-upload>
        <a-modal :visible="createData.client_Head_Portrait_Visible" :footer="null" @cancel="client_Head_Portrait_Cancel">
          <img alt="example" style="width: 100%" :src="createData.client_Head_Portrait_Image" />
        </a-modal>
      </a-form-item>
      <!-- 客户聊天区文字背景上传文件 -->
      <a-form-item label="客户对话区文字背景图" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom:0px">
        <a-upload
          :action="url"
          listType="picture-card"
          :fileList="createData.client_Text_Picture"
          :remove="handleRemoveFile"
          @preview="client_Text_Picture_Preview"
          @change="client_Text_Picture_Change"
          v-decorator="['createData.client_Text_Picture_FileName', { rules: [{ required: true, message: '请上传文件' }]}]"
        >
          <div v-if="createData.client_Text_Picture.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">点击上传</div>
          </div>
        </a-upload>
        <a-modal :visible="createData.client_Text_Picture_Visible" :footer="null" @cancel="client_Text_Picture_Cancel">
          <img alt="example" style="width: 100%" :src="createData.client_Text_Picture_Image" />
        </a-modal>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
import { addData, queryData } from '@/api/common'
import { STable } from '@/components'
import { uploadUrl } from '@/api/upload'
export default {
  components: {
    STable
  },
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      form: this.$form.createForm(this),
      url: '',
      createData: {
        boot_Screen: [], //开机图上传的文件
        boot_Screen_FileName: '', //开机图名称（提交参数）
        boot_Screen_Image: '', //图片预览地址
        boot_Screen_Visible: false, //图片预览遮罩

        standby_Screen: [], //休息图上传的文件
        standby_Screen_FileName: '', //休息图名称（提交参数）
        standby_Screen_Image: '', //图片预览地址
        standby_Screen_Visible: false, //图片预览遮罩

        robot_Logo: [], //logo图上传的文件
        robot_Logo_FileName: '', //logo图名称（提交参数）
        robot_Logo_Image: '', //图片预览地址
        robot_Logo_Visible: false, //图片预览遮罩

        // robot_Version: '', //机器人系统版本（提交参数）
        // content_Area: '', //内容区地址
        // content_Area_Background_Colour: '', //内容区背景色

        content_Area_Background_Picture: [], //内容区背景图上传的文件
        content_Area_Background_Picture_FileName: '', //内容区背景图名称（提交参数）
        content_Area_Background_Picture_Image: '', //图片预览地址
        content_Area_Background_Picture_Visible: false, //图片预览遮罩

        // chat_Background_Colour: '', //聊天界面背景色

        chat_Background_Picture: [], //聊天背景图
        chat_Background_Picture_FileName: '', //聊天背景图名称（提交参数）
        chat_Background_Picture_Image: '', //图片预览地址
        chat_Background_Picture_Visible: false, //图片预览遮罩

        robot_Head_Portrait: [], //机器人头像
        robot_Head_Portrait_FileName: '', //机器人头像图名称（提交参数）
        robot_Head_Portrait_Image: '', //图片预览地址
        robot_Head_Portrait_Visible: false, //图片预览遮罩

        // robot_Text_Colour: '', //机器人聊天区文字颜色

        robot_Text_Picture: [], //机器人聊天区背景图
        robot_Text_Picture_FileName: '', //机器人聊天区背景图名称（提交参数）
        robot_Text_Picture_Image: '', //图片预览地址
        robot_Text_Picture_Visible: false, //图片预览遮罩

        // robot_Text_Background_Colour: '', //机器人聊天区背景颜色

        client_Head_Portrait: [], //客户头像
        client_Head_Portrait_FileName: '', //客户头像图名称（提交参数）
        client_Head_Portrait_Image: '', //图片预览地址
        client_Head_Portrait_Visible: false, //图片预览遮罩

        // client_Text_Colour: '', //客户聊天区文字颜色

        client_Text_Picture: [], //客户聊天区背景图
        client_Text_Picture_FileName: '', //客户聊天区背景图名称（提交参数）
        client_Text_Picture_Image: '', //图片预览地址
        client_Text_Picture_Visible: false, //图片预览遮罩

        // client_Text_Background_Colour: '' //客户聊天区背景颜色
      }
    }
  },
  methods: {
    add() {
      // this.url = uploadUrl + 'robotTheme/fileUpload'
      this.url = 'http://192.168.1.198:8085/robotTheme/fileUpload'
      this.visible = true
    },
    //提交
    handleSubmit () {
      const org = JSON.parse(localStorage.getItem('user')).orgId
      const user = JSON.parse(localStorage.getItem('user')).id
      const {
        form: { validateFields }
      } = this
      var _this = this
      validateFields((errors, values) => {
        if (!errors) {
          var param = _this.createData
          param.org = org
          param.user = user
          queryData({ ...param, ...vues }, '/robotTheme/save').then(res => {
            if (res.code == 0) {
              _this.$message.success('新建成功')
              //参数滞空
              _this.createData={
                boot_Screen: [], //开机图上传的文件
                  boot_Screen_FileName: '', //开机图名称（提交参数）
                  boot_Screen_Image: '', //图片预览地址
                  boot_Screen_Visible: false, //图片预览遮罩

                  standby_Screen: [], //休息图上传的文件
                  standby_Screen_FileName: '', //休息图名称（提交参数）
                  standby_Screen_Image: '', //图片预览地址
                  standby_Screen_Visible: false, //图片预览遮罩

                  robot_Logo: [], //logo图上传的文件
                  robot_Logo_FileName: '', //logo图名称（提交参数）
                  robot_Logo_Image: '', //图片预览地址
                  robot_Logo_Visible: false, //图片预览遮罩

                  // robot_Version: '', //机器人系统版本（提交参数）
                  // content_Area: '', //内容区地址
                  // content_Area_Background_Colour: '', //内容区背景色

                  content_Area_Background_Picture: [], //内容区背景图上传的文件
                  content_Area_Background_Picture_FileName: '', //内容区背景图名称（提交参数）
                  content_Area_Background_Picture_Image: '', //图片预览地址
                  content_Area_Background_Picture_Visible: false, //图片预览遮罩

                  // chat_Background_Colour: '', //聊天界面背景色

                  chat_Background_Picture: [], //聊天背景图
                  chat_Background_Picture_FileName: '', //聊天背景图名称（提交参数）
                  chat_Background_Picture_Image: '', //图片预览地址
                  chat_Background_Picture_Visible: false, //图片预览遮罩

                  robot_Head_Portrait: [], //机器人头像
                  robot_Head_Portrait_FileName: '', //机器人头像图名称（提交参数）
                  robot_Head_Portrait_Image: '', //图片预览地址
                  robot_Head_Portrait_Visible: false, //图片预览遮罩

                  // robot_Text_Colour: '', //机器人聊天区文字颜色

                  robot_Text_Picture: [], //机器人聊天区背景图
                  robot_Text_Picture_FileName: '', //机器人聊天区背景图名称（提交参数）
                  robot_Text_Picture_Image: '', //图片预览地址
                  robot_Text_Picture_Visible: false, //图片预览遮罩

                  // robot_Text_Background_Colour: '', //机器人聊天区背景颜色

                  client_Head_Portrait: [], //客户头像
                  client_Head_Portrait_FileName: '', //客户头像图名称（提交参数）
                  client_Head_Portrait_Image: '', //图片预览地址
                  client_Head_Portrait_Visible: false, //图片预览遮罩

                  // client_Text_Colour: '', //客户聊天区文字颜色

                  client_Text_Picture: [], //客户聊天区背景图
                  client_Text_Picture_FileName: '', //客户聊天区背景图名称（提交参数）
                  client_Text_Picture_Image: '', //图片预览地址
                  client_Text_Picture_Visible: false, //图片预览遮罩

                  // client_Text_Background_Colour: '' //客户聊天区背景颜色
              }
            } else {
              _this.$message.error(res.message)
            }
            _this.visible = false
            _this.$emit('ok', values)
          })
        }
      })
    },
    // 删除文件
    handleRemoveFile(file) {
      console.log(file);
      let _this = this
      queryData({ fileName: file.response.fileName }, '/robotTheme/delFile').then(res => {
        if (res.code == 0) {
          _this.$message.success(res.message)
          return true
        } else {
          _this.$message.error(res.message)
          return false
        }
      })
    },
    //开机图预览关闭
    boot_Screen_Cancel() {
      this.createData.boot_Screen_Visible = false
    },
    //开机图预览
    async boot_Screen_Preview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.createData.boot_Screen_Image = file.url || file.preview
      this.createData.boot_Screen_Visible = true
    },
    //开机图文件监听
    boot_Screen_Change({ fileList }) {
      if (fileList.length > 0) {
        if (fileList[0].status == 'done') {
          var res = fileList[0].response
          if (res.code == 0) {
            this.createData.boot_Screen_FileName = res.fileName
            this.$message.success(`${res.fileName} 上传成功`)
          } else {
            this.$message.error(res.message)
          }
        }
      }
      this.createData.boot_Screen = fileList
    },
    //待机图预览关闭
    standby_Screen_Cancel() {
      this.createData.standby_Screen_Visible = false
    },
    //待机图预览
    async standby_Screen_Preview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.createData.standby_Screen_Image = file.url || file.preview
      this.createData.standby_Screen_Visible = true
    },
    //待机图文件监听
    standby_Screen_Change({ fileList }) {
      if (fileList.length > 0) {
        if (fileList[0].status == 'done') {
          var res = fileList[0].response
          if (res.code == 0) {
            this.createData.standby_Screen_FileName = res.fileName
            this.$message.success(`${res.fileName} 上传成功`)
          } else {
            this.$message.error(res.message)
          }
        }
      }
      this.createData.standby_Screen = fileList
    },
    //logo 图预览关闭
    robot_Logo_Cancel() {
      this.createData.robot_Logo_Visible = false
    },
    //logo图预览
    async robot_Logo_Preview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.createData.robot_Logo_Image = file.url || file.preview
      this.createData.robot_Logo_Visible = true
    },
    //logo图文件监听
    robot_Logo_Change({ fileList }) {
      if (fileList.length > 0) {
        if (fileList[0].status == 'done') {
          var res = fileList[0].response
          if (res.code == 0) {
            this.createData.robot_Logo_FileName = res.fileName
            this.$message.success(`${res.fileName} 上传成功`)
          } else {
            this.$message.error(res.message)
          }
        }
      }
      this.createData.robot_Logo = fileList
    },
    //内容区背景图预览关闭
    content_Area_Background_Picture_Cancel() {
      this.createData.content_Area_Background_Picture_Visible = false
    },
    //内容区背景图预览
    async content_Area_Background_Picture_Preview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.createData.content_Area_Background_Picture_Image = file.url || file.preview
      this.createData.content_Area_Background_Picture_Visible = true
    },
    //内容区背景图文件监听
    content_Area_Background_Picture_Change({ fileList }) {
      if (fileList.length > 0) {
        if (fileList[0].status == 'done') {
          var res = fileList[0].response
          if (res.code == 0) {
            this.createData.content_Area_Background_Picture_FileName = res.fileName
            this.$message.success(`${res.fileName} 上传成功`)
          } else {
            this.$message.error(res.message)
          }
        }
      }
      this.createData.content_Area_Background_Picture = fileList
    },
    //聊天背景图预览关闭
    chat_Background_Picture_Cancel() {
      this.createData.chat_Background_Picture_Visible = false
    },
    //聊天背景图预览
    async chat_Background_Picture_Preview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.createData.chat_Background_Picture_Image = file.url || file.preview
      this.createData.chat_Background_Picture_Visible = true
    },
    //内聊天背景图文件监听
    chat_Background_Picture_Change({ fileList }) {
      if (fileList.length > 0) {
        if (fileList[0].status == 'done') {
          var res = fileList[0].response
          if (res.code == 0) {
            this.createData.chat_Background_Picture_FileName = res.fileName
            this.$message.success(`${res.fileName} 上传成功`)
          } else {
            this.$message.error(res.message)
          }
        }
      }
      this.createData.chat_Background_Picture = fileList
    },
    //机器人对话区头像预览关闭
    robot_Head_Portrait_Cancel() {
      this.createData.robot_Head_Portrait_Visible = false
    },
    //机器人对话区头像预览
    async robot_Head_Portrait_Preview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.createData.robot_Head_Portrait_Image = file.url || file.preview
      this.createData.robot_Head_Portrait_Visible = true
    },
    //机器人对话区头像文件监听
    robot_Head_Portrait_Change({ fileList }) {
      if (fileList.length > 0) {
        if (fileList[0].status == 'done') {
          var res = fileList[0].response
          if (res.code == 0) {
            this.createData.robot_Head_Portrait_FileName = res.fileName
            this.$message.success(`${res.fileName} 上传成功`)
          } else {
            this.$message.error(res.message)
          }
        }
      }
      this.createData.robot_Head_Portrait = fileList
    },
    //机器人聊天区文字背景图预览关闭
    robot_Text_Picture_Cancel() {
      this.createData.robot_Text_Picture_Visible = false
    },
    //机器人聊天区文字背景图预览
    async robot_Text_Picture_Preview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.createData.robot_Text_Picture_Image = file.url || file.preview
      this.createData.robot_Text_Picture_Visible = true
    },
    //机器人聊天区文字背景图文件监听
    robot_Text_Picture_Change({ fileList }) {
      if (fileList.length > 0) {
        if (fileList[0].status == 'done') {
          var res = fileList[0].response
          if (res.code == 0) {
            this.createData.robot_Text_Picture_FileName = res.fileName
            this.$message.success(`${res.fileName} 上传成功`)
          } else {
            this.$message.error(res.message)
          }
        }
      }
      this.createData.robot_Text_Picture = fileList
    },
    //客户对话区头像预览关闭
    client_Head_Portrait_Cancel() {
      this.createData.client_Head_Portrait_Visible = false
    },
    //客户对话区头像预览
    async client_Head_Portrait_Preview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.createData.client_Head_Portrait_Image = file.url || file.preview
      this.createData.client_Head_Portrait_Visible = true
    },
    //客户对话区头像文件监听
    client_Head_Portrait_Change({ fileList }) {
      if (fileList.length > 0) {
        if (fileList[0].status == 'done') {
          var res = fileList[0].response
          if (res.code == 0) {
            this.createData.client_Head_Portrait_FileName = res.fileName
            this.$message.success(`${res.fileName} 上传成功`)
          } else {
            this.$message.error(res.message)
          }
        }
      }
      this.createData.client_Head_Portrait = fileList
    },
    //客户聊天区文字背景图预览关闭
    client_Text_Picture_Cancel() {
      this.createData.client_Text_Picture_Visible = false
    },
    //客户聊天区文字背景图预览
    async client_Text_Picture_Preview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj)
      }
      this.createData.client_Text_Picture_Image = file.url || file.preview
      this.createData.client_Text_Picture_Visible = true
    },
    //客户聊天区文字背景图文件监听
    client_Text_Picture_Change({ fileList }) {
      if (fileList.length > 0) {
        if (fileList[0].status == 'done') {
          var res = fileList[0].response
          if (res.code == 0) {
            this.createData.client_Text_Picture_FileName = res.fileName
            this.$message.success(`${res.fileName} 上传成功`)
          } else {
            this.$message.error(res.message)
          }
        }
      }
      this.createData.client_Text_Picture = fileList
    },
  }
}
</script>