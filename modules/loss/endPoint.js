const roles = {
    user: 'user',
    admin: 'admin'
}

const endPoint = {
    addNewPost: [roles.user],
    getAll: [roles.admin,roles.user],
    found: [roles.admin,roles.user],
    getReported: [roles.admin],
    reportPosts:[roles.admin,roles.user],
    blockPosts:[roles.admin],
    delete:[roles.user],
}

module.exports = endPoint