<template>
  <div class="windows" v-on:mousemove="mouseMove">
    <div ref="window1" class="window-1">
      <div ref="panel1" class="panel-1">
        <div ref="panel1menu" class="panel-1-menu"></div>
        <div class="panel-1-view">ABCD</div>
      </div>
      <div ref="panel2" class="panel-2">
        <div ref="panel2slider" class="panel-2-slider" v-on:mousedown="panel2MouseDown"></div>
        <div ref="panel2menu" class="panel-2-menu"></div>
        <div class="panel-2-view">ABCD</div>
      </div>
    </div>

    <div ref="window2" class="window-2">
      <div ref="windowSlider" class="window-slider" v-on:mousedown="windowDown"></div>
      <div ref="panel3" class="panel-3">
        <div ref="panel3menu" class="panel-3-menu"></div>
        <div class="panel-3-view">ABCD</div>
      </div>
      <div ref="panel4" class="panel-4">
        <div ref="panel4slider" class="panel-4-slider" v-on:mousedown="panel4MouseDown"></div>
        <div ref="panel4menu" class="panel-4-menu"></div>
        <div class="panel-4-view">ABCD</div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment-timezone'
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'

export default {
  name: 'DashboardWindows',
  data: function() {
    return {
      windowView: 'single', // horizontal
      
      windowDrag: false,
      windowY: 0,
      
      panel2Drag: false,
      panel2X: 0,
      
      panel4Drag: false,
      panel4X: 0,
    }
  },
  methods: {
    singleWindow: function() {
      this.windowView = 'single'

      this.$refs.panel1.style.right = '50%'
      this.$refs.panel2.style.left = '50%'
      this.$refs.panel3.style.right = '50%'
      this.$refs.panel4.style.left = '50%'

      this.$refs.window1.style.right = '0'
      this.$refs.window1.style.bottom = '0'
      this.$refs.window1.style.height = 'auto'

      this.$refs.window2.style.display = 'none'
    },
    splitHorizontal: function() {
      // window 1 - right 50% to right 0
      // window 1 - bottom 0 to bottom auto
      // window 1 - height 50%
      // window 2 - left 50% to left 0
      // window 2 - top 0 to top auto
      // window 2 - height 50%

      this.windowView = 'horizontal'

      this.$refs.panel1.style.right = '50%'
      this.$refs.panel2.style.left = '50%'
      this.$refs.panel3.style.right = '50%'
      this.$refs.panel4.style.left = '50%'

      this.$refs.window1.style.right = '0'
      this.$refs.window1.style.bottom = 'auto'
      this.$refs.window1.style.height = '50%'

      this.$refs.window2.style.left = '0'
      this.$refs.window2.style.top = 'auto'
      this.$refs.window2.style.height = '50%'
      this.$refs.window2.style.display = 'block'

      this.$refs.windowSlider.style.top = '0'
      this.$refs.windowSlider.style.right = '0'
      this.$refs.windowSlider.style.height = '2px'
      this.$refs.windowSlider.style.width = 'auto'
      this.$refs.windowSlider.style.bottom = 'auto'
      this.$refs.windowSlider.style.cursor = 'row-resize'
    },
    mouseUp: function() {
      this.windowDrag = false
      this.panel2Drag = false
      this.panel4Drag = false
    },
    mouseMove: function(event) {
      if (this.panel2Drag) {
        this.movePanel12(event)
      } else if (this.panel4Drag) {
        this.movePanel34(event)
      } else if (this.windowDrag && this.windowView === 'horizontal') {
        this.moveWindowHorizontal(event)
      }
    },
    windowDown: function(event) {
      this.windowDrag = true
      this.windowX = event.clientX
      this.windowY = event.clientY
    },
    panel2MouseDown: function(event) {
      this.panel2Drag = true
      this.panel2X = event.clientX
    },
    panel4MouseDown: function(event) {
      this.panel4Drag = true
      this.panel4X = event.clientX
    },
    movePanel12: function(event) {
      const 
        currentPanel1 = Number(window.getComputedStyle(this.$refs.panel1).right.split('px')[0]),
        currentPanel2 = Number(window.getComputedStyle(this.$refs.panel2).left.split('px')[0]);

      if (currentPanel1 < 10 || currentPanel2 < 10) return

      if (event.clientX >= this.panel2X) {
        const diff = event.clientX - this.panel2X
        this.$refs.panel1.style.right = `${currentPanel1 - diff}px`
        this.$refs.panel2.style.left = `${currentPanel2 + diff}px`

        this.panel2X = event.clientX 
      } else if (event.clientX <= this.panel2X) {
        const diff = this.panel2X - event.clientX
        this.$refs.panel1.style.right = `${currentPanel1 + diff}px`
        this.$refs.panel2.style.left = `${currentPanel2 - diff}px`

        this.panel2X = event.clientX 
      }
    },
    movePanel34: function(event) {
      const 
        currentPanel3 = Number(window.getComputedStyle(this.$refs.panel3).right.split('px')[0]),
        currentPanel4 = Number(window.getComputedStyle(this.$refs.panel4).left.split('px')[0]);

      if (currentPanel3 < 10 || currentPanel4 < 10) return

      if (event.clientX >= this.panel4X) {
        const diff = event.clientX - this.panel4X
        this.$refs.panel3.style.right = `${currentPanel3 - diff}px`
        this.$refs.panel4.style.left = `${currentPanel4 + diff}px`

        this.panel4X = event.clientX
      } else if (event.clientX <= this.panel4X) {
        const diff = this.panel4X - event.clientX
        this.$refs.panel3.style.right = `${currentPanel3 + diff}px`
        this.$refs.panel4.style.left = `${currentPanel4 - diff}px`

        this.panel4X = event.clientX 
      }
    },
    moveWindowHorizontal: function(event) {
      const 
        currentWindow1 = Number(window.getComputedStyle(this.$refs.window1).height.split('px')[0]),
        currentWindow2 = Number(window.getComputedStyle(this.$refs.window2).height.split('px')[0]);

      if (currentWindow1 < 30 || currentWindow2 < 30) return

      if (event.clientY >= this.windowY) {
        const diff = event.clientY - this.windowY
        this.$refs.window1.style.height = `${currentWindow1 + diff}px`
        this.$refs.window2.style.height = `${currentWindow2 - diff}px`

        this.windowY = event.clientY
      } else if (event.clientY <= this.windowY) {
        const diff = this.windowY - event.clientY
        this.$refs.window1.style.height = `${currentWindow1 - diff}px`
        this.$refs.window2.style.height = `${currentWindow2 + diff}px`

        this.windowY = event.clientY
      }
    },
  }
};
</script>

<style lang="scss">

</style>