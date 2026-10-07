const WARNING_KEYS = {
  marginLimited: 'warnMarginLimited',
  titleWrapped: 'warnTitleWrapped',
  textOverflow: 'warnTextOverflow',
  plateEnlarged: 'warnPlateEnlarged',
  radiusLimited: 'warnRadiusLimited',
  nfcLimited: 'warnNfcLimited',
  magnetLimited: 'warnMagnetLimited',
  quietZone: 'warnQuietZone',
};

/** Short label and explanation of a generator warning ({ code, params }). */
export const describeWarning = (vm, warning) => {
  const key = WARNING_KEYS[warning.code];
  if (!key) {
    return null;
  }
  return {
    code: warning.code,
    label: vm.$t(key, warning.params || {}),
    help: vm.$t(`${key}Help`, warning.params || {}),
  };
};

/**
 * Gives option sections access to the warnings of the last generated model,
 * so a hint can be shown right next to the setting that was adjusted.
 */
export default {
  inject: {
    getModelWarnings: { default: () => () => [] },
  },
  methods: {
    modelWarning(...codes) {
      // menus own the warnings themselves; nested sections receive them via inject
      const warnings = Array.isArray(this.modelWarnings) ? this.modelWarnings : this.getModelWarnings();
      const warning = warnings.find((item) => codes.includes(item.code));
      if (!warning) {
        return '';
      }
      const described = describeWarning(this, warning);
      return described ? `${described.label}. ${described.help}` : '';
    },
  },
};
