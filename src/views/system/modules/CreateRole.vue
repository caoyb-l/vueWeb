<template>
  <a-modal
    title="新建"
    :width="700"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    v-preventReClick
    :destroyOnClose="true"
    :maskClosable="false"
  >
    <a-card :bordered="false" :style="{ height: '100%' }">
      <a-row :gutter="24">
        <a-col :md="24">
          <div style="max-width: 900px">
            <a-form :form="form">
              <a-form-item label="角色名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input
                  v-decorator="[
               'name',
               {rules: [{ required: true, message: '请填写角色名称!' }]}
              ]"
                  placeholder="请填写角色名称"
                />
              </a-form-item>
              <a-form-item label="角色等级" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <a-input
                  type="number"
                  v-decorator="[
               'level',
               {
                 rules: [{ required: true, message: '请填写角色等级!' }]}
              ]"
                  placeholder="请填写角色名称"
                />
              </a-form-item>
              <a-form-item label="拥有权限">
                <a-row :gutter="16" v-for="(permission, index) in permissions" :key="index">
                  <a-col :xl="4" :lg="24">{{ permission.name }}</a-col>
                  <a-col :xl="20" :lg="24">
                    <a-checkbox
                      v-if="permission.actionsOptions.length > 0"
                      :indeterminate="permission.indeterminate"
                      :checked="permission.checkedAll"
                      @change="onChangeCheckAll($event, permission)"
                    >全选</a-checkbox>
                    <a-checkbox-group
                      :options="permission.actionsOptions"
                      v-model="permission.selected"
                      @change="onChangeCheck(permission)"
                    />
                  </a-col>
                </a-row>
              </a-form-item>
            </a-form>
          </div>
        </a-col>
      </a-row>
    </a-card>
  </a-modal>
</template>

<script>
import { queryData, addData } from '@/api/common'

export default {
  name: 'addRoleModal',
  data() {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      visible: false,
      confirmLoading: false,
      roles: [],
      name: '',
      form: this.$form.createForm(this),
      permissions: []
    }
  },
  methods: {
    add() {
      var param = { role: '' }
      var _this = this
      queryData(param, '/SysRoleManage/loadResourceMsg')
        .then(res => {
          console.log(res)
          _this.permissions = res.result
          if (res.code !== 0) {
            _this.$message.error(res.message)
          }

          this.visible = true
        })
        .catch(err => console.log(err))
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleSubmit() {
      const _this = this
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // 验证表单没错误
        if (!err) {
          _this.confirmLoading = true
          addData(Object.assign(values, { resourceList: _this.permissions }), '/SysRoleManage/addSysRoleMsg')
            .then(res => {
              console.log(res)
              if (res.code == 0) {
                _this.$message.success('新建成功')
                _this.visible = false
                // 重置输入框内容
                _this.form.resetFields()
                this.$emit('ok', values)
              } else {
                _this.$message.error(res.message)
              }
              _this.confirmLoading = false
            })
            .catch(err => console.log(err))
        }
      })
    },
    handleCancel() {
      this.close()
    },
    onChangeCheck(permission) {
      permission.indeterminate =
        !!permission.selected.length && permission.selected.length < permission.actionsOptions.length
      permission.checkedAll = permission.selected.length === permission.actionsOptions.length
    },
    onChangeCheckAll(e, permission) {
      Object.assign(permission, {
        selected: e.target.checked ? permission.actionsOptions.map(obj => obj.value) : [],
        indeterminate: false,
        checkedAll: e.target.checked
      })
    }
  }
}
</script>

<style scoped>
</style>
