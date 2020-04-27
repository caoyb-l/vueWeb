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
      <a-form-item label="版本描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
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
      fileName: '',
      newFileName: '',
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
          this.fileName = res.fileName
          this.newFileName = res.newFileName
        } else {
          this.$message.error(res.message)
          this.fileList = []
        }
      } else if (info.file.status == 'error') {
        this.$message.error(`${info.file.name} 上传失败.`)
      }
    },
    add() {
      this.url = uploadUrl + 'RobotVersion/fileUpload'
      console.log(this.url)
      this.fileList = []
      this.visible = true
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      if (this.fileName == '') {
        this.$message.error('请先上传APP')
        return false
      }
      validateFields((errors, values) => {
        if (!errors) {
          var _this = this
          setTimeout(() => {
            var param = Object.assign(values, { fileName: this.fileName, newFileName: this.newFileName })
            queryData(param, '/RobotVersion/addRobotVersionMsg').then(res => {
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
