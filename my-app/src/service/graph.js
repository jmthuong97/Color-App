const graphApiVersion = 'v2.10'
const groupId = 1422813044661597;

const graph = async (token, resource, params = {}, method = 'GET') => {
    let url = `https://graph.facebook.com/${graphApiVersion}/${resource}?access_token=${token}`
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

export const getSelfUser = async (token) => {
    const user = await node(token, 'me')
    const pictureJson = await edge(token, 'me/picture', {
        type: 'large',
        redirect: false
    })
    user.avatar = pictureJson.url
    return user
}

export const getGroupData = async (token) => {
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

export const getPostData = async (token, postId) => {
    const json = await node(token, `${postId}`, {
        fields: 'comments.limit(9999){message,created_time,from{id,last_name,first_name,middle_name,picture}}'
    })
    return json;
}

export const getAllMembers = async (token) => {
    const json = await node(token, `${groupId}`, {
        fields: 'members.limit(9999){id,name,link,picture.type(large).redirect(false)}'
    })
    let output = []
    if (json.members) {
        let members = json.members.data
        for(let i=0; i< members.length; i++) {
            let options = {}
            options.text = members[i].name
            options.value = members[i].id
            options.image = members[i].picture.data.url
            output.push(options)
        }
    }
    return output;
}