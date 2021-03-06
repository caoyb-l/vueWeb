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
                >{{ item.name }}</a-select-option>
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
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="selectSkillsType(record)" v-action:query>查看问答库</a>
          <a-divider type="vertical"/>
          <a @click="openSkillsRobot(record)" v-action:add>添加问答库</a>
          <a-divider type="vertical"/>
          <a @click="openAiui(record)" v-action:add>AIUI配置</a>
          <a-divider type="vertical"/>
          <a @click="deleteAiui(record)" v-action:delete>删除AIUI配置</a>
        </template>
      </span>
    </s-table>
    <add-skill-robot ref="addSkillRobot" @ok="handleOk" />
    <show-type ref="showSkillsType" @ok="handleOk" />
    <add-aiui-scene ref="addAiuiScene" @ok="handleOk" />

  </a-card>
</template>

<script>
import { STable } from '@/components'
import { PageView } from '@/layouts'
import EditRobot from './modules/EditRobot'
import { queryData } from '@/api/common'
import addSkillRobot from './modules/AddSkillRobot'
import ShowType from './modules/showSkillsType'
import addAiuiScene from './modules/AddAiuiScene'
export default {
  name: 'TableList',
  components: {
    STable,
    PageView,
    EditRobot,
    addSkillRobot,
    ShowType,
    addAiuiScene
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
          title: 'aiui场景',
          dataIndex: 'aiuiScene'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        const userId = JSON.parse(localStorage.getItem('user')).id
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
    // 查看问答库
    selectSkillsType (record) {
      this.$refs.showSkillsType.add(record)
    },
    // 查看问答库
    openSkillsRobot (record) {
      this.$refs.addSkillRobot.show(record)
    },
    // 查看问答库
    openAiui (record) {
      this.$refs.addAiuiScene.show(record)
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
    // 删除机器人
    deleteAiui (record) {
      var _this = this
      this.$confirm({
        title: '警告',
        content: `机器人 <${record.name}>的aiui配置将被移除，确定吗？`,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 500)
            queryData({ robotCode: record.code }, '/aiuiRobot/deleteAiuiRobot').then(res => {
              if (res.code == 0) {
                _this.$message.success('删除成功')
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
