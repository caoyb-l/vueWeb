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
      :maskClosable = "false"
    >
    <a-form :form="form">
      <a-form-item
        label="名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'name',
            {rules: [{ required: true, message: '请输入名称' }]}
          ]"
          placeholder="名称" />
      </a-form-item>
      <a-form-item
        label="编码"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'code',
            {rules: [{required: true,  message: '请输入编码' }]}
          ]"
          placeholder="编码"
           />
      </a-form-item>
    </a-form>
    </a-modal>
</template>

<script>
import { addData } from '@/api/common'

export default {
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
      confirmLoading: false,
      form: this.$form.createForm(this),
    }
  },
  methods: {
    add() {
      this.visible = true
    },
    handleSubmit() {
      const { form: { validateFields } } = this
      this.confirmLoading = true;
      validateFields((errors, values) => {
        if (!errors) {
          var _this = this
          setTimeout(() => {
            addData(values,'/robotExpManage/addRobotExpMsg').then(res => {
              if (res.code == 0) {
                _this.$message.success('新建成功')
              } else {
                _this.$message.error(res.message)
              }
                _this.visible = false
                _this.confirmLoading = false
                _this.$emit('ok', values);
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
