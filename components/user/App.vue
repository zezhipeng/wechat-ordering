<template lang="jade">
#app
  router-view
  .swiper-menu
    router-link.menu-item(to='/account')
      span.icon account_box
    router-link.menu-item(to='/menu')
      span.icon restaurant_menu
    router-link.menu-item.shoppingCart(to='/order' v-bind:data-badge='orderLength')
      span.icon.shoppingCart shopping_cart
</template>

<script>


export default {
  data () {
    return {
    }
  },
  computed: {
    orderLength() {
      if (this.$store.getters.orderLength) {
        return this.$store.getters.orderLength
      }
      else {
        return null
      }
    }
  },
  mounted () {

  },
  methods: {

  },
  components: {

  }
}
</script>

<style lang="less">
html {
  font-family: Roboto,"Helvetica Neue",Helvetica,Arial,sans-serif;
  background-color: #f3f3f3;
  width: 100%;
  height: 100%;
  -webkit-overflow-scrolling: touch;

}
body {
  width: 100%;
  height: 100%;
  -webkit-overflow-scrolling: touch;
  padding-bottom: 55px !important;
  background-color: #f3f3f3 !important;

}

div {
  -webkit-overflow-scrolling: touch;
}

.swiper-menu {
  box-shadow: 0 -1px 1px #D7D7D7;
  display: flex;
  height: 50px;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  background-color: #f9a825;
  color: white;
  font-size: 30px;
  position: fixed;
  bottom: 0;
  left: 0;

  a {
    color: #fff !important;
  }
}

.shoppingCart {
  position: relative;
}

.shoppingCart[data-badge]:after {
  content: attr(data-badge);
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-justify-content: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-align-content: center;
  -ms-flex-line-pack: center;
  align-content: center;
  -webkit-align-items: center;
  -ms-flex-align: center;
  align-items: center;
  position: absolute;
  top: -11px;
  right: -14px;
  font-family: "Roboto","Helvetica","Arial",sans-serif;
  font-weight: 600;
  font-size: 12px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #ff4081;
  color: #fff;
}

.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-active {
  opacity: 0;
  padding-top: 20px;
}

.swiper-fade-enter-active {
  transition: all .3s ease;
}
.swiper-fade-leave-active {
  transition: all .3s ease;
}
.swiper-fade-enter, .swiper-fade-leave-active {
  opacity: 0;
}


</style>
