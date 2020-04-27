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
        label="命令名称"
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
        label="单位指令类型"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol">
          <a-select
            showSearch
            placeholder="选择单位指令类型"
            optionFilterProp="children"
            :filterOption="filterOption"
            v-decorator="[
              'typeId',
              {rules: [{ required: true, message: '请选择' }]}
            ]"
          >
            <a-select-option v-for="(item ,key) in cmdTypeList" :key="key" :value="item.id">
              {{item.name}}
            </a-select-option>
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
      cmdTypeList: [],
      typeId:'',
      name:''
    }
  },
  created(){
    this.getCmdType()
  },
  methods: {
    add() {
      this.visible = true
    },

    // 获取单元指令类型
    getCmdType() {
      queryData({}, '/cmdUnitType/getCmdUnitTypeList').then(res => {
        console.log(res)
        if (res.code == 0) {
          this.cmdTypeList = res.result
        } else {
          this.$message.error(res.message)
        }
      })
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
            addData(values, '/cmdUnit/save').then(res => {
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
