<template lang="jade">
.row
  .col-md-12
    .row
      .col-md-12
        .col-md-12
          .modal.modal-va-middle.fade(aria-hidden='true', id='dialog', role='dialog', tabindex='-1')
            .modal-dialog.modal-xs
              .modal-content
                .modal-inner
                  p.h5.margin-top-sm.text-black-hint 确定删除吗？
                .modal-footer
                  p.text-right
                    a.btn.btn-flat.btn-brand-accent.waves-attach.waves-effect(data-dismiss='modal') 取消
                    a.btn.btn-flat.btn-brand-accent.waves-attach.waves-effect(data-dismiss='modal', @click='deleteDish') 确定
          transition(name='fade')
            .stepper-vert(v-if='!dishForm', style='background-color: #f3f3f3')
              .stepper-vert-inner
                h2(v-if='!dishes.length') 暂无数据

                div(v-for='dishClass in trader.classes')
                  .stepper
                    .stepper-step
                      i.icon.stepper-step-icon class
                    span.stepper-text {{dishClass.name}}
                  .stepper-vert-content
                    .dishes
                      .dish(v-for='dish, index in dishes', v-if='dish.class == dishClass.name', v-bind:class="{'active': dish == editedDish}")
                        .dish-content(v-bind:class='{"sleep": !dish.online}')
                          .tool
                            a.delete(v-if='!dish.online', @click='toggleOnline(dish)')
                              span.icon accessibility
                            a.delete(v-if='dish.online', @click='toggleOnline(dish)')
                              span.icon airline_seat_individual_suite
                            a.delete(@click='deleteMid(dish)', data-backdrop='static', data-toggle='modal', href='#dialog')
                              span.icon delete
                          img(:src='"http://og2h60o77.bkt.clouddn.com/" + dish.src')
                          p {{dish.name}}
                            span(style='float: right') ¥{{dish.price}} /{{dish.unit}}
                          p 推荐指数
                            span(style='margin-left: 5px')
                            span.icon(v-for='i in dish.stars') star_border
                          p {{dish.vt}}
                .stepper
                  .stepper-step
        transition(name='fade')
          .dishForm(v-if='dishForm')
            .row
              .col-md-1
                span.icon(style='color: #666; font-size: 80px; margin-top: 10px', v-if='dishForm', @click='dishForm = !dishForm') chevron_left
              .col-md-5
                .card
                  .card-main
                    .card-inner
                      .form-group.form-group-label
                        label.floating-label 名称
                        input.form-control(type='text', v-model='data.name')
                      .form-group.form-group-label
                        label.floating-label 价格
                        input.form-control(type='text', v-model='data.price', number)
                      .form-group.form-group-label
                        label.floating-label 单位
                        input.form-control(type='text', v-model='data.unit')
                      .form-group.form-group-label
                        label.floating-label(for='ui_floating_label_example_select') 分类
                        select#ui_floating_label_example_select.form-control(v-model='data.class')
                          option(v-for='item in trader.classes' v-bind:value='item.name') {{item.name}}
                      .form-group.form-group-label
                        label.floating-label 推荐指数(填写数字)
                        input.form-control(type='text', v-model.number='data.stars')
                      //- .form-group.form-group-label
                      //-   label.floating-label 特色推荐
                      //-   input.form-control(type='text', v-model='data.recommend')
                      .form-group
                        .checkbox.switch
                          label(for='ui_switch_example_1') 特色推荐
                            input#ui_switch_example_1.access-hide(name='ui_switch_example', type='checkbox', v-model='data.recommend')
                            span.switch-toggle
                      transition(name='fade')
                        .form-group.form-group-label(v-show='data.recommend')
                          label.floating-label 推荐描述
                          input.form-control(type='text', v-model='data.recommendVt')
                      .form-group.form-group-label
                        label.floating-label 普通描述
                        input.form-control(type='text', v-model='data.vt')
                      .form-group.form-group-label.uploader
                        qiniu(:bucket='bucket', v-on:complete='complete', v-if='!data.src')
                        p(v-if='!data.src') 添加图片
                        img.img-responsive(:src="'http://og2h60o77.bkt.clouddn.com/' + data.src + '?imageMogr2/thumbnail/330x220'", v-if='data.src')
                        //- label.floating-label 图片
                        //- input.form-control(type='file', v-on:change='inputFile')
                      .form-group
                        a.btn.btn-flat.waves-attach.saveBtn(@click='createDish')
                          span.icon save
                          span 保存
              .col-md-4
                .row
                  .col-md-12
                    .card
                      .card-main
                        .card-header
                          .col-md-12
                            p 添加分类选项
                        .card-inner
                          .form-group.form-group-label
                            label.floating-label 类名
                            input.form-control(type='text', v-model='newClass.name')
                          .card-action-btn.pull-left
                            span.icon add
                            a.btn.btn-flat.waves-attach.waves-effect(@click='addClass') 添加
      .floatBtn(v-if='!dishForm')
        a.fbtn.fbtn-brand-accent.fbtn-lg.waves-attach.waves-circle.waves-light.waves-effect(style='padding-top: 18px;', @click='dishForm = !dishForm')
          span.icon add
      //- .floatBtn(v-if='dishForm')
      //-   a.fbtn.fbtn-brand-accent.fbtn-red.fbtn-lg.waves-attach.waves-circle.waves-light.waves-effect(style='padding-top: 18px;', @click='createDish')
      //-     span.icon save
