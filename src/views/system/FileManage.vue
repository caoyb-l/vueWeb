<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="24">
            <a-form-item label="文件名称">
              <a-input v-model="queryParam.fileName"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="文件类型">
              <a-select
                size="small"
                v-model="queryParam.type"
                showSearch
                placeholder="选择文件类型"
                optionFilterProp="children"
                :filterOption="filterOption"
              >
                <a-select-option value="1">图片</a-select-option>
                <a-select-option value="2">音频</a-select-option>
                <a-select-option value="3">视频</a-select-option>
                <a-select-option value="4">文件</a-select-option>
                <a-select-option value="5">网页</a-select-option>
              </a-select>
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
                >{{item.name }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-button type="primary" @click="searchData()">查询</a-button>
            <a-button style="margin-left: 8px" @click="resetQuery()">重置</a-button>
            <a-button style="margin-left: 8px" type="primary" icon="plus" v-action:add @click="$refs.createModal.add()">新建</a-button>
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
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEditVisible(record)" v-action:edit>编辑</a>
          <a-divider type="vertical" v-action:delete />
          <a @click="handleDeleteUser(record)" v-action:delete>删除</a>
        </template>
      </span>
    </s-table>
    <edit-form ref="editModal" @ok="handleRefresh" />
    <create-file ref="createModal" @ok="handleRefresh" />
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { PageView } from '@/layouts'
import EditForm from './modules/EditFile'
import CreateFile from './modules/CreateFile'
import { queryData } from '@/api/common'
export default {
  name: 'TableList',
  components: {
    STable,
    PageView,
    EditForm,
    CreateFile
  },
  data () {
    return {
      headers: {
        authorization: 'authorization-text'
      },
      // 查询参数
      queryParam: {
        appVersion: '',
        orgId :''
      },
      orgNames:[],
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
          title: '文件名称',
          dataIndex: 'fileName'
        },
        {
          title: '文件类型',
          dataIndex: 'fileType'
        },
        {
          title: '文件访问路径',
          dataIndex: 'fileUrl'
        },
        {
          title: '所属单位',
          dataIndex: 'orgName'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('App 请求', parameter)
        let orgId
        if (this.queryParam.orgId > 0) {
          orgId = this.queryParam.orgId
        } else {
          orgId = JSON.parse(localStorage.getItem('user')).orgId
        }
        return queryData(Object.assign(parameter, this.queryParam, {orgId: orgId}), '/skillOptionFile/queryFileList')
          .then(res => {
            console.log(res)
            return res.result
          })
      }
    }
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  created () {
    this.handleOrgLists()
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
    // 下拉框
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleChange (info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      }
      if (info.file.status === 'done') {
        this.$message.success(`${info.file.name} file uploaded successfully`)
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} file upload failed.`)
      }
    },
    // 处理更新
    handleRefresh () {
      this.$refs.table.refresh()
    },
    // 表单重置
    resetQuery () {
      this.queryParam = {}
      this.$refs.table.refresh(true)
    },
    handleEditVisible (record) {
      this.$refs.editModal.add(record)
    },
    // 搜索内容
    searchData () {
      this.$refs.table.refresh(true)
    },
    // 删除
    handleDeleteUser (record) {
      var _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除 ${record.fileName} 吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          console.log('OK')
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 500)
            var param = { id: record.id, fileUrl: record.fileUrl }
            queryData(param, '/skillOptionFile/delFile').then(res => {
              console.log('删除返回值：', res)
              if (res.code == 0) {
                _this.$message.success('删除成功')
                _this.$refs.table.refresh()
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
