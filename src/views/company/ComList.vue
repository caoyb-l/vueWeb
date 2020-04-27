<template>
  <div>
    <a-card :bordered="false">
      <a-row :gutter="8">
        <a-col :span="5">
          <a-input-search placeholder="关键字" @change="onChange" />
          <a-tree
            ref="tree"
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            @select="onSelect"
            :treeData="orgTree"
          >
            <template slot="title" slot-scope="{title}">
              <span v-if="title.indexOf(searchValue) > -1">
                {{title.substr(0, title.indexOf(searchValue))}}
                <span
                  style="color: #f50"
                >{{searchValue}}</span>
                {{title.substr(title.indexOf(searchValue) + searchValue.length)}}
              </span>
              <span v-else>{{title}}</span>
            </template>
          </a-tree>
        </a-col>
        <a-col :span="17">
          <div class="table-operator">
            <a-button
              type="primary"
              v-if="isSelect"
              icon="plus"
              style="margin-left:30px;"
              @click="handleAddVisible()"
              v-action:add
            >新建下级</a-button>
            <a-button
              type="dashed"
              v-if="isSelect"
              icon="form"
              style="margin-left:30px;"
              @click="handleEditVisible()"
              v-action:edit
            >编辑信息</a-button>
            <a-button
              type="danger"
              v-if="isSelect"
              icon="delete"
              style="margin-left:30px;"
              @click="handleDelete()"
              v-action:delete
            >删除</a-button>
            <a-card :bordered="false" v-if="isSelect">
              <detail-list title="单位信息" ref="list">
                <detail-list-item term="单位名称">{{comInfo.name}}</detail-list-item>
                <detail-list-item term="联系人">{{comInfo.contact}}</detail-list-item>
                <detail-list-item term="联系方式">{{comInfo.contactWay}}</detail-list-item>
                <detail-list-item term="备注">{{comInfo.descn}}</detail-list-item>
              </detail-list>
              <a-divider style="margin-bottom: 32px" />
            </a-card>
          </div>
        </a-col>
      </a-row>
    </a-card>
    <!-- 新增 -->
    <a-modal title="新建下级" v-model="addVisible" @ok="handleAdd">
      <a-form :form="form">
        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
            'addForm.name',
            {rules: [{ required: true, message: '请输入名称' }]}
          ]"
            placeholder="名称"
          />
        </a-form-item>
        <a-form-item label="联系人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[
            'addForm.contact'
          ]" placeholder="联系人" />
        </a-form-item>
        <a-form-item label="联系方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input v-decorator="[
            'addForm.contactWay'
          ]" placeholder="联系方式" />
        </a-form-item>
        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            v-decorator="[
            'addForm.descn'
          ]"
            placeholder="备注"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 编辑 -->
    <a-modal title="编辑" v-model="editVisible" @ok="handleEdit">
      <a-form :form="form">
        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
            'editForm.name',
            {rules: [{ required: true, message: '请输入名称' }],
            initialValue: editForm.name}
          ]"
            placeholder="名称"
          />
        </a-form-item>
        <a-form-item label="联系人" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
            'editForm.contact',
            {initialValue: editForm.contact}
          ]"
            placeholder="联系人"
          />
        </a-form-item>
        <a-form-item label="联系方式" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-input
            v-decorator="[
            'editForm.contactWay',
            {initialValue: editForm.contactWay}
          ]"
            placeholder="联系方式"
          />
        </a-form-item>
        <a-form-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea
            v-decorator="[
            'editForm.descn',
            {initialValue: editForm.descn}
          ]"
            placeholder="备注"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { queryData } from '@/api/common'
