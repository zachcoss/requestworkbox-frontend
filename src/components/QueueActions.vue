<template>
  <div class="row row-border-bottom">
    <div class="column column-full-width">

      <div class="row margin-top-bottom-5">
        <div class="column">
          <span class="tiny-text tiny-text-spaced">{{ currentTime }}</span>
        </div>
        <div class="column margin-left-28">
          <input type="date" name="" id="" :value="queueDate" v-on:change="editQueueDateAction"/>
        </div>
      </div>

      <div class="row">
        <div class="column text-button action action-text-center text-11" v-if="this.activeSelection()._id" v-on:click="startWorkflow('return')">Return Workflow</div>
        <div class="column text-button action action-text-center text-11" v-if="this.activeSelection()._id" v-on:click="startWorkflow('queue')">Queue Workflow</div>
        <div class="column text-button action action-text-center text-11" v-if="this.activeSelection()._id" v-on:click="startWorkflow('schedule')">Schedule Workflow</div>
      </div>

      <div class="row row-justify-between">
        <div class="column">
          <div class="row">
            
            

            <!-- <div class="spacer"></div>


            <div
              class="column text-button action"
              v-if="!archiving"
              v-bind:class="{ disabled: !this.activeSelection()._id }"
              v-on:click="archiveAllQueuesAction">
              Archive All Upcoming
            </div>
            <div
              class="column text-button action"
              v-if="archiving">
              Archiving...
            </div>

            <div class="large-spacer" v-if="this.activeSelection()._id"></div> -->

            <!-- Schedule Request -->
            <!-- <div class="column text-button action action-text-center" v-if="this.activeSelection()._id" v-on:click="startRequest('return')">Return Request</div>
            <div class="column text-button action action-text-center" v-if="this.activeSelection()._id" v-on:click="startRequest('queue')">Queue Request</div>
            <div class="column text-button action action-text-center" v-if="this.activeSelection()._id" v-on:click="startRequest('schedule')">Schedule Request</div> -->

            <!-- Schedule Workflow -->
            <!-- <div class="column text-button action action-text-center" v-if="this.activeSelection()._id" v-on:click="startWorkflow('return')">Return Workflow</div>
            <div class="column text-button action action-text-center" v-if="this.activeSelection()._id" v-on:click="startWorkflow('queue')">Queue Workflow</div>
            <div class="column text-button action action-text-center" v-if="this.activeSelection()._id" v-on:click="startWorkflow('schedule')">Schedule Workflow</div> -->

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import moment from 'moment-timezone'
import Vue from 'vue'

export default {
  name: 'QueueActions',
  data: function () {
    return {
      loading: false,
      archiving: false,
    };
  },
  computed: {
    ...mapState('queue', ['queueDate','queueType','currentTime']),

    ...mapGetters('request', ['selectedRequest']),
    ...mapGetters('workflow', ['selectedWorkflow']),
  },
  methods: {
    ...mapMutations('queue', ['editSelectedQueueId','editQueueDate']),
    ...mapMutations('instance', ['editSelectedInstanceId', 'editSelectedInstanceStatId']),

    ...mapActions('queue', ['listQueues','archiveAllQueues']),
    ...mapActions('request', ['returnRequest','queueRequest','scheduleRequest',]),
    ...mapActions('workflow', ['returnWorkflow','queueWorkflow','scheduleWorkflow',]),
    activeSelection: function() {
      return this.selectedWorkflow()
    },
    activeSelectionWorkflowId: function() {
      return this.selectedWorkflow()._id
    },
    editQueueDateAction: function(event) {
      this.editSelectedQueueId('')
      this.editSelectedInstanceId('')
      this.editSelectedInstanceStatId('')
      
      this.editQueueDate(event.srcElement.value)
    },
    listQueuesAction: async function () {
      try {
        this.loading = true

        const payload = { workflowId: this.activeSelectionWorkflowId(), date: moment(this.queueDate), }
        const queues = await this.listQueues(payload)
      } catch (err) {
        console.log('Queue actions error', err.message)
      } finally {
        this.loading = false
      }
    },
    archiveAllQueuesAction: async function() {
      try {
        const confirm = window.confirm(`Are you sure you want to unschedule [${this.queueType}] queue types occurring on [${this.queueDate}]?`)
      
        if (confirm) {
          this.archiving = true
          
          const payload = { date: moment(this.queueDate), workflowId: this.activeSelectionWorkflowId(), queueType: this.queueType, }
          const queues = await this.archiveAllQueues(payload)
        }
      } catch(err) {
        console.log('Queue actions error', err.message)
      } finally {
        this.archiving = false
      }
    },
    startRequest: async function(queueType) {
      try {
        Vue.$toast.open({ message: 'One moment...', })

        if (queueType === 'return') {
          const results = await this.returnRequest(this.activeSelection()._id)
        } else if (queueType === 'queue') {
          const results = await this.queueRequest(this.activeSelection()._id)
        } else if (queueType === 'schedule') {
          const results = await this.scheduleRequest(this.activeSelection()._id)
        }
      } catch(err) {
        console.log('Queue actions error', err.message)
      }
    },
    startWorkflow: async function(queueType) {
      try {
        Vue.$toast.open({ message: 'One moment...', })

        if (queueType === 'return') {
          const results = await this.returnWorkflow(this.activeSelection()._id)
        } else if (queueType === 'queue') {
          const results = await this.queueWorkflow(this.activeSelection()._id)
        } else if (queueType === 'schedule') {
          const results = await this.scheduleWorkflow(this.activeSelection()._id)
        }
      } catch(err) {
        console.log('Queue actions error', err.message)
      }
    },
  },
};
</script>

<style lang="scss">
.margin-left-28 {
  margin-left: 28px;
}

</style>