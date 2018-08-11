const userSchema = require("../model/UserSchema");

// create new user
let createUser = (idFb) =>
    new Promise((resolve, reject) => {
        userSchema
            .create({
                idFb: idFb
            })
            .then(data => resolve(data))
            .catch(err => reject(err));
    })

let isExistsUser = (userId) =>
    new Promise((resolve, reject) => {
        userSchema
            .find({
                idFb: userId
            })
            .lean()
            .then((data) => {
                if (data.length == 0) {
                    createUser(userId)
                        .then(result => resolve(result._id))
                        .catch(err => reject(err));
                } else resolve(data[0]._id)
            })
            .catch(err => reject(err));
    })

// update information of user
let updateUser = (id, {
        course,
        address,
        numberPhone
    }) =>
    new Promise((resolve, reject) => {
        userSchema
            .update({
                _id: id
            }, {
                course,
                address,
                numberPhone
            })
            .then(data => resolve(data))
            .catch(err => reject(err));
    });

// change status group
let updateStatusUser = (userId, status) =>
    new Promise((resolve, reject) => {
        userSchema
            .update({
                _id: userId
            }, {
                status
            }).then(data => resolve(data))
            .catch(err => reject(err));
    });

// get all users
const getAllUsers = () =>
    new Promise((resolve, reject) => {
        userSchema
            .find({})
            .exec()
            .then(data => resolve(data))
            .catch(err => reject(err));
    });

// get group by id
const getUser = (id) =>
    new Promise((resolve, reject) => {
        userSchema
            .findOne({
                _id: id
            })
            .exec()
            .then(data => resolve(data))
            .catch(err => reject(err));
    });

module.exports = {
    createUser,
    updateUser,
    updateStatusUser,
    getAllUsers,
    getUser,
    isExistsUser
}