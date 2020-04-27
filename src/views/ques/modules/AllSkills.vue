<template>
  <a-modal
    title="技能管理"
    style="top: 40px;"
    :width="600"
    :afterClose="afterClose"
    :destroyOnClose="true"
    v-model="visible"
    @ok="handleSubmit"
    v-preventReClick
    :maskClosable = "false"
  >
    <a-select
      mode="multiple"
      style="width: 80%"
      @change="handleChange"     
      placeholder="添加技能"
    >
      <a-select-option v-for="(i,index) in skillList" :key="index" :disabled="i.isDel?true:false">{{ i.title }}</a-select-option>
    </a-select>
  </a-modal>
</template>

<script>
import { queryData } from '@/api/common'
export default {
  props: ['skillsId','skillTableRefresh'],
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
      skillList: [],
      selectSkills: []
    }
  },

  methods: {
    // 显示技能
    getSkillList() {
      var _this = this
      var param = { robotSkillTypeId: '5', skillsId: this.skillsId }
      queryData(param, '/robotSkill/getRobotSkillByTypeList').then(res => {
        console.log(res.result)
        _this.skillList = res.result
        return res.result
      })
    },

    add() {
      this.visible = true
      this.getSkillList()
    },
    handleChange(value) {
      console.log(`Selected: ${value}`)
      this.selectSkills=value;
    },
   
    afterClose() {},
    handleSubmit() {
      var _this = this
      if(this.selectSkills.length<=0){
         _this.$message.success('未添加技能')
          _this.visible = false
        return;}
      let orgId = JSON.parse(localStorage.getItem('user')).orgId;
      var skills=this.selectSkills.map((value,index)=>{
        return _this.skillList[value];
      })
      var param = { user: orgId, skillsId: this.skillsId,robotSkillList:skills}
      queryData(param, '/skillsOption/saveList').then(res => {
        console.log(res.result)
        if (res.code == 0) {
          _this.$message.success('添加成功')
          _this.selectSkills=[]
          _this.visible = false
          _this.skillTableRefresh();
        } else {
          _this.$message.error(res.message)
        }
      })
    }
  }
}
</script>
