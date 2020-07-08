<template>
  <section class="captionLocation">
    <div @click="openLegenda" class="indexItem indexClicker">
      <div class="indexPlacer">
        <svg class="bi bi-info-circle rotate" fill="currentColor" height="25px" viewBox="0 0 16 16" width="25px"
             xmlns="http://www.w3.org/2000/svg">
          <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" fill-rule="evenodd"/>
          <path
            d="M8.93 6.588l-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588z"/>
          <circle cx="8" cy="4.5" r="1"/>
        </svg>
      </div>
    </div>
    <div>

      <transition
        name="slide-fade"
      >
        <div v-show="indexOpen">
          <div class="indexItem">
            <div class="indexPlacer">
              <div class="caption good"></div>
              <p>Hoog winstmarge</p>
            </div>
          </div>

          <div class="indexItem">
            <div class="indexPlacer">
              <div class="caption avg"></div>
              <p>Matige winstmarge</p>
            </div>
          </div>

          <div class="indexItem">
            <div class="indexPlacer">
              <div class="caption bad"></div>
              <p>Lage winstmarge</p>
            </div>
          </div>
        </div>
      </transition>

    </div>
  </section>
</template>

<script>
  export default {
    name: 'legenda',
    data () {
      return {
        indexOpen: false
      }
    },
    methods: {
      openLegenda: function () {
        this.indexOpen = !this.indexOpen
      },
    }
  }
</script>

<style lang="scss" scoped>
  .captionLocation {
    position: absolute;
    background-color: transparent;
    top: 10px;
    left: 10px;
  }
  .indexItem{
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  }
  .indexClicker {
    width: fit-content;
    cursor: pointer;
    border-radius: 5px;
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);
  }
  .indexClicker:hover{
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  }

  .indexPlacer {
    background-color: white;
    padding: 5px;
    border-radius: 5px;
    display: flex;
    margin: 5px 0;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  }

  .indexPlacer p {
    margin: 0
  }

  .caption {
    width: 25px;
    height: 25px;
    border-radius: 50px;
    margin-right: 5px;
  }


  .good {
    background-color: var(--success);
  }

  .avg {
    background-color: var(--warning);
  }

  .bad {
    background-color: var(--danger);
  }

  .slide-fade-enter-active {
    transition: all .3s ease;
  }

  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */
  {
    transform: translateX(-10px);
    opacity: 0;
  }
</style>
