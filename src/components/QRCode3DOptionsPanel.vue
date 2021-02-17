<template>
  <nav class="panel">
    <p class="panel-heading">{{$t('modelOptions')}}</p>
    <div class="panel-block">
      <div class="columns" style="width: 100%">
        <div class="column">
          <div class="model-options-title">
            <div class="title is-size-5">{{$t('base')}}</div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-small">
              <label class="label">{{$t('shape')}}</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control has-icons-left">
                  <div class="select is-small">
                    <select v-model="options.base.shape">
                      <option value="rectangle">{{$t('rectangle')}}</option>
                      <option value="roundedRectangle">{{$t('roundedRectangle')}}</option>
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
              <label class="label">{{$t('width')}}</label>
            </div>
            <div class="field-body">
              <div class="field has-addons">
                <div class="control">
                  <input class="input is-small" type="number" v-model.number="options.base.width" @change="options.base.height = options.base.width" />
                </div>
                <p class="control">
                  <a class="button is-static is-small">{{unit}}</a>
                </p>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-small">
              <label class="label">{{$t('depth')}}</label>
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
          <div class="field is-horizontal" v-if="options.base.shape === 'roundedRectangle'">
            <div class="field-label is-small">
              <label class="label">{{$t('cornerRadius')}}</label>
            </div>
            <div class="field-body">
              <div class="field has-addons">
                <div class="control">
                  <input
                    class="input is-small"
                    type="number"
                    v-model.number="options.base.cornerRadius"
                  />
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
              <label class="label">{{$t('border')}}</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <label class="checkbox">
                    <input type="checkbox" v-model="options.base.hasBorder" />
                    <span class="is-size-7"><i class="fa fa-border-all"></i> {{$t("borderAroundBase")}}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="subsection" v-if="options.base.hasBorder">
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label">{{$t('border')}} {{$t('width')}}</label>
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
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label">{{$t('border')}} {{$t('depth')}}</label>
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

          <!-- Text Settings -->
          <div class="field is-horizontal">
            <div class="field-label is-small">
              <label class="label">{{$t('text')}}</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <label class="checkbox">
                    <input type="checkbox" v-model="options.base.hasText" />
                    <span class="is-size-7"><i class="fa fa-font"></i> {{$t('textOnEdge')}}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="subsection" v-if="options.base.hasText">
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label">{{$t('text')}} {{$t('placement')}}</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control has-icons-left">
                    <div class="select is-small">
                      <select v-model="options.base.textPlacement">
                        <option value="top">{{$t('top')}}</option>
                        <option value="bottom">{{$t('bottom')}}</option>
                      </select>
                      <span class="icon is-small is-left">
                        <i class="fa fa-arrows-alt-v"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label">{{$t('text')}} {{$t('content')}}</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <div class="buttons are-small mb-0 is-pulled-right">
                      <button :class="{'button': true, 'is-primary': options.base.textAlign == 'left'}" @click="options.base.textAlign = 'left'">
                        <span class="icon is-small">
                          <i class="fas fa-align-left"></i>
                        </span>
                      </button>
                      <button :class="{'button': true, 'is-primary': options.base.textAlign == 'center'}" @click="options.base.textAlign = 'center'">
                        <span class="icon is-small">
                          <i class="fas fa-align-center"></i>
                        </span>
                      </button>
                      <button :class="{'button': true, 'is-primary': options.base.textAlign == 'right'}" @click="options.base.textAlign = 'right'">
                        <span class="icon is-small">
                          <i class="fas fa-align-right"></i>
                        </span>
                      </button>
                    </div>
                    <textarea
                      class="textarea is-small"
                      rows=3
                      v-model="options.base.textMessage"
                      :placeholder="$t('theText')"
                    />
                    <p class="help content">
                      {{$t('fontInfoText')}}<br/>
                      <i class="fas fa-italic"></i> {{$t('italicInfoText')}}<br/>
                      <i class="fas fa-bold"></i> {{$t('boldInfoText')}}<br/>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label">{{$t('text')}} {{$t('size')}}</label>
              </div>
              <div class="field-body">
                <div class="field has-addons">
                  <div class="control">
                    <input
                      class="input is-small"
                      type="number"
                      v-model.number="options.base.textSize"
                    />
                  </div>
                  <p class="control">
                    <a class="button is-static is-small">{{unit}}</a>
                  </p>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label">{{$t('text')}} {{$t('margin')}}</label>
              </div>
              <div class="field-body">
                <div class="field has-addons">
                  <div class="control">
                    <input
                      class="input is-small"
                      type="number"
                      v-model.number="options.base.textMargin"
                    />
                  </div>
                  <p class="control">
                    <a class="button is-static is-small">{{unit}}</a>
                  </p>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label">{{$t('text')}} {{$t('depth')}}</label>
              </div>
              <div class="field-body">
                <div class="field has-addons">
                  <div class="control">
                    <input
                      class="input is-small"
                      type="number"
                      v-model.number="options.base.textDepth"
                    />
                  </div>
                  <p class="control">
                    <a class="button is-static is-small">{{unit}}</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Keychain Settings -->
          <div class="field is-horizontal">
            <div class="field-label is-small">
              <label class="label">{{$t('keychain')}}</label>
            </div>
            <div class="field-body">
              <div class="control">
                <label class="checkbox">
                  <div class="field">
                    <input type="checkbox" v-model="options.base.hasKeychainAttachment" />
                    <span class="is-size-7"><i class="fa fa-key"></i> {{$t('keychainHelp')}}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div class="subsection" v-if="options.base.hasKeychainAttachment">
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label">{{$t('keychain')}} {{$t('placement')}}</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control has-icons-left">
                    <div class="select is-small">
                      <select v-model="options.base.keychainPlacement">
                        <option value="top">{{$t('top')}}</option>
                        <option value="left">{{$t('left')}}</option>
                        <option value="topLeft">{{$t('top')}}-{{$t('left')}} {{$t('corner')}}</option>
                      </select>
                      <span class="icon is-small is-left">
                        <i class="fa fa-arrows-alt-v"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label">{{$t('keychainHoleDiameter')}}</label>
              </div>
              <div class="field-body">
                <div class="field has-addons">
                  <div class="control">
                    <input
                      class="input is-small"
                      type="number"
                      v-model.number="options.base.keychainHoleDiameter"
                    />
                  </div>
                  <p class="control">
                    <a class="button is-static is-small">{{unit}}</a>
                  </p>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label">{{$t('mirrorHoles')}}</label>
              </div>
              <div class="field-body">
                <div class="control">
                  <label class="checkbox">
                    <div class="field">
                      <input type="checkbox" v-model="options.base.mirrorHoles" />
                      <span class="is-size-7">{{$t('mirrorHolesHelp')}}</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- NFC Tag Section -->
          <div class="field is-horizontal">
            <div class="field-label is-small">
              <label class="label">{{$t('nfcIndentation')}}</label> <span class="tag is-danger is-light">NEW</span>
            </div>
            <div class="field-body">
              <div class="control">
                <label class="checkbox">
                  <div class="field">
                    <input type="checkbox" v-model="options.base.hasNfcIndentation" />
                    <span class="is-size-7"><i class="fa fa-wifi"></i> {{$t('nfcIndentationHelp')}}</span>
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div class="subsection" v-if="options.base.hasNfcIndentation">
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label">{{$t('indentation')}} {{$t('shape')}}</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control has-icons-left">
                    <div class="select is-small">
                      <select v-model="options.base.nfcIndentationShape">
                        <option value="square">{{$t('square')}}</option>
                        <option value="round">{{$t('round')}}</option>
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
                <label class="label">{{$t('indentation')}} {{$t('size')}}</label>
              </div>
              <div class="field-body">
                <div class="field has-addons">
                  <div class="control">
                    <input
                      class="input is-small"
                      type="number"
                      v-model.number="options.base.nfcIndentationSize"
                    />
                  </div>
                  <p class="control">
                    <a class="button is-static is-small">{{unit}}</a>
                  </p>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label">{{$t('indentation')}} {{$t('depth')}}</label>
              </div>
              <div class="field-body">
                <div class="field has-addons">
                  <div class="control">
                    <input
                      class="input is-small"
                      type="number"
                      v-model.number="options.base.nfcIndentationDepth"
                    />
                  </div>
                  <p class="control">
                    <a class="button is-static is-small">{{unit}}</a>
                  </p>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label">{{$t('hidden')}}</label>
              </div>
              <div class="field-body">
                <div class="control">
                  <label class="checkbox">
                    <div class="field">
                      <input type="checkbox" v-model="options.base.nfcIndentationHidden" />
                      <span class="is-size-7"><i class="fa fa-layer-group"></i> {{$t('nfcIndentationHiddenHelp')}}</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- Right Column -->
        <div class="column">
          <div class="model-options-title">
            <div class="title is-size-5">QR Code</div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-small">
              <label class="label">{{$t('invert')}}</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <label class="checkbox">
                    <input type="checkbox" v-model="options.code.invert" />
                    <span class="is-size-7"><i class="fa fa-retweet"></i> {{$t("invertText")}}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-small">
              <label class="label">{{$t('depth')}}</label>
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
              <label class="label">{{$t('margin')}}</label>
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
              <label class="label">{{$t('block')}} {{$t('size')}}</label>
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
                  :title="$t('blockSizeHelp')">
                  <i class="fas fa-info-circle"></i>
                </span>
              </div>
            </div>
          </div>

          <!-- Icon Settings -->
          <div class="field is-horizontal">
            <div class="field-label is-small">
              <label class="label">{{$t('icon')}}</label>
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
                              <span class="title is-size-7">{{$t('noIcon')}}</span>
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
                    <br/>
                    <p class="has-text-danger">
                      This is a beta feature.<br/>
                      Error Correction will be set to high if you use icons.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="field is-horizontal" v-if="options.code.iconName !== 'none'">
            <div class="field-label is-small">
              <label class="label">{{$t('icon')}} {{$t('size')}}</label>
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
                  :title="$t('iconSizeHelp')"
                >
                  <i class="fas fa-info-circle"></i>
                </span>
              </div>
            </div>
          </div>

          <!-- Skyscraper Mode -->
          <div class="field is-horizontal" v-if="!options.code.invert">
            <div class="field-label is-small">
              <label class="label">{{$t('cityMode')}}</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <label class="checkbox">
                    <input type="checkbox" v-model="options.code.cityMode" />
                    <span class="is-size-7"><i class="fa fa-city"></i> {{$t("cityModeText")}}</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div class="subsection" v-if="options.code.cityMode">
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label">{{$t('depth')}} {{$t('min')}}</label>
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
                <label class="label">{{$t('depth')}} {{$t('max')}}</label>
              </div>
              <div class="field-body">
                <div class="field has-addons">
                  <div class="control">
                    <input class="input is-small" type="number" v-model.number="options.code.depthMax" />
                  </div>
                  <p class="control">
                    <a class="button is-static is-small">{{unit}}</a>
                  </p>
                </div>
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
  name: 'QRCode3DOptionsPanel',
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
