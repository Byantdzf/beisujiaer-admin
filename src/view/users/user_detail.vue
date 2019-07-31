<template>
  <div class="hello">
    <Menu mode="horizontal" theme="light" active-name="1">
      <MenuItem name="1">
        <Icon type="ios-paper"></Icon>
        用户详情
      </MenuItem>
    </Menu>
    <Row>
      <Card v-if="user_is_admin==1" shadow>
        <p slot="title" style="color: #ff6c4c">管理员操作</p>
        <div style="width: 100%;">
          <Row>
            <i-col span="10">
              <Card>
                <div style="width:100%; padding: 12px;border-bottom: 1px solid #d3d3d3;margin-bottom: 12px;">
                  <span class="font_16 _bold" style="margin-right: 12px;">屏蔽该账户:</span>
                  <Radio-group v-model="closeCode">
                    <Radio label="关闭"></Radio>
                    <Radio label="开启"></Radio>
                  </Radio-group>
                  <div style="clear: both"></div>
                </div>
              </Card>
            </i-col>
          </Row>
        </div>
      </Card>
      <Col span="10" style="margin: 22px 0;position: relative">
        <Card>
          <p slot="title" style="color: #ff6c4c">用户信息</p>
          <div style="display: inline-block">
            <span class="font_16 _bold">头像：<img
              :src="avatar?avatar:'http://images.ufutx.com/201905/13/599151d27fc07ba1bc4cc57a291525e5.jpeg'" alt=""
              width="80px" height="80px" style="box-shadow: 1px 1px 12px #c1c1c1"
              @click="showModal(avatar,'image')"></span>
          </div>
          <div style="display: inline-block;margin-left: 42px;">
            <span class="font_16 _bold">用户名：</span>
            <span class="font_16">{{name}}</span>
          </div>
          <div style="display: inline-block;margin-top: 22px;" v-if="user_is_admin==1">
          </div>
          <Table :columns="columns" :data="information" :show-header="false" :border="false"
                 style="margin-top: 26px"></Table>
        </Card>
      </Col>
      <Col span="13" offset="1" style="margin-top: 12px;position: relative">
        <Card style="margin-top: 12px;">
          <p slot="title">历史检测记录<span style="color: #ff0c18;font-weight: bold">（{{recommendTotal}}）</span></p>
          <Table :loading="loading" :columns="recommendColumns" :data="recommendData" style="width: 100%;"
                 border></Table>
          <Page :total="recommendTotal" @on-change="handlePage" :page-size="15"
                style="float:right;margin-top:5px;margin-bottom:30px;"></Page>
          <div style="clear: both"></div>
        </Card>
      </Col>
    </Row>
    <Modal
      v-model="modal"
      :title="message.title_v"
      ok-text="OK"
      no-cancel>
      <!--<p>{{message.type}}</p>-->
      <div style="font-size: 16px">
        <div v-if="message.type_v == 'test'">{{message.content}}</div>
        <div style="text-align: center" v-if="message.type_v == 'image'">
          <img :src="message.image" style="width: 400px;"/>
        </div>
        <div v-if="message.type_v == 'character'">
          <p style="font-weight: bold;margin: 4px;"><span>类型:</span>
          <p>{{character.type}}</p></p>
          <p style="font-weight: bold;margin: 4px;"><span>性格:</span>
          <p>{{character.character}}</p></p>
          <p style="font-weight: bold;margin: 4px;"><span>推荐职位:</span>
          <p v-for="item in character.profession">{{item}}</p></p>
        </div>
      </div>
    </Modal>
    <Modal
      v-model="modal1"
      title='温馨提示'
      ok-text="OK"
      @on-ok="deleteUser"
      no-cancel>
      <p>是否确认删除该用户？</p>
    </Modal>
  </div>
</template>

