<template>
  <div v-model="activeTab">
    <Card>
      <Tabs @on-click="getTab" style="margin-top: 12px;">
        <TabPane label="管理员列表" name="adminList">
          <Input
            v-model="searchKeyword"
            @on-enter="handleSearch"
            placeholder="关键字搜索..."
            style="width: 160px; margin-bottom: 22px;"/>
          <span @click="handleSearch">
                    <Button type="primary" icon="ios-search" style="margin-left: 12px; margin-bottom: 22px;">搜索</Button>
                </span>
          <span @click="modalCode = true">
                        <Button type="success" style=" margin-bottom: 22px; float: right;">添加管理员</Button>
                    </span>
          <Table :loading="loading" :columns="orgColumns" :data="information" style="width: 100%;" border></Table>
          <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                style="float:right;margin-top:5px;margin-bottom:30px;"></Page>
        </TabPane>
      </Tabs>
      <Modal
        v-model="modalCode"
        title="添加管理员账号"
        @on-ok="ok"
      >
        <Input
          v-model="mobile"
          placeholder="登录手机号"
          style="width: 240px; margin-bottom: 22px;"/><br/>
        <Input
          v-model="code"
          placeholder="登录密码"
          style="width: 240px; margin-bottom: 22px;"/>
        <!--<Tree :data="baseData" :multiple="multiple" @on-select-change="changeTree"></Tree>-->
      </Modal>
    </Card>
  </div>
</template>

