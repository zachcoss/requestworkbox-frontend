<template>
  <div class="row">
    <div class="column column-full-width">

      <!-- <div class="row row-border-bottom" v-for="(total, key) in usages" :key="key">
        <div class="column column-data column-10 column-padded">{{ `Total` }}</div>
        <div class="column column-data column-10 column-padded">{{ key }}</div>
        <div class="column column-data column-10 column-padded">{{ total }}</div>
        <div class="column column-data column-10 column-padded">{{ `` }}</div>
        <div class="column column-data column-grow column-padded">{{ `` }}</div>
      </div> -->

      <div class="row row-border-bottom">
        <div class="column column-data column-header column-10 column-padded">Location</div>
        <div class="column column-data column-header column-10 column-padded">Type</div>
        <div class="column column-data column-header column-10 column-padded">Usage Amount</div>
        <div class="column column-data column-header column-10 column-padded">Measurement</div>
        <div class="column column-data column-header column-10 column-padded">Direction</div>
        <div class="column column-data column-header column-20 column-padded">Date</div>
        <div class="column column-data column-header column-grow column-padded">Detail</div>
      </div>

      <div class="row row-border-bottom table-row-selectable" v-for="(usage) in selectedInstanceUsage()" :key="usage._id">
        <div class="column column-data column-10 column-padded">{{ usageUppercase(usage.usageLocation) }}</div>
        <div class="column column-data column-10 column-padded">{{ usageUppercase(usage.usageType) }}</div>
        <div class="column column-data column-10 column-padded">{{ usage.usageAmount }}</div>
        <div class="column column-data column-10 column-padded">{{ usage.usageMeasurement }}</div>
        <div class="column column-data column-10 column-padded">{{ usage.usageDirection }}</div>
        <div class="column column-data column-20 column-padded">{{ usageCreatedAt(usage.createdAt) }}</div>
        <div class="column column-data column-grow column-padded">{{ usage.usageDetail }}</div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import moment from 'moment-timezone'
import _ from 'lodash'

export default {
  name: 'QueueStatsInstanceUsage',
  computed: {
    ...mapState('instance', ['selectedInstanceId']),
    ...mapGetters('instance', ['visibleInstances']),
    ...mapGetters('queue', ['selectedQueue']),
  },
  methods: {
    ...mapActions('instance', ['usageTotals']),
    selectedInstanceUsage: async function() {
      const instances = _.filter(this.visibleInstances(), (data) => {
        if (data.queueId === this.selectedQueue()._id) return true
        else return false
      })

      if (_.size(instances)) return instances[0]
      else return {}
    },
    usageUppercase: function(usage) {
      if (usage === 'api') return 'API'
      else return _.upperFirst(usage)
    },
    usageCreatedAt: function(createdAt) {
      if (!createdAt) return ''
      return `${moment(createdAt).format('M-D-YYYY, h:mm:ss a')}`
    },
  }
};
</script>