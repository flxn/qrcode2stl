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
                        <option value="left">{{$t('left')}}</option>
                        <option value="right">{{$t('right')}}</option>
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
                    <div v-if="options.base.textPlacement === 'top' || options.base.textPlacement === 'bottom'" class="buttons are-small mb-0 is-pulled-right">
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
                    <div v-if="options.base.textPlacement === 'left' || options.base.textPlacement === 'right'" class="buttons are-small mb-0 is-pulled-right">
                      <button :class="{'button': true, 'is-primary': options.base.textAlign == 'left'}" @click="options.base.textAlign = 'left'">
                        <span class="icon is-small">
                          <i class="fas fa-arrow-up"></i>
                        </span>
                      </button>
                      <button :class="{'button': true, 'is-primary': options.base.textAlign == 'center'}" @click="options.base.textAlign = 'center'">
                        <span class="icon is-small">
                          <i class="fas fa-equals"></i>
                        </span>
                      </button>
                      <button :class="{'button': true, 'is-primary': options.base.textAlign == 'right'}" @click="options.base.textAlign = 'right'">
                        <span class="icon is-small">
                          <i class="fas fa-arrow-down"></i>
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
                <label class="label">{{$t("keychainMaterialThickness")}}</label>
              </div>
              <div class="field-body">
                <div class="field has-addons">
                  <div class="control">
                    <input
                      class="input is-small"
                      type="number"
                      step="0.1"
                      min="0"
                      v-model.number="options.base.keychainMaterialThickness"
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
                <label class="label">{{$t("keychainOffset")}}</label>
              </div>
              <div class="field-body">
                <div class="field has-addons">
                  <div class="control">
                    <input
                      class="input is-small"
                      type="number"
                      step="0.1"
                      min="0"
                      v-model.number="options.base.keychainOffset"
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
              <label class="label">{{$t('nfcIndentation')}}</label>
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
                        <!-- Custom Icon Upload Section -->
                        <div class="custom-icon-section">
                          <div class="field">
                            <label class="label is-size-7">{{$t('uploadCustomIcon')}}</label>
                            <div class="file is-small">
                              <label class="file-label">
                                <input 
                                  class="file-input" 
                                  type="file" 
                                  accept=".svg" 
                                  @change="handleCustomIconUpload"
                                  ref="customIconInput"
                                />
                                <span class="file-cta">
                                  <span class="file-icon">
                                    <i class="fas fa-upload"></i>
                                  </span>
                                  <span class="file-label is-size-7">
                                    {{$t('selectSvgFile')}}
                                  </span>
                                </span>
                              </label>
                            </div>
                          </div>
                          <hr class="dropdown-divider">
                        </div>
                        
                        <!-- Icon Grid -->
                        <div class="columns is-multiline">
                          <div class="column is-4">
                            <div class="no-icon icon-item dropdown-item is-vcentered" @click="iconSelected('none')">
                              <span class="title is-size-7">{{$t('noIcon')}}</span>
                            </div>
                          </div>
                          <!-- Default icons -->
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
                    :data="getIconPreviewUrl()"
                    v-if="options.code.iconName !== 'none'"
                  />
                  <div class="is-size-7" v-if="options.code.iconName !== 'none'">
                    <span v-if="!options.code.iconName.startsWith('custom-')">
                      Icons by Fontawesome
                      <a href="https://fontawesome.com/license/free" target="_blank">CC BY 4.0</a>
                    </span>
                    <span v-else>
                      Custom uploaded icon
                    </span>
                    <br/>
                    <p class="has-text-danger">
                      This is a beta feature.<br/>
                      Error Correction will be set to high if you use icons.
                    </p>
                    <p class="has-text-info" v-if="showIconCompatibilityWarning">
                      <i class="fas fa-info-circle"></i> {{ iconCompatibilityMessage }}
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

          <!-- Monochrome Logo Info -->
          <div class="field is-horizontal" v-if="options.code.iconName.startsWith('custom-')">
            <div class="field-body">
              <div class="field">
                <div class="notification is-info is-light">
                  <i class="fas fa-info-circle"></i>
                  {{$t('monochromeLogoInfo')}}
                </div>
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

          <div class="field is-horizontal">
            <div class="field-label is-small">
              <label class="label">{{$t('compatibilityMode')}}</label>
            </div>
            <div class="field-body">
              <div class="field has-addons">
                <div class="control">
                  <label class="checkbox">
                    <input type="checkbox" v-model="options.code.compatibilityMode" />
                    <span class="is-size-7">{{$t("compatibilityModeLabel")}}</span>
                  </label>
                </div>
                <span
                  class="help-icon icon has-text-info"
                  :title="$t('compatibilityModeHelp')">
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
  name: 'QRCodeModelOptionsPanel',
  props: {
    options: Object,
    unit: String,
    iconCompatibilityStatus: Object,
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
        'instagram',
        'whatsapp',
        'linkedin',
        'twitter',
        'google',
        'snapchat',
        'youtube',
        'tiktok',
        'patreon',
        'spotify',
        'soundcloud',
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
      customIcons: [],
    };
  },
  computed: {
    showIconCompatibilityWarning() {
      // Show warning whenever compatibility mode is active with icons
      return this.iconCompatibilityStatus &&
             this.iconCompatibilityStatus.hasIcon &&
             this.iconCompatibilityStatus.isCompatibilityMode;
    },
    iconCompatibilityMessage() {
      if (!this.showIconCompatibilityWarning) return '';

      const messages = [];

      // Always mention compatibility mode is active
      messages.push(this.$t('iconCompatibleProcessing'));

      if (this.iconCompatibilityStatus.wasSimplified) {
        messages.push(this.$t('iconShapesSimplified'));
      }
      if (this.iconCompatibilityStatus.holesRemoved) {
        messages.push(this.$t('iconHolesRemoved'));
      }

      return `${this.$t('iconCompatibilityWarning')}: ${messages.join(', ')}.`;
    }
  },
  methods: {
    iconSelected(icon) {
      this.options.code.iconName = icon;
    },
    handleCustomIconUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.includes('svg') && !file.name.toLowerCase().endsWith('.svg')) {
        this.$toast.open({
          message: this.$t('invalidSvgFile'),
          type: 'is-danger',
          duration: 3000,
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const svgContent = e.target.result;
          
          // Basic SVG validation
          if (!svgContent.includes('<svg') || !svgContent.includes('</svg>')) {
            this.$toast.open({
              message: this.$t('invalidSvgFile'),
              type: 'is-danger',
              duration: 3000,
            });
            return;
          }

          // Additional SVG validation - check for proper XML structure
          try {
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
            const parseError = svgDoc.querySelector('parsererror');
            if (parseError) {
              throw new Error('Invalid SVG structure');
            }
          } catch (error) {
            this.$toast.open({
              message: this.$t('invalidSvgFile'),
              type: 'is-danger',
              duration: 3000,
            });
            return;
          }

          // Create a centered version for preview
          const centeredSvgContent = this.centerSvgForPreview(svgContent);
          const dataUrl = `data:image/svg+xml;base64,${btoa(centeredSvgContent)}`;
          
          // Store custom icon (use original content for 3D processing, centered for preview)
          const customIcon = {
            name: file.name,
            content: svgContent, // Original for 3D processing
            previewContent: centeredSvgContent, // Centered for preview
            dataUrl: dataUrl,
          };
          
          // Limit to 10 custom icons to prevent memory issues
          if (this.customIcons.length >= 10) {
            this.customIcons.shift(); // Remove oldest icon
          }
          
          this.customIcons.push(customIcon);
          
          // Auto-select the uploaded icon
          const iconIndex = this.customIcons.length - 1;
          this.iconSelected(`custom-${iconIndex}`);
          
          this.$toast.open({
            message: this.$t('customIconUploaded'),
            type: 'is-success',
            duration: 3000,
          });
          
          // Clear the file input
          this.$refs.customIconInput.value = '';
          
        } catch (error) {
          console.error('Error processing SVG file:', error);
          this.$toast.open({
            message: this.$t('iconUploadError'),
            type: 'is-danger',
            duration: 3000,
          });
        }
      };
      
      reader.onerror = () => {
        this.$toast.open({
          message: this.$t('iconUploadError'),
          type: 'is-danger',
          duration: 3000,
        });
      };
      
      reader.readAsText(file);
    },
    getIconPreviewUrl() {
      if (this.options.code.iconName.startsWith('custom-')) {
        const index = parseInt(this.options.code.iconName.replace('custom-', ''));
        if (this.customIcons[index]) {
          return this.customIcons[index].dataUrl;
        }
      }
      return `icons/${this.options.code.iconName}.svg`;
    },
    getCustomIconContent(iconName) {
      if (iconName.startsWith('custom-')) {
        const index = parseInt(iconName.replace('custom-', ''));
        if (this.customIcons[index]) {
          return this.customIcons[index].content;
        }
      }
      return null;
    },
    centerSvgForPreview(svgContent) {
      try {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');
        
        if (!svgElement) return svgContent;
        
        // Get original viewBox
        const viewBox = svgElement.getAttribute('viewBox');
        if (!viewBox) return svgContent;
        
        const [x, y, width, height] = viewBox.split(' ').map(Number);
        
        // Calculate actual content bounds for better centering
        const contentBounds = this.calculateSvgContentBounds(svgElement);
        
        // Use standard FontAwesome viewBox format (512x512)
        const standardSize = 512;
        const newViewBox = `0 0 ${standardSize} ${standardSize}`;
        
        // Calculate scaling based on actual content bounds, not viewBox
        const contentWidth = contentBounds.maxX - contentBounds.minX;
        const contentHeight = contentBounds.maxY - contentBounds.minY;
        
        if (contentWidth === 0 || contentHeight === 0) {
          // Fallback to viewBox-based scaling
          const scaleX = standardSize / width;
          const scaleY = standardSize / height;
          const scale = Math.min(scaleX, scaleY) * 0.7;
          
          const scaledWidth = width * scale;
          const scaledHeight = height * scale;
          const offsetX = (standardSize - scaledWidth) / 2;
          const offsetY = (standardSize - scaledHeight) / 2;
          
          return this.createCenteredSvg(svgDoc, svgContent, scale, offsetX, offsetY, newViewBox);
        }
        
        // Use content-based scaling for better positioning
        const scaleX = (standardSize * 0.7) / contentWidth;
        const scaleY = (standardSize * 0.7) / contentHeight;
        const scale = Math.min(scaleX, scaleY);
        
        // Calculate centering offset based on content bounds
        const scaledContentWidth = contentWidth * scale;
        const scaledContentHeight = contentHeight * scale;
        const offsetX = (standardSize - scaledContentWidth) / 2 - (contentBounds.minX * scale);
        const offsetY = (standardSize - scaledContentHeight) / 2 - (contentBounds.minY * scale);
        
        
        return this.createCenteredSvg(svgDoc, svgContent, scale, offsetX, offsetY, newViewBox);
      } catch (error) {
        console.warn('Error formatting SVG to standard format:', error);
        return svgContent; // Return original if processing fails
      }
    },
    calculateSvgContentBounds(svgElement) {
      const tempSvg = svgElement.cloneNode(true);
      tempSvg.style.position = 'absolute';
      tempSvg.style.visibility = 'hidden';
      tempSvg.style.pointerEvents = 'none';
      document.body.appendChild(tempSvg);
      
      try {
        const visualElements = tempSvg.querySelectorAll('path, rect, circle, ellipse, polygon, polyline, g, text');
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        visualElements.forEach(element => {
          try {
            const bbox = element.getBBox();
            if (bbox && bbox.width > 0 && bbox.height > 0) {
              minX = Math.min(minX, bbox.x);
              minY = Math.min(minY, bbox.y);
              maxX = Math.max(maxX, bbox.x + bbox.width);
              maxY = Math.max(maxY, bbox.y + bbox.height);
            }
          } catch (e) {
            // Skip elements that don't support getBBox
          }
        });
        
        if (minX === Infinity) {
          const rect = tempSvg.getBoundingClientRect();
          minX = 0;
          minY = 0;
          maxX = rect.width;
          maxY = rect.height;
        }
        
        return { minX, minY, maxX, maxY };
      } finally {
        document.body.removeChild(tempSvg);
      }
    },
    createCenteredSvg(svgDoc, originalSvgContent, scale, offsetX, offsetY, newViewBox) {
      try {
        const newSvg = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'svg');
        newSvg.setAttribute('viewBox', newViewBox);
        newSvg.setAttribute('role', 'img');
        newSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        newSvg.setAttribute('aria-hidden', 'true');
        newSvg.setAttribute('focusable', 'false');
        
        const group = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.setAttribute('transform', `translate(${offsetX}, ${offsetY}) scale(${scale})`);
        
        const parser = new DOMParser();
        const originalSvgDoc = parser.parseFromString(originalSvgContent, 'image/svg+xml');
        const originalSvg = originalSvgDoc.querySelector('svg');
        if (originalSvg) {
          const allElements = originalSvg.querySelectorAll('path, rect, circle, ellipse, polygon, polyline, g, defs, style, linearGradient, radialGradient, stop');
          
          allElements.forEach(element => {
            if (element.tagName === 'path') {
              const newPath = svgDoc.createElementNS('http://www.w3.org/2000/svg', 'path');
              newPath.setAttribute('d', element.getAttribute('d'));
              
              const originalFill = element.getAttribute('fill');
              if (originalFill && originalFill !== 'none') {
                newPath.setAttribute('fill', originalFill);
              } else {
                newPath.setAttribute('fill', 'currentColor');
              }
              
              if (element.getAttribute('stroke')) {
                newPath.setAttribute('stroke', element.getAttribute('stroke'));
                newPath.setAttribute('stroke-width', element.getAttribute('stroke-width') || '1');
              }
              
              group.appendChild(newPath);
            } else if (element.tagName === 'g') {
              const clonedGroup = element.cloneNode(true);
              group.appendChild(clonedGroup);
            } else if (['defs', 'style', 'linearGradient', 'radialGradient', 'stop'].includes(element.tagName)) {
              const clonedElement = element.cloneNode(true);
              newSvg.appendChild(clonedElement);
            } else {
              const clonedElement = element.cloneNode(true);
              if (!clonedElement.getAttribute('fill') || clonedElement.getAttribute('fill') === 'none') {
                clonedElement.setAttribute('fill', 'currentColor');
              }
              group.appendChild(clonedElement);
            }
          });
        }
        
        newSvg.appendChild(group);
        
        const result = new XMLSerializer().serializeToString(newSvg);
        return result;
      } catch (error) {
        console.warn('Error creating centered SVG:', error);
        return originalSvgContent;
      }
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
  width: 280px;
  padding: 20px;
}

.custom-icon-section {
  margin-bottom: 15px;
}

.custom-icon-section .file {
  margin-bottom: 0;
}

.custom-icon-section .file-label {
  width: 100%;
}

.custom-icon-section .file-cta {
  width: 100%;
  justify-content: center;
}
</style>
