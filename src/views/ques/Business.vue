<template>
  <a-card :bordered="true">
    <a-row type="flex">
      <a-col :span="6">
        <div class="table-operator" style="margin-bottom:0px">
          <a-button type="primary" icon="plus" v-action:add @click="$refs.createQues.add()">新建业务</a-button>
          <a style="font-weight: 600">{{businessName}}></a>
          <span>一级菜单</span>
          <!-- 业务批量操作 -->
          <a-dropdown v-if="skillsIds.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" v-action:delete @click="deleteSkillsList()">
                <a-icon type="delete" />删除
              </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px">
              批量操作
              <a-icon type="down" />
            </a-button>
          </a-dropdown>
        </div>
        <!-- 业务表格样式 -->
        <s-table
          bordered
          ref="table"
          size="middle"
          rowKey="id"
          :columns="columnList"
          :data="loadData"
          :alert="options.alert"
          :rowSelection="options.rowSelection"
          showPagination="auto"
        >
          <!-- 业务名字点击显示详情 -->
          <span slot="name" slot-scope="text, record">
            <a-tooltip
              placement="topLeft"
              :title="record.title +'（'+ record.depict + '）' + record.contents"
              arrowPointAtCenter
            >
              <div ref="titleTxt" @click="showList(record.id,record.title)">{{ text }}</div>
            </a-tooltip>
          </span>
          <span slot="action" slot-scope="text, record">
            <a-badge :status="record.isAble==1?'success':'error'" />
            <a @click="handleEditVisible(record)" v-action:edit>
              编辑
              <a-icon type="edit" />
            </a>
          </span>
        </s-table>
        <a-button
          style="margin-left: 0px"
          @click="tableOption"
        >{{ optionAlertShow && '关闭' || '开启' }} 批量</a-button>
      </a-col>
      <!-- <a-col :span="1"></a-col> -->
      <a-col :span="7" style="margin-left:25px" v-if="isShowList">
        <div class="table-operator" style="margin-bottom:0px">
          <a-button type="primary" icon="plus" @click="$refs.allSkills.add()">新建技能</a-button>
          <a style="font-weight: 600">{{businessName}}></a>
          <span>二级菜单</span>
          <!-- 技能批量操作 -->
          <a-dropdown v-if="skillsOptionIds.length > 0">
            <a-menu slot="overlay">
              <a-menu-item key="1" v-action:delete @click="deleteSkillsOptionList()">
                <a-icon type="delete" />删除
              </a-menu-item>
            </a-menu>
            <a-button style="margin-left: 8px">
              批量操作
              <a-icon type="down" />
            </a-button>
          </a-dropdown>
        </div>
        <!-- 技能表格样式 -->
        <s-table
          bordered
          ref="skillTable"
          size="middle"
          rowKey="id"
          :columns="columnSkillList"
          :data="loadSkillOptionData"
          :alert="options2.alert"
          :rowSelection="options2.rowSelection"
          showPagination="auto"
        >
          <span slot="keywords" slot-scope="text,record" @click="handleEditSkillVisible(record)">
            <a-tooltip placement="topLeft" :title="record.suspension" arrowPointAtCenter>{{ text }}</a-tooltip>
          </span>
          <span slot="action" slot-scope="text,record">
            <template>
              <a-popconfirm title="您将失去这个技能" @confirm="deleteSkillsOption(record)" okText="确认删除">
                <a href="#">删除</a>
              </a-popconfirm>
            </template>
          </span>
        </s-table>
        <a-button
          style="margin-left: 0px"
          @click="tableOption2"
        >{{ optionAlertShow2 && '关闭' || '开启' }} 批量</a-button>
        <!-- 默认回答提交 -->
      </a-col>
      <a-col :span="7" style="margin-top:5px; margin-left:20px">
        <a style="font-weight: 600">{{businessName}}>{{skillName}}></a>
        <span>三级菜单</span>
        <a-form :form="form" v-if="formVisible" style="margin-top:20px;">
          <a-form-item label="回答内容" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-textarea v-model="editSkills.contents" placeholder="回答内容" :rows="2" autosize />
          </a-form-item>
          <a-form-item label="网址信息" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-radio-group name="radioGroup" v-model="editSkills.netType">
              <a-radio :value="0">内网</a-radio>
              <a-radio :value="1">外网</a-radio>
            </a-radio-group>
            <a-input placeholder="网址信息" v-model="editSkills.url" />
          </a-form-item>
          <!-- 业务库上传文件 -->
          <a-form-item
            v-if="editSkills.htmlType==222?true:false"
            label="上传文件"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-upload
              name="file"
              :multiple="true"
              action="http://robot.lovechuangchuang.com:8085/skillsOption/fileUpload"
              :fileList="fileList"
              :headers="headers"
              :remove="handleRemoveFile"
              @change="handleChangeFile"
              @preview="handlePreview"
            >
              <a-button>
                <a-icon type="upload" />点击上传
              </a-button>
            </a-upload>
          </a-form-item>
          <a-form-item label="地图" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select
              placeholder="如需使用导航请先选择地图"
              optionFilterProp="children"
              v-model="editSkills.map"
            >
              <a-select-option
                v-for="(item ,key) in mapList"
                :key="key"
                :value="item.id"
              >{{item.mapName}}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="动作集" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select placeholder="选择动作集" optionFilterProp="children" v-model="editSkills.cmd">
              <a-select-option
                v-for="(item ,key) in cmdList"
                :key="key"
                :value="item.id"
              >{{item.name}}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item style="text-align:center">
            <a-button @click="updateCmd">添加动作集</a-button>
            <a-button @click="delCmd" style="margin-left: 15px">清空动作集</a-button>
          </a-form-item>

          <a-form-item style="text-align:center">
            <a-button type="primary" @click="handleFormSubmit">保存全部</a-button>
          </a-form-item>
        </a-form>
      </a-col>
    </a-row>
    <create-ques ref="createQues" @ok="handleRefresh" />
    <edit-ques ref="editQues" @ok="handleRefresh" />
    <all-skills ref="allSkills" :skillsId="currectSel" :skillTableRefresh="skillTableRefresh"></all-skills>
    <a-modal title="Title" :width="1200" :visible="showCmd" @ok="handleSubmit" v-preventReClick ></a-modal>
    <!-- 获取cmd.vue中的cmdName的值 -->
    <cmd-list @getCmdId="getCmdId" ref="cmd"></cmd-list>
  </a-card>
