<template lang="jade">
.stepper-vert
  .stepper-vert-inner
    .stepper.done
      .stepper-step
        i.icon.stepper-step-icon check
        span.stepper-step-num 1
      span.stepper-text Step 1
    .stepper.active
      .stepper-step
        i.icon.stepper-step-icon check
        span.stepper-step-num 2
      span.stepper-text
        | Step 2
        br
        small.stepper-text-sub.text-black-hint Optional
    .stepper-vert-content
      p.h5 Vertical Steppers
      p
        | Vertical steppers are designed for narrow screen sizes. They are ideal for mobile.
      p
        | Vertical steppers can be used in mobile as-is. Simply ensure the contents for each step are responsive.
      p
        a.btn.btn-brand.margin-right-sm.waves-attach.waves-light.waves-effect(href='javascript:void(0)') Continue
        a.btn.btn-flat.margin-right-sm.waves-attach.waves-effect(href='javascript:void(0)') Cancel
    .stepper
      .stepper-step
        i.icon.stepper-step-icon check
        span.stepper-step-num 3
      span.stepper-text Step 3

</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {},
  mounted () {},
  methods: {},
  components: {}
}
</script>

<style lang="css">
</style>
