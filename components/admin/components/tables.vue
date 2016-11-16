<template lang="jade">
.col-md-12
  .col-md-7
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
            a(@click='del($index)')
              span.icon.waves-attach.waves-effect delete
  .col-md-5
    .card
      .card-main
        .card-inner
          .form-group.form-group-label
            label.floating-label 名称
            input.form-control(type='text', v-model='data.name')
          .form-group.form-group-label
            label.floating-label 人数
            input.form-control(type='text', number, v-model='data.size')
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
    createQrCode (item) {
      $('#qr').empty()
      console.log(this.trader)
      console.log(item)
      var qrcode = qr(`http://192.168.31.138:3000/index/${this.trader._id}/${item._id}`, {
          width: 128,
          height: 128
      })
      $('#qr').append(qrcode)
    },
    add(item) {
      let value = this.data

      if (!value) {
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
      let req = {
        model: 'trader',
        operator: 'splice',
        key: 'tables',
        value: $index
      }

      this.$store.dispatch('update', req)
    }
  },
  components: {}
}
</script>

<style lang="less">
#modal {
  .modal-dialog {
    width: 200px;
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
