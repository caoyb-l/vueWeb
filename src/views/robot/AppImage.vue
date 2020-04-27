<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="24">
          <a-col :md="5" :sm="24">
            <a-form-item label="机器人编码">
              <a-input v-model="queryParam.code" />
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="24">
            <a-form-item label="显示类型">
              <a-select
                showSearch
                placeholder="选择触发指令"
                optionFilterProp="children"
                v-model="queryParam.type"
                :filterOption="filterOption">
                <a-select-option v-for="(item) in appImageList" :key="item.typeId" :value="item.typeId" >{{ item.type }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="13" :sm="24">
            <a-button type="primary" @click="handleRefresh()">查询</a-button>
            <a-button style="margin-left: 10px" @click="resetQuery()">重置</a-button>
<!--            <a-button style="margin-left: 10px" type="primary" icon="plus" @click="$refs.editAllImage.add()">批量修改</a-button>-->
            <a-button style="margin-left: 10px" type="primary" icon="plus" @click="$refs.createImage.add()">新建</a-button>
            <a-button style="margin-left: 10px" type="dashed" @click="tableOption">{{ optionAlertShow && '关闭' || '开启' }} alert</a-button>
            <a-dropdown style="margin-left: 10px" v-if="selectedRowKeys.length > 0">
              <a-menu slot="overlay">
                <a-menu-item key="1" v-action:delete @click="handleDeletes()"><a-icon type="delete" />删除</a-menu-item>
              </a-menu>
              <a-button style="margin-left: 8px">批量操作<a-icon type="down" /></a-button>
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
      <span slot="fileName" slot-scope="text">
         <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="descn" slot-scope="text">
         <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <span slot="fileUrl" slot-scope="text">
        <a-popover>
          <template slot="content">
            <img :src="text" style="width:200px;" />
          </template>
          <a-icon type="appstore" />
        </a-popover>
      </span>
      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEditVisible(record)" v-action:edit>编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDelete(record)" v-action:delete>删除</a>
        </template>
      </span>
    </s-table>
    <create-image ref="createImage" @ok="handleRefresh"></create-image>
    <edit-all-image ref="editAllImage" @ok="handleRefresh"></edit-all-image>
    <edit-image ref="editImage" @ok="handleRefresh"></edit-image>
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { PageView } from '@/layouts'
import { queryData } from '@/api/common'
import CreateImage from './modules/CreateImage'
import EditAllImage from './modules/EditAllImage'
import EditImage from './modules/EditImage'
export default {
  name: 'TableList',
  components: {
    Ellipsis,
    STable,
    PageView,
    CreateImage,
    EditAllImage,
    EditImage
  },
  data () {
    return {
      appImageList: [
        {
          'typeId': 0,
          'type': '开机'
        }, {
          'typeId': 1,
          'type': '休息'
        }, {
          'typeId': 2,
          'type': 'LOGO'
        }, {
          'typeId': 3,
          'type': '主页'
        }
      ],
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {
      },
      // 表头
      columns: [
        {
          title: '#',
          dataIndex: 'no',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '机器人',
          dataIndex: 'robotName'
        },
        {
          title: '编码',
          dataIndex: 'code'
        },
        {
          title: '显示类型',
          dataIndex: 'typeName'
        },
        {
          title: '文件名称',
          dataIndex: 'name'
        },
        {
          title: '文件访问路径',
          dataIndex: 'fileName',
          scopedSlots: { customRender: 'fileName' }
        },
        {
          title: '图片预览',
          dataIndex: 'fileUrl',
          scopedSlots: { customRender: 'fileUrl' }
        },
        {
          title: '备注',
          dataIndex: 'descn',
          scopedSlots: { customRender: 'descn' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        var orgId = JSON.parse(localStorage.getItem('user')).orgId
        console.log('user 请求', parameter)
        var params = { orgId: orgId }
        return queryData(Object.assign(parameter, params, this.queryParam), '/appImage/loadPageList').then(res => {
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
  // computed: {
  //   title() {
  //     return this.$route.meta.title
  //   }
  // },
  created () {
    // this.getCmdList()
  },
  methods: {
    tableOption () {
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
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 处理刷新
    handleRefresh () {
      this.$refs.table.refresh(true)
    },
    // 表单重置
    resetQuery () {
      this.queryParam = {}
      this.$refs.table.refresh(true)
    },
    handleEditVisible (record) {
      this.$refs.editImage.add(record)
    },
    // 删除
    handleDelete (record) {
      var _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          console.log('OK')
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 500)
            var id = { id: [record.id] }
            queryData(id, '/appImage/delete').then(res => {
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
    },
    // 批量删除
    handleDeletes () {
      var _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 500)
            var ids = { id: _this.selectedRowKeys }
            queryData(ids, '/appImage/delete').then(res => {
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
