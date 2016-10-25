<template lang="jade">
.footer-menu
  span.icon filter_list
  span.icon
  span.icon room_service
  .input-animate(v-bind:class="{'active': search}")
    transition(name='bounce')
      input.search-input(v-if='search')

    span.icon(@click='search = !search') search
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

  .input-animate {
    height: 45px;
    // width: e('calc(100vw - 30px)');
    width: 45px;
    border-radius: 30px;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    background: white;
    left: 50%;
    transform: translateX(-50%);
    overflow: hidden;

    .icon {
      transition: all 570ms cubic-bezier(0.4, 0, 0.2, 1);
    }
    .search-input {
      width: e('calc(100% - 100px)');
      margin: 0 auto;
      border: 0 solid#fff;
    }
  }

  .active {
    width: e('calc(100vw - 30px)');
    transform: translateX(-50%) translateY(-60px);
    visibility: visible;
    animation: searchActive 570ms cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 1px 3px 3px -2px;
    justify-content: flex-start;

    .icon {
      position: absolute;
      right: 10px;
    }
  }

  span {
    flex-grow: 1;
    text-align: center;
  }

  .search-group {
    position: relative;
  }
}

.bounce-enter-active {
  animation: searchIn 570ms cubic-bezier(0.4, 0.0, 0.2, 1);
}
.bounce-leave-active {
  animation: searchOut 570ms cubic-bezier(0.4, 0.0, 0.2, 1);
  // animation-delay: 375ms;
}
@keyframes searchIn {
  0% {
    width: 0;
    opacity: 0;
  }
  100% {
    width: e('calc(100% - 30px)');
    opacity: 1;
  }
}
@keyframes searchOut {
  0% {
    width: e('calc(100% - 30px)');
    opacity: 1;
  }
  100% {
    width: 0;
    opacity: 0;
  }
}

@keyframes searchActive {
  0% {
    width: 45px;
    transform: translateX(-50%) translateY(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
    visibility: visible;
  }
  50% {
    width: 45px;
    transform: translateX(-50%) translateY(-60px);
  }
  100% {
    width: e('calc(100vw - 30px)');
    // transform: translateX(-50%) translateY(-80px);
    visibility: visible;
  }
}

@keyframes searchGroupIn {
  0% {
    transform: translateX(-50%) translateY(-80px);

  }
  100% {
    transform: translateX(-50%) translateY(0);
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
