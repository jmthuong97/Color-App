const fetch = require("node-fetch")

const graphApiVersion = 'v2.10'
const groupId = 1422813044661597;

const graph = async (token, resource, params = {}, type, method = 'GET') => {
    let url = `https://graph.facebook.com/${graphApiVersion}/${resource}${type? '&': '?'}access_token=${token}`
    Object.entries(params).forEach(([key, value]) => {
        url += `&${key}=${value}`
    })
    const response = await fetch(url, {
        method
    })
    const json = await response.json()

    return json
}
const node = graph
const edge = async (...args) => {
    const json = await graph(...args)
    return json.data
}

const getSelfUser = async (token) => {
    const user = await node(token, 'me')
    const pictureJson = await edge(token, 'me/picture', {
        type: 'large',
        redirect: false
    })
    user.avatar = pictureJson.url
    return user
}

const getGroupData = async (token) => {
    const json = await node(token, `${groupId}`, {
        fields: 'admins.limit(9999),feed.limit(20){attachments,type,message,created_time,from{name,picture.type(large).redirect(false)}}'
    })
    const group = {}
    group.admins = json.admins ? json.admins.data : []
    group.feed = json.feed.data
    group.feed.forEach(post => {
        post.from.avatar = post.from.picture.data.url
        delete post.from.picture
    })
    return group
}

const getPostData = async (token, postId) => {
    const json = await node(token, `${postId}`, {
        fields: 'comments.limit(9999){message,created_time,from{id,last_name,first_name,middle_name,picture}}'
    })
    return json;
}

// get all data member of group(group on mlab)
const getUsersData = async (token, ids) => {
    let listUid = '?ids='
    ids.map((id, index) => {
        listUid += (ids.length - 1) == index ? `${id}` : `${id},`
    });
    const json = await node(token, `${listUid}`, {
        fields: 'id,name,first_name,middle_name,last_name,hometown,birthday,gender,picture.type(large).redirect(false)'
    }, 'type')
    return json
}

const getDataMembers = async (token, members) => {
    let ids = []
    members.map((member) => ids.push(member.idFb))

    if (ids.length == 0) return {}
    else if (ids.length <= 50) return getUsersData(token, ids)
    else {
        // Phần này cho trường hợp mảng id nhiều hơn 50 (Phải làm riêng vì max request trong 1 lần gửi của FB là 50)
        // let currentArr = []
        // let count = ids.length % 50 == 0 ? (ids.length / 50) : ((ids.length / 50) + 1)
        // for (let i = 0; i < count; i++) {
        // }
    }
}

module.exports = {
    getSelfUser,
    getGroupData,
    getPostData,
    getDataMembers
}