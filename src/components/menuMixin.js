import JSZip from 'jszip';
import modelWorker from '@/model-worker';
import parseWorkerMeshes from '@/model-worker/meshes';
import { save, saveAsString, saveAsArrayBuffer } from '../utils';

/**
 * True if every numeric option (judged by the defaults) currently holds a finite number.
 * Number fields emit '' while they are empty, which must not trigger a live re-generation.
 */
export const hasValidNumbers = (options, defaults) => Object.keys(defaults).every((key) => {
  const fallback = defaults[key];
  const value = options ? options[key] : undefined;
  if (typeof fallback === 'number') {
    return typeof value === 'number' && Number.isFinite(value);
  }
  if (fallback && typeof fallback === 'object' && !Array.isArray(fallback)) {
    return hasValidNumbers(value || {}, fallback);
  }
  return true;
});

/**
 * Shared behaviour of the QR / Spotify / Text menus:
 * - talks to the model worker and ignores results of superseded requests
 * - keeps generated meshes outside of Vue's reactivity system
 * - re-adds its model to the preview when it becomes the active mode again (keep-alive)
 * - reports a signature of its options so the app can detect outdated previews
 */
export default {
  props: {
    scene: {
      type: Object,
      default: null,
    },
    exporter: {
      type: Object,
      default: null,
    },
    stlType: {
      type: String,
      default: 'binary',
    },
    multipleParts: {
      type: Boolean,
      default: false,
    },
    tab: {
      type: String,
      default: 'model',
    },
    liveUpdate: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      unit: 'mm',
      isGenerating: false,
      generateError: null,
      hasModel: false,
      // adjustments the generator made to keep the model valid ({ code, params })
      modelWarnings: [],
    };
  },
  provide() {
    // lets option sections show inline hints for the warnings that concern them
    return {
      getModelWarnings: () => this.modelWarnings,
    };
  },
  computed: {
    currentTab() {
      return this.tabs.some((tab) => tab.id === this.tab) ? this.tab : 'model';
    },
    signature() {
      return JSON.stringify(this.signatureSource());
    },
    menuState() {
      return {
        signature: this.signature,
        canAutoGenerate: this.isReadyForAutoUpdate(),
        printabilityWarning: this.printabilityWarning || '',
        warnings: this.modelWarnings,
      };
    },
  },
  watch: {
    menuState(state) {
      if (this.isActive) {
        this.$emit('state', state);
      }
    },
    signature() {
      // any edit makes a previous generation error obsolete
      this.generateError = null;
    },
  },
  created() {
    // THREE objects intentionally live outside of Vue's reactivity (it would deep-walk them)
    this.parts = {};
    this.latestRequestId = 0;
    this.generatedSignature = null;
    this.isActive = false;
  },
  activated() {
    this.isActive = true;
    this.$emit('activated', this.menuState);
    if (this.hasModel) {
      this.showParts(true);
    }
  },
  deactivated() {
    this.isActive = false;
  },
  methods: {
    selectTab(id) {
      this.$emit('update:tab', id);
    },
    /** Options that define the generated model. Menus override this to normalize values. */
    signatureSource() {
      return this.options;
    },
    /** Whether a live update may run right now (e.g. content present, numbers valid). */
    isReadyForAutoUpdate() {
      return true;
    },
    beginGeneration() {
      this.latestRequestId += 1;
      this.generateError = null;
      this.isGenerating = true;
      const ticket = { requestId: this.latestRequestId, signature: this.signature };
      this.$emit('generating', { signature: ticket.signature });
      return ticket;
    },
    failGeneration(ticket, message) {
      if (ticket && ticket.requestId !== this.latestRequestId) {
        return;
      }
      this.isGenerating = false;
      this.generateError = message;
      this.$emit('generate-failed', message);
    },
    async requestModel(ticket, message) {
      try {
        const result = await modelWorker.request(message);
        if (ticket.requestId !== this.latestRequestId) {
          return;
        }
        this.parts = parseWorkerMeshes(result.meshes);
        this.generatedSignature = ticket.signature;
        this.modelWarnings = result.warnings || [];
        this.onModelResult(result);
        this.hasModel = true;
        this.isGenerating = false;
        if (this.isActive) {
          this.showParts(false);
        }
      } catch (error) {
        this.failGeneration(ticket, `Error during generation: ${error.message}`);
      }
    },
    onModelResult() {},
    showParts(restored) {
      if (!this.scene) {
        return;
      }
      this.$emit('resetScene');
      Object.keys(this.parts).forEach((key) => {
        if (key !== 'combined') {
          this.scene.add(this.parts[key]);
        }
      });
      this.$emit('exportReady', { signature: this.generatedSignature, restored });
    },
    /**
     * Saves the current model. `exportParts` lists [meshKey, filePrefix] pairs for multi-part exports.
     */
    exportSTL(stlType, multipleParts) {
      const timestamp = new Date().getTime();
      const exportAsBinary = (stlType === 'binary');

      if (multipleParts) {
        if (this.scene) {
          this.scene.updateWorldMatrix(true, true);
        }
        const zip = new JSZip();
        this.exportParts.forEach(([key, prefix]) => {
          const mesh = this.parts[key];
          if (!mesh) {
            return;
          }
          const data = this.exporter.parse(mesh, { binary: exportAsBinary });
          const filename = `${prefix}-${timestamp}.stl`;
          if (exportAsBinary) {
            // data may be ArrayBuffer, DataView, or a typed array
            zip.file(filename, (data && data.buffer) ? data.buffer : data, { binary: true });
          } else {
            zip.file(filename, data);
          }
        });
        return zip.generateAsync({ type: 'blob' }).then((content) => {
          save(new Blob([content]), `qrcode2stl-${timestamp}.zip`);
        });
      }

      const filename = `combined-${timestamp}.stl`;
      const result = this.exporter.parse(this.parts.combined, { binary: exportAsBinary });
      if (exportAsBinary) {
        saveAsArrayBuffer(result, filename);
      } else {
        saveAsString(result, filename);
      }
      return Promise.resolve();
    },
  },
};
