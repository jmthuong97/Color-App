const getSubname = (last_name, middle_name) => {
    return middle_name ? (last_name + middle_name) : last_name
}

const getDateInVietnamese = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.getMonth() + 1
    const hour = date.getHours()
    const minute = date.getMinutes()
    return `${day} Tháng ${month} lúc ${hour}:${minute}`
}

const getProfileLink = (id) => {
    return "https://facebook.com/" + id
}

module.exports = {
    getSubname,
    getProfileLink,
    getDateInVietnamese
}