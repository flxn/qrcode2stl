<template>
  <div id="main" class="container is-fluid">
    <div class="columns">
      <div class="column is-one-quarter">
        <h1 class="title">QR2STL Generator</h1>
        <h2 class="subtitle">Configuration</h2>
        <hr/>
        <div class="field">
          <label class="label">Name</label>
          <div class="control">
            <input class="input" type="text" placeholder="Text input">
          </div>
        </div>
      </div>
      <div class="column">
        <div id="container3d"></div>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'

export default {
  name: 'Main',
  props: {
    msg: String
  },

  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
    }
  },

  methods: {
    init3d() {
      this.scene = new THREE.Scene();
      const container = document.getElementById('container3d')
      this.camera = new THREE.PerspectiveCamera( 75, container.clientWidth/container.clientHeight, 0.1, 1000 );
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight)
      container.appendChild( this.renderer.domElement );
    }
  },

  mounted() {
    this.init3d();
    //renderer.setSize( 800, 600 );
    //document.body.appendChild( document.getElementById('3dcanvas') );

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshNormalMaterial();
    var cube = new THREE.Mesh( geometry, material );
    this.scene.add( cube );
    this.camera.position.z = 5;
    const animate = () => {
      requestAnimationFrame( animate );
      this.renderer.render( this.scene, this.camera );
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
    }
    animate()
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#main {
  margin-top: 20px;
}

#container3d {
  width: 100%;
  height: 600px;
}
</style>
