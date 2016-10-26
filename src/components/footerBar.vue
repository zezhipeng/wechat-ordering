<template lang="jade">
.footer-menu
  span.icon filter_list
  //- .hamburger(v-bind:class="{'active': search}")
  //-   span
  //-   span
  //-   span
  span.icon room_service
  span.icon(@click='searchPage') search
  transition(name='search')
    search-page(v-if='search', v-on:back='searchPage')
</template>

<script>
import searchPage from './searchPage.vue'

export default {
  data () {
    return {
    }
  },
  props: ['search'],
  computed: {},
  mounted () {},
  methods: {
    searchPage () {
      this.$parent.search = !this.$parent.search
    }

  },
  components: {
    searchPage
  }
}
</script>

<style lang="less">
.footer-menu {
  height: 50px;
  width: 100%;
  position: fixed;
  z-index: 10;
  bottom: 0;
  left: 0;
  background: #fff;
  display: flex;
  box-shadow: 0 -2px 2px -1px #ddd;
  font-size: 30px;
  justify-content: space-around;
  align-items: center;
  color: #666;
}

.search-enter-active, .search-leave-active {
  transition: opacity 375ms cubic-bezier(0.4, 0, 0.2, 1);
}
.search-enter, .search-leave-active {
  opacity: 0;
}

  // .hamburger {
	// 	width: 13px;
  //   &.active {
	// 		cursor: pointer;
  //
  //     span:nth-child(1) {
  //       transform: rotate(-45deg) translate(-4px, -2px);
  //       width: 75%;
  //     }
  //
  //     span:nth-child(3) {
  //       transform: rotate(45deg) translate(-3px, 2px);
  //       width: 75%;
  //     }
	// 	}
  //
  //   span {
	// 		display: block;
	// 		margin: 2px auto;
	// 		height: 2px;
	// 		width: 100%;
	// 		background: #fff;
	// 		border-radius: 9px;
	// 		opacity: 1;
	// 		transform: rotate(0deg);
	// 		transition: .25s ease-in-out;
	// 	}
	// }


</style>
