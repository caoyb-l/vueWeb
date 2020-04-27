<template>
  <!-- 修改弹框 -->
  <a-modal
    title="修改"
    style="top: 20px;"
    :width="600"
    v-model="visible"
    @ok="handleSubmit"
    v-preventReClick
    :destroyOnClose="true"
    :maskClosable="false"
  >
    <a-form :form="form">
      <a-form-item label="文件名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'fileName',
            {rules: [{ required: true, message: '请输入文件名称' }],initialValue:this.fileName}
          ]"
          placeholder="文件名称"
        />
      </a-form-item>
      <a-form-item label="单位名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
          showSearch
          placeholder="选择所属单位"
          optionFilterProp="children"
          :filterOption="filterOption"
          v-decorator="[
            'orgId',
            {rules: [{ required: true, message: '请选择' }],initialValue:this.orgId}
          ]"
        >
          <a-select-option
            v-for="(item ,key) in orgNames"
            :key="key"
            :value="item.id"
          >{{ item.name }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="文件类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
          placeholder="选择文件类型"
          optionFilterProp="children"
          :filterOption="filterOption"
          v-decorator="[
            'fileType',
            {rules: [{required: true, message: '文件类型' }],initialValue:this.fileType}
          ]"
        >
          <a-select-option :value="1">图片</a-select-option>
          <a-select-option :value="2">音频</a-select-option>
          <a-select-option :value="3">视频</a-select-option>
          <a-select-option :value="4">文件</a-select-option>
          <a-select-option :value="5">网页</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="文件访问路径" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'fileUrl',
            {rules: [{ required: true, message: '文件访问路径' }],initialValue:this.fileUrl}
          ]"
          placeholder="文件访问路径"
        />
      </a-form-item>
      <a-form-item label="上传" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-upload
          name="file"
          :multiple="false"
          :action="url"
          :fileList="fileList"
          :headers="headers"
          @change="handleChange"
        >
          <a-button>
            <a-icon type="upload" />点击上传
          </a-button>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { queryData } from '@/api/common'
import { uploadUrl } from '@/api/upload'
export default {
  data() {
    return {
      fileList: [],
      headers: {
        authorization: 'authorization-text'
      },
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
      fileUrl: '',
      fileName: '',
      orgId: '',
      id: '',
      fileType: '',
      orgNames: [],
      url: ''
    }
  },
  methods: {
    // 获取单位下的单位
    handleOrgList() {
      const id = JSON.parse(localStorage.getItem('user')).orgId
      var param = { org: id }
      var _this = this
      queryData(param, '/userManage/getHrOrgByPid').then(res => {
        _this.orgNames = res.result
        if (res.code !== 0) {
          _this.$message.error(res.message)
        }
      })
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleChange(info) {
      let fileList = [...info.fileList]
      fileList = fileList.slice(-1)
      console.log(fileList)
      this.fileList = fileList
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      console.log(info.file.status)
      if (info.file.status == 'done') {
        const res = info.file.response
        if (res.code == 0) {
          this.$message.success(`${info.file.name} 上传成功`)
          this.fileUrl = res.fileName
          this.form.setFieldsValue({
            fileUrl: res.fileName
          })
        } else {
          this.$message.error(res.message)
          this.fileList = []
        }
      } else if (info.file.status == 'error') {
        this.$message.error(`${info.file.name} 上传失败.`)
      }
    },
    add(record) {
      console.log(record)
      this.fileList = []
      this.fileUrl = record.fileUrl
      this.orgId = record.org
      this.fileName = record.fileName
      this.fileType = record.type
      this.id = record.id
      this.visible = true
      this.url = uploadUrl + 'skillOptionFile/fileUpload'
      this.handleOrgList()
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (this.fileUrl == '' && values.fileUrl == '') {
          this.$message.error('请先上传文件')
          return false
        }
        if (!errors) {
          var _this = this
          setTimeout(() => {
            var param = Object.assign(values, { id: this.id })
            queryData(param, '/skillOptionFile/editFile').then(res => {
              if (res.code == 0) {
                _this.$message.success('修改成功')
              } else {
                _this.$message.error(res.message)
              }
              _this.visible = false
              _this.confirmLoading = false
              _this.$emit('ok', values)
              _this.url = ''
              // 重置输入框内容
              _this.form.resetFields()
            })
          }, 300)
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>
