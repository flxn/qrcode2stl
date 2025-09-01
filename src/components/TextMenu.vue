/* eslint-disable import/no-webpack-loader-syntax */
<template>
  <div id="qrcodeMenu">
    <nav class="panel">
      <p class="panel-heading">{{ $t("text") }}</p>

      <!-- Text -->
      <div class="option-pane">
        <!-- Text Settings -->
          <div class="field is-horizontal">
            <div class="field-body">
              <div class="field">
                <div class="control">
                  <textarea
                    class="textarea is-normal"
                    rows="5"
                    v-model="options.base.textMessage"
                    :placeholder="$t('theText')"
                  />
                  <div class="buttons are-small mt-2 is-pulled-right">
                    <button
                      :class="{
                        button: true,
                        'is-primary': options.base.textAlign == 'left',
                      }"
                      @click="options.base.textAlign = 'left'"
                    >
                      <span class="icon is-normal">
                        <i class="fas fa-align-left"></i>
                      </span>
                    </button>
                    <button
                      :class="{
                        button: true,
                        'is-primary': options.base.textAlign == 'center',
                      }"
                      @click="options.base.textAlign = 'center'"
                    >
                      <span class="icon is-normal">
                        <i class="fas fa-align-center"></i>
                      </span>
                    </button>
                    <button
                      :class="{
                        button: true,
                        'is-primary': options.base.textAlign == 'right',
                      }"
                      @click="options.base.textAlign = 'right'"
                    >
                      <span class="icon is-normal">
                        <i class="fas fa-align-right"></i>
                      </span>
                    </button>
                  </div>
                  <p class="help content">
                    {{ $t("fontInfoText") }}<br />
                    <i class="fas fa-italic"></i> {{ $t("italicInfoText")
                    }}<br />
                    <i class="fas fa-bold"></i> {{ $t("boldInfoText") }}<br />
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">{{ $t("text") }} {{ $t("size") }}</label>
            </div>
            <div class="field-body">
              <div class="field has-addons">
                <div class="control">
                  <input
                    class="input is-normal"
                    type="number"
                    v-model.number="options.base.textSize"
                  />
                </div>
                <p class="control">
                  <a class="button is-static is-normal">{{ unit }}</a>
                </p>
              </div>
            </div>
          </div>
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label">{{ $t("text") }} {{ $t("depth") }}</label>
            </div>
            <div class="field-body">
              <div class="field has-addons">
                <div class="control">
                  <input
                    class="input is-normal"
                    type="number"
                    v-model.number="options.base.textDepth"
                  />
                </div>
                <p class="control">
                  <a class="button is-static is-normal">{{ unit }}</a>
                </p>
              </div>
            </div>
          </div>
      </div>
    </nav>

    <!-- 3D Options -->
    <nav class="panel">
      <p class="panel-heading">{{ $t("modelOptions") }}</p>
      <div class="panel-block">
        <div class="columns" style="width: 100%">
          <div class="column">
            <div class="model-options-title">
              <div class="title is-size-5">{{ $t("base") }}</div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label">{{ $t("shape") }}</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control has-icons-left">
                    <div class="select is-small">
                      <select v-model="options.base.shape">
                        <option value="rectangle">{{ $t("rectangle") }}</option>
                        <option value="roundedRectangle">
                          {{ $t("roundedRectangle") }}
                        </option>
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
                <label class="label">{{ $t("width") }}</label>
              </div>
              <div class="field-body">
                <div class="field has-addons">
                  <div class="control">
                    <input
                      class="input is-small"
                      type="number"
                      v-model.number="options.base.width"
                    />
                  </div>
                  <p class="control">
                    <a class="button is-static is-small">{{ unit }}</a>
                  </p>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label">{{ $t("height") }}</label>
              </div>
              <div class="field-body">
                <div class="field has-addons">
                  <div class="control">
                    <input
                      class="input is-small"
                      type="number"
                      v-model.number="options.base.height"
                    />
                  </div>
                  <p class="control">
                    <a class="button is-static is-small">{{ unit }}</a>
                  </p>
                </div>
              </div>
            </div>
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label">{{ $t("depth") }}</label>
              </div>
              <div class="field-body">
                <div class="field has-addons">
                  <div class="control">
                    <input
                      class="input is-small"
                      type="number"
                      v-model.number="options.base.depth"
                    />
                  </div>
                  <p class="control">
                    <a class="button is-static is-small">{{ unit }}</a>
                  </p>
                </div>
              </div>
            </div>
            <div
              class="field is-horizontal"
              v-if="options.base.shape === 'roundedRectangle'"
            >
              <div class="field-label is-small">
                <label class="label">{{ $t("cornerRadius") }}</label>
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
                    <a class="button is-static is-small">{{ unit }}</a>
                  </p>
                </div>
              </div>
            </div>

            <!-- Border Settings -->
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label">{{ $t("border") }}</label>
              </div>
              <div class="field-body">
                <div class="field">
                  <div class="control">
                    <label class="checkbox">
                      <input type="checkbox" v-model="options.base.hasBorder" />
                      <span class="is-size-7"
                        ><i class="fa fa-border-all"></i>
                        {{ $t("borderAroundBase") }}</span
                      >
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="subsection" v-if="options.base.hasBorder">
              <div class="field is-horizontal">
                <div class="field-label is-small">
                  <label class="label"
                    >{{ $t("border") }} {{ $t("width") }}</label
                  >
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
                      <a class="button is-static is-small">{{ unit }}</a>
                    </p>
                  </div>
                </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-small">
                  <label class="label"
                    >{{ $t("border") }} {{ $t("depth") }}</label
                  >
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
                      <a class="button is-static is-small">{{ unit }}</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Keychain Settings -->
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label">{{ $t("keychain") }}</label>
              </div>
              <div class="field-body">
                <div class="control">
                  <label class="checkbox">
                    <div class="field">
                      <input
                        type="checkbox"
                        v-model="options.base.hasKeychainAttachment"
                      />
                      <span class="is-size-7"
                        ><i class="fa fa-key"></i>
                        {{ $t("keychainHelp") }}</span
                      >
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div class="subsection" v-if="options.base.hasKeychainAttachment">
              <div class="field is-horizontal">
                <div class="field-label is-small">
                  <label class="label"
                    >{{ $t("keychain") }} {{ $t("placement") }}</label
                  >
                </div>
                <div class="field-body">
                  <div class="field">
                    <div class="control has-icons-left">
                      <div class="select is-small">
                        <select v-model="options.base.keychainPlacement">
                          <option value="top">{{ $t("top") }}</option>
                          <option value="left">{{ $t("left") }}</option>
                          <option value="topLeft">
                            {{ $t("top") }}-{{ $t("left") }} {{ $t("corner") }}
                          </option>
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
                  <label class="label">{{ $t("keychainHoleDiameter") }}</label>
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
                      <a class="button is-static is-small">{{ unit }}</a>
                    </p>
                  </div>
                </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-small">
                  <label class="label">{{ $t("mirrorHoles") }}</label>
                </div>
                <div class="field-body">
                  <div class="control">
                    <label class="checkbox">
                      <div class="field">
                        <input
                          type="checkbox"
                          v-model="options.base.mirrorHoles"
                        />
                        <span class="is-size-7">{{
                          $t("mirrorHolesHelp")
                        }}</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- NFC Tag Section -->
            <div class="field is-horizontal">
              <div class="field-label is-small">
                <label class="label">{{ $t("nfcIndentation") }}</label>
              </div>
              <div class="field-body">
                <div class="control">
                  <label class="checkbox">
                    <div class="field">
                      <input
                        type="checkbox"
                        v-model="options.base.hasNfcIndentation"
                      />
                      <span class="is-size-7"
                        ><i class="fa fa-wifi"></i>
                        {{ $t("nfcIndentationHelp") }}</span
                      >
                    </div>
                  </label>
                </div>
              </div>
            </div>
            <div class="subsection" v-if="options.base.hasNfcIndentation">
              <div class="field is-horizontal">
                <div class="field-label is-small">
                  <label class="label"
                    >{{ $t("indentation") }} {{ $t("shape") }}</label
                  >
                </div>
                <div class="field-body">
                  <div class="field">
                    <div class="control has-icons-left">
                      <div class="select is-small">
                        <select v-model="options.base.nfcIndentationShape">
                          <option value="square">{{ $t("square") }}</option>
                          <option value="round">{{ $t("round") }}</option>
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
                  <label class="label"
                    >{{ $t("indentation") }} {{ $t("size") }}</label
                  >
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
                      <a class="button is-static is-small">{{ unit }}</a>
                    </p>
                  </div>
                </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-small">
                  <label class="label"
                    >{{ $t("indentation") }} {{ $t("depth") }}</label
                  >
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
                      <a class="button is-static is-small">{{ unit }}</a>
                    </p>
                  </div>
                </div>
              </div>
              <div class="field is-horizontal">
                <div class="field-label is-small">
                  <label class="label">{{ $t("hidden") }}</label>
                </div>
                <div class="field-body">
                  <div class="control">
                    <label class="checkbox">
                      <div class="field">
                        <input
                          type="checkbox"
                          v-model="options.base.nfcIndentationHidden"
                        />
                        <span class="is-size-7"
                          ><i class="fa fa-layer-group"></i>
                          {{ $t("nfcIndentationHiddenHelp") }}</span
                        >
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div
      class="notification is-danger is-light"
      v-if="generateError"
      style="margin-top: 20px 0"
    >
      {{ generateError }}
    </div>

    <button
      class="button is-success is-large"
      v-bind:class="{ 'is-loading': isGenerating }"
      @click="generate3dModel"
    >
      <span class="icon">
        <i class="fa fa-cube"></i>
      </span>
      <span>{{ $t("generateButton") }}</span>
    </button>

  </div>
