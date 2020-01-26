<template>
  <nav class="panel">
    <p class="panel-heading">3D Model Options</p>
    <div class="panel-block">
      <div class="columns" style="width: 100%">
        <div class="column">
          <div class="model-options-title">
            <div class="title is-size-5">Base</div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-small">
              <label class="label">Width</label>
            </div>
            <div class="field-body">
              <div class="field has-addons">
                <div class="control">
                  <input class="input is-small" type="number" v-model.number="options.base.width" />
                </div>
                <p class="control">
                  <a class="button is-static is-small">{{unit}}</a>
                </p>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-small">
              <label class="label">Depth</label>
            </div>
            <div class="field-body">
              <div class="field has-addons">
                <div class="control">
                  <input class="input is-small" type="number" v-model.number="options.base.depth" />
                </div>
                <p class="control">
                  <a class="button is-static is-small">{{unit}}</a>
                </p>
              </div>
            </div>
          </div>

          <!-- Border Settings -->
          <div class="field is-horizontal">
            <div class="field-label is-small">
              <label class="label">Border</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <label class="checkbox">
                    <input type="checkbox" v-model="options.base.hasBorder" />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="field is-horizontal" v-if="options.base.hasBorder">
            <div class="field-label is-small">
              <label class="label">Border Width</label>
            </div>
            <div class="field-body">
              <div class="field has-addons">
                <div class="control">
                  <input
                    class="input is-small"
                    type="number"
                    v-model.number="options.base.borderWidth"
                  />
                </div>
                <p class="control">
                  <a class="button is-static is-small">{{unit}}</a>
                </p>
              </div>
            </div>
          </div>
          <div class="field is-horizontal" v-if="options.base.hasBorder">
            <div class="field-label is-small">
              <label class="label">Border Depth</label>
            </div>
            <div class="field-body">
              <div class="field has-addons">
                <div class="control">
                  <input
                    class="input is-small"
                    type="number"
                    v-model.number="options.base.borderDepth"
                  />
                </div>
                <p class="control">
                  <a class="button is-static is-small">{{unit}}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="model-options-title">
            <div class="title is-size-5">QR Code</div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-small">
              <label class="label">Depth</label>
            </div>
            <div class="field-body">
              <div class="field has-addons">
                <div class="control">
                  <input class="input is-small" type="number" v-model.number="options.code.depth" />
                </div>
                <p class="control">
                  <a class="button is-static is-small">{{unit}}</a>
                </p>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-small">
              <label class="label">Margin</label>
            </div>
            <div class="field-body">
              <div class="field has-addons">
                <div class="control">
                  <input class="input is-small" type="number" v-model.number="options.code.margin" />
                </div>
                <p class="control">
                  <a class="button is-static is-small">{{unit}}</a>
                </p>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-small">
              <label class="label">Block Style</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control has-icons-left">
                  <div class="select is-small">
                    <select v-model="options.code.qrcodeBlockStyle">
                      <option>square</option>
                      <option>round</option>
                    </select>
                    <span class="icon is-small is-left">
                      <i class="fa fa-shapes"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-small">
              <label class="label">Block Size</label>
            </div>
            <div class="field-body">
              <div class="field has-addons">
                <div class="control">
                  <input
                    class="input is-small"
                    type="number"
                    v-model.number="options.code.blockSizeMultiplier"
                  />
                </div>
                <p class="control">
                  <a class="button is-static is-small">%</a>
                </p>
                <span
                  class="help-icon icon has-text-info"
                  title="This settings modifies the size of the individual QR code blocks.
Play around with this value to achieve unique visual looks but keep in mind that this could impact readability of the QR code.
Check the preview with your phone before printing to see if you have gone too far.

