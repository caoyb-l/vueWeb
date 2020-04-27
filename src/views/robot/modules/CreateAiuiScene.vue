<template>
  <!-- 新增弹框 -->
  <a-modal
    title="新建引擎"
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
            {rules: [{ required: true, message: '请输入' }]}
          ]"
          placeholder="输入一个名称"
        />
      </a-form-item>
      <a-form-item label="描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'descn',
            {rules: [{ required: true, message: '请输入' }]}
          ]"
          placeholder="简单描述一下吧"
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
      orgNames: [],
      roleNames: [],
      scene: '',
      descn: ''
    }
  },
  methods: {
    add() {
      this.visible = true
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      validateFields((errors, values) => {
        if (!errors) {
          var _this = this
          setTimeout(() => {
            addData(values, '/aiuiScene/add').then(res => {
              if (res.code === 0) {
                _this.$message.success('新建成功')
                // 重置输入框内容
                _this.form.resetFields()
                _this.$emit('ok', values)
              } else {
                _this.$message.error(res.message)
              }
              this.visible = false
            })
          })
        }
      })
    }
  }
}
</script>