</template>

<script>
import * as THREE from 'three';

import { diff } from 'deep-object-diff';
import merge from 'deepmerge';
import JSZip from 'jszip';
import modelWorker from '@/model-worker';

import { save, saveAsString, saveAsArrayBuffer } from '../utils';
import { nextTick } from 'vue';

const defaultOptions = {
  code: {
    invert: false,
    margin: 0,
  },
  base: {
    shape: 'roundedRectangle',
    width: 100,
    height: 100,
    depth: 3,
    cornerRadius: 5,
    hasBorder: true,
    borderWidth: 2,
    borderDepth: 1,
    hasText: true,
    textPlacement: 'center',
    textMargin: 4,
    textSize: 10,
    textMessage: '',
    textDepth: 1,
    textAlign: 'center',
    hasKeychainAttachment: false,
    keychainPlacement: 'left',
    keychainHoleDiameter: 6,
    mirrorHoles: false,
    hasNfcIndentation: false,
    nfcIndentationShape: 'square',
    nfcIndentationSize: 30,
    nfcIndentationDepth: 1,
    nfcIndentationHidden: false,
  },
};

export default {
  name: 'TextMenu',
  props: {
    initData: Object,
    scene: Object,
    exporter: Object,
  },
  components: {},
  data() {
    return {
      options: JSON.parse(JSON.stringify(defaultOptions)),
      unit: 'mm',
      mesh: null,
      baseMesh: null,
      borderMesh: null,
      subtitleMesh: null,
      keychainAttachmentMesh: null,
      stlType: 'binary',
      dualExtrusion: false,
      isGenerating: false,
      generateError: null,
      changelogModalVisible: false,
    };
  },

  methods: {
    initWorker() {
      modelWorker.worker.onmessage = (event) => {
        if (event.data.type !== 'result') {
          return;
        }
        this.$emit('resetScene');
        const jsonLoader = new THREE.ObjectLoader();
        const { meshes } = event.data;
        let i = 0;
        Object.keys(meshes).forEach((key) => {
          jsonLoader.parse(meshes[key], (parsed) => {
            meshes[key] = parsed;
            i += 1;
            if (key !== 'combined') {
              this.scene.add(meshes[key]);
            }
            if (i === event.data.meshCount) {
              this.mesh = meshes.combined;
              this.baseMesh = meshes.base;
              this.borderMesh = meshes.border;
              this.subtitleMesh = meshes.subtitle;
              this.keychainAttachmentMesh = meshes.keychainAttachment;
              this.isGenerating = false;
            }
          });
        });
        this.$emit('exportReady', diff(defaultOptions, this.options));
      };
    },
    setup3dObject() {
      modelWorker.send({
        mode: 'Text',
        options: this.options,
      });
    },
    async generate3dModel() {
      this.$emit('generating');

      this.generateError = null;
      this.isGenerating = true;

      nextTick(() => {
        // this.init3d();
        this.setup3dObject();
        // this.startAnimation();
      });
    },
    exportSTL(stlType, multipleParts) {
      const timestamp = new Date().getTime();
      const exportAsBinary = stlType === 'binary';

      if (multipleParts) {
        const zip = new JSZip();
        const filenameBase = `base-${timestamp}.stl`;
        const filenameBorder = `border-${timestamp}.stl`;
        const filenameText = `text-${timestamp}.stl`;
        const filenameKeychain = `attachment-${timestamp}.stl`;

        const put = (name, data) => {
          if (exportAsBinary) {
            const content = (data && data.buffer) ? data.buffer : data;
            zip.file(name, content, { binary: true });
          } else {
            zip.file(name, data);
          }
        };

        const baseSTL = this.exporter.parse(this.baseMesh, {
          binary: exportAsBinary,
        });
        put(filenameBase, baseSTL);

        if (this.borderMesh) {
          const borderSTL = this.exporter.parse(this.borderMesh, {
            binary: exportAsBinary,
          });
          put(filenameBorder, borderSTL);
        }

        if (this.subtitleMesh) {
          const textSTL = this.exporter.parse(this.subtitleMesh, {
            binary: exportAsBinary,
          });
          put(filenameText, textSTL);
        }

        if (this.keychainAttachmentMesh) {
          const kcaSTL = this.exporter.parse(this.keychainAttachmentMesh, {
            binary: exportAsBinary,
          });
          put(filenameKeychain, kcaSTL);
        }

        zip.generateAsync({ type: 'blob' }).then((content) => {
          save(new Blob([content]), `qrcode2stl-${timestamp}.zip`);
        });
      } else {
        const filename = `combined-${timestamp}.stl`;
        const result = this.exporter.parse(this.mesh, {
          binary: exportAsBinary,
        });
        if (exportAsBinary) {
          saveAsArrayBuffer(result, filename);
        } else {
          saveAsString(result, filename);
        }
      }
    },
  },
  async mounted() {
    this.initWorker();
    if (this.initData && this.initData.mode === 'Text') {
      delete this.initData.mode;
      this.options = merge(this.options, this.initData);
      this.generate3dModel();
    }
  },
};
</script>

<style scoped>
#main {
  margin-top: 20px;
}

.export-button {
  margin: 0 10px;
}

#notifications {
  margin-top: 10px;
}

.field-label {
  text-align: left;
}

#mode-buttons > button {
  margin-right: 20px;
}
</style>
