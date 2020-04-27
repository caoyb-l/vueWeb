<template>
  <!-- 编辑业务弹框 -->
  <a-modal
    title="编辑"
    style="top: 150px;"
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
            'title',
            {rules: [{ required: true, message: '请输入名称' }],
            initialValue:editData.title}
          ]"
          placeholder="名称"
        />
      </a-form-item>
      <a-form-item label="别名" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'depict',
            {rules: [{ message: '请输入别名' }],
            initialValue:editData.depict}
          ]"
          placeholder="别名"
        />
      </a-form-item>
      <!-- 默认回答输入框 -->
      <a-form-item label="回答：" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-textarea
          placeholder="默认回答内容"
          rows="5"
          v-decorator="[
            'contents',
            {rules: [{ required: true,message: '请输入默认回答内容' }],
            initialValue:editData.contents}
          ]"
        />
      </a-form-item>
      <a-form-item label="是否启用" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-switch
          v-decorator="[
            'isAble'
          ]"
          checkedChildren="是"
          unCheckedChildren="否"
          v-model="isAble"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { addBusinessQues } from '@/api/ques'

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
      isAble: true,
      editData: [],
      entityId: ''
    }
  },
  methods: {
    onChange(check) {
      console.log('check:', check)
    },
    add(record) {
      this.visible = true
      this.editData = record
      this.isAble = record.isAble == 1 ? true : false
      this.entityId = record.id
    },

    //回调函数
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          var _this = this
          setTimeout(() => {
            let isAble = this.isAble == undefined || this.isAble == false ? 0 : 1
            console.log('isAble=' + isAble)
            values.isAble = isAble
            let userObj = JSON.parse(localStorage.getItem('user'))
            let [orgId, user, type] = [userObj.orgId, userObj.id, 1]
            let param = Object.assign(values, { orgId, user, type }, { entityId: this.entityId })
            addBusinessQues(param).then(res => {
              console.log(res)
              if (res.code == 0) {
                _this.$message.success('编辑成功')
              } else {
                _this.$message.error(res.message)
              }
              _this.visible = false
              _this.confirmLoading = false
              _this.$emit('ok', values)
              _this.entityId = ''
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
