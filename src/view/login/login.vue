<style lang="less">
  @import './login.less';
</style>

<template>
  <div class="login ">
    <div class="login-con">
      <Card icon="ios-analytics" class="interim" title="健康AI纸尿裤管理系统" :bordered="false" v-if="!changeCode">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" :load="loading"></login-form>
          <p class="login-tip">【健康AI纸尿裤】 -- 后台
            <a style="float: right;"></a>
          </p>
        </div>
      </Card>
      <!--<Card icon="md-heart-outline" class="interim" title="福恋智能后台管理系统" :bordered="false" v-else>-->
        <!--<div class="form-con">-->
          <!--<login-code @on-changePassword="changePassword" :load="loading"></login-code>-->
          <!--<p class="login-tip">【福恋智能】 &#45;&#45; 后台-->
            <!--<a style="float: right;" @click="changeCode=false">登录系统 </a>-->
          <!--</p>-->
        <!--</div>-->
      <!--</Card>-->
    </div>
  </div>
</template>

<script>
  import LoginForm from '_c/login-form'
  import LoginCode from '../../components/login-form/login-code'
  import config from '@/libs/api.request'
  import {mapActions} from 'vuex'

  export default {
    components: {
      LoginForm,
      LoginCode
    },
    data () {
      return {
        loading: false,
        changeCode: false,
        newCode: ''
      }
    },
    methods: {
      goRegister () {
        let URL = config.baseUrl.split('api')[0]
        window.open(URL + 'register')
      },
      ...mapActions([
        'handleLogin',
        'getRoutersConfig'
      ]),
      handleSubmit ({userName, password}) {
        const _this = this
        _this.loading = true
        _this.handleLogin({userName, password}).then(res => {
          console.log(res)
          if (res.code === 1) {
            return setTimeout(() => {
              _this.loading = false
              _this.$Message.error(res.data.message || '系统错误')
            }, 1000)
          } else if (res.code === 2) {
            return setTimeout(() => {
              _this.loading = false
              _this.$Message.error(res.data.message || '你尚未注册')
            }, 1000)
          } else {
            _this.$Message.loading({
              content: '登录系统中...',
              duration: 1.5,
              onClose: function () {
                _this.loading = false
                Promise.all([_this.getRoutersConfig()]).then(res => {
                  // 注册新路由配置
                  _this.$router.addRoutes(res[0])
                  _this.$router.push({
                    name: 'home'
                  })
                })
              }
            })
          }
        }).catch(err => {
          setTimeout(() => {
            console.log('err', err)
            _this.loading = false
            _this.$Message.error(err.response.data.message || '系统错误')
          }, 1000)
        })
      },
      changePassword (newPassword) {
        let vm = this
        this.loading = false
        this.$Message.loading({
          content: '修改密码中...',
          duration: 1.5,
          onClose: function () {
            vm.loading = false
            console.log(newPassword)
            vm.changeCode = false
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .interim {
    animation: opacity 1s 1;
    animation-fill-mode: forwards;
    @keyframes opacity {
      from {
        opacity: 0.5;
      }
      to {
        opacity: 1;
      }
    }
  }

</style>
