<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <!-- <a-col :md="6" :sm="24">//暂且不开放
            <a-form-item label="登录名/手机号">
              <a-input v-model="queryParam.loginName"/>
            </a-form-item>
          </a-col> -->
          <a-col :md="5" :sm="24">
            <a-form-item label="用户姓名">
              <a-input v-model="queryParam.userName"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="登录名">
              <a-input v-model="queryParam.loginName"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="单位名称">
              <a-select
                showSearch
                placeholder="选择单位名称"
                optionFilterProp="children"
                :filterOption="filterOption"
                v-model="queryParam.queryOrgId "
              >
              <a-select-option v-for="(item ,key) in orgNames" :key="key" :value="item.id">
                {{item.name}}
              </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md=5 :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchData()">查询</a-button>
              <a-button style="margin-left: 10px" @click="resetQuery()">重置</a-button>
              <a-button style="margin-left: 10px" type="primary" icon="plus" @click="$refs.createModal.add()" v-action:add>新建</a-button>
              <a-button style="margin-left: 10px" type="dashed" @click="tableOption">{{ optionAlertShow && '关闭' || '开启' }} alert</a-button>
              <a-dropdown v-if="selectedRowKeys.length > 0">
                <a-menu slot="overlay">
                  <a-menu-item key="1" @click="deleteUsers()">
                    <a-icon type="delete" v-action:delete/>删除
                </a-menu-item>
                </a-menu>
                <a-button style="margin-left: 10px">
                  批量操作 <a-icon type="down" />
                </a-button>
      </a-dropdown>
            </span>
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
        <span slot="serial" slot-scope="text, record, index">
          {{ index + 1 }}
        </span>
        <span slot="roleNames"  slot-scope="text">
          <a-tag color="blue">{{ text }}</a-tag>
        </span>
        <span slot="isDel" slot-scope="text">
          <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a @click="handleEditVisible(record)" v-action:edit>编辑</a>
            <a-divider type="vertical" v-action:delete />
            <a @click="handleDeleteUser(record)" v-action:delete>删除</a>
            <a-divider type="vertical" v-action:resetPwd  />
            <a @click="handleResetPwd(record)" v-action:resetPwd>密码重置</a>
          </template>
        </span>
      </s-table>
    <create-modal ref="createModal" @ok="handleAddSubmit" />
    <edit-modal ref="editModal" @ok="handleAddSubmit" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { PageView } from '@/layouts'
import EditModal from './modules/EditUser'
import CreateModal from './modules/CreateUser'
import { queryData } from '@/api/common'
const statusMap = {
  0: {
    status: 'default',
    text: '无效'
  },
  1: {
    status: 'processing',
    text: '有效'
  }
}
export default {
  name: 'TableList',
  components: {
    STable,
    PageView,
    EditModal,
    CreateModal
  },
  data() {
    return {
      // 高级搜索 展开/关闭
      advanced: false,
      selectedItems: [],
      // 查询参数
      queryParam: {
        queryOrgId: '',
        userName: '',
        loginName: ''
      },
      editData: {},
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'no',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '登录名',
          dataIndex: 'loginName',
          scopedSlots: { customRender: 'loginName' }
        },
        {
          title: '单位名称',
          dataIndex: 'orgName',
          scopedSlots: { customRender: 'orgName' }
        },
        {
          title: '角色名称',
          dataIndex: 'roleNames',
          scopedSlots: { customRender: 'roleNames' }
        },
        {
          title: '用户姓名',
          dataIndex: 'userName',
          scopedSlots: { customRender: 'userName' }
        },
        {
          title: '手机号',
          dataIndex: 'mobile',
          scopedSlots: { customRender: 'mobile' }
        },
        {
          title: '是否生效',
          dataIndex: 'isDel',

          scopedSlots: { customRender: 'isDel' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('user 请求', parameter)
        let id = JSON.parse(localStorage.getItem('user')).orgId

        var orgId = { orgId: id }
        return queryData(Object.assign(parameter, this.queryParam, orgId), '/userManage/queryUserMsg').then(res => {
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
  created() {
    this.handleOrgList()
    this.handleRoleList()
  },
  computed: {
    title() {
      return this.$route.meta.title
    }
  },
  filters: {
    statusFilter(type) {
      return statusMap[type].text
    },
    statusTypeFilter(type) {
      return statusMap[type].status
    }
  },
  methods: {
    // 获取单位下的单位
    handleOrgList() {
      let id = JSON.parse(localStorage.getItem('user')).orgId
      var _this = this
      queryData({ org: id }, '/userManage/getHrOrgByPid').then(res => {
        console.log(res)
        _this.orgNames = res.result
        if (res.code !== 0) {
          _this.$message.error(res.message)
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
                disabled: record.no === 'No 2', // Column configuration not to be checked
                name: record.no
              }
            })
          }
        }
        this.optionAlertShow = true
      }else{
        this.options = {
          alert: false,
          rowSelection: null
        },
        this.optionAlertShow = false
      }
    },

    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 获取角色
    handleRoleList() {
      var _this = this
      var roleId = JSON.parse(localStorage.getItem('user')).roleId
      queryData({ role: roleId }, '/userManage/getAllSysRole').then(res => {
        _this.roleNames = res
      })
    },

    // 处理新增
    handleAddSubmit() {
      this.$refs.table.refresh(true)
    },

    // 重置密码
    handleResetPwd(record) {
      var _this = this
      this.$confirm({
        title: '警告',
        content: `真的要重置 ${record.loginName}的密码吗?`,
        okText: '重置',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          console.log('OK')
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
            var param = { id: record.id }
            queryData(param, '/userManage/revertPassword')
              .then(res => {
                if (res.code == 0) {
                  _this.$message.success('密码重置成功')
                }
              })
              .catch(() => _this.$message.error(res.message))
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel() {
          console.log('Cancel')
        }
      })
    },
    // 表单重置
    resetQuery () {
      this.queryParam = { queryOrgId: '', userName: '', loginName: '' }
      this.$refs.table.refresh(true)
    },
    // 显示状态修改
    handleAddVisible () {
      this.addVisible = true
    },
    handleEditVisible(record) {
      this.editData = record
      this.$refs.editModal.add(record)
    },
    handleChangeOption(value) {
      console.log(`select ${value}`)
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 搜索内容
    searchData() {
      this.$refs.table.refresh(true)
    },
    // 删除
    handleDeleteUser(record) {
      var _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除 ${record.loginName} 吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          console.log('OK')
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 500)
            var id = { id: [record.id] }
            queryData(id, '/userManage/delUserMsg').then(res => {
              console.log('删除用户返回值：', res)
              if (res.code == 0) {
                _this.$message.success('删除成功')
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
    },
    // 批量删除
    deleteUsers() {
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
            queryData(ids, '/userManage/delUserMsg').then(res => {
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
