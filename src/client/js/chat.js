import '../css/stylesheet.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {ChatRoom} from '../components/chatroom/chatroom'


function Square(props) {  // 广场模块 后期开发
    return (
        <section className="m-square"></section>
    )
}

class WebPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: "chat"
        }
    }

    changeHeader(state) {
        return
    }

    changeFooter(state) {
        return
    }

    render() {
        let pagewindow = ""
        switch(this.state['page']) {
            case "chat":
                pagewindow = <ChatRoom changeHeader={state=>this.changeHeader(state)} changeFooter={state=>this.changeFooter(state)}/>
                break
            case "square":
                pagewindow = <Square />
                break
        }

        return (
            <div className="web-body">
                <nav class="main-nav">
                    <section>
                        <div class="item-active"><a href="">匿名聊天</a></div>
                        <div><a href="#">素质广场</a></div>
                    </section>
                </nav>
                <article className="main-match">
                <section className="match-title"><span>匿名聊天</span></section>
                {pagewindow}
                </article>
            </div>
        )
    }
}

ReactDOM.render(
    <WebPage />,
    document.getElementById('chat')
)
