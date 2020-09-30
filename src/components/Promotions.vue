<template>
  <div>
    <nav id="promo-container" class="panel">
    <p class="panel-heading">
      {{$t('promotionTitle')}}
    </p>
    <p class="panel-block">
      {{$t('promotionSubtitle')}}
    </p>
    <div class="panel-block">
      <div class="products">
        <a href="https://s.click.aliexpress.com/e/_dVxD78E" target="_blank">
          <img src="https://ae01.alicdn.com/kf/Hb53a0162ce664ab7ad5e98181493d736C.jpg_80x80.jpg" />
          <div class="name">Creality Ender-3 Pro</div>
        </a>

        <a href="https://s.click.aliexpress.com/e/_dYmya3y" target="_blank">
          <img src="https://ae01.alicdn.com/kf/H3600f1147e5647e9803786643497b97cg.jpg_80x80.jpg" />
          <div class="name">Creality Ender-3 V2</div>
        </a>

        <a href="https://s.click.aliexpress.com/e/_dVBFZG2" target="_blank">
          <img src="https://ae01.alicdn.com/kf/Hee8f5922f62b47e08e777baefd3ff262D.jpg_80x80.jpg" />
          <div class="name">Creality CR-10 V2</div>
        </a>

        <a href="https://s.click.aliexpress.com/e/_BffriIjG" target="_blank">
          <img src="https://ae01.alicdn.com/kf/H2580702879bc4ae1a094cb4fe80304a5x.jpg_80x80.jpg" />
          <div class="name">Creality CR-10S Pro</div>
        </a>

        <a href="https://s.click.aliexpress.com/e/_dX8dqP3" target="_blank">
          <img src="https://ae01.alicdn.com/kf/H38f64f2601f741868f1d6d7b432470029.jpg_80x80.jpg" />
          <div class="name">Elegoo Mars</div>
        </a>

        <a href="https://s.click.aliexpress.com/e/_dT7G0RG" target="_blank">
          <img src="https://ae01.alicdn.com/kf/HTB19lAfJA9WBuNjSspeq6yz5VXam.jpg_80x80.jpg" />
          <div class="name">BLTouch</div>
        </a>

        <a href="https://s.click.aliexpress.com/e/_dXu6tBo" target="_blank">
          <img src="https://ae01.alicdn.com/kf/Hb64655a64fe2441fbd521ca66672994at.jpg_80x80.jpg" />
          <div class="name">SKR V1.3</div>
        </a>

        <a href="https://s.click.aliexpress.com/e/_dTczAUQ" target="_blank">
          <img src="https://ae01.alicdn.com/kf/H6caf815aa82f47db99fbe0ebcd58b17aG.jpg_80x80.jpg" />
          <div class="name">SKR Mini E3 V2</div>
        </a>

        <a href="https://s.click.aliexpress.com/e/_dVSbTNy" target="_blank">
          <img src="https://ae01.alicdn.com/kf/Hc801a35cd72a4e10a3aec89b86fc7de1l.jpg_80x80.jpg" />
          <div class="name">Trianglelab Spider</div>
        </a>

        <a href="https://s.click.aliexpress.com/e/_dZgeEfM" target="_blank">
          <img src="https://ae01.alicdn.com/kf/HLB12GIXau3tHKVjSZSgq6x4QFXaQ.jpg_80x80.jpg" />
          <div class="name">BMG Extruder</div>
        </a>

        <a href="https://s.click.aliexpress.com/e/_d6JsfwO" target="_blank">
          <img src="https://ae01.alicdn.com/kf/HTB1YDITxmBYBeNjy0Feq6znmFXaQ.jpg_80x80.jpg" />
          <div class="name">PTFE Tube</div>
        </a>

        <a href="https://s.click.aliexpress.com/e/_BfZMuzKW" target="_blank">
          <img src="https://ae01.alicdn.com/kf/HTB1GH6JX4uTBuNkHFNRq6A9qpXah.jpg_80x80.jpg" />
          <div class="name">V6 Nozzle Set</div>
        </a>

        <a href="https://s.click.aliexpress.com/e/_dSxb1lU" target="_blank">
          <img src="https://ae01.alicdn.com/kf/Hb180849b14be4c0eba9091108fbdf23dK.jpg_80x80.jpg" />
          <div class="name">TS80P Soldering Iron</div>
        </a>

        <a href="https://s.click.aliexpress.com/e/_dWysZS5" target="_blank">
          <img src="https://ae01.alicdn.com/kf/H980ed3796a8d49b99eca44ce4fcff0aeB.jpg_80x80.jpg" />
          <div class="name">Smart Filament Sensor</div>
        </a>
      </div>
    </div>
  </nav>
  <div class="notification">
      <div class="columns">
        <div class="column is-1 is-size-3">🌈</div>
        <div class="column">Are you a developer/designer/engineer? Check out my newest side project <strong>landof.dev</strong> where you can <a href="https://landof.dev/awesome">discover GitHub repositories and development resources about hundreds of topics</a>.</div>
        <div class="column is-1 is-size-3">🌈</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Promotions',
};
</script>

<style>
#promo-container {
  margin-top: 20px;
}

.products>a {
  background-color: white;
  border-radius: 6px;
  -webkit-box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
  box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0px 0 1px rgba(10, 10, 10, 0.02);
  color: #4a4a4a;
  display: inline-block;
  padding: 1rem;
  margin-top: 10px;
  margin-right: 10px;
  max-width: 200px;
}

.products>a img {
  display: block;
  height: 80px;
  width: 80px;
  margin: 0 auto;
}

.products>a:hover, .products>a:focus {
    -webkit-box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0 0 1px #3273dc;
    box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1), 0 0 0 1px #3273dc;
}

a .name {
  margin-top: 5px;
  text-align: center;
  font-weight: bold;
  font-size: .8rem;
}

</style>
