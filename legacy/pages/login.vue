<template>
<section class="thing">
  <div class="loginFormHolder">
    <h2>Menuggest</h2>
    <b-card no-body class="overflow-hidden">
      <b-row no-gutters>
        <b-col md="6">
          <b-card-img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQTdz4NrRlLhvx2ReQ-DA2uUP4pzPpFy9i-7w&usqp=CAU" alt="Image" class="rounded-0"></b-card-img>
        </b-col>
        <b-col md="6">
          <b-card-body title="User login">
            <b-form @reset="onReset">
              <b-form-group
                id="input-group-1"
                label="Email address:"
                label-for="input-1"
              >
                <b-form-input
                  id="input-1"
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="Enter email"
                >
                </b-form-input>
              </b-form-group>


              <label for="text-password">Password:</label>
              <b-input type="password"
                       placeholder="Password"
                       id="text-password"
                       aria-describedby="password-help-block">
              </b-input>
            </b-form>

            <b-button block href="/menu" variant="primary">Login</b-button>
            <b-button block href="/menu" variant="light">Reset password</b-button>

          </b-card-body>
        </b-col>
      </b-row>
    </b-card>
  </div>


</section>
</template>

<script>
  export default {
    name: 'login',
    data() {
      return {
        form: {
          email: '',
          password:'',
        },
      }
    },
    computed: {
    },
    methods:{
      onReset(evt) {
        evt.preventDefault()
        // Reset our form values
        this.form.email = ''
        this.form.name = ''
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .thing{
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: lightblue;
  }

.loginFormHolder{
  position: relative;
  width: 450px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}

.loginFormHolder h2 {
  position: absolute;
  top: -45px;
  text-align: center;
  right: 0;
  left: 0;
  margin: auto;
}
  .btn{
    margin-top: 0.75em;
  }
</style>
