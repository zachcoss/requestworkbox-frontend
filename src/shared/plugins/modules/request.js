import requestProject from './RequestProject'
import requestMenu from './RequestMenu'
import requestTable from './RequestTable'
import requestOptions from './RequestOptions'
import requestOptionsParameters from './RequestOptionsParameters'
import requestOptionsQuery from './RequestOptionsQuery'
import requestOptionsHeaders from './RequestOptionsHeaders'

const state = () => ({
    apiUrl: 'http://localhost:3000'
})

const getters = {

}


const actions = {

}

const mutations = {

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
    modules: {
        requestProject,
        requestMenu,
        requestTable,
        requestOptions,
        requestOptionsParameters,
        requestOptionsQuery,
        requestOptionsHeaders,
    }
}