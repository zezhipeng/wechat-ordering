<template lang="jade">
.card-main.app
  v-header
  v-side
  .dishes-content(v-bind:class='{"active": aside}')
    recommend(v-if='recommends.length')
    menu-content(v-if='list.length')
    transition(name='slide-fade')
      .background(v-if='!list.length')
        svg(xmlns='http://www.w3.org/2000/svg', width='100', height='100')
          g(fill='none', fill-rule='evenodd')
            circle(cx='50', cy='50', r='50', fill='#f9a825')
            path(fill='#324A5E', d='M61.39 73.69l-36.965 9.94V26.29l36.964-9.92')
            path(fill='#FFF', d='M24.425 26.29h51.13v57.34h-51.13z')
            path(fill='#E6E9EE', d='M24.425 56.032v27.6H70.1c-1.092-1.33-2.183-2.66-3.294-3.99-.834-1.01-1.687-2.043-2.858-2.638-2.6-1.33-5.952-.12-8.53-1.508-3.037-1.607-3.612-6.052-6.608-7.778-2.68-1.528-6.23-.297-8.99-1.647-3.193-1.586-4.344-6.15-7.776-7.122-1.032-.297-2.143-.198-3.195-.357-1.747-.217-3.314-1.19-4.425-2.558z')
            g(fill='#FF7058')
              path(d='M38.313 36.687l-2.5 5.04h-1.23l-2.48-5.04V42.5H30.04v-9.226h2.777l2.38 5.08 2.382-5.08h2.777V42.5h-2.064v-5.813M49.305 33.274v1.845h-4.603v1.904h4.127v1.766H44.7v1.924h4.742v1.826H42.64v-9.226h6.665v-.04M57.738 33.274H59.8V42.5H57.74l-4.405-5.794V42.5H51.27v-9.226h1.924l4.524 5.952v-5.952M64.524 40.12c.337.436.813.634 1.39.634.574 0 1.03-.218 1.388-.635.337-.437.515-1.013.515-1.747v-5.1h2.064v5.16c0 1.35-.376 2.36-1.11 3.095-.734.714-1.687 1.07-2.837 1.07-1.15 0-2.104-.356-2.838-1.09-.734-.714-1.11-1.746-1.11-3.075v-5.16h2.063v5.1c-.04.734.12 1.31.476 1.746z')
            path(fill='#4CDBC4', d='M30.14 45.02h39.7v1.13h-39.7z')
            path(fill='#54C0EB', d='M30.14 48.056h39.7v1.13h-39.7z')
        //- p(style='color: #f9a825') 菜品还在研发当中⋯
</template>

<script>
import VHeader from '../layout/header.vue'
import recommend from './recommend.vue'
import menuContent from './menuContent.vue'
import VSide from '../layout/VSide.vue'

export default {
  data () {
    return {}
  },
  computed: {
    list () {
      return this.$store.getters.list
    },
    recommends () {
      return this.$store.getters.recommends
    },
    aside () {
      return this.$store.getters.aside
    }
  },
  mounted () {},
  methods: {},
  components: {
    VHeader,
    menuContent,
    recommend,
    VSide
  }
}
</script>

<style lang="less">
.app {
  display: flex;
  flex-direction: row;
}
.dishes-content {
  padding: 0 15px;
  overflow: scroll;
  width: 100%;
  height: 100%;
  -webkit-overflow-scrolling: touch;
  background: #f3f3f3;
  transition: all .3s ease;
  .swiper-wrapper {
    height: 290px;
  }
  &.active {
    width: e('calc(100% - 80px)');
    .classesTitle {
      border-left: 4px solid#ddd;
    }
    .menu-list {

      .menu-item {
        display: flex;
        margin-bottom: 5px;

        .img {
          width: 100px;
          overflow: hidden;
          img {
            max-width: 120px
          }
        }
        .footer {
          width: e('calc(100% - 80px)');
          overflow: hidden;
          padding-left: 20px;
          display: flex;
          flex-direction: column;
          .line {
            margin-top: 0;
          }
          .line2 {
            height: auto;
            display: flex;
            flex-direction: column;

            .price {
              font-size: 10px;
            }
            .vt {
              font-size: 10px;
              width: e('calc(100% - 20px)')
            }
          }
          .name {
            font-size: 15px;
            .br {
              display: block;
            }
          }
        }
      }
    }
    .recommend-main {
      display: none;
    }
  }
}

</style>