</template>

<script>
import { PageView } from '@/layouts'
import { STable } from '@/components'
import CreateQues from './modules/CreateQues'
import EditQues from './modules/EditQues'
import AllSkills from './modules/AllSkills'
import EditSkills from './modules/EditSkills'
import CmdList from '../Cmd'
import { queryData } from '@/api/common'
export default {
  name: 'TableList',
  components: {
    STable,
    PageView,
    CreateQues,
    EditQues,
    AllSkills,
    EditSkills,
    CmdList
  },
  data() {
    return {
      headers: {
        authorization: 'authorization-text'
      },
      skillsList: [],
      isShowList: true,
      mapId: '',
      mapList: [],
      currectSel: 0, //当前业务id
      businessName: '',
      skillName: '',
      // 业务表头
      columnList: [
        {
          title: '业务名称',
          dataIndex: 'title',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      //业务获取数据
      loadData: parameter => {
        let orgId = JSON.parse(localStorage.getItem('user')).orgId
        var param = { type: 1, orgId: orgId }
        return queryData(Object.assign(parameter, this.queryParam, param), '/skills/getSkillsList').then(res => {
          return res.result
        })
      },

      // 技能表头
      columnSkillList: [
        {
          title: '技能列表',
          dataIndex: 'keywords',
          scopedSlots: { customRender: 'keywords' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],

      //点击业务获取技能列表
      loadSkillOptionData: parameter => {
        this.formVisible = false //点击业务以后重新隐藏表单
        let orgId = JSON.parse(localStorage.getItem('user')).orgId
        var param = { skillsId: this.currectSel }
        return queryData(Object.assign(parameter, this.queryParam, param), '/skillsOption/getSkillsOptionList').then(
          res => {
            return res.result
          }
        )
        con
      },

      //业务问题选取的id集和
      skillsIds: [],
      optionAlertShow: false,
      //技能问题选区的id集和
      skillsOptionIds: [],
      optionAlertShow2: false,

      options: {
        alert: false,
        rowSelection: null
      },
      options2: {
        alert: false,
        rowSelection: null
      },
      labelCol: {
        xs: { span: 35 },
        sm: { span: 10 }
      },
      wrapperCol: {
        xs: { span: 35 },
        sm: { span: 10 }
      },
      form: this.$form.createForm(this),
      formVisible: false,
      showCmd: false,
      fileList: [],
      cmdList: [],
      editSkills: { id: '', contents: '', netType: '', url: '', cmdName: '', cmd: '', map: '', mapName: '' }
    }
  },
  created() {
    this.getMap()
    this.getCmd()
  },
  computed: {
    title() {
      return this.$route.meta.title
    }
  },

  methods: {
    //删除业务技能
    deleteSkillsOption(record) {
      var _this = this
      console.log(record)
      return new Promise((resolve, reject) => {
        setTimeout(Math.random() > 0.5 ? resolve : reject, 300)
        var id = { entityIds: [record.id] }
        queryData(id, '/skillsOption/delete').then(res => {
          if (res.code == 0) {
            _this.$message.success('以删除')
            _this.$refs.skillTable.refresh()
          } else {
            _this.$message.error(res.message)
          }
        })
      }).catch(err => console.log(err))
    },

    updateCmd() {
      let mapId = this.editSkills.map == undefined ? 0 : this.editSkills.map
      console.log('地图ID' + mapId + '/场景名称' + this.skillName)
      this.$refs.cmd.show(this.businessName + this.skillName, mapId, 0)
    },
    //清空动作集
    delCmd() {
      var _this = this
      queryData({ entityId: this.editSkills.id }, '/skillsOption/deleteCmd').then(res => {
        if (res.code == 0) {
          _this.$message.success('删除成功')
          _this.editSkills.map = ''
          _this.editSkills.cmd = ''
        } else {
          _this.$message.error(res.message)
        }
      })
    },
    // 获取编辑好的动作集id并赋值
    getCmdId(cmd) {
      this.getCmd()
      console.log('-------渲染以后的值', cmd)
      this.editSkills.cmd = parseInt(cmd)
    },
    //动作集列表
    getCmd() {
      let org = JSON.parse(localStorage.getItem('user')).orgId
      let _this = this
      queryData({ orgId: org }, '/cmdCollection/getCmdListByOrg').then(res => {
        if (res.code == 0) {
          _this.cmdList = res.cmdList
        } else {
          _this.$message.error(res.message)
        }
      })
    },
    handleSubmit() {
      this.showCmd = false
    },

    onSelectChange(skillsIds) {
      this.skillsIds = skillsIds
    },
    onSelectChange2(skillsOptionIds) {
      this.skillsOptionIds = skillsOptionIds
    },

    tableOption() {
      if (!this.optionAlertShow) {
        this.options = {
          alert: {
            show: true,
            clear: () => {
              this.skillsIds = []
            }
          },
          rowSelection: {
            skillsIds: this.skillsIds,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
              props: {
                disabled: record.no === 'No 2', // Column configuration not to be checked
                name: record.no
              }
            })
          }
        }
        this.optionAlertShow = true
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow = false
      }
    },
    tableOption2() {
      if (!this.optionAlertShow2) {
        this.options2 = {
          alert: {
            show: true,
            clear: () => {
              this.skillsOptionIds = []
            }
          },
          rowSelection: {
            skillsOptionIds: this.skillsOptionIds,
            onChange: this.onSelectChange2,
            getCheckboxProps: record => ({
              props: {
                disabled: record.no === 'No 2', // Column configuration not to be checked
                name: record.no
              }
            })
          }
        }
        this.optionAlertShow2 = true
      } else {
        this.options2 = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow2 = false
      }
    },

    // 业务table选取id集和
    showList(id, name) {
      this.businessName = name
      this.currectSel = id
      this.isShowList = true
      //this.showTable(id)
      this.$refs.skillTable.refresh(true)
    },
    //刷新技能列表
    skillTableRefresh() {
      this.$refs.skillTable.refresh(true)
    },
    handleRefresh() {
      this.$refs.table.refresh()
    },
    handleEditVisible(record) {
      this.$refs.editQues.add(record)
    },
    // 批量删除业务方法
    deleteSkillsList() {
      var _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 300)
            var id = { entityIds: _this.skillsIds }
            queryData(id, '/skills/delete').then(res => {
              if (res.code == 0) {
                _this.$message.success('删除成功')
                _this.$refs.table.refresh(true)
                _this.currectSel = 0
                _this.$refs.skillTable.refresh()
              } else {
                _this.$message.error(res.message)
              }
            })
          }).catch(err => console.log(err))
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },

    // 批量删除技能
    deleteSkillsOptionList() {
      var _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          console.log('OK')
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 300)
            var id = { entityIds: _this.skillsOptionIds }
            queryData(id, '/skillsOption/delete').then(res => {
              if (res.code == 0) {
                _this.$message.success('删除成功')
                _this.$refs.skillTable.refresh(true)
              } else {
                _this.$message.error(res.message)
              }
            })
          }).catch(err => console.log(err))
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },

    //技能编辑点击
    handleEditSkillVisible(record) {
      console.log(record)
      this.skillName = record.keywords
      this.show(record)
    },

    // 文件上传
    handleChangeFile(info) {
      let fileList = [...info.fileList]
      // fileList = fileList.slice(-1)
      this.fileList = fileList
      if (info.file.status == 'uploading') {
      }
      if (info.file.status === 'done') {
        if (info.file.response.code == 0) {
          this.$message.success(`${info.file.name} 上传成功`)
        } else {
          this.fileList.splice(-1, 1)
          this.$message.success(`${info.file.response.message}`)
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败.`)
      }
    },

    // 删除文件
    handleRemoveFile(file) {
      let _this = this
      alert(file.response.fileUrl)
      queryData({ fileUrl: file.response.fileUrl }, '/skillsOption/delFile').then(res => {
        if (res.code == 0) {
          _this.$message.success(res.message)
          return true
        } else {
          _this.$message.error(res.message)
          return false
        }
      })
    },

    handlePreview(file) {
      window.open(file.response.fileUrl)
    },

    //获取地图列表
    getMap() {
      let org = JSON.parse(localStorage.getItem('user')).orgId
      queryData({ orgId: org }, '/robotMapLib/getRobotMapLibList').then(res => {
        console.log('-----------getMap', res)
        this.mapList = res.result
      })
    },

    // 获取技能详情(带文件)
    show(record) {
      let _this = this
      this.editSkills.fileNameList = []
      this.formVisible = true
      let param = { entityId: record.id }
      queryData(param, '/skillsOption/getSkillsOption').then(res => {
        if (res.code == 0) {
          _this.editSkills = res.result
          _this.fileList = res.resultFile
        } else {
          _this.$message.error(res.message)
        }
      })
    },

    // 提交编辑好的技能from表单
    handleFormSubmit() {
      const {
        form: { validateFields }
      } = this
      this.confirmLoading = true
      var _this = this
      validateFields((errors, values) => {
        if (!errors) {
          let user = JSON.parse(localStorage.getItem('user')).id
          let org = JSON.parse(localStorage.getItem('user')).orgId
          var param = _this.editSkills
          param.fileNameList = _this.fileList.map((value, index) => {
            return {
              fileUrl: value.response.fileUrl,
              type: value.response.type
            }
          })
          values.org = org
          values.user = user
          queryData({ ...param, ...values }, '/skillsOption/updateContents').then(res => {
            if (res.code == 0) {
              _this.$message.success('编辑成功')
            } else {
              _this.$message.error(res.message)
            }
          })
        } else {
          // this.confirmLoading = false
        }
      })
    }
  }
}
</script>
<style>
</style>
