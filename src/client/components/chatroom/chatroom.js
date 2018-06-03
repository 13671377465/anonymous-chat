import React from 'react'
import {Greeting} from '../greeting/greeting'

class ChatRoom extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userlist: [],
            messagelist: [],
            eventlist: [],
            errCode: -1
        }
        this.checkChannel = this.checkChannel.bind(this)
        this.setWebSocket = this.setWebSocket.bind(this)
        this.buildChannel = this.buildChannel.bind(this)
        this.name = this.getRandomId()
        this.command = {
            list: function (msg) {
                // console.log(msg)
                this.setState({userlist: msg.data})
            },
            join: function (msg) {
                // console.log(msg)
            },
            left: function (msg) {
                // console.log(msg)
                let messagelist = this.state.messagelist
                this.setState({
                  messagelist: messagelist.concat([msg]),
                  errCode: 0
                })
            },
            chat: function (msg) {
                // console.log(msg)
                this.setState(preState => ({
                  messagelist: [...preState.messagelist, msg]
                }))
            },
            event: function (msg) {
                // console.log(msg)
                this.setState(preState => ({
                  eventlist: [...preState.eventlist, msg]
                }))
            }
        }
    }

    getRandomId() {
        return Date.now().toString()+Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString()+Math.floor(Math.random()*10).toString()
    }

    submitMessage(event) {
        event.preventDefault()
        const target = event.target
        let input = target.childNodes[0]
        let text = input.value.trim()
        if (text) {
            input.value = ""
            this.ws.send("chat,"+text)
        }
    }

    focusMessage(event) {
        this.ws.send("event,true")
    }

    blurMessage(event) {
        this.ws.send("event,false")
    }

    restartMatch(){
        this.ws.close()
        this.props.changeHeader(false)
        this.props.changeFooter(false)
        this.setState({
            userlist: [{}],
            messagelist: [],
            eventlist: []
        })
        this.buildChannel(this.gender)
    }

    chatout() {
        this.ws.close()
        this.setState({
            userlist: [],
            messagelist: [],
            eventlist: []
        })
    }

    checkChannel(type) {
        if(type["type"] === "old" && this.state.userlist.length !== 2) {
            console.log("调用")
            this.ws.close()
            this.buildChannel(this.gender)
            clearInterval(this.timer)
        }else {
            clearInterval(this.timer)
        }
    }

    setWebSocket() {
        if(document.domain === 'www.eastcity.top') {
            this.ws = new WebSocket('ws://www.eastcity.top' + '/anony/ws/chat')
        }else if(document.domain === 'eastcity.top') {
            this.ws = new WebSocket('ws://eastcity.top' + ':3001/ws/chat')
        }else if(document.domain === '39.106.52.131') {
            this.ws = new WebSocket('ws://39.106.52.131' + ':3001/ws/chat')
        }else {
            this.ws = new WebSocket('ws://' + document.domain + ':3001/ws/chat')
        }

        this.ws.onmessage = event => {
            let data = event.data
            let msg = JSON.parse(data)
            let type = msg.type
            let command = this.command[type]
            command.call(this, msg)
        }

        this.ws.onclose = event => {
            // console.log('[closed] ' + event.code)
            this.setState({errCode: -1})
        }

        this.ws.onerror = (code, msg) => {
            // console.log('[ERROR] ' + code + ': ' + msg)
            this.setState({errCode: 1})
        }
    }

    buildChannel(mygender) {
        const self = this
        this.gender = mygender
        $.ajax({
            type: "POST",
            dataType: "json",
            data: {
                name: self.name,
                gender: mygender 
            },
            url: '/anony/anonymous',
            beforeSend: function() { 
                // console.log("ajax数据处理中,请稍后...")
            },  
            complete :function(){
                // console.log("ajax数据处理完毕")
            },
            success: function(data) {
                self.setWebSocket()
                self.timer = setInterval(() => self.checkChannel(data), 3000)
            },
            error: function(err) {
                // console.log(err)
            }
        })
    }

    render() {
	    return (
            <Greeting userlist = {this.state.userlist} getGender={gender=>this.buildChannel(gender)} chatout={()=>this.chatout()} userlist={this.state.userlist} messagelist={this.state.messagelist} eventlist={this.state.eventlist} name={this.name} submitMessage={(...args)=>this.submitMessage(...args)} focusMessage={(...args)=>this.focusMessage(...args)} blurMessage={(...args)=>this.blurMessage(...args)} chatout={()=>this.chatout()} errCode={this.state.errCode} changeHeader={state=>this.props.changeHeader(state)} changeFooter={state=>this.props.changeFooter(state)} restartMatch={()=>this.restartMatch()}/>
	    )
    }
}

export {ChatRoom}