import DetailList from '@/components/tools/DetailList'
const DetailListItem = DetailList.Item
export default {
  components: {
    DetailList,
    DetailListItem
  },
  data() {
    return {
      form: this.$form.createForm(this),
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      orgTree: [],
      orgList: [],
      comInfo: [],
      pid: '',
      isSelect: false,
      addVisible: false,
      editVisible: false,
      addForm: {
        name: '',
        contact: '',
        contactWay: '',
        descn: ''
      },
      editForm: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
  },
  beforeMount() {
    this.getDateTree()
  },
  methods: {
    // 新增
    handleAdd() {
      const {
        form: { validateFields }
      } = this
      var _this = this
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
        }
        var param = { pid: this.pid, ...values.addForm }
        console.log(param)

        queryData(param, '/hrOrg/save').then(res => {
          if (res.code == 0) {
            _this.$message.success('新建成功')
            _this.addVisible = false
            _this.form.resetFields()
            _this.getDateTree()
          } else {
            _this.$message.error(res.message)
          }
        })
      })
    },
    // 编辑
    handleEdit() {
      const {
        form: { validateFields }
      } = this
      var _this = this
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values', values)
        }
        var param = { entityId: this.pid, ...values.editForm }
        console.log(param)

        queryData(param, '/hrOrg/save').then(res => {
          if (res.code == 0) {
            _this.$message.success('编辑成功')
            _this.editVisible = false
            _this.form.resetFields()
            _this.getDateTree()
            _this.getComInfo(_this.pid)
          } else {
            _this.$message.error(res.message)
          }
        })
      })
    },
    // 删除
    handleDelete() {
      var _this = this
      this.$confirm({
        title: '警告',
        content: `真的要删除该单位吗?`,
        okText: '删除',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          // 在这里调用删除接口
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 500)
            var param = { entityId: _this.pid }
            console.log(param)
            queryData(param, '/hrOrg/delete').then(res => {
              console.log(res)
              if (res.code == 0) {
                _this.$message.success('删除成功')
                _this.getDateTree()
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
    // 处理显隐
    handleAddVisible() {
      if (this.pid != '') {
        this.addVisible = true
      }
    },
    // 编辑
    handleEditVisible() {
      this.form.resetFields()
      this.editVisible = true
      this.editForm = this.comInfo
    },
    //   获取树形结构数据
    getDateTree() {
      var id = JSON.parse(localStorage.getItem('user')).id
      var _this = this
      queryData({ userid: id }, 'hrOrg/list').then(res => {
        console.log(res)
        if (res.code == 0) {
          _this.orgTree = res.result
          _this.getOrgList(res.result)
          var expandedKeys = []
          res.result.map((value, index) => {
            if (value.children) {
              var item = value.children
              item.map((value, index) => {
                expandedKeys.push(value.key)
              })
            } else {
              expandedKeys.push(value.key)
            }
          })
          _this.expandedKeys = expandedKeys
        }
      })
    },
    //   获取用于搜索的list数组
    getOrgList(data) {
      for (let i = 0; i < data.length; i++) {
        const node = data[i]
        const key = node.key
        const title = node.title
        const orgid = node.orgId
        const pid = node.pid
        this.orgList.push({ key, title: title, orgid: orgid, pid: pid })
        if (node.children) {
          this.getOrgList(node.children)
        }
      }
    },
    // 获取当前点击单位
    onSelect(key) {
      this.getComInfo(key[0])
    },
    getComInfo(pid) {
      var param = { orgId: pid }
      var _this = this
      queryData(param, '/hrOrg/getOrgMessage').then(res => {
        console.log(res)
        if (res.code == 0) {
          _this.comInfo = Object(res.hrOrg)
          if (Object.keys(_this.comInfo).length) {
            _this.isSelect = true
            _this.pid = pid
          } else {
            _this.isSelect = false
          }
        }
      })
    },
    onExpand(expandedKeys) {
      //console.log(expandedKeys);
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    // 搜索
    onChange(e) {
      const value = e.target.value

      const expandedKeys = this.orgList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return this.getParentKey(item.title, this.orgTree)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    },
    // 定位树形结构的数据
    getParentKey(title, tree) {
      let parentKey = 0
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.children) {
          if (node.children.some(item => item.title === title)) {
            parentKey = node.key
          } else if (this.getParentKey(title, node.children)) {
            parentKey = this.getParentKey(title, node.children)
          }
        }
      }
      return parentKey
    }
  }
}
</script>
<style lang="less">
.ant-tree {
  line-height: 2.3rem;
}
.ant-layout-content {
  background: #fff;
}
.custom-tree {
  /deep/ .ant-menu-item-group-title {
    position: relative;
    &:hover {
      .btn {
        display: block;
      }
    }
  }

  /deep/ .ant-menu-item {
    &:hover {
      .btn {
        display: block;
      }
    }
  }

  /deep/ .btn {
    display: none;
    position: absolute;
    top: 0;
    right: 10px;
    width: 20px;
    height: 40px;
    line-height: 40px;
    z-index: 1050;

    &:hover {
      transform: scale(1.2);
      transition: 0.5s all;
    }
  }
}
</style>
