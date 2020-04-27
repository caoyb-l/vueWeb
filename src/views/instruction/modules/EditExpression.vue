<template>
  <!-- 修改表机器人表情 -->
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
        label="名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'name',
            {rules: [{ required: true, message: '请输入名称' }],
            initialValue: editData.name,}
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
            {rules: [{ message: '请输入编码' }],
            initialValue: editData.code,}
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
      editData:{},
    }
  },
  methods: {
    add(record) {
      this.form.resetFields();
      this.visible = true,
      this.editData = record;
    },
    handleSubmit() {
      const { form: { validateFields } } = this
      this.confirmLoading = true;
      validateFields((errors, values) => {
        if (!errors) {
          var _this = this
          setTimeout(() => {
            var param = Object.assign(values,{id:this.editData.id} )
            addData(param,'/robotExpManage/editRobotExpMsg').then(res => {
              if (res.code == 0) {
                _this.$message.success('编辑成功')
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
