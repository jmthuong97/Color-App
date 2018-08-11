const mongoose = require('mongoose');
const groupSchema = require("../model/GroupSchema");
const graph = require("../api/Graph")
const service = require("../service")

// create new group
let createGroup = (name, description, status) =>
    new Promise((resolve, reject) => {
        groupSchema
            .create({
                name,
                description,
                status
            })
            .then(data => resolve({
                id: data._id
            }))
            .catch(err => reject(err));
    })

// add more member into group
let addMember = (groupId, memberId) =>
    new Promise((resolve, reject) => {
        groupSchema
            .findByIdAndUpdate(groupId, {
                $addToSet: {
                    'members': mongoose.Types.ObjectId(memberId)
                }
            }, {
                upsert: true
            }).then(data => resolve({
                id: data._id
            }))
            .catch(err => reject(err));
    });

// delete one member in group
let deleteMember = (groupId, memberId) =>
    new Promise((resolve, reject) => {
        console.log(memberId)
        groupSchema
            .update({
                _id: groupId
            }, {
                $pull: {
                    members: memberId
                }
            })
            .then(data => resolve(data))
            .catch(err => reject(err))
    })


// update information of group
let updateGroup = (id, name, description, status) =>
    new Promise((resolve, reject) => {
        groupSchema
            .update({
                _id: id
            }, {
                name,
                description,
                status
            })
            .then(data => resolve({
                id: data._id
            }))
            .catch(err => reject(err));
    });

// get all groups
const getAllGroups = () =>
    new Promise((resolve, reject) => {
        groupSchema
            .find({})
            .exec()
            .then(data => {
                let output = []
                data.map((group) => {
                    let option = {}
                    option.key = group._id
                    option.value = group._id
                    option.text = group.name
                    output.push(option)
                })
                resolve(output)
            })
            .catch(err => reject(err));
    });

// merge data group with data fb
const mergeDataGroup = async (id, page, token) => {
    let data = await getGroup(id, page)
    // console.log(data)
    console.log(data.members.length)
    let json = await graph.getDataMembers(token, data.members) // get data api fb of all users in group
    if (!json) return data
    else {
        let output = {}
        let allMembers = await getMembers(id)

        output.group = {}
        output.group.id = id
        output.group.name = data.name
        output.group.description = data.description
        output.group.status = data.status
        output.group.size = allMembers.length
        output.group.createdAt = service.getDateInVietnamese(data.createdAt)

        output.members = []
        const arr = Object.keys(json).map(i => json[i])
        arr.map((member, index) => {
            let m = {}
            m.id = data.members[index].id
            m.idFb = member.id
            m.link = service.getProfileLink(member.id)
            m.fullname = member.name
            m.name = member.first_name
            m.subname = service.getSubname(member.last_name, member.middle_name)
            m.gender = member.gender
            m.birthday = member.birthday
            m.course = data.members[index].course
            m.address = data.members[index].address
            m.numberPhone = data.members[index].numberPhone
            m.hometown = member.hometown ? member.hometown.name : ''
            m.avatar = member.picture ? member.picture.data.url : ''
            output.members.push(m)
        })
        return output
    }
}

// get group by id
const getGroup = (id, page) =>
    new Promise((resolve, reject) => {
        groupSchema
            .findOne({
                _id: id
            }, {
                members: {
                    $slice: [((page - 1) * 50), 50]
                }
            })
            .populate('members')
            .exec()
            .then(data => resolve(data))
            .catch(err => reject(err));
    });

// get size member of group
const getMembers = (id) =>
    new Promise((resolve, reject) => {
        groupSchema
            .findOne({
                _id: id
            })
            .populate('members')
            .exec()
            .then(data => {
                resolve(data.members)
            })
            .catch(err => reject(err));
    });

// delete group
const deleteGroup = (id) =>
    new Promise((resolve, reject) => {
        groupSchema.findByIdAndRemove(id, (err, data) => {
            if (err) reject(false)
            else resolve(data)
        })
    })

module.exports = {
    createGroup,
    addMember,
    getMembers,
    deleteMember,
    updateGroup,
    getAllGroups,
    getGroup,
    mergeDataGroup,
    deleteGroup
}