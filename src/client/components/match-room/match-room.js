import React from 'react'
import ReactDOM from 'react-dom'
import {Media} from '../media/media'
import './match-room-h5css.css'
import './match-room-webcss.css'


class MatchRoom extends React.Component {
    constructor(props) {
        super(props)
    }

    componentWillMount() {
        this.props.changeHeader(true)
        this.props.changeFooter(true)
        const userlist = this.props.userlist
        this.lastuser = userlist.find((value)=>{
            return value.name !== this.props.name
        })["gender"]=== "1" ? "男孩子" : "女孩子"
    }

    componentDidUpdate(prevProps, preState) {
        if(prevProps.messagelist.length !== this.props.messagelist.length) {
            this.messagelist.scrollTop = this.messagelist.scrollHeight
        }
        let input = this.formchat.childNodes[0]
        let button = this.formchat.childNodes[1]

        switch(this.props.errCode) {
            case 0:
                input.vlaue = ""
                input['placeholder'] = " 请重新匹配吧"
                input["disabled"] = "disabled"
                button["disabled"] = "disabled"
                break
            case 1:
                input.vlaue = ""
                input["placeholder"] = " 连接已断开，请重新匹配"
                input["disabled"] = "disabled"
                button["disabled"] = "disabled"
                break
            default:
                break
        }
    }

    componentDidMount() {
        ReactDOM.findDOMNode(this).querySelector('form').childNodes[0].addEventListener('click', this.resizeHandle)
    }

    componentWillUnmount() {
        this.props.changeHeader(false)
        this.props.changeFooter(false)
        ReactDOM.findDOMNode(this).querySelector('form').childNodes[0].removeEventListener('click', this.resizeHandle)
    }

    resizeHandle() {
        let timer = setTimeout(()=>{
            document.querySelector('.media-container').scrollTop = document.querySelector('.media-container').scrollHeight
            clearTimeout(timer)
        },500)
    }

    render() {
        const eventlist = this.props.eventlist
        const messages = [{
            "data": "「 发送一个有趣的开场白吧 」",
            "type": "hello",
            "id": 1,
        }].concat(this.props.messagelist)

        const title = () => {
            let lastUserEvent = eventlist.filter(value => {
                return value.user["name"] !== this.props.name
            })
            let lastEvent = lastUserEvent[lastUserEvent.length-1]
            if(lastEvent && lastEvent.data === "true") {
                return "正在输入中..."
            }else {
                return "成功匹配到"+this.lastuser
            }
        }

        const media = messages.map((value, index) => {
            return (
                <Media name={this.props.name} message={value} restartMatch={()=>this.props.restartMatch()} key={index}/>
            )
        })
        
        return (
            <section className="match-room-context">
            <article className="match-room">
                <section className="match-room-title"><span>{title()}</span><span onClick={this.props.chatout}>退出聊天</span></section>
                <section className="match-room-container">
                    <div className="media-container" ref={dom => this.messagelist = dom}>
                        {media}
                    </div>
                </section>
                <section className="match-room-input">
                    <form ref={dom => this.formchat = dom} action="#0" onSubmit={this.props.submitMessage}>
                        <input type="text" onFocus={this.props.focusMessage} onBlur={this.props.blurMessage}/><button type="submit">发送</button>
                    </form>
                </section>
            </article>
            </section>
        )
    }
}

export {MatchRoom}