<script>
  import axios from 'axios'
  import uAxios from '../../api'
  import config from '../../api/config'
  //  import md5 from 'js-md5';
  //	import moment from 'moment';
  import dropdown from '../components/dropdown'

  export default {
    name: 'Org',
    components: {
      dropdown: dropdown
    },
    data () {
      return {
        closeCode: '关闭',
        articlesId: '',
        switch1: false,
        redMun: [], // 红娘列表
        disabled: false,
        loading: false,
        type: '',
        typeList: [
          {
            title: '单身',
            name: 'single'
          },
          {
            title: '恋爱',
            name: 'loveing'
          },
          {
            title: '介绍人',
            name: 'marriage'
          }],
        user_is_admin: 0,
        //                enterprises_id: '', // 默认企业id
        columns: [
          {
            title: 'Name',
            key: 'name'
          },
          {
            title: 'Age',
            key: 'key'
          }
        ],
        columns1: [
          {
            title: 'Name',
            key: 'title'
          },
          {
            title: 'Age',
            key: 'key'
          }
        ],
        recommendColumns: [
          {
            title: '序号',
            align: 'center',
            key: 'id'
          },
          // {
          //   title: '兼职名称',
          //   align: 'center',
          //   key: 'name'
          // },
          {
            title: '检测图片',
            key: 'updatedAt',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: 'http://images.ufutx.com/201907/03/d3058221db41bb6be32bb2cd2cdb884c.jpeg'
                },
                style: {
                  width: '48px',
                  height: '48px',
                  // borderRadius: '50%',
                  marginTop: '6px',
                  border: '2px solid #f4f4f4'
                },
                on: {
                  click: () => {
                    let argu = { id: params.row.id }
                    this.$router.push({
                      name: 'user_detail',
                      params: argu
                    })
                  }
                }
              })
            },
            align: 'center'
          },
          {
            title: '检测时间',
            align: 'center',
            key: 'created_at'
          },
          {
            title: '状态/结果',
            align: 'center',
            render: (h, params) => {
              return h('span', '酮体')
            }
          },
          {
            title: '操作',
            key: 'title',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error'
                  },
                  style: {
                    margin: '5px'
                  },
                  on: {
                    click: () => {
                      let argu = { id: params.row.id }
                      const { href } = this.$router.resolve({
                        name: 'user_detail',
                        params: argu
                      })
                      window.open(href, '_blank')
                    }
                  }
                }, '删除记录')
              ])
            }
          }
        ],
        recommendData: [],
        information: [],
        VIPinformation: [],
        searchKeyword: '',
        activeTab: 'orgInfo',
        orgColumns: [
          {
            key: 'updatedAt',
            width: '150px',
            align: 'right'
          },
          {
            key: 'value',
            align: 'left',
            render: (h, params) => {
              if (params.row.key === 'LOGO') {
                return h('div', [
                  h('Avatar', {
                    props: {
                      src: params.row.value,
                      shape: 'square'
                    },
                    style: {
                      width: '50px',
                      height: '50px',
                      margin: '10px 0'
                    }
                  })
                ])
              } else {
                return h('div', [
                  h('span', params.row.value)
                ])
              }
            }
          }
        ],
        orgData: [],
        total: 0,
        recommendTotal: 0,
        orgTotal: 0,
        modal: false,
        modal1: false,
        name: '',
        mobile: '',
        avatar: '',
        maker_name: '',
        is_approved: '',
        is_audited: '',
        photos: [],
        lifePhotos: [],
        graduate_photos: [],
        other_photos: [],
        identification_photos: [],
        wechat_qrcode: [],
        love_characters: [],
        love_languages: [],
        character: {},
        message: {},
        client_id: 0,
        uploaddata: []
      }
    },
    methods: {
      alterState () {
        console.log()
        uAxios.put(`admin/users/${this.id}?type=${this.type}`).then((response) => {
          if (response.data.code === 0) {
            this.$Message.info('修改成功')
            this.getlist(this.currentPage)
          } else {
            this.$Modal.error({
              content: response.data.message
            })
          }
        })
      },
      showDeleteUser () {
        this.modal1 = true
      },
      handlePage (num) {
        this.recommend(num)
      },
      gotoEdit () {
        let argu = { edit_id: this.id }
        this.$router.push({
          name: 'edit_user_detail',
          params: argu
        })
      },
      auditUser () {
        // 审核用户
        let self = this
        uAxios.put('admin/audit/users/' + self.id).then((response) => {
          if (response.data.code === 0) {
            this.$Message.info('设置成功')
            this.getlist(this.currentPage)
          } else {
            this.$Modal.error({
              content: response.data.message
            })
          }
        })
      },
      deleteUser () {
        let self = this
        uAxios.delete('admin/users/' + self.id).then((response) => {
          if (response.data.code === 0) {
            this.$Message.info('删除成功')
            this.getlist(this.currentPage)
          } else {
            this.$Modal.error({
              content: response.data.message
            })
          }
        })
      },
      settNote () {
        let argu = { id: this.id }
        this.$router.push({
          name: 'user_note',
          params: argu
        })
      },
      getGropData (_id) {
        this.client_id = _id
      },
      gotoUrl (name, name_id, id) {
        let argu = {}
        argu[name_id] = id
        this.$router.push({
          name: name,
          params: argu
        })
      },
      // 分配用户
      setapproved () {
        let self = this
        uAxios.put(`admin/users/${self.id}/approved`).then((response) => {
          if (response.data.code === 0) {
            this.$Message.info('设置成功')
            this.getlist(this.currentPage)
          } else {
            this.$Modal.error({
              content: response.data.message
            })
          }
        })
      },
      // 分配用户
      allocation () {
        if (this.client_id == 0) {
          return this.$Modal.error({
            content: '请选择红娘'
          })
        }
        let self = this
        uAxios.post(`admin/set/matchmaker/${self.client_id}/client/${self.id}`).then((response) => {
          if (response.data.code === 0) {
            this.$Message.info('设置成功')
            this.getlist(this.currentPage)
          } else {
            this.$Modal.error({
              content: response.data.message
            })
          }
        })
      },
      change (status) {
        let self = this,
          data = {
            is_admin: Number(status)
          }
        uAxios.put(`admin/set/users/${self.id}/admin`, data).then((response) => {
          if (response.data.code === 0) {
            this.$Message.info('设置成功')
            this.getlist(this.currentPage)
          } else {
            this.$Modal.error({
              content: response.data.message
            })
          }
        })
      },
      getGropData (value) {
        console.log(this.searchKeyword)
        let self = this
        self.loading = true
        uAxios.get(`admin/matchmakers?type=single&keyword=${value}`)
          .then(res => {
            let result = res.data.data.data
            this.redMun = result.map((item) => {
              return {
                name: item.name,
                id: item.id
              }
            })
            console.log(this.redMun)
          }).catch(() => {
          self.loading = false
        })
      },
      showModal (item, type) {
        console.log(this.character)
        if (type == 'test') {
          this.modal = true
          this.message = item
          this.message.type_v = 'test'
          this.message.title_v = item.title
        } else if (type == 'image') {
          this.modal = true
          this.message.title_v = '预览'
          this.message.type_v = 'image'
          this.message.image = item ? item : 'http://images.ufutx.com/201905/13/599151d27fc07ba1bc4cc57a291525e5.jpeg'
        } else {
          this.modal = true
          this.message.title_v = '了解自己的优势'
          this.message.type_v = 'character'
        }
        console.log(this.message)
      },
      recommend (page) {
        let self = this
        self.loading = true
        uAxios.get(`admin/users/${self.id}/invite/users?page=${page}`)
          .then(res => {
            let result = res.data.data
            console.log(result)
            self.recommendData = result.data.map((item) => {
              return {
                avatar: item.avatar,
                created_at: item.created_at,
                id: item.id,
                mobile: item.mobile,
                name: item.name,
                sex: item.sex == 1 ? '男' : '女',
                type: item.type == 'single' ? '单身' : '介绍人',
                from_name: item.from_name,
                rank: item.rank_name,
                is_approved: item.is_approved == '0' ? '未认证' : '已认证'
              }
            })
            self.recommendTotal = result.total
            self.loading = false
            // self.searchKeyword = ''
          }).catch(() => {
          self.loading = false
        })
      },
      getlist (page) {
        let self = this
        self.loading = true
        uAxios.get('admin/users/' + self.id + '?page=' + page)
          .then(res => {
            let result = res.data.data
            console.log(result)
            self.name = result.name
            self.type = result.type
            self.switch1 = result.is_admin != 0
            self.maker_name = result.maker_name
            self.is_approved = result.is_approved
            self.is_audited = result.is_audited
            self.disabled = result.maker_name != ''
            self.avatar = result.avatar
            self.user_is_admin = result.user_is_admin
            self.mobile = result.mobile
            self.love_characters = result.love_characters
            self.love_languages = result.love_languages
            self.character = result.character
            self.photos = result.profile.photos
            self.lifePhotos = result.lifePhotos
            self.graduate_photos = result.profile.graduate_photos
            self.other_photos = result.profile.other_photos
            self.identification_photos = result.profile.identification_photos
            self.wechat_qrcode = result.profile.wechat_qrcode
            self.information = [

              {
                name: '手机号',
                key: result.mobile
              },
              {
                name: '加入时间',
                key: result.profile.created_at
              }
            ]
            self.VIPinformation = [
              {
                title: '薪资',
                key: result.profile.salary
              },
              {
                title: '购车情况',
                key: result.profile.h_car == 1 ? '有' : '无'
              },

              {
                title: '购房情况',
                key: result.profile.h_housing == 1 ? '有' : '无'
              }
            ]
            self.orgTotal = result.total
            self.loading = false
            // self.searchKeyword = ''
          })
      }
    },
    mounted () {
      this.id = this.$route.params.id
      this.getlist(1)
      this.recommend(1)
    }
  }
</script>

<style>
  ._bold {
    font-weight: bold
  }
</style>
