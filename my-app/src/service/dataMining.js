import axios from "../axios";

export const changeTypeConfirm = async (groupId, comments, type) => {
    let membersGroup = getMembersByGroupId(groupId)
    let arrUserCommented = await formatDataComments(comments)




    console.log(arrUserCommented)
}

// get array uid of member in group
const getMembersByGroupId = async (id) => {
    let members = []
    await axios.get(`/${id}/members`)
        .then(result => {
            members = result.data.map(member => member.idFb)
        })
        .catch(err => console.log(err))
    return members
}

// return array idUser if commented
const formatDataComments = async (comments) => {
    let output = []
    comments.map(comment => {
        if (comment.message.trim() !== "") {
            let uid = comment.from.id
            pushIfNotExist(output, uid)
        }
    })
    return output
}

// check item do not dupplicate in array
const pushIfNotExist = (arr, uid) => {
    if (isExist(arr, uid)) {
        arr.push(uid)
    }
    return arr
}

const isExist = (arr, item) => {
    let check = true
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === item) {
            check = false
        }
    }
    return check
}