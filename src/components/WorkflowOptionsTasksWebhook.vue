<template>
  <div class="row">
    <div class="column column-full-width">

      <div class="row" 
        v-for="webhook in this.selectedWorkflow().webhooks" 
        :key="webhook._id">
        <div class="column account-column-data">
          <input 
            id="team"
            type="checkbox"
            :checked="webhook.active"
            @change="editWorkflowTaskActive('webhooks', webhook._id, 'active', $event)">
        </div>
        <div class="column column-full-width">
          <div class="row">
            <div
              class="column account-column-data column-uparrow column-uparrow-hidden">
              <span>▲</span>
            </div>
            <div class="column account-column-data column-20">
              <select
                class="column-input-select border-hidden column-input-select-grow"
                :value="webhookRequestId()"
                v-on:input="editWorkflowWebhookAction($event)">
                  <option value="">No Webhook</option>
                  <option
                    v-for="(request) in visibleRequests()"
                    :key="request._id"
                    :value="request._id">
                      {{ request.name }}
                  </option>
              </select>
            </div>
          </div>

        </div>
      </div>

      <div v-if="forceComputedForWebhookCancelChanges"></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'

export default {
  name: 'WorkflowOptionsTasksWebhook',
  computed: {
    ...mapGetters('workflow', ['selectedWorkflow']),
    ...mapGetters('request', ['visibleRequests']),
    
    forceComputedForWebhookCancelChanges: async function() {
      const changes = await this.forceComputedForWebhookCancelChangesAction()
      return changes
    },
  },
  methods: {
    ...mapMutations('workflow', ['editWorkflowTask', 'changeTaskPosition', 'editWorkflowWebhook']),
    ...mapActions('workflow', ['deleteWorkflowTask','forceComputedForWebhookCancelChangesAction']),
    editWorkflowWebhookAction: function (event) {
      this.editWorkflowWebhook({ value: event.target.value, workflowId: this.selectedWorkflow()._id, })
    },
    editWorkflowTaskActive: function (type, _id, key, event) {
      this.editWorkflowTask({ type, _id, key, value: event.target.checked, workflowId: this.selectedWorkflow()._id, })
    },
    webhookRequestId: function() {
      if (!this.selectedWorkflow().webhooks || !this.selectedWorkflow().webhooks[0]) return ''
      else {
        if (this.selectedWorkflow().webhooks[0].requestId) return this.selectedWorkflow().webhooks[0].requestId
        else return ''
      }
    },
  },
};
</script>