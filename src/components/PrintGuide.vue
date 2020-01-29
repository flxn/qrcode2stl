<template>
  <section id="printguide" class="section">
    <div class="container">
      <h1 class="title is-1">
        <i class="fa fa-book"></i> {{$t('printGuideTitle')}}
      </h1>
      <h2 class="subtitle">
        {{$t('printGuideSubtitle')}}
      </h2>
      <hr/>
      <div class="notification is-info is-light">
        <i class="fa fa-info-circle"></i> {{$t('printGuideWIPInfo')}}
      </div>
      <p v-html="$t('printGuideIntro')">
      </p>
      <br/>
      <div class="notification is-warning is-light">
        <i class="fa fa-exclamation-triangle"></i> <strong>{{$t('printGuideSupportWarningTitle')}}</strong><br/>
        <span v-html="$t('printGuideSupportWarningMessage')"></span>
      </div>

      <!-- General -->
      <hr/>
      <h3 class="title is-2">
        {{$t('printGuideGenerateQRCode')}}
      </h3>
      <div class="columns">
        <div class="column is-8">
          <img src="../assets/printguide/generate_code.gif" alt="configure the qrcode exporter" loading="lazy">
        </div>
        <div class="column is-4">
          <ol type="1" style="margin-left: 20px" v-html="$t('printGuideGenerateQRCodeSteps')"></ol>
        </div>
      </div>

      <!-- Cura Guide -->
      <hr/>
      <h3 class="title is-2">
        Cura
      </h3>
      <p class="subtitle">
        ({{$t('printGuideVersionDisclaimer', {version: '4.4.1'} )}})
      </p>
      <div class="columns">
        <div class="column">
          <img src="../assets/printguide/cura_layers.gif" alt="find the layer where the color change should happen" loading="lazy">
          <p v-html="$t('printGuideCuraStep1')"></p>
        </div>
        <div class="column">
          <img src="../assets/printguide/cura_add_postprocessing.gif" alt="set up the postprocessing script" loading="lazy">
          <ol type="1" v-html="$t('printGuideCuraStep2')"></ol>
        </div>
      </div>
      <p v-html="$t('printGuideCuraStep3')"></p>

      <!-- PrusaSlicer Guide -->
      <hr/>
      <h3 class="title is-2">
        PrusaSlicer
      </h3>
      <p class="subtitle">
        ({{$t('printGuideVersionDisclaimer', {version: '2.1.1'} )}})
      </p>
      <div class="columns">
        <div class="column">
          <img src="../assets/printguide/prusa_layers.gif" alt="find the layer where the color change should happen" loading="lazy">
          <p v-html="$t('printGuidePrusaSlicerStep1')"></p>
        </div>
        <div class="column">
          <img src="../assets/printguide/prusa_add_filament_change.gif" alt="set up the filament change" loading="lazy">
          <ol type="1" v-html="$t('printGuidePrusaSlicerStep2')"></ol>
        </div>
      </div>
      <p v-html="$t('printGuidePrusaSlicerStep3')"></p>
    </div>
  </section>
</template>

<script>
export default {

};
</script>

<style scoped>
  .title {
    margin-top: 10px;
  }

  img {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    margin-bottom: 10px;
    border-radius: 10px;
    overflow: hidden;
  }
</style>
