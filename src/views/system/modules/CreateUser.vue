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
    :maskClosable="false"
  >
    <a-form :form="form">
      <a-form-item label="登录名" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'loginName',
            {rules: [{ required: true, message: '请输入登录名' }]}
          ]"
          placeholder="登录名"
        />
      </a-form-item>
      <a-form-item label="单位名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
          showSearch
          placeholder="选择所属单位"
          optionFilterProp="children"
          :filterOption="filterOption"
          v-decorator="[
            'org',
            {rules: [{ required: true, message: '请选择' }]}
          ]"
        >
          <a-select-option v-for="(item ,key) in orgNames" :key="key" :value="item.id">{{item.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="角色名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-select
          showSearch
          placeholder="选择角色名称"
          optionFilterProp="children"
          :filterOption="filterOption"
          v-decorator="[
            'role',
            {rules: [{ required: true, message: '请选择' }]}
          ]"
        >
          <a-select-option
            v-for="(item ,key) in roleNames"
            :key="key"
            :value="item.id"
          >{{item.name}}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="用户姓名" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'userName',
            {rules: [{ required: true, message: '请输入用户名' }]}
          ]"
          placeholder="用户名"
        />
      </a-form-item>
      <a-form-item label="手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-input
          v-decorator="[
            'mobile',
            {rules: [{ message: '请输入手机号' }]}
          ]"
          placeholder="手机号"
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
      confirmLoading: false,

      form: this.$form.createForm(this),
      orgNames: [],
      roleNames: []
    }
  },
  created() {
    this.handleRoleList()
    this.handleOrgList()
  },
  methods: {
    // 获取角色
    handleRoleList() {
      var _this = this
      var roleId = JSON.parse(localStorage.getItem('user')).roleId
      queryData({ role: roleId }, '/userManage/getAllSysRole').then(res => {
        console.log('角色列表', res)
        _this.roleNames = res.result
        if (res.code !== 0) {
          _this.$message.error(res.message)
        }
      })
    },
    // 获取单位下的单位
    handleOrgList() {
      let id = JSON.parse(localStorage.getItem('user')).orgId
      var param = { org: id }
      var _this = this
      queryData(param, '/userManage/getHrOrgByPid').then(res => {
        _this.orgNames = res.result
        if (res.code !== 0) {
          _this.$message.error(res.message)
        }
      })
    },
    add() {
      this.visible = true
    },
    handleSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (values.mobile && parseInt(values.mobile).toString().length !== 11) {
          this.$message.error('请输入正确的手机号')
          return false
        }
        if (!errors) {
          console.log('values', values)
          var _this = this
          setTimeout(() => {
            addData(values, '/userManage/addUserMsg').then(res => {
              if (res.code == 0) {
                _this.$message.success('新建成功')
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
    handleCancel() {
      this.visible = false
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>
