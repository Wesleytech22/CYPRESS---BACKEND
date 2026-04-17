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