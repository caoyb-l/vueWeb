<template>
  <!-- 新增弹框 -->
  <a-modal
    title="新建"
    style="top: 20px;"
    :width="600"
    :destroyOnClose="true"
    v-model="visible"
    @ok="handleSubmit"
    v-preventReClick
    :maskClosable = "false"
  >
    <a-form :form="form">
      <a-form-item
        label="姓名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'name',
            {rules: [{ required: true, message: '请输入' }]}
          ]"
          placeholder="姓名" />
      </a-form-item>
      <a-form-item
        label="人脸描述"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-textarea
          v-decorator="[
            'Descn',
            {rules: [{ required:true, message: '请输入' }]}
          ]"
          row="2">
        </a-textarea>
      </a-form-item>
      <a-form-item
        label="人脸应答内容"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-textarea
          v-decorator="[
            'msg',
            {rules: [{ required: true, message: '请输入' }]}
          ]"
          row="2">
        </a-textarea>
      </a-form-item>
      <a-form-item label="地图" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
          showSearch
          placeholder="如需使用导航请先选择地图"
          optionFilterProp="children"
          v-decorator="['mapId']"
        >
          <a-select-option v-for="(item ,key) in mapList" :key="key" :value="item.id">
            {{ item.mapName }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item
        label="动作集"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-select
          showSearch
          placeholder="选择动作集"
          optionFilterProp="children"
          @change="changeCmd($event)"
          v-decorator="[
            'cmd',
            {initialValue: cmd}
          ]"
        >
          <a-select-option v-for="(item ,key) in cmdList" :key="key" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
        <a-button type="primary" @click="addCmd()">新增一个动作集</a-button>
        <a-divider type="vertical"/>
        <a-button id="chgCmd" type="primary" @click="editCmd()" v-if="showEditCmd">修改当前动作集</a-button>
      </a-form-item>

      <a-form-item
        label="年龄"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'age',
            {rules: [{ message: '请输入' }]}
          ]"
          placeholder="年龄" />
      </a-form-item>
      <a-form-item
        label="性别"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-select
          placeholder="选择性别"
          optionFilterProp="children"
          v-decorator="[
            'sex',
            {rules: [{ message: '请选择' }]}
          ]"
        >
          <a-select-option value="1">男</a-select-option>
          <a-select-option value="2">女</a-select-option>
        </a-select>
      </a-form-item>
      <!-- 人脸上传文件 -->
      <a-form-item
        label="上传"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-upload
          :action= "url"
          listType="picture-card"
          :fileList="fileList"
          @preview="handlePreview"
          @change="handleChange"
        >
          <div v-if="fileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
          <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
      </a-form-item>
    </a-form>
    <cmd-list @getCmdId="getCmdId" ref="cmd"></cmd-list>
  </a-modal>
</template>

<script>
import { addData, queryData } from '@/api/common'
import CmdList from '../../Cmd'
import { uploadUrl } from '@/api/upload'
export default {
  components: {
    CmdList
  },
  data () {
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
      confirmLoading: false,
      form: this.$form.createForm(this),
      previewVisible: false,
      previewImage: '',
      fileList: [],
      fileName: '',
      cmdList: [],
      photo: '',
      faceName: '',
      mapId: '',
      mapList: [],
      cmd: '',
      showEditCmd: false,
      url: ''

    }
  },
  created () {
    this.url = uploadUrl + 'faceManage/faceUpload'
    this.getCmd()
    this.getMap()
  },
  methods: {
    changeCmd (event) {
      this.cmd = event
      this.showEditCmd = true
    },
    // 修改动作集
    editCmd () {
      const formData = this.form.getFieldsValue()
      if (formData.name == undefined) {
        this.$message.error('请先输入人脸名称')
        return
      }
      const mapId = formData.mapId == undefined ? 0 : formData.mapId
      console.log(mapId)
      this.$refs.cmd.show('编辑人脸动作集', mapId, this.cmd)
    },
    // 新增动作集
    addCmd () {
      const formData = this.form.getFieldsValue()
      if (formData.name == undefined) {
        this.$message.error('请先输入人脸名称')
        return
      }
      const mapId = formData.mapId == undefined ? 0 : formData.mapId
      this.$refs.cmd.show('编辑人脸动作集', mapId, 0)
    },
    add () {
      this.form.resetFields()
      this.visible = true
      this.cmd = ''
      this.showEditCmd = false
    },
    // showCmd(){
    //   let formData = this.form.getFieldsValue();
    //   if(formData.name == undefined){
    //     this.$message.error('请先输入人脸名称')
    //     return;
    //   }
    //   let mapId = formData.mapId == undefined ? 0 : formData.mapId
    //   this.$refs.cmd.show(formData.name,mapId,this.selectCmd)
    // },
    // 编辑动作集后，获取动作集ID
    getCmdId (cmd) {
      this.getCmd()
      this.form.setFieldsValue({
        cmd: parseInt(cmd)
      })
    },
    getMap () {
      const org = JSON.parse(localStorage.getItem('user')).orgId
      queryData({ orgId: org }, '/robotMapLib/getRobotMapLibList').then(res => {
        console.log('-----------getMap', res)
        this.mapList = res.result
      })
    },
    getCmd () {
      const org = JSON.parse(localStorage.getItem('user')).orgId
      const _this = this
      queryData({ orgId: org }, '/cmdCollection/getCmdListByOrg').then(res => {
        console.log(res)
        if (res.code == 0) {
          _this.cmdList = res.cmdList
        } else {
          _this.$message.error(res.message)
        }
      })
    },
    handleCancel () {
      this.previewVisible = false
    },
    handlePreview (file) {
      console.log(file)
      this.previewImage = file.url || file.thumbUrl
      this.previewVisible = true
    },
    handleChange ({ fileList }) {
      if (fileList.length > 0) {
        if (fileList[0].status == 'done') {
          var res = fileList[0].response
          console.log(res)
          if (res.code == 0) {
            this.fileName = res.fileName
            this.$message.success(`${res.fileName} 上传成功`)
          } else {
            this.$message.error(res.message)
          }
        }
      }
      this.fileList = fileList
    },
    // 下拉框
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },

    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          var _this = this
          if (this.fileName == '') {
            this.$message.error('请上传人脸图片')
            return
          }
          setTimeout(() => {
            const org = JSON.parse(localStorage.getItem('user')).orgId
            // values.cmd = this.cmd == '' ? values.cmd : this.cmd
            addData(Object.assign(values, { org: org, photo: this.fileName }), '/faceManage/addFaceMsg').then(res => {
              if (res.code == 0) {
                _this.$message.success('新建成功')
              } else {
                _this.$message.error(res.message)
              }
              _this.fileList = []
              _this.visible = false
              _this.confirmLoading = false
              _this.$emit('ok', values)
              // 重置输入框内容
              _this.form.resetFields()
            })
          }, 300)
        } else {
          this.confirmLoading = false
        }
      })
    }
  }
}
</script>
<style>
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  .anticon anticon-eye-o{
      display: none;
  }
  .ant-upload-list-item-actions a{
      display: none;
  }
</style>
