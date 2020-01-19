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
              <label class="label">Height</label>
            </div>
            <div class="field-body">
              <div class="field has-addons">
                <div class="control">
                  <input class="input is-small" type="number" v-model.number="options.base.height" />
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

Tip: If you increase this value above 100% (e.g. 120%) the blocks will form connected islands that make the QR code easier to print."
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
};
</script>

<style>
.help-icon {
  margin-top: 3px;
  margin-left: 5px;
}
</style>