</template>

<script>
import qiniu from './qiniu.vue'

export default {
  data () {
    return {
      item: {},
      bucket: 'dishes',
      dishForm: false,
      data: {
        src: '',
        recommend: false
      },
      newClass: {},
      editedDish: {}
    }
  },
  computed: {
    trader() {
      return this.$store.getters.trader
    },
    dishes() {
      return this.$store.getters.dishes
    }
  },
  mounted () {},
  methods: {
    deleteMid(item) {
      this.item = item
    },
    editDish(dish) {
      this.editedDish = dish
    },
    complete(src) {
      console.log('complete', src)
      this.data.src = src.key
    },
    inputFile(e) {
      let files = e.target.files || e.dataTransfer.files

      if (!files.length)
        return

      this.createImage(files[0])
    },
    createImage(file) {
      var image = new Image()
      var reader = new FileReader()
      var vm = this

      reader.onload = (e) => {
        vm.data.src = e.target.result
      }
      reader.readAsDataURL(file)
    },
    addClass() {
      let value = this.newClass

      if (!value || !value.name) {
        $('.snackbar').snackbar({
          alive: 4000,
          content: `<div>请填写完整表单</div>`
        })
        return
      }

      let req = {
        model: 'trader',
        operator: 'push',
        key: 'classes',
        value: this.newClass
      }

      this.$store.dispatch('update', req)
      this.newClass = {}
    },
    createDish() {
      if (!this.data || !this.data.name || !this.data.price || !this.data.unit || !this.data.class || !this.data.vt || !this.data.src) {
        $('.snackbar').snackbar({
          alive: 4000,
          content: `<div>请填写完整表单</div>`
        })
        return
      }
      this.dishForm = !this.dishForm

      let req = {
        model: 'dishes',
        body: this.data
      }

      this.$store.dispatch('create', req)
      this.data = {}
    },
    toggleOnline(item) {
      let req = {
        model: 'dishes',
        body: {
          _id: item._id,
          key: 'online',
          value: !item.online
        }
      }
      console.log(req)
      this.$store.dispatch('update', req)
    },
    deleteDish() {
      // console.log(item)
      // // this.dishes.splice(index, 1)
      // if (!item._id) return
      let item = this.item
      let req = {
        model: 'dishes',
        body: {
          _id: item._id
        }
      }
      this.$store.dispatch('deleteItem', req)
    }
  },
  components: {
    qiniu
  }
}
</script>

<style lang="less">
.dishForm {
  position: relative;
  z-index: 2;
  width: 100%;
}
.dishes {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  position: relative;
  z-index: 1;
  padding-top: 25px;
  clear: both;

  .dish {
    display: block;
    margin-left: .5%;
    min-height: 20px;
    width: 250px;
    margin: 0 10px 20px 10px;

    .dish-content {
      cursor: pointer;
      background: #fff;
      height: 270px;
      width: 250px;
      transition: all 375ms cubic-bezier(0.4, 0, 0.2, 1);
      padding: 8px;
      box-shadow: 0 2px 2px #ddd;
      border-radius: 4px;
      position: relative;
      overflow: hidden;
      &.sleep {
        &:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
          z-index: 2;
          background: rgba(0, 0, 0, 0.3);
        }
      }
      p {
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      &:hover {
        .tool {
          visibility: visible;
          opacity: 1;
        }
      }
      .tool {
        transition: all 175ms cubic-bezier(0.4, 0, 0.2, 1);
        position: absolute;
        top: 12px;
        right: 8px;
        z-index: 3;
        font-size: 20px;
        // padding: 2px 3px;
        a {
          background: rgba(0, 0, 0, 0.5);
          padding: 2px 3px;
          margin: 0 3px;
          color: white !important;
        }
      }
      img {
        width: 100%;
      }
    }
  }
}

.uploader {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  .qiniu {
    transform: scale(1.3);
  }
  p {
    color: #777;
  }
}

.selectList {
  padding: 0;
  li {
    font-size: 20px;
    padding: 5px 10px;
  }
}
.saveBtn {
  font-size: 30px;
  color: #666;
  border: 1px solid#999;
  width: 100%;
  .icon {
    margin-left: 10px
  }
}
.stepper-step:before {
  background-color: rgba(255, 102, 0, 0.7);
}
.stepper-text {
  color: rgba(255, 102, 0, 0.7);
}
</style>
