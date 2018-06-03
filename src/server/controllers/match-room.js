const model = require('../../../model')
const logger = require('../../../logConfig')
const UA = require('ua-device')

let User = model.User

var lastPerson = ''
var lastChannel = ''

var fn_match_channel = async(ctx, next) => {
    const name = ctx.request.body["name"]
    const gender = ctx.request.body["gender"]
    const agent = "用户的user-agent"
    const ip = ctx.ip
    const now = Date.now()
    var new_user = await User.create({
        name: name,
        gender: gender,
        agent: agent,
        limited: now,
    })
    logger.info('匿名用户[注册成功]: ' + JSON.stringify(new_user))
    let user = {
        id: new_user.id,
        name: new_user.name,
        gender: new_user.gender,
    }
    let value = Buffer.from(JSON.stringify(user)).toString('base64')
    ctx.state.user = user
    ctx.cookies.set('name', value)
    logger.info('匿名用户[登录成功]:' + user.id + user.name + user.gender)

    let channel
    let channelType
    if(lastChannel === '' || lastPerson === ctx.state.user.id) {
        channel = new Date().getTime().toString()
        lastChannel = channel
        lastPerson = ctx.state.user.id
        channelType = "new"
    } else {
        channel = lastChannel
        lastChannel = ''
        lastPerson = ctx.state.user.id
        channelType = "old"
    }

    ctx.state.channel = channel
    ctx.cookies.set('channel', channel)
    const data = {type: channelType}
    ctx.body = JSON.stringify(data)
}

var fn_match_room = async(ctx, next) => {
    ctx.cookies.set('name', '',{signed:false,maxAge:0})
    ctx.cookies.set('channel', '',{signed:false,maxAge:0})

    let useragent = ctx.request.header['user-agent']
    let media = await new UA(useragent).device['type']
	let mediaClass = media === 'mobile' ? 'mobileanonymous.html' : 'anonymous.html'
    ctx.render(mediaClass, {
        title: 'AiCi'
    })
}

module.exports = {
    'GET /': fn_match_room,
    'POST /anonymous': fn_match_channel,
}