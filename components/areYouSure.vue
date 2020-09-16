<b-overlay :show="busy" no-wrap @shown="onShown" @hidden="onHidden">
  <template v-slot:overlay>
    <div v-if="processing" class="text-center p-4 bg-primary text-light rounded">
      <b-icon icon="cloud-upload" font-scale="4"></b-icon>
      <div class="mb-3">Deleting</div>
      <b-progress
        min="1"
        max="20"
        :value="counter"
        variant="success"
        height="3px"
        class="mx-n4 rounded-0"
      ></b-progress>
    </div>
    <div
      v-else
      ref="dialog"
      tabindex="-1"
      role="dialog"
      aria-modal="false"
      aria-labelledby="form-confirm-label"
      class="text-center p-3"
    >
      <p><strong id="form-confirm-label">Are you sure?</strong></p>
      <div class="d-flex">
        <b-button variant="outline-danger" class="mr-3" @click="onCancel">
          Cancel
        </b-button>
        <b-button variant="outline-success" @click="onOK">OK</b-button>
      </div>
    </div>
  </template>
</b-overlay>

<script>
  export default {
    name: 'areYouSure',
    data() {
      return {
        busy: false,
        processing: false,
        counter: 1,
        interval: null
      }
    },
    beforeDestroy() {
      this.clearInterval()
    },
    methods: {
      clearInterval() {
        if (this.interval) {
          clearInterval(this.interval)
          this.interval = null
        }
      },
      onShown() {
        // Focus the dialog prompt
        this.$refs.dialog.focus()
      },
      onHidden() {
        // In this case, we return focus to the submit button
        // You may need to alter this based on your application requirements
        this.$refs.submit.focus()
      },
      onSubmit() {
        this.processing = false
        this.busy = true
      },
      onCancel() {
        this.busy = false
      },
      onOK() {
        this.counter = 1
        this.processing = true
        // Simulate an async request
        this.clearInterval()
        this.interval = setInterval(() => {
          if (this.counter < 20) {
            this.counter = this.counter + 1
          } else {
            this.clearInterval()
            this.$nextTick(() => {
              this.busy = this.processing = false
            })
          }
        }, 350)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
