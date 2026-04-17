class HeadersBuilder {
    constructor() {
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    }

    withAuth(token) {
        this.headers['Authorization'] = `Bearer ${token}`
        return this
    }

    withTenant(tenantCode = 'portal') {
        this.headers['x-tenant-code'] = tenantCode
        return this
    }

    withMultipart() {
        this.headers['Content-Type'] = 'multipart/form-data'
        return this
    }

    withUrlEncoded() {
        this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
        return this
    }

    noCache() {
        this.headers['Cache-Control'] = 'no-cache'
        this.headers['Pragma'] = 'no-cache'
        return this
    }

    withCustom(key, value) {
        this.headers[key] = value
        return this
    }

    build() {
        return this.headers
    }

    reset() {
        this.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        return this
    }
}

export const Headers = {
    jsonAuth: (token, tenantCode = 'portal') => new HeadersBuilder()
        .withAuth(token)
        .withTenant(tenantCode)
        .build(),

    jsonAuthNoCache: (token, tenantCode = 'portal') => new HeadersBuilder()
        .withAuth(token)
        .withTenant(tenantCode)
        .noCache()
        .build(),

    multipartAuth: (token, tenantCode = 'portal') => new HeadersBuilder()
        .withAuth(token)
        .withTenant(tenantCode)
        .withMultipart()
        .build(),

    authOnly: (token, tenantCode = 'portal') => new HeadersBuilder()
        .withAuth(token)
        .withTenant(tenantCode)
        .build(),

    builder: () => new HeadersBuilder()
}

export default Headers