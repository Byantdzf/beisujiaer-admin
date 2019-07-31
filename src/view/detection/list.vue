<template>
  <div id="name">
    <div v-model="activeTab">
      <Card>
        <Tabs @on-click="getTab">
          <TabPane label="检测管理列表" name="search">
            <Input
              v-model="searchKeyword"
              @on-enter="handleSearch"
              placeholder="关键字搜索..."
              style="width: 200px; margin-bottom: 22px;"/>
            <span @click="handleSearch">
                        <Button type="primary" icon="ios-search"
                                style=" margin-bottom: 22px;margin-left: 12px;">搜索</Button>
                    </span>
            <Table :loading="loading" :columns="Columns" :data="information" style="width: 100%;" border></Table>
            <Page :total="orgTotal" @on-change="handlePage" :page-size="15"
                  style="float:right;margin-top:20px;margin-bottom:20px;"></Page>
            <div style="clear: both"></div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  </div>
</template>

<script>
  import uAxios from '../../api/index'
  import config from '../../api/config'

  export default {
    name: 'activityList',
    components: {},
    data () {
      return {
        id: 2134,
        searchKeyword: '',
        loading: false,
        switchLoading: false,
        activeTab: 'signIn',
        orgTotal: 0,
        Columns: [
          {
            title: 'ID',
            align: 'center',
            width: 80,
            key: 'id'
          },
          {
            title: '名称',
            align: 'center',
            key: 'name'
          },
          {
            title: '检测对比图',
            key: 'poster',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.photo
                },
                style: {
                  height: '48px',
                  marginTop: '6px',
                  padding: '6px',
                  border: '2px solid #f4f4f4'
                },
                on: {
                  click: () => {
                  }
                }
              })
            },
            align: 'center'
          },
          {
            title: '检测色值',
            align: 'center',
            key: 'color'
          },
          {
            title: '创建时间',
            align: 'center',
            key: 'time'
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
                      let argu = {id: params.row.id}
                      this.$router.push({
                        name: 'jobDetail',
                        params: argu
                      })
                    }
                  }
                }, '编辑'),
                // h('Button', {
                //   props: {
                //     type: 'warning'
                //   },
                //   style: {
                //     margin: '5px'
                //   },
                //   on: {
                //     click: () => {
                //       let argu = {id: params.row.id}
                //       this.$router.push({
                //         name: 'activity_detail',
                //         params: argu
                //       })
                //     }
                //   }
                // }, '活动现场'),
                // h('Button', {
                //   props: {
                //     type: 'success'
                //   },
                //   style: {
                //     margin: '5px'
                //   },
                //   on: {
                //     click: () => {
                //       this.copyActivity(params.row.id)
                //     }
                //   }
                // }, '复制活动')
              ])
            }
          }
        ],
        information: [{
          id: 1,
          color: '#dedede',
          photo: 'http://images.ufutx.com/201907/03/f9722b3af141d9a3cd6b31c97ccee3e7.png',
          name: '尿胆原',
          time: '2019-7-13 13:35'
        }],
      }
    },
    methods: {
      copyActivity (id) {
        uAxios.post(`admin/copy/activity/${id}`).then(response => {
          if (response.data.code === 0) {
            this.$Message.success('复制成功!')
            this.getlist(1)
          } else {
            alert('操作失败！')
          }
        }).catch(() => {
        })
      },
      switchFn (val, id) {
        this.switchLoading = true
        switch (val) {
          case true: {
            uAxios.put(`admin/activity/${id}/top`, this.activity).then(response => {
              if (response.data.code === 0) {
                this.$Message.success('设置成功!')
                this.switchLoading = false
                this.getlist(1)
              } else {
                alert('操作失败！')
              }
            })
          }
            break
          default: {
            uAxios.put(`admin/activity/${id}/cancel/top`, this.activity).then(response => {
              if (response.data.code === 0) {
                this.$Message.success('设置成功!')
                this.switchLoading = false
                this.getlist(1)
              } else {
                alert('操作失败！')
              }
            })
          }
        }
      },
      handlePage (num) {
        // 分页
        this.currentPage = num
        // if (this.social.length == 0) {
        this.getlist(num)
        // } else {
        //   this.filterLabel(num)
        // }
      },
      handleSearch () {
        this.getlist(1)
      },
      creatParty () {
        let argu = {id: 0}
        this.$router.push({
          name: 'jobDetail',
          params: argu
        })
      },
      getTab (type) {
        // 获得激活的Tab页
        this.activeTab = type
      },
      getlist (page) {
        let self = this,
          jump = ''
        self.loading = true
        uAxios.get('admin/activities?page=' + page + '&keyword=' + self.searchKeyword)
          .then(res => {
            let result = res.data.data
            self.total = res.data.data.total
            self.information = result.data
            console.log(self.information)
            self.orgTotal = result.total
            self.loading = false
          })
      },
    },
    mounted () {
      // this.getlist(1)
    }
  }
</script>
<style lang="less" scoped>
  .line-chart-con {
    height: 300px;
  }

  .ivu-card-body {
    text-align: center;
  }

  ._bc-list {
    box-shadow: 0 0 12px #d3d3d3;
    margin-bottom: 12px;
    padding: 12px;
    position: relative;
  }

  ._bc-num {
    font-size: 42px;
    font-weight: bold;
    position: absolute;
    right: 6%;
    top: 40%;
  }

  .bc-style {
    width: 54px;
    position: absolute;
    right: 2%;
    top: 2%;
  }

  .float_l {
    float: left;
  }

  ._bc-name {
    font-size: 16px;
    margin-left: 12px;
    font-weight: bold;

  }
</style>
