<template>
  <!-- 编辑弹框 -->
      <a-modal
      title="编辑"
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
        label="版本描述"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-textarea
          placeholder="请输入描述" :rows="4"
          v-decorator="[
            'contents',
            {
              rules: [{message: '请输入版本描述' }],
              initialValue: editData.contents,
            }]"
          />
      </a-form-item>
    </a-form>
    </a-modal>
</template>

<script>
import { queryData } from '@/api/common'
export default {
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
      editData: {}
    }
  },
  methods: {
    add (record) {
      this.form.resetFields()
      this.visible = true
      this.editData = record
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          var param = Object.assign(values, { id: this.editData.id })
          var _this = this
          setTimeout(() => {
            queryData(param, '/Singlechip/editSinglechipMsg').then(res => {
              if (res.code == 0) {
                _this.$message.success('修改成功')
                // 重置输入框内容
                _this.form.resetFields()
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', values)
              } else {
                _this.$message.error(res.message)
              }
            })
          }, 300)
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      this.visible = false
      this.editData = {}
    }
  }
}
</script>
