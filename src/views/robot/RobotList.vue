<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="4" :sm="24">
            <a-form-item label="名称">
              <a-input v-model="queryParam.name" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="24">
            <a-form-item label="编码">
              <a-input v-model="queryParam.code" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="所属单位">
              <a-select
                v-model="queryParam.orgId"
                showSearch
                placeholder="选择所属单位"
                optionFilterProp="children"
                :filterOption="filterOption"
              >
                <a-select-option
                  v-for="(item ,key) in orgNames"
                  :key="key"
                  :value="item.id"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="截止时间">
              <a-date-picker showTime format="YYYY-MM-DD HH:mm:ss" @change="onChange" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-button type="primary" @click="searchData()">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetQuery()">重置</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      ref="table"
      size="middle"
      rowKey="id"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      showPagination="auto"
    >
      <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <a-row :gutter="24" :style="{ marginBottom: '12px' ,color:'red'}">
          <a-col :span="6" :style="{marginBottom:  '12px',height:'45px'}">
            <span>开机状态：</span>
            <span>{{ record.robotStateList.isLive }}</span>
          </a-col>
          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.city!=''&& record.robotStateList.city!=undefined"
          >
            <span>所在城市：</span>
            <span>{{ record.robotStateList.city }}</span>
          </a-col>
          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.address!=''&& record.robotStateList.address!=undefined"
          >
            <span>详细地址：</span>
            <span>{{ record.robotStateList.address }}</span>
          </a-col>
          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.totalMileage!=''&& record.robotStateList.totalMileage!=undefined"
          >
            <span>行走里程：</span>
            <span>{{ record.robotStateList.totalMileage }}</span>
          </a-col>
          <!--<br/><br/>-->

          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.chargerStatus!=''&& record.robotStateList.chargerStatus!=undefined"
          >
            <span>充电状态：</span>
            <span>{{ record.robotStateList.chargerStatus }}</span>
          </a-col>
          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.charger!=''&& record.robotStateList.charger!=undefined"
          >
            <span>充电方式：</span>
            <span>{{ record.robotStateList.charger }}</span>
          </a-col>
          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.powerLeft!=''&& record.robotStateList.powerLeft!=undefined"
          >
            <span>剩余电量：</span>
            <span>{{ record.robotStateList.powerLeft }}</span>
          </a-col>
          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.batteryVoltage!=''&& record.robotStateList.batteryVoltage!=undefined"
          >
            <span>电池电压：</span>
            <span>{{ record.robotStateList.batteryVoltage }}</span>
          </a-col>
          <!--<br/><br/>-->

          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.appVersionCode!=''&& record.robotStateList.appVersionCode!=undefined"
          >
            <span>App版本号：</span>
            <span>{{ record.robotStateList.appVersionCode }}</span>
          </a-col>
          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.appVersionName!=''&& record.robotStateList.appVersionName!=undefined"
          >
            <span>App版本名称：</span>
            <span>{{ record.robotStateList.appVersionName }}</span>
          </a-col>
          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.wifi!=''&& record.robotStateList.wifi!=undefined"
          >
            <span>wifi名称：</span>
            <span>{{ record.robotStateList.wifi }}</span>
          </a-col>
          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.aiuiSsid!=''&& record.robotStateList.aiuiSsid!=undefined"
          >
            <span>Aiuil连接wifi：</span>
            <span>{{ record.robotStateList.aiuiSsid }}</span>
          </a-col>
          <!--<br/><br/>-->

          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.isConnectSlam!=''&& record.robotStateList.isConnectSlam!=undefined"
          >
            <span>导航状态：</span>
            <span>{{ record.robotStateList.isConnectSlam }}</span>
          </a-col>
          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.navModelType!=''&& record.robotStateList.navModelType!=undefined"
          >
            <span>导航固件类型：</span>
            <span>{{ record.robotStateList.navModelType }}</span>
          </a-col>
          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.navVersion!=''&& record.robotStateList.navVersion!=undefined"
          >
            <span>导航固件版本：</span>
            <span>{{ record.robotStateList.navVersion }}</span>
          </a-col>
          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.isNavMapInit!=''&& record.robotStateList.isNavMapInit!=undefined"
          >
            <span>地图是否初始化：</span>
            <span>{{ record.robotStateList.isNavMapInit }}</span>
          </a-col>
          <!--<br/><br/>-->

          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.locationEngine!=''&& record.robotStateList.locationEngine!=undefined"
          >
            <span>定位引擎：</span>
            <span>{{ record.robotStateList.locationEngine }}</span>
          </a-col>
          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.locationType!=''&& record.robotStateList.locationType!=undefined"
          >
            <span>定位方式：</span>
            <span>{{ record.robotStateList.locationType }}</span>
          </a-col>
          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.mapId!=''&& record.robotStateList.mapId!=undefined"
          >
            <span>地图ID：</span>
            <span>{{ record.robotStateList.mapId }}</span>
          </a-col>
          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.mapName!=''&& record.robotStateList.mapName!=undefined"
          >
            <span>地图名称：</span>
            <span>{{ record.robotStateList.mapName }}</span>
          </a-col>
          <!--<br/><br/>-->

          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.isSpeechEnable!=''&& record.robotStateList.isSpeechEnable!=undefined"
          >
            <span>启用语音识别：</span>
            <span>{{ record.robotStateList.isSpeechEnable }}</span>
          </a-col>
          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.asr!=''&& record.robotStateList.asr!=undefined"
          >
            <span>语音引擎：</span>
            <span>{{ record.robotStateList.asr }}</span>
          </a-col>
          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.isFaceVerifyed!=''&& record.robotStateList.isFaceVerifyed!=undefined"
          >
            <span>启用人脸识别：</span>
            <span>{{ record.robotStateList.isFaceVerifyed }}</span>
          </a-col>
          <a-col
            :span="6"
            :style="{marginBottom:  '12px',height:'45px'}"
            v-if="record.robotStateList.faceCount!=''&& record.robotStateList.faceCount!=undefined"
          >
            <span>人脸库数量：</span>
            <span>{{ record.robotStateList.faceCount }}</span>
          </a-col>
          <!--<br/> <br/>-->
        </a-row>
      </div>
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="selectSkillsType(record)">查看问答库</a>
          <a-divider type="vertical" />
          <a @click="searchData()">刷新</a>
          <a-divider type="vertical" v-action:edit />
          <a @click="handleEditVisible(record)" v-action:edit>修改</a>
          <a-divider type="vertical" v-action:recovery />
          <a @click="handleRecovery(record)" v-action:recovery>初始化</a>
          <a-divider type="vertical" v-action:delete />
          <a @click="handleDelete(record)" v-action:delete>删除</a>
          <a-divider type="vertical" />
          <a :href = "url+ record.id">问答分析报告</a>
          <a-divider type="vertical" />
          <a @click="showRobotNote(record)">运行记录</a>
        </template>
      </span>
    </s-table>
    <edit-robot ref="editModal" @ok="handleOk" />
    <show-type ref="showSkillsType" @ok="handleOk" />
    <show-robot-note ref="showRobotNote" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { PageView } from '@/layouts'
