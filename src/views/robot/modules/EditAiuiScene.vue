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
    :maskClosable="false"
  >
    <a-form :form="form">
      <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
          'scene',
            {
              rules: [{ required: true, message: '请输入' }],
              initialValue: editData.scene
            }]"
        />
      </a-form-item>
      <a-form-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
          'descn',
            {
              rules: [{ required: true, message: '请输入' }],
              initialValue: editData.descn
            }]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { queryData, addData } from '@/api/common'

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

      form: this.$form.createForm(this),
      editData: {}
    }
  },
  methods: {
    add(record) {
      this.form.resetFields()
      this.visible = true
      this.editData = record
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      validateFields((errors, values) => {
        if (!errors) {
          var param = Object.assign(values, { entityId: this.editData.id })
          var _this = this
          setTimeout(() => {
            addData(param, '/aiuiScene/update').then(res => {
              if (res.code == 0) {
                _this.$message.success('修改成功')
                // 重置输入框内容
                this.visible = false
                _this.$emit('ok', values)
              } else {
                _this.$message.error(res.message)
              }
            })
          })
        }
      })
    }
  }
}
</script>
