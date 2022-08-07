const roles = {
    user: 'user',
    admin: 'admin'
}

const endPoint = {
    viewProfile: [roles.admin, roles.user],
    completeProfile: [roles.user],
    changePass: [roles.admin, roles.user]
}

module.exports = endPoint