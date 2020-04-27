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
      <a-form-item label="地图名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'mapName',
            {rules: [{ required: true, message: '请输入地图名称' }],
            initialValue: editData.mapName,}
          ]"
          placeholder="地图名称"
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
      editData: {}
    }
  },
  methods: {
    add(record) {
      this.form.resetFields()
      ;(this.visible = true), (this.editData = record)
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          var _this = this
          setTimeout(() => {
            var param = Object.assign(values, { entityId: this.editData.id })
            addData(param, '/robotMapLib/save').then(res => {
              if (res.code == 0) {
                _this.$message.success('编辑成功')
              } else {
                _this.$message.error(res.message)
              }
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
    },
    handleCancel() {
      this.visible = false
    }
  }
}
</script>
