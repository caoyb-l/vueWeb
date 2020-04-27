<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="关键词">
              <a-input v-model="queryParam.keywords" />
            </a-form-item>
          </a-col>
          <a-col :md="19" :sm="24">
            <a-button type="primary" @click="searchData()">查询</a-button>
            <a-button
              type="primary"
              style="margin-left: 10px"
              icon="plus"
              v-action:add
              @click="$refs.CreateChat.add()"
            >新建</a-button>
            <a-button
              type="primary"
              style="margin-left: 10px"
              icon="plus"
              v-action:addFile
              @click="$refs.updateModal.add()"
            >批量上传文件</a-button>
            <a-button style="margin-left: 10px" icon="plus" v-action:add @click="mieBa()" v-action:mieba>同步老数据</a-button>
            <a-button style="margin-left: 10px" @click="resetQuery()">刷新列表</a-button>
            <a-button
              type="dashed"
              style="margin-left: 10px"
              @click="tableOption"
            >{{ optionAlertShow && '关闭' || '开启' }} 批量</a-button>
            <a-dropdown v-if="selectedRowKeys.length > 0">
              <a-menu slot="overlay">
                <a-menu-item key="1" @click="deleteSkillsIds()" v-action:delete>
                  <a-icon type="delete" />删除
                </a-menu-item>
                <a-menu-item key="2" @click="deriveExcel()" v-action:excel>
                  <a-icon type="share-alt" />导出Excel
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
      <span slot="name" slot-scope="text, record">
        <a-tooltip placement="topLeft" :title="record.depict" arrowPointAtCenter>
          <div>{{ text }}</div>
        </a-tooltip>
      </span>
      <template slot-scope="text" slot="contents">
        <ellipsis :length="20" tooltip>{{text}}</ellipsis>
      </template>
      <template slot-scope="text" slot="url">
        <ellipsis :length="20" tooltip>{{text}}</ellipsis>
      </template>
      <span slot="isAble" slot-scope="text,record">
        <a-badge :status="record.isAble==1?'success':'error'" :text="record.isAble==1?'正常':'禁用'" />
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEditVisible(record)" v-action:edit>编辑</a>
          <a-divider type="vertical" />
          <a @click="delCmd(record)" v-action:delete>清空动作集</a>
          <a-divider type="vertical" />
          <a @click="deleteSkills(record)" v-action:delete>删除</a>
        </template>
      </span>
    </s-table>
    <update-excel ref="updateModal" @ok="handleAddSubmit"></update-excel>
    <create-chat ref="CreateChat" @ok="handleAddSubmit" />
    <edit-chat ref="EditChat" @ok="handleAddSubmit" />
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import UpdateExcel from './modules/UpdateExcel'
import EditChat from './modules/EditChat'
import CreateChat from './modules/CreateChat'
import { queryData } from '@/api/common'
export default {
  name: 'TableList',
  components: {
    Ellipsis,
    STable,
    UpdateExcel,
    EditChat,
    CreateChat
  },
  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      selectedItems: [],
      // 查询参数
      queryParam: {
        keywords: ''
      },
      // editData: {},
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
          dataIndex: 'cmdName',
        },
        // {
        //   title: '是否生效',
        //   dataIndex: 'isDel',

        //   scopedSlots: { customRender: 'isDel' }
        // },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        let orgId = JSON.parse(localStorage.getItem('user')).orgId
        return queryData(
          Object.assign(parameter, { orgId: orgId, type: 2 }, this.queryParam),
          '/skills/getSkillsList'
        ).then(res => {
          console.log(res)
          return res.result
        })
      },
      orgNames: [],
      roleNames: [],
      selectedRowKeys: [],
      options: {
        alert: false,
        rowSelection: null
      },
      optionAlertShow: false
    }
  },
  created() {},
  methods: {
    deriveExcel() {
      console.alert('别着急快好了😭')
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

    //回掉函数
    handleAddSubmit() {
      this.$refs.table.refresh(true)
    },
    // 表单重置
    resetQuery() {
      (this.queryParam = {
        title: '',
        keywords: ''
      }),
        this.$refs.table.refresh(true)
    },
    // 显示状态修改
    handleAddVisible() {
      this.addVisible = true
    },
    //修改闲聊
    handleEditVisible(record) {
      this.$refs.EditChat.add(record)
    },
    // 查询
    searchData() {
      this.$refs.table.refresh(true)
    },
    mieBa() {
      var _this = this
      this.$confirm({
        title: '警告',
        content: `等待时间可能过长，是否确认?`,
        okText: '确认',
        okType: 'danger',
        cancelText: '退出',
        onOk() {
          console.log('OK')
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 500)
            var user = JSON.parse(localStorage.getItem('user'))
            queryData({ org: user.orgId, user: user.id }, '/skillsOption/mieBa').then(res => {
              console.log('同步数据后返回值：', res)
              if (res.code == 0) {
                _this.$message.success('res.message')
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
          console.log('OK')
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 500)
            var id = { entityIds: [record.id] }
            queryData(id, '/skills/delete').then(res => {
              console.log('删除用户返回值：', res)
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
