<template>
  <div class="row" v-if="this.balance !== 0">
    <div class="column column-full-width">

      <div class="row row-border-bottom-light">
        <div class="column column-data column-15">
          <p class="text-12">Credit Remaining</p>
        </div>
        <span class="tiny-text tiny-text-spaced">{{ balanceCurrency }}</span>
        <div class="column column-grow"></div>
        <span class="tiny-text tiny-text-spaced"></span>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'BillingCredit',
  computed: {
    ...mapState('billing', ['balance']),
    balanceCurrency: function() {
      if (this.balance === 0) return '$0.00'
      else if (this.balance > 0) {
        const total = (this.balance / 100).toFixed(2)
        return `- $${total}`
      } else if (this.balance < 0) {
        const total = ( Math.abs(this.balance) / 100).toFixed(2)
        return `$${total}`
      }
    },
  }
}
</script>