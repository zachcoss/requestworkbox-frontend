<template>
  <div class="row" id="user-sign-up">
    <div class="column column-full-width">


      <div class="row row-align-start row-height-100">
        <!-- Login -->
        <div class="column column-grow">
          <UserConfirmForm />
        </div>
      </div>

      <!-- Login -->

      <div class="row row-align-start row-height-20">
        <!-- Login -->
        <div class="column column-grow">
          
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import _ from 'lodash'

import UserConfirmForm from './UserConfirmForm'

export default {
  name: 'UserConfirm',
  components: {
    UserConfirmForm,
  }
}
</script>