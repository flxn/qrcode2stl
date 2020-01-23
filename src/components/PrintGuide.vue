<template>
  <section id="printguide" class="section">
    <div class="container">
      <h1 class="title is-1">
        <i class="fa fa-book"></i> 3D Print Guide
      </h1>
      <h2 class="subtitle">
        How to print a dual color QR code with a single extruder 3d printer?
      </h2>
      <hr/>
      <div class="notification is-info is-light">
        <i class="fa fa-info-circle"></i> This guide is a work in progress.
      </div>
      <p>
        You can print multi colored objects even with a single extruder by swapping the filament at specific layers.<br/>
        We can use this method to print the base of our QR code and the actual QR code part on the top in two different colors.<br/>
        This technique is what makes 3d printable QR codes possible in the first place.<br/>
        The process is different depending on the slicer software you are using.<br/>
        In this guide I will focus on Cura and PrusaSlicer only and I am taking no responsibility whatsoever if you somehow damage your printer in the process.<br/>
      </p>
      <br/>
      <div class="notification is-warning is-light">
        <i class="fa fa-exclamation-triangle"></i> <strong>Keep in mind: Not all printers/firmwares support the necessary functionality!</strong><br/>
        This is meant as a general guide, as I can't provide a writeup on every printer/firmware combination out there.<br/>
        I recommend doing a small test print first. If you are having problems getting this to work, please search online if your specific printer model supports the <strong>M600</strong> G-Code command for filament changing.<br/>
      </div>

      <!-- General -->
      <hr/>
      <h3 class="title is-2">
        Generating the QR code
      </h3>
      <div class="columns">
        <div class="column is-8">
          <img src="../assets/printguide/generate_code.gif" alt="configure the qrcode exporter" loading="lazy">
        </div>
        <div class="column is-4">
          <ol type="1" style="margin-left: 20px">
            <li>Select the type of QR code you want to generate under "QR Code Options".</li>
            <li>Fill out the necessary fields.</li>
            <li>Configure the 3d model under "3D Model Options".</li>
            <li>Click on "Generate 3D Model"</li>
            <li>Save the stl file via the "Save As STL" button in the top right.</li>
          </ol>
        </div>
      </div>

      <!-- Cura Guide -->
      <hr/>
      <h3 class="title is-2">
        Cura
      </h3>
      <p class="subtitle">
        (Version 4.4.1, your experience can differ.)
      </p>
      <div class="columns">
        <div class="column">
          <img src="../assets/printguide/cura_layers.gif" alt="find the layer where the color change should happen" loading="lazy">
          <p>
            Slice the model and locate the layer where the color change should happen.<br/>
            In my case this is at layer 16.<br/>
          </p>
        </div>
        <div class="column">
          <img src="../assets/printguide/cura_add_postprocessing.gif" alt="set up the postprocessing script" loading="lazy">
          <ol type="1">
            <li>Go to "Extensions -> Post Processing -> Modify G-Code".</li>
            <li>Click on "Add a script" then select "Filament Change".</li>
            <li>In the Filament Change settings, set the "Layer" value to your layer number from step 1.</li>
            <li>Re-Slice your model. The icon left of the "Slice" button indicates an active Post Processing script.</li>
          </ol>
        </div>
      </div>
      <p>
        You can now print the model as usual.<br/>
        The 3d printer will pause on the specified layer and move to the origin of the print bed.
        Now you can swap the filament and restart the print job from your printers menu.
      </p>

      <!-- PrusaSlicer Guide -->
      <hr/>
      <h3 class="title is-2">
        PrusaSlicer
      </h3>
      <p class="subtitle">
        (Version 2.1.1, your experience can differ.)
      </p>
      <div class="columns">
        <div class="column">
          <img src="../assets/printguide/prusa_layers.gif" alt="find the layer where the color change should happen" loading="lazy">
          <p>
            Slice the model and locate the layer where the color change should happen.<br/>
            In my case this is at layer 11.<br/>
          </p>
        </div>
        <div class="column">
          <img src="../assets/printguide/prusa_add_filament_change.gif" alt="set up the filament change" loading="lazy">
          <ol type="1">
            <li>Click on the little plus sign right of the layer selection bar.</li>
            <li>PrusaSlicer gives you a nice preview where you can see the different colors to verify that you selected the right layer. The qr code parts should have a different color than the base</li>
            <li>Re-Slice your model.</li>
          </ol>
        </div>
      </div>
      <p>
        You can now print the model as usual.<br/>
        The 3d printer will pause on the specified layer and move to the origin of the print bed.
        Now you can swap the filament and restart the print job from your printers menu.
      </p>
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
