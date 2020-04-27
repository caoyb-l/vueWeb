<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="机器人名称">
              <a-input v-model="queryParam.robotName" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="触发条件">
              <a-select
                showSearch
                placeholder="选择触发指令"
                optionFilterProp="children"
                v-model="queryParam.triggerName"
                @change="handleCmdChange"
                :filterOption="filterOption"
              >
                <a-select-option
                  v-for="(item) in cmdList"
                  :key="item.code"
                  :value="item.triggerName"
                >{{item.triggerName}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="13" :sm="24">
            <a-button type="primary" @click="searchData()">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetQuery()">重置</a-button>
            <a-button
              type="primary"
              style="margin-left: 8px"
              icon="plus"
              @click="$refs.createModal.add()"
              v-action:add
            >新建</a-button>
            <a-button
              type="primary"
              style="margin-left: 8px"
              @click="$refs.editAllModal.add()"
              v-action:edit
            >批量修改</a-button>
            <a-button
              type="dashed"
              style="margin-left: 8px"
              @click="tableOption"
              v-action:delete
            >{{ optionAlertShow && '关闭' || '开启' }} alert</a-button>
            <a-dropdown v-if="selectedRowKeys.length > 0">
              <a-menu slot="overlay">
                <a-menu-item key="1" @click="handleDeletes()">
                  <a-icon type="delete" />删除
                </a-menu-item>
              </a-menu>
              <a-button style="margin-left: 8px">
                批量操作
                <a-icon type="down" />
              </a-button>
            </a-dropdown>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- <div class="table-operator">
        
    </div>-->
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
          <a @click="handleEditVisible(record)" v-action:edit>编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record)" v-action:delete>删除</a>
        </template>
      </span>
    </s-table>
    <create-sensor ref="createModal" @ok="handleRefresh"></create-sensor>
    <edit-all-sensor ref="editAllModal" @ok="handleRefresh"></edit-all-sensor>
    <edit-sensor ref="editModal" @ok="handleRefresh"></edit-sensor>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { PageView } from '@/layouts'
import { queryData } from '@/api/common'
import CreateSensor from './modules/CreateSensor'
import EditAllSensor from './modules/EditAllSensor'
import EditSensor from './modules/EditSensor'
export default {
  name: 'TableList',
  components: {
    STable,
    PageView,
    CreateSensor,
    EditAllSensor,
    EditSensor
  },
  data() {
    return {
      cmdList: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
        robotName: '',
        triggerName: ''
      },
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'no',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '机器人名称',
          dataIndex: 'robotName',
          scopedSlots: { customRender: 'robotName' }
        },
        {
          title: '机器人编码',
          dataIndex: 'robotCode',
          scopedSlots: { customRender: 'robotCode' }
        },
        {
          title: '触发条件',
          dataIndex: 'triggerName',
          scopedSlots: { customRender: 'triggerName' }
        },
        {
          title: '动作集',
          dataIndex: 'cmdName',
          scopedSlots: { customRender: 'cmdName' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        var id = JSON.parse(localStorage.getItem('user')).orgId
        var params = { orgId: id }
        return queryData(Object.assign(parameter, params, this.queryParam), '/supercmdTriggerRobot/list').then(res => {
          console.log(res)
          return res.result
        })
      },
      selectedRowKeys: [],
      options: {
        alert: false,
        rowSelection: null
      },
      optionAlertShow: false
    }
  },
  computed: {
    title() {
      return this.$route.meta.title
    }
  },
  created() {
    this.getCmdList()
  },
  methods: {
    tableOption() {
      if (!this.optionAlertShow) {
        this.options = {
          alert: {
            show: true,
            clear: () => {
              this.selectedRowKeys = []
            }
          },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
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
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    handleCmdChange(value) {
      console.log(`selected ${value}`)
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    //获取指令列表
    getCmdList() {
      var _this = this
      queryData({}, '/supercmdTrigger/getSupercmdTriggerList').then(res => {
        console.log('指令列表', res)
        if (res.code == 0) {
          _this.cmdList = res.supercmdTriggerList
        } else {
          _this.$message.error(res.message)
        }
      })
    },

    // 处理刷新
    handleRefresh() {
      this.$refs.table.refresh(true)
    },
    // 表单重置
    resetQuery() {
      this.queryParam = {}
      this.$refs.table.refresh(true)
    },
    handleEditVisible(record) {
      this.$refs.editModal.add(record)
    },
    // 搜索内容
    searchData() {
      this.$refs.table.refresh(true)
    },
    // 删除
    handleDelete(record) {
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
            setTimeout(Math.random() > 0.5 ? resolve : reject, 500)
            var id = { id: [record.id] }
            queryData(id, '/supercmdTriggerRobot/delete').then(res => {
              if (res.code == 0) {
                _this.$message.success('删除成功')
                _this.$refs.table.refresh(true)
              } else {
                _this.$message.error(res.message)
              }
            })
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    // 批量删除
    handleDeletes() {
      console.log(this.selectedRowKeys)
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
            setTimeout(Math.random() > 0.5 ? resolve : reject, 500)
            var ids = { id: _this.selectedRowKeys }
            queryData(ids, '/supercmdTriggerRobot/delete').then(res => {
              if (res.code == 0) {
                _this.$message.success('删除成功')
                _this.selectedRowKeys = []
                _this.$refs.table.refresh()
              } else {
                _this.$message.error(res.message)
              }
            })
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel() {
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
