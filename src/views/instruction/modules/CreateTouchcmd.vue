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
        label="触发条件"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'name',
            {rules: [{ required: true, message: '请输入触发条件' }]}
          ]"
          placeholder="触发条件" />
      </a-form-item>
      <a-form-item
        label="指令编码"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'code',
            {rules: [{ required: true, message: '请输入指令编码' }]}
          ]"
          placeholder="指令编码" />
      </a-form-item>
    </a-form>
    </a-modal>
</template>

<script>
import { addData, queryData } from '@/api/common'
export default {
  name: 'createSuperCmd',
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
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          var _this = this
          setTimeout(() => {
            addData(values, '/supercmdTrigger/save').then(res => {
              console.log(res);
              if (res.code == 0) {
                _this.$message.success('新建成功');
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
