export const Endpoints = {
    auth: {
        login: '/api-acl/authentication/login',
        logout: '/api-acl/authentication/logout',
        refresh: '/api-acl/authentication/refresh'
    },
    corporation: {
        base: '/api-acl/corporation',
        byId: (id) => `/api-acl/corporation/${id}`,
        update: (id) => `/api-acl/corporation/${id}`,
        delete: (id) => `/api-acl/corporation/${id}`,
        activate: (id) => `/api-acl/corporation/${id}/activate`,
        deactivate: (id) => `/api-acl/corporation/${id}/deactivate`
    },
    company: {
        base: '/api-acl/company',
        createWithSubsidiary: '/api-acl/company/create-with-subsidiary',
        byId: (id) => `/api-acl/company/${id}`,
        update: (id) => `/api-acl/company/${id}`,
        delete: (id) => `/api-acl/company/${id}`,
        byCorporation: (corporationId) => `/api-acl/corporation/${corporationId}/companies`,
        activate: (id) => `/api-acl/company/${id}/activate`,
        deactivate: (id) => `/api-acl/company/${id}/deactivate`
    },
    subsidiary: {
        base: '/api-acl/subsidiary',
        byId: (id) => `/api-acl/subsidiary/${id}`,
        update: (id) => `/api-acl/subsidiary/${id}`,
        delete: (id) => `/api-acl/subsidiary/${id}`,
        byCompany: (companyId) => `/api-acl/company/${companyId}/subsidiaries`,
        activate: (id) => `/api-acl/subsidiary/${id}/activate`,
        deactivate: (id) => `/api-acl/subsidiary/${id}/deactivate`
    },
    user: {
        base: '/api-acl/user',
        byId: (id) => `/api-acl/user/${id}`,
        byCorporation: (corporationId) => `/api-acl/corporation/${corporationId}/users`
    },
    equipment: {
        base: '/api-acl/equipment',
        byId: (id) => `/api-acl/equipment/${id}`,
        byCorporation: (corporationId) => `/api-acl/corporation/${corporationId}/equipment`
    }
}

export default Endpoints