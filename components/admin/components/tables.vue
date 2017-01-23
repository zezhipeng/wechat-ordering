<template lang="jade">
.col-md-12
  .col-md-7
    button.btn.btn-brand-accent.waves-attach.waves-effect(@click='allQr', data-toggle='modal', data-backdrop='static', href='#modal') 所有的二维码
    table.table
      thead
        tr
          th #
          th 名称
          th 人数
          th 二维码
          th 删除
      tbody
        tr(v-for='(item, $index) in tables')
          td {{$index + 1}}
          td {{item.name}}
          td {{item.size}}
          th
            a.btn.btn-flat.btn-brand-accent.waves-attach.waves-effect(data-toggle='modal', data-backdrop='static', href='#modal', @click='createQrCode(item)')
              span.icon crop_free
          td
            a.del-btn(@click='del($index)')
              span.icon.waves-attach.waves-effect delete
  .col-md-5
    .card
      .card-main
        form.card-inner
          .form-group.form-group-label
            label.floating-label 名称
            input.form-control(type='text', v-model='data.name', required)
          .form-group.form-group-label
            label.floating-label 人数
            input.form-control(type='text', number, v-model='data.size', required)
          .card-action-btn.pull-left
            span.icon add
            a.btn.btn-flat.waves-attach.waves-effect(@click='add') 添加
  .modal.modal-va-middle.fade#modal(aria-hidden='true', role='dialog', tabindex='-1')
    .modal-dialog.modal-xs
      .modal-content
        .modal-heading
        .modal-inner
          #qr
        .modal-close(data-dismiss='modal')
          span.icon close
</template>

<script>
import qr from 'qr-element'
import _ from 'lodash'

export default {
  data () {
    return {
      data: {}
    }
  },
  computed: {
    tables() {
      return this.$store.getters.trader.tables
    },
    trader() {
      return this.$store.getters.trader
    }
  },
  mounted () {},
  methods: {
    allQr() {
      $('#qr').empty()

      _.forEach(this.tables, table => {
        var qrcode = qr(`http://${window.location.host}/index?trader=${this.trader._id}&table=${table._id}`, {
            width: 128,
            height: 128
        })
        var content = document.createElement('div')
        var title = document.createElement('div')

        title.innerText = table.name
        title.className = 'qr-title'

        $(content).append(title)
        $(content).append(qrcode)

        $('#qr').append(content)
      })

    },
    createQrCode (item) {
      $('#qr').empty()

      var qrcode = qr(`http://${window.location.host}/index?trader=${this.trader._id}&table=${item._id}`, {
          width: 128,
          height: 128
      })
      $('#qr').append(qrcode)
    },
    add() {
      let value = this.data
      console.log(this.data)
      if (!value || !value.name || !value.size) {
        $('.snackbar').snackbar({
          alive: 4000,
          content: `<div>请填写完整表单</div>`
        })
        return
      }

      let req = {
        model: 'trader',
        operator: 'push',
        key: 'tables',
        value: this.data
      }

      this.$store.dispatch('update', req)
      this.data = {}
    },
    del($index) {
      var r = window.confirm('确认删除?')
      if (r) {
        let req = {
          model: 'trader',
          operator: 'splice',
          key: 'tables',
          value: $index
        }
        
        this.$store.dispatch('update', req)
      }
    }
  },
  components: {}
}
</script>

<style lang="less">
#modal {
  .qr-title {
    text-align: center;
  }
  .modal-dialog {
    // width: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-close {
    position: absolute;
    top: 0;
    right: -33px;
    height: 40px;
    width: 40px;
    background: rgba(0, 0, 0, 0.2);
    color: white;
    font-size: 20px;
    line-height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