import EditRobot from './modules/EditRobot'
import { queryData } from '@/api/common'
import ShowType from './modules/showSkillsType'
import ShowRobotNote from './modules/showRobotNote'
import { uploadUrl } from '@/api/upload'

export default {
  name: 'TableList',
  components: {
    STable,
    PageView,
    EditRobot,
    ShowType,
    ShowRobotNote
  },
  data () {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      addVisible: false,
      editVisible: false,
      orgId: {
        orgId: 1
      },
      selectedItems: [],
      // 查询参数
      queryParam: {
        code: '',
        name: '',
        orgId: '',
        validityDate: ''
      },
      editData: {},
      options: {
        alert: false,
        rowSelection: null
      },
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'no',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '编码',
          dataIndex: 'code'
        },
        {
          title: '单位名称',
          dataIndex: 'orgName'
        },
        {
          title: '地图名称',
          dataIndex: 'mapName'
        },
        {
          title: '最后一次在线时间',
          dataIndex: 'lastLoginTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        let userId = JSON.parse(localStorage.getItem('user')).id
        let orgId
        if (this.queryParam.orgId > 0) {
          orgId = this.queryParam.orgId
        } else {
          orgId = JSON.parse(localStorage.getItem('user')).orgId
        }
        return queryData(
          Object.assign(parameter, this.queryParam, { userId: userId, orgId: orgId }),
          '/robotInfo/list'
        ).then(res => {
          console.log(res)
          return res.result
        })
      },
      orgNames: [],
      roleNames: [],
      selectedRowKeys: [],
      url: uploadUrl + 'robotInfo/excel?robot='
    }
  },
  created () {
    this.handleOrgLists()
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  methods: {
    // 获取该用户下的所属单位
    handleOrgLists () {
      var _this = this
      var orgId = JSON.parse(localStorage.getItem('user')).orgId
      var param = { org: orgId }
      queryData(param, '/userManage/getHrOrgByPid')
        .then(res => {
          _this.orgNames = res.result
          if (res.code !== 0) {
            _this.$message.error(res.message)
          }
        })
        .catch(err => console.log(err))
    },
    onChange (date, dateString) {
      this.queryParam.validityDate = dateString
      console.log(date, dateString)
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 表单重置
    resetQuery () {
      this.queryParam = {}
      this.$refs.table.refresh(true)
    },
    // 显示状态修改
    handleAddVisible () {
      this.addVisible = true
    },
    // 查看问答库
    selectSkillsType (record) {
      this.$refs.showSkillsType.add(record)
    },
    // 查看运行记录
    showRobotNote (record) {
      this.$refs.showRobotNote.show(record)
    },
    handleEditVisible (record) {
      // this.editData = record;
      this.$refs.editModal.add(record)
      this.editVisible = true
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 搜索内容
    searchData () {
      this.$refs.table.refresh(true)
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    // 初始化机器人
    handleRecovery (record) {
      var _this = this
      this.$confirm({
        title: '警告',
        content: `机器人 <${record.name}>将删除后台所有配置，但是会保留自定义库。是否确定？`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          console.log('OK')
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 500)
            var id = { code: record.code }
            queryData(id, '/robotInfo/recoveryRobot').then(res => {
              console.log('机器人初始化返回值：', res)
              if (res.code == 0) {
                _this.$message.success('初始化成功')
                _this.$refs.table.refresh(true)
              } else {
                _this.$message.error(res.message)
              }
            })
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    // 删除机器人
    handleDelete (record) {
      var _this = this
      this.$confirm({
        title: '警告',
        content: `机器人 <${record.name}>信息将被移除，并且信息无法找回，是否确定？`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          console.log('OK')
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 500)
            var id = { code: record.code }
            queryData(id, '/robotInfo/delete').then(res => {
              console.log('移除机器人：', res)
              if (res.code == 0) {
                _this.$message.success('移除成功')
                _this.$refs.table.refresh(true)
              } else {
                _this.$message.error(res.message)
              }
            })
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  margin-bottom: 54px;
}

.fold {
  width: calc(100% - 216px);
  display: inline-block;
}

.operator {
  margin-bottom: 18px;
}

@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
</style>
