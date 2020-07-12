import Vue from 'vue'
import { getField, updateField } from 'vuex-map-fields'
import _ from 'lodash'

const state = () => ({
    numberOfRows: 5,
    page: 0,
    
    filter: 'active',

    allRequests: [],

    requestDetails: {},

    requestId: '',

    searchTerm: '',

    editing: false,
})

const getters = {
    getField,
    selectedRequest: (state, getters) => () => {
        return state.requestDetails
    },
    currentPage: (state, getters) => () => {
        return (getters.totalPages() === 0) ? 0 : state.page + 1
    },
    totalPages: (state, getters) => () => {
        return getters.chunkedRequests().length
    },
    pagination: (state, getters) => () => {
        return `${getters.currentPage()} / ${getters.totalPages()}`
    },

    requestsByFilter: (state, getters) => () => {
        return _.filter(state.allRequests, (request) => {
            if (state.filter === 'active') {
                if (request.active) return true
                else return false
            } else if (state.filter === 'deleted') {
                if (!request.active) return true
                else return false
            } else {
                return true
            }
        })
    },
    requestsBySearchTerm: (state, getters) => () => {
        return _.filter(getters.requestsByFilter(), (request) => {
            if (state.searchTerm === '') return true

            if (_.includes(request.url, state.searchTerm)) return true;
            else return false;
        })
    },
    chunkedRequests: (state, getters) => () => {
        return _.chunk(getters.requestsBySearchTerm(), state.numberOfRows)
    },
    viewableRequests: (state, getters) => () => {
        return getters.chunkedRequests()[state.page]
    },
}

const actions = {
    previousPage({ commit, state, getters, rootState }) {
        if (getters.currentPage() <= 1) return
        commit('decrementPage')
    },
    nextPage({ commit, state, getters, rootState }) {
        if (getters.currentPage() === getters.totalPages()) return
        commit('incrementPage')
    },
    async getRequests({ commit, state, getters, rootState }, payload) {
        const projectId = (payload && payload.projectId) ? payload.projectId : rootState.request.requestProject.projectId
        const requestUrl = `${rootState.request.apiUrl}/get-requests`
        const requestBody = { projectId }
        const request = await Vue.$axios.post(requestUrl, requestBody)
        commit('replaceRequests', { requests: request.data })
        commit('resetPage')
    },
    async selectOrDeselectRow({ commit, state, getters, rootState }, { _id }) {
        if (state.requestId === _id) {
            commit('changeRequestId', { requestId: ''})
            commit('updateRequestDetails', {})
        } else {
            commit('changeRequestId', { requestId: _id })
            const requestUrl = `${rootState.request.apiUrl}/get-request-details`
            const requestBody = { requestId: _id }
            const request = await Vue.$axios.post(requestUrl, requestBody)
            commit('updateRequestDetails', request.data)
        }
    },
    async cancelChanges({ commit, state, getters, rootState }) {
        if (!state.editing) return;

        const requestUrl = `${rootState.request.apiUrl}/get-request-details`
        const requestBody = { requestId: state.requestId }
        const request = await Vue.$axios.post(requestUrl, requestBody)
        commit('updateRequestDetails', request.data)
        commit('stopEditing')
    },
    async saveChanges({ commit, state, getters, rootState }) {
        if (!state.editing) return;

        const requestUrl = `${rootState.request.apiUrl}/save-changes`
        const requestBody = state.requestDetails
        const request = await Vue.$axios.post(requestUrl, requestBody)
        commit('stopEditing')
    },
    async addRequestDetailItem({ commit, state, getters, rootState }) {
        const requestDetailOption = rootState.request.requestOptions.option
        const requestUrl = `${rootState.request.apiUrl}/add-request-detail-item`
        const requestBody = { _id: state.requestId, requestDetailOption: requestDetailOption }
        const request = await Vue.$axios.post(requestUrl, requestBody)
        commit('updateRequestDetailItem', { requestDetailOption, item: request.data })
    },
    async deleteRequestDetailItem({ commit, state, getters, rootState }, payload) {
        const requestDetailOption = rootState.request.requestOptions.option
        const requestId = state.requestId
        const requestDetailItemId = payload._id
        const requestUrl = `${rootState.request.apiUrl}/delete-request-detail-item`
        const requestBody = { _id: requestId, requestDetailOption, requestDetailItemId }
        const request = await Vue.$axios.post(requestUrl, requestBody)
        commit('removeRequestDetailItem', { requestDetailOption, requestDetailItemId })
    },
}

const mutations = {
    updateField,
    decrementPage(state) {
        state.page--
    },
    incrementPage(state) {
        state.page++
    },
    changeFilter(state, { filter }) {
        state.filter = filter
        state.page = 0
    },
    resetPage(state) {
        state.page = 0
    },
    replaceRequests(state, { requests }) {
        state.allRequests = requests
    },
    changeRequestId(state, { requestId }) {
        state.requestId = requestId
    },
    updateRequestDetails(state, payload) {
        state.requestDetails = { ...payload }
    },
    editRequestDetail(state, payload) {
        state.editing = true
        state.requestDetails[payload.type][payload.key] = payload.value
    },
    editRequestDetailKey(state, payload) {
        state.editing = true
        _.each(state.requestDetails[payload.type], (obj) => {
            if (obj._id === payload.key) {
                obj.key = payload.value
            }
        })
    },
    editRequestDetailValue(state, payload) {
        state.editing = true
        _.each(state.requestDetails[payload.type], (obj) => {
            if (obj._id === payload.key) {
                obj.value = payload.value
            }
        })
    },
    editRequestDetailAcceptInput(state, payload) {
        state.editing = true
        _.each(state.requestDetails[payload.type], (obj) => {
            if (obj._id === payload.key) {
                obj.acceptInput = payload.value
            }
        })
    },
    updateRequestDetailItem(state, payload) {
        state.requestDetails[payload.requestDetailOption].push(payload.item)
    },
    removeRequestDetailItem(state, payload) {
        state.requestDetails[payload.requestDetailOption] = _.filter(state.requestDetails[payload.requestDetailOption], (obj) => {
            if (obj._id === payload.requestDetailItemId) return false;
            else return true;
        })
    },
    stopEditing(state) {
        state.editing = false
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}