Stay at 100% if you are not sure.
If you increase this value above 100% (e.g. 120%) the blocks will form connected islands that make the QR code easier to print."
                >
                  <i class="fas fa-info-circle"></i>
                </span>
              </div>
            </div>
          </div>

          <!-- Icon Settings -->
          <div class="field is-horizontal">
            <div class="field-label is-small">
              <label class="label">Icon</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <div class="dropdown is-hoverable">
                    <div class="dropdown-trigger">
                      <button class="button is-small" aria-haspopup="true" aria-controls="dropdown-menu2">
                        <span class="icon is-small">
                          <i class="fa fa-icons" aria-hidden="true"></i>
                        </span>
                        <span>{{options.code.iconName}}</span>
                        <span class="icon is-small">
                          <i class="fas fa-angle-down" aria-hidden="true"></i>
                        </span>
                      </button>
                    </div>
                    <div class="dropdown-menu" id="dropdown-menu2" role="menu">
                      <div class="dropdown-content" id="dropdown-content2">
                        <div class="columns is-multiline">
                          <div class="column is-4">
                            <div class="no-icon icon-item dropdown-item is-vcentered" @click="iconSelected('none')">
                              <span class="title is-size-7">no icon</span>
                            </div>
                          </div>
                          <div class="column is-4" v-for="icon in icons" :key="icon">
                            <div class="icon-item dropdown-item is-vcentered" @click="iconSelected(icon)">
                              <img width="18" height="18" :src="'icons/' + icon + '.svg'" loading="lazy" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <object
                    type="image/svg+xml"
                    id="icon-preview"
                    width="32"
                    height="32"
                    :data="'icons/' + options.code.iconName + '.svg'"
                    v-if="options.code.iconName !== 'none'"
                  />
                  <div class="is-size-7" v-if="options.code.iconName !== 'none'">
                    Icons by Fontawesome
                    <a href="https://fontawesome.com/license/free" target="_blank">CC BY 4.0</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="field is-horizontal" v-if="options.code.iconName !== 'none'">
            <div class="field-label is-small">
              <label class="label">Icon Size</label>
            </div>
            <div class="field-body">
              <div class="field has-addons">
                <div class="control">
                  <input
                    class="input is-small"
                    type="number"
                    v-model.number="options.code.iconSizeRatio"
                  />
                </div>
                <p class="control">
                  <a class="button is-static is-small">%</a>
                </p>
                <span
                  class="help-icon icon has-text-info"
                  title="The size of the icon relative to the total width of the QR Code.
The icon abuses the inbuilt error correction of the qr code. If it is too big the code may not be readable.
If you want to have a big icon but your phone can't read the QR code you can try to increase the Error Correction Level."
                >
                  <i class="fas fa-info-circle"></i>
                </span>
              </div>
            </div>
          </div>


        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Panel3dOptions',
  props: {
    options: Object,
    unit: String,
  },
  data() {
    return {
      icons: [
        'wifi',
        'user',
        'user-plus',
        'key',
        'mouse-pointer',
        'globe',
        'bookmark',
        'bubble',
        'marker',
        'map',
        'envelope',
        'facebook',
        'linkedin',
        'twitter',
        'paypal',
        'share',
        'share-alt',
        'calendar',
        'phone',
        'music',
        'play',
        'exclamation',
        'info',
        'home',
        'heart',
        'check',
        'lightbulb',
        'star',
        'thumbs-up',
        'thumbs-down',
        'bolt',
        'moon',
      ],
    };
  },
  methods: {
    iconSelected(icon) {
      this.options.code.iconName = icon;
    },
  },
};
</script>

<style>
.help-icon {
  margin-top: 3px;
  margin-left: 5px;
}

.model-options-title {
  margin: 0 0 10px 5px;
  padding-bottom: 7px;
  border-bottom: 2px solid whitesmoke;
}

#icon-preview {
  margin-left: 15px;
}

.icon-item {
  border-radius: 10px;
}

.icon-item>img {
  width: 18px;
  height: 18px;
}

.icon-item:hover {
  background: whitesmoke;
  cursor: pointer;
}

.icon-item.no-icon {
  padding: 5px;
}

#dropdown-content2 {
  width: 240px;
  padding: 20px;
}
</style>
