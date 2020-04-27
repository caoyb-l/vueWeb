<template>
  <!-- 编辑弹框 -->
  <a-modal
    title="修改密码"
    style="top: 20px;"
    :width="600"
    v-model="visible"
    @ok="handleSubmit"
    v-preventReClick
    :destroyOnClose="true"
    :maskClosable="false"
  >
    <a-form :form="form">
      <a-popover
        placement="rightTop"
        :trigger="['focus']"
        :getPopupContainer="(trigger) => trigger.parentElement"
        v-model="state.passwordLevelChecked"
      >
        <template slot="content">
          <div :style="{ width: '240px' }">
            <div :class="['user-register', passwordLevelClass]">
              强度：
              <span>{{ passwordLevelName }}</span>
            </div>
            <a-progress
              :percent="state.percent"
              :showInfo="false"
              :strokeColor=" passwordLevelColor "
            />
            <div style="margin-top: 10px;">
              <span>请至少输入6个字符,且必须同时包含字符和数字。</span>
            </div>
          </div>
        </template>
        <a-form-item label="新密码">
          <a-input
            size="large"
            type="password"
            autocomplete="false"
            @click="handlePasswordInputClick"
            placeholder="至少6位密码"
            v-decorator="['password', {rules: [{ required: true, message: '至少6位密码'}, { validator: this.handlePasswordLevel }], validateTrigger: ['change', 'blur']}]"
          ></a-input>
        </a-form-item>
      </a-popover>

      <a-form-item label="密码确认">
        <a-input
          size="large"
          type="password"
          autocomplete="false"
          placeholder="确认密码"
          v-decorator="['password2', {rules: [{ required: true, message: '至少6位密码' }, { validator: this.handlePasswordCheck }], validateTrigger: ['change', 'blur']}]"
        ></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { queryData } from '@/api/common'
const levelNames = {
  0: '低',
  1: '低',
  2: '中',
  3: '强'
}
const levelClass = {
  0: 'error',
  1: 'error',
  2: 'warning',
  3: 'success'
}
const levelColor = {
  0: '#ff0000',
  1: '#ff0000',
  2: '#ff7e05',
  3: '#52c41a'
}
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
      state: {
        time: 60,
        smsSendBtn: false,
        passwordLevel: 0,
        passwordLevelChecked: false,
        percent: 10,
        progressColor: '#FF0000'
      }
    }
  },
  computed: {
    passwordLevelClass() {
      return levelClass[this.state.passwordLevel]
    },
    passwordLevelName() {
      return levelNames[this.state.passwordLevel]
    },
    passwordLevelColor() {
      return levelColor[this.state.passwordLevel]
    }
  },
  methods: {
    add() {
      this.form.resetFields()
      this.visible = true
      this.state.passwordLevelChecked = false
    },
    handlePasswordInputClick() {
      this.state.passwordLevelChecked = true
    },
    handlePasswordLevel(rule, value, callback) {
      let level = 0
      if (value.length < 6) {
        callback(new Error('长度不能小于6位'))
      }
      // 判断这个字符串中有没有数字
      if (/[0-9]/.test(value)) {
        level++
      }
      // 判断字符串中有没有字母
      if (/[a-zA-Z]/.test(value)) {
        level++
      }
      // 判断字符串中有没有特殊符号
      if (/[^0-9a-zA-Z_]/.test(value)) {
        level++
      }
      this.state.passwordLevel = level
      this.state.percent = level * 30
      if (level >= 2) {
        if (level >= 3) {
          this.state.percent = 100
        }
        callback()
      } else {
        if (level === 0) {
          this.state.percent = 10
        }
        callback(new Error('密码强度不够'))
      }
    },
    // handlePasswordLevel (rule, value, callback) {
    //   // 判断这个字符串是否是数字
    //   if (!(/^[0-9]+$/.test(value)) || value.length < 6) {
    //     callback(new Error('必须是数字,且长度不能小于6位'))
    //   }
    //   callback()
    // },
    handlePasswordCheck(rule, value, callback) {
      const password = this.form.getFieldValue('password')
      console.log('value', value)
      if (value === undefined) {
        callback(new Error('请输入密码'))
      }
      if (value && password && value.trim() !== password.trim()) {
        callback(new Error('两次密码不一致'))
      }
      callback()
    },
    handleSubmit() {
      console.log('提交')
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        console.log(!errors)
        if (!errors) {
          var userId = JSON.parse(localStorage.getItem('user')).id
          var param = Object.assign(values, { id: userId })
          console.log(param)
          var _this = this
          setTimeout(() => {
            queryData(param, '/userManage/chgPassword').then(res => {
              // eslint-disable-next-line eqeqeq
              if (res.code == 0) {
                _this.$message.success('密码修改成功，请重新登录')
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
    }
  }
}
</script>
