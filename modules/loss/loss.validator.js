const { body, param } = require("express-validator");
const newPostValidator = [
    body('title').isString().withMessage('in-valid title'),
    body('desc').isString().withMessage('in-valid description'),
    body('location').isString().withMessage('in-valid location'),
];
const idValidator = [
    param("id").isLength({ options: { min: 24, max: 24 } }).withMessage('invalid id')
]
const reportValidator =[
    param("id").isLength({ options: { min: 24, max: 24 } }).withMessage('invalid id'),
    body("reportComment").isString().withMessage('invalid comment')

]
module.exports = {
    newPostValidator,
    idValidator,
    reportValidator
}