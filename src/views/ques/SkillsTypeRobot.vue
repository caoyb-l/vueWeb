<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="10" :sm="24">
            <a-form-item label="选择机器人">
              <a-select v-model="code" showSearch optionFilterProp="children" :filterOption="filterOption">
                <a-select-option v-for="(item, key) in robotList" :key="key" :value="item.code">
                  {{item.code + '>'+item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="12" :sm="24">
            <a-button style="margin-left: 10px" @click="resetQuery()">重置</a-button>
            <a-button type="dashed" style="margin-left: 10px" @click="tableOption"
              >{{ (optionAlertShow && '关闭') || '开启' }} 批量</a-button
            >
            <a-button style="margin-left: 10px" @click="handleAddSubmit()">刷新</a-button>
            <a-button
              v-if="formVisible"
              type="primary"
              style="margin-left: 10px"
              icon="plus"
              v-action:add
              @click="$refs.CreateSkillsRobot.add(code)"
              >新建</a-button
            >
            <a-dropdown v-if="selectedRowKeys.length > 0">
              <a-menu slot="overlay">
                <a-menu-item key="1" @click="deleteSkillsIds()"> <a-icon type="delete" />删除 </a-menu-item>
                <a-menu-item key="2" @click="deriveExcel()"> <a-icon type="share-alt" />导出 </a-menu-item>
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
      <!-- 表单文字过长，省略展示文字内容 -->
      <span slot="contents" slot-scope="text">
        <Ellipsis :length="20" tooltip>{{ text }}</Ellipsis>
      </span>
      <span slot="url" slot-scope="text">
        <Ellipsis :length="15">{{ text }}</Ellipsis>
      </span>
      <span slot="isAble" slot-scope="text, record">
        <a-badge :status="record.isAble == 1 ? 'success' : 'error'" :text="record.isAble == 1 ? '正常' : '禁用'" />
      </span>
      <span slot="name" slot-scope="text">
        <Ellipsis :length="20" tooltip>{{ text }}</Ellipsis>
      </span>
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEditVisible(record)" v-action:edit>
            编辑
            <a-icon type="edit" />
          </a>
          <a-divider type="vertical" />
          <a @click="delCmd(record)" v-action:delete>清空动作集</a>
          <a-divider type="vertical" />
          <a @click="deleteSkills(record)" v-action:delete>
            删除
            <a-icon type="delete" />
          </a>
        </template>
      </span>
    </s-table>
    <update-excel ref="updateModal" @ok="handleAddSubmit"></update-excel>
    <create-skillsRobot ref="CreateSkillsRobot" @ok="handleAddSubmit" />
    <edit-chat ref="EditChat" @ok="handleAddSubmit" />
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import UpdateExcel from './modules/UpdateExcel'
import EditChat from './modules/EditChat'
import CreateSkillsRobot from './modules/CreateSkillsRobot'
import { queryData } from '@/api/common'
export default {
  components: {
    STable,
    Ellipsis,
    UpdateExcel,
    EditChat,
    CreateSkillsRobot
  },
  watch: {
    code(values) {
      if (values != '') {
        this.$refs.table.refresh(true)
        this.formVisible = true
      } else {
        this.formVisible = false
      }
    }
  },
  data() {
    return {
      selectedItems: [],
      // 查询参数
      code: '',
      formVisible: false,
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'no',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '标题',
          dataIndex: 'title',
          scopedSlots: { customRender: 'name' }
        },
        {
          title: '回答内容',
          dataIndex: 'contents',
          scopedSlots: { customRender: 'contents' }
        },
        {
          title: '网页或图片',
          dataIndex: 'url',
          scopedSlots: { customRender: 'url' }
        },
        {
          title: '状态',
          dataIndex: 'isAble',
          scopedSlots: { customRender: 'isAble' }
        },
        {
          title: '动作集',
          dataIndex: 'cmdName'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return queryData(Object.assign(parameter, { code: this.code, type: 4 }), '/skills/getSkillsList').then(res => {
          return res.result
        })
      },
      selectedRowKeys: [],
      options: {
        alert: false,
        rowSelection: null
      },
      optionAlertShow: false,
      robotList: [] //机器人列表
    }
  },
  created() {
    this.handlerobotList()
  },
  methods: {
    // 获取单位下的单位
    handlerobotList() {
      const orgId = JSON.parse(localStorage.getItem('user')).orgId
      var _this = this
      queryData({ orgId: orgId }, '/robotInfo/loadRobotListByOrgNoPage').then(res => {
        _this.robotList = res.result
      })
    },
    // 回掉函数
    handleAddSubmit() {
      this.$refs.table.refresh(true)
    },
    // 表单重置
    resetQuery() {
      this.code = ''
      this.formVisible = false
      this.$refs.table.refresh(true)
    },
    //修改私有库问题
    handleEditVisible(record) {
      this.$refs.EditChat.add(record)
    },
    //下拉框
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 删除
    deleteSkills(record) {
      var _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除 ${record.title} 吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 500)
            var id = { entityIds: [record.id] }
            queryData(id, '/skills/delete').then(res => {
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
    deleteSkillsIds() {
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
            var ids = { entityIds: [_this.selectedRowKeys][0] }

            queryData(ids, '/skills/delete').then(res => {
              if (res.code == 0) {
                _this.$message.success('删除成功')
                _this.selectedRowKeys = []
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
    //清空动作集
    delCmd(record) {
      var _this = this
      this.$confirm({
        title: '警告',
        content: ` <${record.title}> 将不再使用 <${record.cmdName}> 动作集`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 500)
            queryData({ entityId: record.skillsOptionId }, '/skillsOption/deleteCmd').then(res => {
              if (res.code == 0) {
                _this.$message.success('已解除关联')
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
                disabled: record.no === 'No 2',
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
    deriveExcel() {
      this.$message.success('别着急快好了😭')
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
