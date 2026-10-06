<template>
  <div
    class="ui-collapse"
    :class="{ 'is-open': open, 'is-settled': settled }"
    :aria-hidden="open ? 'false' : 'true'"
    @transitionend.self="onTransitionEnd"
  >
    <div class="ui-collapse__inner">
      <div class="ui-collapse__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UiCollapse',
  props: {
    open: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      settled: this.open,
    };
  },
  watch: {
    open() {
      this.settled = false;
    },
  },
  methods: {
    onTransitionEnd(event) {
      if (event.propertyName === 'grid-template-rows' && this.open) {
        this.settled = true;
      }
    },
  },
};
</script>

<style>
.ui-collapse {
  display: grid;
  grid-template-rows: 0fr;
  /* cancels the parent grid gap while collapsed */
  margin-top: calc(-1 * var(--stack-gap, 7px));
  transition: grid-template-rows 280ms var(--ease-out), margin-top 280ms var(--ease-out);
}

.ui-collapse.is-open {
  grid-template-rows: 1fr;
  margin-top: 0;
}

.ui-collapse__inner {
  min-height: 0;
  overflow: hidden;
}

/* once fully open, let focus rings and popovers overflow */
.ui-collapse.is-settled > .ui-collapse__inner {
  overflow: visible;
}

.ui-collapse__content {
  display: grid;
  gap: var(--stack-gap, 7px);
  opacity: 0;
  visibility: hidden;
  transition: opacity 160ms ease, visibility 0s linear 280ms;
}

.ui-collapse.is-open .ui-collapse__content {
  opacity: 1;
  visibility: visible;
  transition: opacity 220ms ease 60ms, visibility 0s linear 0s;
}
</style>
