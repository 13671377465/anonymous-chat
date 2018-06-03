const Koa = require('koa')
const ws = require('ws')
const Cookies = require('cookies')
const fs = require('fs')
const url = require('url')
const path = require('path')
const bodyParser = require('koa-bodyparser')
const static = require('koa-static')
const views = require('koa-views')
const logger = require('./logConfig')
const config = require('./config')
const controller = require('./controller.js')
const templating = require('./templating.js')
const model = require('./model')

const app = new Koa()
const WebSocketServer = ws.Server
const isProduction = process.env.NODE_ENV === 'production'

let 
	Chat = model.Chat,
	User = model.User

//解析user函数
function parseUser(obj) {
	if (!obj) {
		return
	}
	let s = ''
	if (typeof obj === 'string') {
		s = obj
	} else if (obj.headers) {
		let cookies = new Cookies(obj, null)
		s = cookies.get('name')
	}
	if (s) {
		try {
			let user = JSON.parse(Buffer.from(s, 'base64').toString())
			return user
		} catch (e) {
			logger.warn('Parsing Error: ' + e)
		}
	}
}

function parseChannel(obj) {
	if (!obj) {
		return;
	}
	let s = ''
	if (typeof obj === 'string') {
		s = obj;
	} else if (obj.headers) {
		let cookies = new Cookies(obj, null)
		s = cookies.get('channel')
	}
	if (s) {
		try {
			return s
		} catch (e) {
			logger.warn('Parsing Error: ' + e)
		}
	}
}

function saveMessage(channel, owner, toOwner, text, isread) {
	(async() => {
		var new_chat = await Chat.create({
			ownerId: owner,
			text: text,
			toOwnerId: toOwner,
			isread: isread
		})
		logger.debug('saveMessage: ' + JSON.stringify(new_chat))
	})()
}

// parse user from cookie:
app.use(async (ctx, next) => {
	let user = parseUser(ctx.cookies.get('name') || '')
	let channel = parseChannel(ctx.cookies.get('channel') || '')
	if(user && channel) {
		ctx.state.user = user
		ctx.state.channel = channel
		logger.debug(`${ctx.state.user.name} 正在请求资源..., Ta目前所在频道为 ${ctx.state.channel}`)
		await next()
	}else {
		ctx.state.user = user
		ctx.state.channel = channel
		logger.debug(`未注册用户正在请求资源...`)
		await next()
	}	
});

//加载静态资源文件
app.use(static(path.join(__dirname, '/dist/')))

//解析url
app.use(bodyParser())

//加载相应模板
app.use(templating('dist/assets', {
	noCache: !isProduction,
	watch: !isProduction
}))
// app.use(views(path.join(__dirname, '/dist'), {
// 	extension: 'html'
//   }))

//加载controllers,生成url map
app.use(controller())

//启动 WebSocket Server
var server = app.listen(config.port)

function createWebSocketServer(server, onConnection, onMessage, onClose, onError) {
	let wss = new WebSocketServer({
		server: server
	})
	wss.broadcast = function broadcast(data) {
		let temp_data = JSON.parse(data)
		let same_channel = temp_data.channel
		for (var client of wss.clients) {
			if (client.channel === same_channel) {   		
				if(temp_data.type === 'chat' && temp_data.user.id !== client.user.id){
					saveMessage(same_channel, temp_data.user.id, client.user.id, temp_data.data, true);
				} 		
				client.send(data)
			}
		}
	}
	onConnection = onConnection || function () {
		logger.debug('[WebSocket] connected.')
	}
	onMessage = onMessage || function (msg) {
		logger.debug('[WebSocket] message received: ' + msg)
	}
	onClose = onClose || function (code, message) {
		logger.debug(`[WebSocket] closed: ${code} - ${message}`)
	}
	onError = onError || function (err) {
		logger.debug('[WebSocket] error: ' + err)
	}
	wss.on('connection', function (ws) {
		let location = url.parse(ws.upgradeReq.url, true)
		logger.info('[WebSocketServer] connection: ' + location.href)
		ws.on('message', onMessage);
		ws.on('close', onClose)
		ws.on('error', onError)
		if (location.pathname !== '/ws/chat') {
			ws.close(4000, 'Invalid URL');
		}

		// check user:
		let user = parseUser(ws.upgradeReq)
		let channel = parseChannel(ws.upgradeReq)
		if (!user) {
			ws.close(4001, 'Invalid user')
		}

		ws.channel = channel 
		ws.user = user

		ws.wss = wss
		onConnection.apply(ws)
	})
	logger.info('[开始运行]: WebSocketServer was attached.')
	return wss
}

var messageIndex = 0

function createMessage(type, user, data, channel) {
	messageIndex++
	if(type !== 'list' && type !== 'event') {
		logger.info('[聊天室消息]:', channel, data)
	}
	return JSON.stringify({
		id: messageIndex,
		type: type,
		user: user,
		channel: channel,
		data: data,
		time: new Date()
	})
}

function onConnect() {
	let user = this.user
	let channel = this.channel
	var clients = this.wss.clients

	//build user list:
	for (var client of clients) {
		if (client.channel === channel) {
			let users = [client.user]
			for(var c of clients){
				if (c.channel === channel && c.user !== client.user) {
					users.push(c.user)
				}
			}
			client.send(createMessage('list', user, users, channel))
		}
	}

	let msg = createMessage('join', user, `用户 ${user.name} 加入了 ${channel} 频道。`, channel)
	this.wss.broadcast(msg)
}

function onMessage(message) {
	if (message) {
		console.log(message)
		let m = message.split(",")
		let type = m[0]
		let text = m[1]
		let msg = createMessage(type, this.user, text, this.channel)
		this.wss.broadcast(msg)
	}
}

function onClose() {
	let user = this.user
	let channel = this.channel
	let msg = createMessage('left', user, `对方离开了...`, channel)
	this.wss.broadcast(msg)
}

app.wss = createWebSocketServer(server, onConnect, onMessage, onClose);
logger.info(`[开始运行]: app started at port ${config.host}...`);