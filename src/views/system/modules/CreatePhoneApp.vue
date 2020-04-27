<template>
  <!-- 新增弹框 -->
  <a-modal
    title="新建"
    style="top: 20px;"
    :width="600"
    v-model="visible"
    @ok="handleSubmit"
    v-preventReClick
    :destroyOnClose="true"
    :maskClosable="false"
  >
    <a-form :form="form">
      <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'name',
            {rules: [{ required: true, message: '请输入名称' }]}
          ]"
          placeholder="名称"
        />
      </a-form-item>
      <a-form-item label="版本号" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'appVersion',
            {rules: [{ required: true, message: '请输入版本号' }]}
          ]"
          placeholder="版本号"
        />
      </a-form-item>
      <a-form-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-textarea
          placeholder="请输入描述"
          :rows="4"
          v-decorator="[
            'contents',
            {rules: [{ message: '请输入描述' }]}
          ]"
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
      url: '',
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
      url: ''
    }
  },
  methods: {
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
          this.url = res.fileName
        } else {
          this.$message.error(res.message)
          this.fileList = []
        }
      } else if (info.file.status == 'error') {
        this.$message.error(`${info.file.name} 上传失败.`)
      }
    },
    add() {
      this.fileList = []
      this.visible = true
      this.url = uploadUrl + 'AppManage/fileUpload'
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      if (this.url == '') {
        this.$message.error('请先上传APP')
        return false
      }
      validateFields((errors, values) => {
        if (!errors) {
          var _this = this
          setTimeout(() => {
            var param = Object.assign(values, { url: this.url })
            queryData(param, '/AppManage/addRobotAppMsg').then(res => {
              if (res.code == 0) {
                _this.$message.success('新建成功')
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
