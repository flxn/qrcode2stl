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
                  <input class="input is-small" type="number" v-model.number="options.base.width" @change="options.base.height = options.base.width * 0.25" />
                </div>
                <p class="control">
                  <a class="button is-static is-small">{{unit}}</a>
                </p>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-small">
              <label class="label">{{$t('height')}}</label>
            </div>
            <div class="field-body">
              <div class="field has-addons">
                <div class="control">
                  <input class="input is-small" type="number" v-model.number="options.base.height" :title="$t('spotifyCodeHeightInfo')"/>
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
          <div class="field is-horizontal" v-if="options.base.hasBorder">
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
          <div class="field is-horizontal" v-if="options.base.hasBorder">
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
          <div class="field is-horizontal" v-if="options.base.hasText">
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
          <div class="field is-horizontal" v-if="options.base.hasText">
            <div class="field-label is-small">
              <label class="label">{{$t('text')}} {{$t('content')}}</label>
            </div>
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <input
                    class="input is-small"
                    v-model="options.base.textMessage"
                    :placeholder="$t('theText')"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="field is-horizontal" v-if="options.base.hasText">
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
          <div class="field is-horizontal" v-if="options.base.hasText">
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
          <div class="field is-horizontal" v-if="options.base.hasText">
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

        <!-- Right Column -->
        <div class="column">
          <div class="model-options-title">
            <div class="title is-size-5">Spotify Code</div>
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

          <!-- Skyraper Mode -->
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
          <div class="field is-horizontal" v-if="options.code.cityMode">
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
          <div class="field is-horizontal" v-if="options.code.cityMode">
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
    return {};
  },
  methods: {},
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
