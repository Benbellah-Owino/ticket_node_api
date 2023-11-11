
const log_date_now = ()=>{
    let date = new Date()
    let date_string = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDay()}  ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`

    return date_string
}

module.exports = log_date_now
