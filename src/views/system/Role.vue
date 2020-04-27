<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色名">
              <a-input placeholder="请输入" v-model="queryParam.name" />
            </a-form-item>
          </a-col>

          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="$refs.table.refresh()">查询</a-button>
            <a-button style="margin-left: 10px" @click="handleReset()">重置</a-button>
            <a-button
              style="margin-left: 10px"
              type="primary"
              icon="plus"
              @click="$refs.addModal.add()"
              v-action:add
            >新建</a-button>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table ref="table" size="middle" :columns="columns" :data="loadData">
      <div slot="expandedRowRender" slot-scope="record" style="margin: 0">
        <a-row :gutter="24" :style="{ marginBottom: '12px' }">
          <a-col
            :span="12"
            v-for="(role, index) in record.permissions"
            :key="index"
            :style="{ marginBottom: '12px' }"
          >
            <a-col :span="6">
              <span>{{ role.permissionName }}：</span>
            </a-col>
            <a-col :span="18" v-if="role.actionEntitySet.length > 0">
              <a-tag
                color="cyan"
                v-for="(action, k) in role.actionEntitySet"
                :key="k"
              >{{ action.describe }}</a-tag>
            </a-col>
            <a-col :span="18" v-else>-</a-col>
          </a-col>
        </a-row>
      </div>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)" v-action:edit>编辑</a>
        <a-divider type="vertical" v-action:delete />
        <a @click="handleDel(record)" v-action:delete>删除</a>
      </span>
    </s-table>

    <edit-modal ref="editModal" @ok="handleOk" :roleName="roleName" />
    <create-modal ref="addModal" @ok="handleOk" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import EditModal from './modules/EditRole'
import CreateModal from './modules/CreateRole'
import { queryData } from '@/api/common'

export default {
  name: 'TableList',
  components: {
    STable,
    EditModal,
    CreateModal
  },
  data() {
    return {
      roleId: 0,
      roleName: '',
      mdl: {},
      // 查询参数
      queryParam: { name: '' },
      // 表头
      columns: [
        {
          title: '唯一识别码',
          dataIndex: 'id'
        },
        {
          title: '角色名称',
          dataIndex: 'name'
        },
        {
          title: '角色等级',
          dataIndex: 'level'
        },
        {
          title: '描述',
          dataIndex: 'describe'
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],

      loadData: parameter => {
        return queryData(Object.assign(parameter, this.queryParam), '/SysRoleManage/querySysRoleMsg').then(res => {
          return res.result
        })
      }
    }
  },
  methods: {
    handleEdit(record) {
      this.mdl = Object.assign({}, record)
      this.mdl.permissions.forEach(permission => {
        permission.actionsOptions = permission.actionEntitySet.map(action => {
          return { label: action.describe, value: action.action, defaultCheck: action.defaultCheck }
        })
      })
      this.roleName = record.name
      console.log('当前选择', record.name)
      this.$refs.editModal.edit(record, record.name)
    },
    handleOk() {
      // 新增/修改 成功时，重载列表
      this.$refs.table.refresh()
    },
    // 处理重置
    handleReset() {
      this.queryParam.name = ''
      this.$refs.table.refresh()
    },
    // 删除
    handleDel(record) {
      var _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除 ${record.name} 吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          console.log('OK')
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 300)
            var id = { id: [record.id] }
            queryData(id, '/SysRoleManage/delSysRoleMsg').then(res => {
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
