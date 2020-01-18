<template>
  <div id="option-tabs" class="panel-tabs tabs">
    <ul>
      <li v-bind:class="{ 'is-active': activeTabIndex === 0 }" @click="$emit('tabChanged', 0)">
        <a>
          <span class="icon is-small">
            <i class="fas fa-font" aria-hidden="true"></i>
          </span>
          <span>Text/URL</span>
        </a>
      </li>
      <li v-bind:class="{ 'is-active': activeTabIndex === 1 }" @click="$emit('tabChanged', 1)">
        <a>
          <span class="icon is-small">
            <i class="fas fa-wifi" aria-hidden="true"></i>
          </span>
          <span>Wifi</span>
        </a>
      </li>
      <li v-bind:class="{ 'is-active': activeTabIndex === 2 }" @click="$emit('tabChanged', 2)">
        <a>
          <span class="icon is-small">
            <i class="far fa-envelope" aria-hidden="true"></i>
          </span>
          <span>E-Mail</span>
        </a>
      </li>
      <li v-bind:class="{ 'is-active': activeTabIndex === 3 }" @click="$emit('tabChanged', 3)">
        <a>
          <span class="icon is-small">
            <i class="far fa-address-card" aria-hidden="true"></i>
          </span>
          <span>Contact (vCard)</span>
        </a>
      </li>
      <li v-bind:class="{ 'is-active': activeTabIndex === 4 }" @click="$emit('tabChanged', 4) ">
        <a>
          <span class="icon is-small">
            <i class="far fa-comment" aria-hidden="true"></i>
          </span>
          <span>SMS</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'TabsQR',
  props: {
    activeTabIndex: Number,
  },
  data() {
    return {

    };
  },
  methods: {

  },
};
</script>

<style>
</style>