<script>
  import uAxios from '../../api/index'
  import config from '../../api/config'
  import dropdown from '../components/dropdown'
  import Cookies from 'js-cookie'

  export default {
    name: 'authorization',
    components: {
      dropdown: dropdown
    },
    data () {
      return {
        mobile: '',
        code: '',
        multiple: false,
        activeTab: 'score',
        workerTotal: 0,
        search: '',
        addInformation: [],
        searchKeyword: '', // 搜索
        orgTotal: 0, // 分页
        userList: [], // 用户列表
        referresID: '', // 充值用户
        id: '',
        modalCode: false,
        baseData: [],
        workerColumns: [
          {
            title: 'ID',
            key: 'id',
            align: 'center',
            width: 80,
            editable: true
          },
          {
            title: '用户名',
            key: 'name',
            align: 'center',
            editable: true
          },
          {
            title: '头像',
            key: 'photo',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.photo
                },
                style: {
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  marginTop: '6px',
                  border: '4px solid #f4f4f4'
                },
                on: {
                  click: () => {
                    let argu = {id: params.row.id}
                    this.$router.push({
                      name: 'user_detail',
                      params: argu
                    })
                  }
                }
              })
            },
            width: 80,
            align: 'center'
          },
          {
            title: '性别',
            key: 'sex',
            align: 'center',
            editable: true
          },
          {
            title: '单身状态',
            key: 'type',
            align: 'center',
            editable: true
          },
          {
            title: '加入时间',
            key: 'created_at',
            align: 'center',
            editable: true
          },
          {
            title: '操作',
            key: 'title',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      this.addAdminId = params.row.id
                      this.modalCode = true
                      this.baseData = this.getTreeData(this.paasList)
                    }
                  }
                }, '配置权限')
              ])
            }
          }
        ],
        orgColumns: [
          {
            title: 'UserID',
            key: 'id',
            align: 'center',
            width: 100,
            editable: true
          },
          {
            title: '用户名',
            key: 'name',
            align: 'center',
            editable: true
          },
          {
            title: '头像',
            key: 'photo',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.photo
                },
                style: {
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  marginTop: '6px',
                  border: '4px solid #f4f4f4'
                },
                on: {
                  click: () => {
                    let argu = {id: params.row.id}
                    this.$router.push({
                      name: 'user_detail',
                      params: argu
                    })
                  }
                }
              })
            },
            width: 80,
            align: 'center'
          },
          {
            title: '权限类型',
            key: 'admin_type',
            align: 'center',
            editable: true
          },
          {
            title: '操作',
            key: 'id',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                  },
                  on: {
                    click: () => {
                      this.$Modal.confirm({
                        title: '温馨提示',
                        content: `<p>是否将 <span class="_bold">${params.row.name}</span> 移除权限?</p>`,
                        onOk: () => {
                          this.removeAdmin(params.row.adminId, params.index)
                        },
                        onCancel: () => {
                          console.log('点击了取消')
                        }
                      })
                    }
                  }
                }, '移除权限')
              ])
            }
          }
        ],
        modal: false,
        information: [
          {
            id: 1,
            name: 'admin',
            admin_type: '管理员',
            photo: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3762745400,2719224059&fm=27&gp=0.jpg'
          }
        ],
        title: '',
        addAdminId: 0,
        paasList: [],
        paasID: '',
        paasName: '',
        loading: false
      }
    },
    methods: {
      changeTree (val) {
        if (val && val[0].title) {
          if (val[0].title === '超级管理员') return this.paasName = 'super'
          for (let item of this.paasList) {
            if (item.title === val[0].title) {
              this.paasID = item.id
              this.paasName = item.name
            }
          }
        }
      },
      ok () {
        let type = this.paasName
        if (!type) {
          return this.$Message.error('已取消！')
        }
        if (this.paasName === 'super') {
          type = 'SUPER'
        }
        uAxios.post(`admin/admins?user_id=${this.addAdminId}&type=${type}`)
          .then(res => {
            let result = res.data
            if (result.code == 0) {
              this.$Message.success('添加成功！')
            }
          }).catch(() => {
          this.$Message.error(result.message)
        })
      },
      removeAdmin (id, index) {
        uAxios.delete(`admin/admins/${id}`)
          .then(res => {
            let result = res.data
            if (result.code == 0) {
              this.information.splice(index, 1)
              this.$Message.success('移除成功！')
            }
          }).catch(() => {
          this.$Message.error(res.message)
        })
      },
      workerPage (num) {
        this.userSearch(num)
      },
      userSearch (page) {
        let self = this
        this.$Message.loading({
          content: '加载中...',
          duration: 1,
          onClose: () => {
          }
        })
        self.loading = true
        uAxios.get(`admin/users?page=${page}&keyword=${self.search}`)
          .then(res => {
            let result = res.data.data
            if (result.data) {
              self.addInformation = result.data
              for (let item of self.addInformation) {
                item.type = item.type == 'single' ? '单身' : '介绍人'
              }
              self.workerTotal = result.total
            }
            self.loading = false
          }).catch(() => {
          self.loading = false
        })
      },
      // setReferres () {
      //   // 设置为推荐人
      //   console.log(this.referresID)
      //   if (!this.referresID) {
      //     return this.$Message.error('请选择要设置为推荐人的用户！')
      //   }
      //   // let reg = /^[0-9]*$/
      //   // if (!reg.test(this.money)) {
      //   //   return this.$Message.error('请输入正确的充值金额！')
      //   // }
      //   uAxios.post(`admin/referres/users/${this.referresID}`)
      //     .then(res => {
      //       let result = res.data
      //       if (result.code == 0) {
      //         this.$Message.success('设置成功！')
      //         this.getlist()
      //       }
      //     })
      // },
      // getGropData (value) {
      //   let self = this
      //   self.loading = true
      //   uAxios.get(`admin/users?keyword=${value}`)
      //     .then(res => {
      //       let result = res.data.data.data
      //       this.userList = result.map((item) => {
      //         return {
      //           name: item.name,
      //           id: item.id
      //         }
      //       })
      //     })
      // },
      getTab (type) {
        this.activeTab = type
        switch (type) {
          case 'adminList':
            this.getlist(1)
            break
          default:
            console.log('添加管理员')
        }
      },
      handlePage (num) { // 分页
        this.getlist(num)
      },
      getTreeData (result) {
        let data = [
          {
            expand: true,
            selected: false,
            title: '超级管理员'
          },
          {
            expand: true,
            title: '平台管理员',
            disabled: true,
            selected: false,
            children: []
          }
        ]
        console.log(data[1].children)
        for (let item of result) {
          data[1].children.push({title: item.title})
        }
        return data
      },
      getPaasList () {
        uAxios.get('admin/paas/list?nopage=0')
          .then(res => {
            let result = res.data.data
            this.paasList = result
            this.baseData = this.getTreeData(this.paasList)
          })
          .catch(() => {
          })
      },
      getlist (page) {
        let self = this
        self.loading = true
        uAxios.get(`admin/admins?page=${page}&keyword=${self.searchKeyword}`)
          .then(res => {
            let result = res.data.data
            if (result.data) {
              self.information = result.data.map((item) => {
                let {user} = item
                user.adminId = item.id
                user.created_at = item.created_at
                user.sex = user.sex == 1 ? '男' : '女'
                user.type = user.type == 'single' ? '单身' : '介绍人'
                user.admin_type = item.type == 'SUPER' ? '超级管理员' : `《${item.paas.title}》管理员`
                return user
              })
              self.orgTotal = result.total
              console.log(this.information)
            }
            self.loading = false
          })
      },
      handleSearch () {
        this.getlist(1)
      }
    },
    mounted () {
      // this.getlist(1)
      // this.getPaasList()
    }
  }
</script>

<style lang="less">
  ._bold {
    font-weight: bold;
  }

  .ivu-tree-title-selected, .ivu-tree-title-selected:hover {
    background-color: #d5e8fc;
    position: relative;
    padding-right: 22px;

    &:after {
      content: '';
      position: absolute;
      right: 4px;
      top: 5px;
      width: 12px;
      height: 18px;
      background-image: url("http://images.ufutx.com/201905/15/c09ba0a5ed976879bc389cc9cfd8c43a.png");
      background-size: contain;
      background-repeat: no-repeat;
    }

    /*box-shadow: 1px 1px 12px #d3d3d3;*/
  }
</style>
