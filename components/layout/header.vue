<template lang="jade">
.header(v-bind:class="{'active': search}")
  .hamburger(v-bind:class="{'active': search}", @click='clearSearch')
    span
    span
    span
  //- .hamburger(v-bind:class="{'active': search}", v-if='！search', @click='clearSearch')
  //-   span
  //-   span
  //-   span
  .item.searchContent(v-show='search')
    input(placeholder='搜索', v-model='searchText')
  .item(@click='search = !search')
    span.icon search
</template>

<script>
import raf from 'raf'

export default {
  data () {
    return {
      search: false,
      searchText: ''
    }
  },
  watch: {
    searchText(newVal, oldVal) {
      this.$store.commit('searchText', newVal)
    }
  },
  computed: {
  },
  mounted () {
    this.elemHeight = this.$el.offsetHeight
      if (!this.disabled) {
        this.header = document.querySelector('.dishes-content')
        $('.dishes-content').bind('scroll', this._handleScroll)
      }
  },
  methods: {
    clearSearch() {
      if (this.search) {
        this.searchText = ''
        this.search = !this.search
      }
    },
    _handleScroll () {
      raf(this.update)
    },

    _getScrollY () {
      let top
      if (this.header.pageYOffset !== undefined) {
        top = this.header.pageYOffset
      } else if (this.header.scrollTop !== undefined) {
        top = this.header.scrollTop
      } else {
        top = (document.documentElement || document.body.parentNode || document.body).scrollTop
      }

      return top
    },

    update () {
      this.currentScrollY = this._getScrollY()

      const action = checkActions(this)
      let isAction = $('.header').hasClass('action')

      if (action === 'up' && isAction) {
        $('.header').removeClass('action')
      }
      else if (action === 'down' && !isAction) {
        $('.header').addClass('action')
      }

      this.lastScrollY = this.currentScrollY
    }
  },
  components: {
  }
}


function checkActions (states) {
  const direction = states.currentScrollY >= states.lastScrollY ? 'down' : 'up'
  const distanceScrolled = Math.abs(states.currentScrollY - states.lastScrollY)

  if (distanceScrolled > 2) {
    return direction
  }
}

</script>

<style lang="less">
.header {
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  align-items: center;
  background-color: #f9a825;
  position: fixed;
  color: white;
  font-size: 25px;
  transition: all 275ms ease;
  box-shadow: 0 1px 1px #D7D7D7;
  transform: translateY(0);
  min-height: 50px;

  &.action {
    transform: translateY(-100%);
  }

  .searchContent {
    flex-grow: 2;
    padding: 0 20px;
  }
  .item {
    input {
      width: 100%;
      height: 80%;
      border: none;
      display: block;
      font-size: 16px;
      font-family: "Helvetica","Arial",sans-serif;
      margin: 0;
      padding: 4px 0;
      background: 0 0;
      text-align: left;
      color: inherit;
    }
    input:focus {
      outline: none;
    }
  }
  &.active {
    background-color: #fff !important;
    color: #999 !important;;
    .hamburger {
      span {
        background: #999;

      }
    }
  }

  .hamburger {
    width: 20px;
    transform: rotate(0);
    transition: all 275ms ease;

    &.active {
      cursor: pointer;
      transform: rotate(180deg);

      span:nth-child(1) {
        transform: rotate(45deg) translate(5px, -2px);
        width: 55%;
      }

      span:nth-child(3) {
        transform: rotate(-45deg) translate(5px, 2px);
        width: 55%;
      }
    }

    span {
     display: block;
     margin: 4px auto;
     height: 2px;
     width: 100%;
     background: #fff;
     border-radius: 9px;
     opacity: 1;
     transform: rotate(0deg);
     transition: .25s ease-in-out;
   }
  }
}


</style>
