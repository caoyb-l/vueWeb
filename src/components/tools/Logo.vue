<template>
  <div class="logo">
    <router-link :to="{name:'dashboard'}">
     <img src="@/assets/logo2.png" class="logo" alt="logo" style="width:60px;height:35px;">
      <h1 v-if="showTitle">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.svg?inline'
export default {
  name: 'Logo',
  components: {
    LogoSvg,
  },
  props: {
    title: {
      type: String,
      default: '创泽智能',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>

