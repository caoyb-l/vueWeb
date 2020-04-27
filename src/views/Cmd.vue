<template>
  <a-modal
    title="动作集制作"
    style="top:10px;"
    width="68%"
    v-model="showIframe"
    :footer="null"
    :destroyOnClose="true"
    @cancel="handleSubmit"
    :maskClosable="false"
    :keyboard="false"
    v-preventReClick
  >
    <iframe
      :src="cmdSrc"
      ref="iframe"
      scrolling="no"
      height="600px"
      width="100%"
      frameborder="0"
      style="margin: -33px 0px -25px -30px;"
    ></iframe>
  </a-modal>
</template>
<script>
import { addData, queryData } from '@/api/common'
import { STable } from '@/components'
export default {
  name: 'TableList',
  components: {
    STable
  },
  data () {
    return {
      returnCmd: '',
      // confirmLoading: false,
      form: this.$form.createForm(this),
      showIframe: false,
      cmdSrc: 'http://robot.lovechuangchuang.com:8084/robot.html'
      // cmdSrc: 'http://192.168.0.154:8084/robot.html'
    }
  },
  // 添加监听，监听子页面发送的值
  mounted () {
    window.addEventListener('message', e => {
      this.returnCmd = e.data
    })
  },
  methods: {
    // 打开网页传值
    show(title, mapId, cmd) {
      let user = JSON.parse(localStorage.getItem('user'))
      let param =
        '?orgId=' +
        user.orgId +
        '&createBy=' +
        user.id +
        '&circulation=1' +
        '&mapId=' +
        mapId +
        '&title=' +
        title +
        '&cmd=' +
        cmd
      this.cmdSrc = this.cmdSrc + encodeURI(param)
      console.log(this.cmdSrc)
      this.showIframe = true
    },
    // 右上角关闭按钮事件
    handleSubmit () {
      if (this.returnCmd != '') {
        // 命令集id回传到编辑页面
        this.$emit('getCmdId', this.returnCmd)
      }
      this.showIframe = false
    }
  }
}
</script>
<style>
</style>