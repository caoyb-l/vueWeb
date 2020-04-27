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
        label="类型名称"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'name',
            {rules: [{ required: true, message: '请输入类型名称' }]}
          ]"
          placeholder="类型名称" />
      </a-form-item>
      <a-form-item
        label="命令单元参数类型"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
          <a-select
            showSearch
            placeholder="选择命令单元参数类型"
            optionFilterProp="children"
            :filterOption="filterOption"
            v-decorator="[
              'type',
              {rules: [{ required: true, message: '请选择' }]}
            ]"
          >
            <a-select-option value="1">声音 </a-select-option>
            <a-select-option value="2">串口 </a-select-option>
            <a-select-option value="3">思岚 </a-select-option>
          </a-select>
        </a-form-item>
    </a-form>
    </a-modal>
</template>

<script>
import { addData , queryData} from '@/api/common'

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
      typeId:'',
      name:''
    }
  },
  methods: {
    add() {
      this.visible = true
    },
    // 下拉框
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleSubmit() {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          var _this = this
          setTimeout(() => {
            addData(values, '/cmdUnitType/save').then(res => {
              if (res.code == 0) {
                _this.$message.success('新建成功')
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
