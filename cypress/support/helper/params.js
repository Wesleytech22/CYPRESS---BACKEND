export const Params = {
    listCorporations: () => ({
        page: 1,
        limit: 20,
        sortBy: 'createdAt',
        orderBy: 'ASC',
        _t: Date.now()
    }),
    searchCorporations: (keyword) => ({
        page: 1,
        limit: 20,
        key: keyword,
        sortBy: 'createdAt',
        orderBy: 'ASC',
        _t: Date.now()
    }),
    corporationsByStatus: (status) => ({
        page: 1,
        limit: 20,
        status: status,
        _t: Date.now()
    }),
    builder: () => {
        let params = {}
        return {
            paginate: (page, limit) => { params.page = page; params.limit = limit; return this },
            sortBy: (field, order) => { params.sortBy = field; params.orderBy = order; return this },
            noCache: () => { params._t = Date.now(); return this },
            build: () => params
        }
    }
}

export default Params