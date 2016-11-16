<template lang="jade">
.container
  .row
    .col-lg-4.col-lg-push-4.col-sm-6.col-sm-push-3
      section.content-inner
        .card
          .card-main
            .card-header
              .card-inner
                h1.card-heading 登录
            .card-inner
              p.text-center
                span
                  img(alt='Login', src='http://og2h60o77.bkt.clouddn.com/avatar-001.jpg', style='height: 72px; width: 72px; border-radius: 50%; overflow: hidden')
              form.form
                .form-group.form-group-label
                  .row
                    .col-md-10.col-md-push-1
                      label.floating-label(for='ui_login_username') 用户名
                      input#ui_login_username.form-control(type='text', v-model='trader.name')
                .form-group.form-group-label
                  .row
                    .col-md-10.col-md-push-1
                      label.floating-label(for='ui_login_password') 密码
                      input#ui_login_password.form-control(type='password', v-model='trader.password')
                .form-group
                  .row
                    .col-md-10.col-md-push-1
                      a.btn.btn-block.btn-brand.waves-attach.waves-light.waves-effect(@click='login') 登录
                      br
                      router-link(to='/signUp') 注册
                .form-group
                  .row
                    .col-md-10.col-md-push-1
                      .checkbox.checkbox-adv
                        label(for='ui_login_remember')
                          //- input#ui_login_remember.access-hide(name='ui_login_remember', type='checkbox')
                          //- | Stay signed in
                          //- span.checkbox-circle
                          //- span.checkbox-circle-check
                          //- span.checkbox-circle-icon.icon done
        //- .clearfix
        //-   p.margin-no-top.pull-left
        //-     a.btn.btn-flat.btn-brand.waves-attach.waves-effect(href='javascript:void(0)') Need help?
        //-   p.margin-no-top.pull-right
        //-     a.btn.btn-flat.btn-brand.waves-attach.waves-effect(href='javascript:void(0)') Create an account

</template>

<script>
export default {
  data () {
    return {
      trader: {
        name: '',
        password: ''
      }
    }
  },
  computed: {},
  mounted () {},
  methods: {
    login() {
      $.ajax({
        type: 'POST',
        url: '/admin/login',
        data: this.trader,
        dataType: 'json'
      })
      .then(res => {
        console.log(res)
        if (res.success) {
          this.$store.commit('trader', res.data)
          this.$router.push({name: 'home'})
        }
      })
    }
  },
  components: {}
}
</script>

<style lang="less">
html, body {
  background: white !important;
}
</style>
