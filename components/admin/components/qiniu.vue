<template lang="jade">
.qiniu
  svg(xmlns='http://www.w3.org/2000/svg', width='35', height='41', xmlns:xlink='http://www.w3.org/1999/xlink')
    defs
      path#a(d='M20.625 36.667h13.75v-13.75h9.167L27.5 6.875 11.458 22.917h9.167v13.75zm-9.167 4.583h32.084v4.583H11.458V41.25z')
    g(fill='none', fill-rule='evenodd', transform='translate(-10 -6)')
      path(d='M0 0h55v55H0')
      mask#b(fill='#fff')
        use(xlink:href='#a')
      use(stroke='#979797', xlink:href='#a')
      rect(fill='#aaa', width='35', height='39', x="10", v-bind:y="46 - 39 * progress", mask='url(#b)')
  input(type='file', v-on:change='inputFile')
</template>

<script>
import Uploader from 'qiniu-web-uploader'
import sha1 from 'sha1'

export default {
  data () {
    return {
      uploader: {},
      progress: 0
    }
  },
  computed: {},
  props: ['bucket'],
  mounted () {},
  methods: {
    upload(file, token) {
      this.uploader = new Uploader(file, token)
      this.uploader.on('progress', () => {
        console.log(this.uploader.percent) //加载进度
        this.progress = this.uploader.percent
      })
      this.uploader.on('cancel', () => {
        //取消
      })
      this.uploader.on('complete', () => {
        console.log('complete', this.uploader.imgRes) //文件
        this.$emit('complete', this.uploader.imgRes)
      })

      this.uploader.upload()
    },
    imgFilter(name) {
      return /(.*)\.(jpg|bmp|jpeg|png)$/.test(name)
    },
    inputFile(e) {
      let files = e.target.files || e.dataTransfer.files

      if (!files.length)
        return
      if (!this.imgFilter(files[0].name))
        return
      this.beforeUpload(files[0])
    },
    beforeUpload(file) {
      let ext = file.name.split('.').pop()
      let key = sha1(Date.now() + file.size + file.name) + '.' + ext

      $.ajax({
        url: '/api/qiniu',
        data: {
          key: key,
          bucket: this.bucket
        },
        dataType: 'json'
      })
      .then(res => {
        let token = {
          uptoken: res,
          key: new Buffer(key).toString('base64')
        }
        this.upload(file, token)
      })
    }
  },
  components: {}
}
</script>

<style lang="less">
.qiniu {
  overflow: hidden;
  width: 35px;
  height: 41px;

  input {
    top: 0;
    left: 0;
    z-index: 2;
    position: absolute;
    opacity: 0;
    width: 100%;
    height: 100%;
  }
  svg {
    position: relative;
    z-index: 1;
  }
}
</style>
