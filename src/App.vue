<template lang="jade">
#app
  main-content
</template>

<script>
import mainContent from './components/main.vue'

export default {
  data () {
    return {}
  },
  computed: {},
  mounted () {

  },
  methods: {},
  components: {
    mainContent
  }
}
</script>

<style lang="css">
html {
  font-family: Roboto,"Helvetica Neue",Helvetica,Arial,sans-serif;
  background-color: #fff;
  width: 100%;
  height: 100%;
  -webkit-overflow-scrolling: touch;

}
body {
  width: 100%;
  height: 100%;
  -webkit-overflow-scrolling: touch;

}

div {
  -webkit-overflow-scrolling: touch;
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

.flyIn {
  animation: flyIn 600ms cubic-bezier(0.4, 0.0, 0.2, 1);
  -webkit-animation: flyIn 600ms cubic-bezier(0.4, 0.0, 0.2, 1);
}

@keyframes flyIn {
  70% {
    opacity: 1;
    transform: scale(0.7, 0.7) translateX(-5px);
  }
  99% {
    opacity: 0;
    visibility: visible;
  }
  100% {
    opacity: 0;
    visibility: hidden;
    transform: scale(0.1, 0.1) translateX(-5px);
    top: 2px;
    left: 50%;
  }
}

@-webkit-keyframes flyIn {
  70% {
    opacity: 1;
    transform: scale(0.7, 0.7) translateX(-5px);
  }
  99% {
    opacity: 0;
    visibility: visible;
  }
  100% {
    opacity: 0;
    visibility: hidden;
    transform: scale(0.1, 0.1) translateX(-5px);
    top: 2px;
    left: 50%;
  }
}
</style>
