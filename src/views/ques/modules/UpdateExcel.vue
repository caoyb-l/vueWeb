<template>
  <a-modal
    title="批量上传文件"
    style="top: 300px;"
    :width="400"
    :afterClose="afterClose"
    :destroyOnClose="true"
    v-model="visible"
    @ok="handleSubmit"
    v-preventReClick
    :maskClosable="false"
  >
    <a-form-item style="margin-left: 120px;" :labelCol="labelCol" :wrapperCol="wrapperCol">
      <a-upload
        name="file"
        :multiple="true"
        action="http://robot.lovechuangchuang.com:8085/skills/fileUpload"
        :data="this.fileParam"
        :headers="headers"
        @change="handleChange"
      >
        <a-button>
          <a-icon type="upload" />点击上传
        </a-button>
      </a-upload>
      <a
        href="http://robot.lovechuangchuang.com:8085/images/1578557194713.xlsx"
        target="_blank"
      >下载模板</a>
    </a-form-item>
  </a-modal>
</template>

<script>
import { queryData } from '@/api/common'
export default {
  data() {
    return {
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
      fileParam: {}
    }
  },
  created() {
    this.Param()
  },
  methods: {
    Param() {
      let user = JSON.parse(localStorage.getItem('user')).id
      let org = JSON.parse(localStorage.getItem('user')).orgId
      this.fileParam = { userId: user, orgId: org }
    },
    add() {
      this.visible = true
    },
    handleChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`上传成功，刷新可查看数据`)
      } else if (info.file.status === 'error') {
        this.$message.error(`上传失败`)
      }
    },
    afterClose() {},
    handleSubmit() {
      this.visible = false
    }
  }
}
</script>
