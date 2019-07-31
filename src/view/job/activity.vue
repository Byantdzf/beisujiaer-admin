<template>
  <div class="hello">
    <Tabs @on-click="getTab">
      <TabPane :label='title' name="detail">
        <Row>
          <Col span="22" style="margin: 22px;min-height: 58vh;">
            <Card>
              <Form ref="activity" :model="activity" :label-width="100">
                <FormItem label="对比图" prop="image">
                  <Card style="max-width: 400px">
                    <uploadImage v-on:uploadPictures="uploadPicture" :pic="activity.poster"></uploadImage>
                  </Card>
                </FormItem>
                <FormItem label="名称" prop="name">
                  <Input v-model="activity.theme" placeholder="Enter activity theme"></Input>
                </FormItem>
                <FormItem label="检测色值" prop="name">
                  <ColorPicker v-model="color" />
                </FormItem>
                <FormItem label="结果说明" prop="name">
                  <editor ref="editor" />
                  <!--<div style="max-width: 400px">-->
                    <!--<Input v-model="activity.detail" placeholder="Enter activity detail" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>-->
                  <!--</div>-->
                </FormItem>
              </Form>
              <div style="text-align: center">
                <Button type="primary" @click="handleSubmit()">{{BtnText}}</Button>
              </div>
            </Card>
          </Col>
        </Row>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
  import axios from 'axios'
  import uAxios from '../../api/index'
  import config from '../../api/config'
  //  import md5 from 'js-md5';
  //	import moment from 'moment';
  import Geolocation from '../components/Geolocation'
  import uploadImage from '../components/uploadImage'
  import dropdown from '../components/dropdown'
  import VDistpicker from 'v-distpicker'
  import Editor from '_c/editor'


  export default {
    name: 'Org',
    components: {
      dropdown,
      uploadImage,
      VDistpicker,
      Geolocation,
      Editor
    },
    data () {
      return {
        color: '19be6b',
        articlesId: '',
        showMapModel: false,
        address: '',
        switch1: false,
        Index: 0,
        setLocation: [],
        redMun: [],    // 红娘列表
        disabled: false,
        user_is_admin: 0,
        date: [],
        title: '类型详情',
        BtnText: '保存',
        loading: false,
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
        information: [],
        VIPinformation: [],
        searchKeyword: '',
        activeTab: 'detail',
        orgColumns: [
          {
            title: 'ID',
            key: 'id',
            align: 'center'
          },
          {
            title: '用户ID',
            key: 'user_id',
            align: 'center'
          },
          {
            title: '用户名',
            key: 'name',
            align: 'center'
          },
          {
            title: '头像',
            key: 'avatar',
            render: (h, params) => {
              return h('img', {
                attrs: {
                  src: params.row.avatar
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
                    let argu = {id: params.row.user_id}
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
            title: '报名时间',
            key: 'created_at',
            align: 'center',
            editable: true
          },
          {
            title: '退款状态',
            align: 'center',
            render: (h, params) => {
              if (params.row.is_refund) {
                return h('div', '已经退款')
              } else {
                return h('div', '未退款')
              }
            }
          },
          {
            title: '操作',
            key: 'title',
            align: 'center',
            render: (h, params) => {
              if (params.row.can_refund && !params.row.is_refund) {
                return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                    },
                    style: {
                      margin: '5px'
                    },
                    on: {
                      click: () => {
                        this.Index = params.index
                        this.refund(params.row.id,params.row.name)
                      }
                    }
                  }, '申请退款')
                ])
              }else{
                return h('div', [
                  h('Button', {
                    props: {
                      disabled: true
                    },
                    style: {
                      margin: '5px'
                    },
                    on: {
                      click: () => {
                      }
                    }
                  }, '暂无退款')
                ])
              }
            }
          }
        ],
        orgData: [],
        total: 0,
        orgTotal: 0,
        modal: false,
        name: '',
        mobile: '',
        avatar: '',
        maker_name: '',
        is_approved: '',
        photos: [],
        graduate_photos: [],
        other_photos: [],
        identification_photos: [],
        wechat_qrcode: [],
        love_characters: [],
        love_languages: [],
        access: localStorage.getItem('access'),
        character: {},
        message: {},
        client_id: 0,
        uploaddata: [],
        id: 0,
        //活动详情
        activity: {}
      }
    },
    methods: {
      editAddress (value) {
        this.activity.address = value.split(' ')[3]
      },
      hideModal (val) {
        this.showMapModel = val
      },
      getLocation (childValue, lnglat) {
        this.address = `${childValue.address}`
        this.activity.province = childValue.province
        this.activity.city = childValue.city
        this.activity.dist = childValue.dist
        this.activity.address = `${childValue.address}`
        this.activity.location_longitude = lnglat[0]
        this.activity.location_latitude = lnglat[1]
      },
      ok () {
        console.log('确定')
      },
      getDate (e) {
        this.activity.start_time = e[0]
        this.activity.end_time = e[1]
      },
      getTab (type) {
        // 获得激活的Tab页
        this.activeTab = type
        this.getOrder(1)
      },
      settNote () {
        let argu = {id: this.id}
        this.$router.push({
          name: 'user_note',
          params: argu
        })
      },
      getGropData (_id) {
        this.client_id = _id
      },
      uploadPicture (image) {  // 单
        this.activity.poster = image // 轮播banna
      },
      uploadPictures (image) {  // 多
        this.activity.detail_pic = image // 详情image
      },
      // 提交表单
      handleSubmit () {
        if (this.id == 0) {
          uAxios.post(`admin/activities`, this.activity).then(response => {
            if (response.data.code === 0) {
              this.$Message.success('创建成功!')
              setTimeout(() => {
                this.$router.push({
                  name: 'activityList'
                })
              }, 800)
            } else {
              alert('操作失败！')
            }
          })
          console.log(this.activity)
          return
        }
        uAxios.put(`admin/activities/${this.id}`, this.activity).then(response => {
          if (response.data.code === 0) {
            this.$Message.success('保存成功!')
          } else {
            alert('操作失败！')
          }
        })
      },
      refund (id, name) {
        let self = this
        this.$Modal.confirm({
          title: '温馨提示',
          content: `<p>是否 <span class="_bold">${name}</span>执行 <span style="color: orange">"申请退款"</span> 操作？</p>`,
          onOk: () => {
            uAxios.post(`admin/activity/members/${id}/refund`)
              .then(res => {
                if (res.data.code === 0) {
                  setTimeout(() => {
                    this.$Modal.remove();
                    this.$Message.info('操作成功');
                  }, 200);
                  self.information.splice(this.Index,1)
                } else {
                  alert('操作失败！')
                }
              })
          }
        });
      },
      getOrder (page) {
        let self = this
        self.loading = true
        uAxios.get(`admin/activity/${self.id}/members?page=` + page + '&type=' + self.activeTab + '&keyword=' + self.searchKeyword)
          .then(res => {
            let result = res.data.data
            console.log(result)
            self.information = result.data
            console.log(self.information)
            self.orgTotal = result.total
            self.loading = false
          })
      },
      getmatchmakers () {
        let self = this
        self.loading = true
        uAxios.get('admin/matchmakers?nopage=1&keyword=' + self.searchKeyword)
          .then(res => {
            let result = res.data.data
            this.redMun = result.map((item) => {
              return {
                name: item.name,
                id: item.id
              }
            })
            console.log(this.redMun)
          })
      },
      handlePage (num) {
        // 分页
        this.getOrder(num)

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
          this.message.image = item
        } else {
          this.modal = true
          this.message.title_v = '了解自己的优势'
          this.message.type_v = 'character'
        }
        console.log(this.message)
      },
      getlist (page) {
        let self = this
        self.loading = true
        uAxios.get('admin/activities/' + self.id)
          .then(res => {
            console.log(res, '999999')
            let result = res.data.data
            this.data = []
            this.address = `${result.address}`
            this.activity = result
            this.date.push(result.start_time)
            this.date.push(result.end_time)
            this.setLocation = [result.location_longitude, result.location_latitude]
            console.log(this.activity)
          })
      },
    },
    mounted () {
      if (this.$route.params.id != 0) {
        this.id = this.$route.params.id
        this.getlist()
        return
      }
      this.title = this.BtnText = '新增检测结果'
      this.activity.host = localStorage.getItem('paas')
    }
  }
</script>

<style lang="less">
  ._bold {
    font-weight: bold
  }
  #container {width:300px; height: 180px;}

  .float_l {
    float: left
  }
  .distpicker-address-wrapper select {
    height: 32px !important;
    line-height: 32px !important;
    padding: 0 12px !important;
    margin-right: 12px !important;
    font-size: 14px !important;
  }
  Input{
    max-width: 400px;
  }
</style>
