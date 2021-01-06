
const getters = {
    getField,
    pagination: (state, getters) => () => {
        return `${getters.currentPage()} / ${getters.totalPages()}`
    },
    currentPage: (state, getters) => () => {
        return (getters.totalPages() === 0) ? 0 : state.page + 1
    },
    totalPages: (state, getters) => () => {
        return getters.chunkedData().length
    },
    dataByFilter: (state, getters) => () => {
        return _.filter(state.allData, (data) => {
            if (state.filter === 'active') {
                if (data.active) return true
                else return false
            } else if (state.filter === 'archived') {
                if (!data.active) return true
                else return false
            }
        })
    },
    dataBySearchTerm: (state, getters) => () => {
        return _.filter(getters.dataByFilter(), (data) => {
            if (state.searchTerm === '') return true

            if (state.currentRoute === 'Requests') {
                if (_.includes(data.name, state.searchTerm) || _.includes(data.url, state.searchTerm)) return true;
                else return false;
            } else if (state.currentRoute === 'Workflows') {
                if (_.includes(data.name, state.searchTerm)) return true;
                else return false;
            } else if (state.currentRoute === 'Storage') {
                if (_.includes(data.name, state.searchTerm) || _.includes(data.storageType, state.searchTerm)) return true;
                else return false;
            }
        })
    },
    sortedData: (state, getters) => () => {
        return getters.dataBySearchTerm().sort(function compare(a, b) {
            var dateA = new Date(a.createdAt)
            var dateB = new Date(b.createdAt)
            if (state.orderDirection === 'ascending') {
                return dateA - dateB
            } else if (state.orderDirection === 'descending') {
                return dateB - dateA
            }
        })
    },
    chunkedData: (state, getters) => () => {
        return _.chunk(getters.sortedData(), state.numberOfRows)
    },
    viewableData: (state, getters) => () => {
        return getters.chunkedData()[state.page]
    },
    selectedData: (state, getters, rootState) => () => {
        if (state.selectedId === '') return {}

        return _.filter(state.allData, (data) => {
            if (data._id === state.selectedId) return true;
            else return false;
        })[0]
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
    async selectOrDeselectRow({ commit, state, getters, dispatch, rootState }, data) {
        if (state.editing) return;

        if (state.selectedId === data._id) {
            commit('changeSelectedId', { selectedId: '' })
        } else {
            commit('changeSelectedId', { selectedId: data._id })
        }
    },
}

const mutations = {
    updateField,

    // GENERAL MUTATIONS
    setCurrentRoute(state, payload) {
        state.currentRoute = payload.route
    },
    resetPage(state) {
        state.page = 0

        if (state.allData && _.size(state.allData)) {
            if (state.orderDirection === 'descending') {
                state.selectedId = state.allData[0]._id
            } else {
                state.selectedId = state.allData[_.size(state.allData) - 1]._id
            }
        }
    },
    changeFilter(state, { filter }) {
        state.filter = filter
        state.page = 0
        state.selectedId = ''
    },
    stopEditing(state) {
        state.editing = false
    },
    decrementPage(state) {
        state.page--
    },
    incrementPage(state) {
        state.page++
    },
    changeOption(state, payload) {
        if (state.editing) return;
        
        state.option = payload
    },
    replaceAllData(state, { data }) {
        state.allData = data
    },
    changeSelectedId(state, { selectedId }) {
        state.selectedId = selectedId
    },
    updateSearchTerm(state, payload) {
        state.searchTerm = payload
    },
    updateOrderDirection(state, payload) {
        state.orderDirection = payload.orderDirection
        localStorage.setItem('orderDirection', state.orderDirection)
    },
    toggleOrderDirection(state, payload) {
        if (state.orderDirection === 'ascending') {
            state.orderDirection = 'descending'
        } else if (state.orderDirection === 'descending') {
            state.orderDirection = 'ascending'
        }

        localStorage.setItem('orderDirection', state.orderDirection)

        state.page = 0
        state.selectedId = ''
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}