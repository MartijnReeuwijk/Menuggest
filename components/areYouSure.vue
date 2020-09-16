<b-overlay :show="busy" @hidden="onHidden" @shown="onShown" no-wrap>
  <template v-slot:overlay>
    <div class="text-center p-4 bg-primary text-light rounded" v-if="processing">
      <b-icon font-scale="4" icon="cloud-upload"></b-icon>
      <div class="mb-3">Deleting</div>
      <b-progress
        :value="counter"
        class="mx-n4 rounded-0"
        height="3px"
        max="20"
        min="1"
        variant="success"
      ></b-progress>
    </div>
    <div
      aria-labelledby="form-confirm-label"
      aria-modal="false"
      class="text-center p-3"
      ref="dialog"
      role="dialog"
      tabindex="-1"
      v-else
    >
      <p><strong id="form-confirm-label">Are you sure?</strong></p>
      <div class="d-flex">
        <b-button @click="onCancel" class="mr-3" variant="outline-danger">
          Cancel
        </b-button>
        <b-button @click="onOK" variant="outline-success">OK</b-button>
      </div>
    </div>
  </template>
</b-overlay>

<script>
  export default {
    name: 'areYouSure',
    data () {
      return {
        busy: false,
        processing: false,
        counter: 1,
        interval: null
      }
    },
    beforeDestroy () {
      this.clearInterval()
    },
    methods: {
      clearInterval () {
        if (this.interval) {
          clearInterval(this.interval)
          this.interval = null
        }
      },
      onShown () {
        // Focus the dialog prompt
        this.$refs.dialog.focus()
      },
      onHidden () {
        // In this case, we return focus to the submit button
        // You may need to alter this based on your application requirements
        this.$refs.submit.focus()
      },
      onSubmit () {
        this.processing = false
        this.busy = true
      },
      onCancel () {
        this.busy = false
      },
      onOK () {
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
