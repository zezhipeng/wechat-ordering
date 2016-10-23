<template lang="jade">
.footer-menu
  span.icon filter_list
  span.icon room_service
  .search-group
    .form-group-green
      transition(name='bounce')
        input.form-control.search-input(v-if='search')
    .input-group-addon(@click='search = !search')
      span.icon search
</template>

<script>
export default {
  data () {
    return {
      search: false
    }
  },
  computed: {},
  mounted () {},
  methods: {},
  components: {}
}
</script>

<style lang="less">
.footer-menu {
  height: 45px;
  width: 100%;
  position: fixed;
  z-index: 10;
  bottom: 0;
  left: 0;
  background: white;
  border-top: 1px solid#ddd;
  display: flex;
  font-size: 30px;
  justify-content: flex-end;
  align-items: center;
  color: #666;

  .search-input {
    height: 100%;
    width: 100%;
  }

  span {
    flex-grow: 1;
    text-align: center;
  }

  .search-group {
    .search-input {
      position: absolute;
      left: calc(50% - 20px);
      top: 0;
      height: 40px;
      width: 65vw;
      transform-origin: right;
      z-index: 11;
      transform: translateX(-100%);
      background: white;
    }

    position: relative;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.bounce-enter-active {
  animation: searchIn 570ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
.bounce-leave-active {
  animation: searchOut 570ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
@keyframes searchIn {
  0% {
    width: 0;
  }
  100% {
    width: 65vw;
  }
}
@keyframes searchOut {
  0% {
    width: 65vw;
  }
  100% {
    width: 0;
  }
}
.fadeIcon-enter-active {
    opacity: 1;
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fadeIcon-leave-active {
    opacity: 0;
    transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}

// .search-input-enter, .search-input-leave-active {
//   // padding-left: 10px;
//   // opacity: 0;
// }

// .search-icon-enter-active {
//   opacity: 1;
//   transition: all .3s ease;
// }
// .search-icon-leave-active {
//   opacity: 0;
//   transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
// }

.search-group {
  // width: 100%;
  display: flex;
  flex-direction: row;

  .form-control {
    flex-shrink: 0;
    height: 95%;
    // width: 0;
  }

  .input-group-addon {
    display: flex;
    height: 45px;
    width: 45px;
    justify-content: center;
    align-items: center;
    font-size: 38px;
  }
}
// .search-icon-enter, .search-icon-leave-active {
//   padding-left: 10px;
//   opacity: 0;
// }

</style>
