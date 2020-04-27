<template>
  <div class="user-wrapper">
    <div class="content-box">
        <span class="action">
          {{ orgName }}
        </span>
      <!-- <notice-icon class="action"/> -->
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="avatar"/>
          <span>{{ userName }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="0" @click="chgPwd">
              <a-icon type="user"/>
              <span>修改密码</span>
          </a-menu-item>
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout"/>
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
    <chg-user-pwd ref="chgUserPwd"/>
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import ChgUserPwd from '../../views/user/ChgUserPwd'

import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UserMenu',
  data () {
    return {
      userName: '',
      orgName: '',
      avatar: ''
    }
  },
  components: {
    NoticeIcon,
    ChgUserPwd
  },
  created(){
    this.getUserInfo();
  },
  methods: {
    ...mapActions(['Logout']),
    // ...mapGetters(['avatar']),
    getUserInfo(){
      this.userName = JSON.parse(localStorage.getItem('user')).name;
      this.orgName = JSON.parse(localStorage.getItem('user')).orgName;
      this.avatar = JSON.parse(localStorage.getItem('user')).avatar;
    },
    chgPwd () {
      this.$refs.chgUserPwd.add()
    },
    handleLogout () {
      const that = this
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk () {
          return that.Logout({}).then(() => {
            window.location.reload()
          }).catch(err => {
            that.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel () {
        }
      })
    }
  }
}
</script>
