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
      <a-form-item label="回答内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-textarea
          v-decorator="[
            'contents',
            {rules: [{ required: true, message: '请输入回答内容' }],initialValue:editSkills.contents}
          ]"
          placeholder="回答内容"
          :rows="2"
          autosize
        />
      </a-form-item>

      <a-form-item label="网址信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-radio-group
          name="radioGroup"
          v-decorator="[
            'netType',
            {rules: [{ required: true,message: '请选择网址类型' }],initialValue:editSkills.netType}
          ]"
        >
          <a-radio :value="1">内网</a-radio>
          <a-radio :value="0">外网</a-radio>
        </a-radio-group>
        <a-input
          placeholder="网址信息"
          v-decorator="[
            'url',
            {rules: [{ message: '请输入网址信息' }],initialValue:editSkills.url}
          ]"
        />
      </a-form-item>
      <a-form-item
        v-if="editSkills.htmlType==222?true:false"
        label="上传文件"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <!-- 业务库上传文件 -->
        <a-upload
          name="file"
          :multiple="true"
          action="http://robot.lovechuangchuang.com:8085/skillsOption/fileUpload"
          :fileList="editSkills.fileNameList"
          :headers="headers"
          :remove="handleRemoveFile"
          @change="handleChangeFile"
        >
          <a-button>
            <a-icon type="upload" />点击上传
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item label="动作集" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-button type="primary">编辑动作集</a-button>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { queryData } from '@/api/common'
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
      url: '',
      editSkills: { entityId: '', contents: '', user: '0', netType: '', url: '', org: '1', fileNameList: [] }
    }
  },
  methods: {
    handleRemoveFile(file) {
      console.log(file)
    },
    handleChangeFile(info) {
      console.log(info)
      let fileList = [...info.fileList]
      // fileList = fileList.slice(-1)
      this.editSkills.fileNameList = fileList
      if (info.file.status !== 'uploading') {
        console.log('info.file:', info.file)
        var response = info.file.response
        this.url = response.fileName
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} 上传成功`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败.`)
      }
    },
    show(record) {
      let _this = this
      this.fileList = []
      this.visible = true
      let param = { entityId: '62299' }
      queryData(param, '/skillsOption/getSkillsOption').then(res => {
        if (res.code == 0) {
          // console.log(_this.editSkills)
          _this.editSkills = res.result
          console.log(_this.editSkills)
          _this.editSkills.fileNameList = res.resultFile
        } else {
          _this.$message.error(res.message)
        }
      })
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      var _this = this
      validateFields((errors, values) => {
        if (!errors) {
          console.log(values)
          var param = _this.editSkills
          queryData({ ...param, ...values }, '/skillsOption/updateContents').then(res => {
            if (res.code == 0) {
              _this.$message.success('新建成功')
            } else {
              _this.$message.error(res.message)
            }
            _this.visible = false
            // 重置输入框内容
            _this.form.resetFields()
          })
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
