import '../css/stylesheet.css'
import React from 'react'
import ReactDOM from 'react-dom'
import {ChatRoom} from '../components/chatroom/chatroom'

function MobileHeader(props) {
    return (
        <header className="m-header"><span> 我说你听 ♪</span></header>
    )
}

class MobileNav extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pageOrder: 0       // 可优化，page状态应该由父组件的props处理
        }
    }

    changePage(page) {
        this.setState({"pageOrder": page})
    }

    render() {
        return (
            <nav className="m-nav">
                <article className="m-nav-list" onClick={() => this.changePage(0)}>
                    <span className = {this.state.pageOrder === 0 ? "m-nav-list-iconchat-select" : "m-nav-list-iconchat"}>
                        <p>聊天</p>
                    </span>
                </article>
                <article className="m-nav-list" onClick={() => this.changePage(1)}>
                    <span className = {this.state.pageOrder === 1 ? "m-nav-list-iconsquare-select" : "m-nav-list-iconsquare"}>
                        <p>广场</p>
                    </span>
                </article>
            </nav>
        )
    }
}

function Square(props) {  // 广场模块 后期开发
    return (
        <section className="m-square"></section>
    )
}

class MobilePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            page: "chat",
            hiddenHeader: false,
            hiddenFooter: false
        }
    }

    changeHeader(state) {
        this.setState({
            hiddenHeader: state
        })
    }

    changeFooter(state) {
        this.setState({
            hiddenFooter: state
        })
    }

    render() {
        let pageheader = this.state.hiddenHeader ? "" : <MobileHeader/>
        let pagefooter = this.state.hiddenFooter ? "" : <MobileNav />
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
            <div className="m-body">
                {pageheader}
                {pagewindow}
                {pagefooter}
            </div>
        )
    }
}

ReactDOM.render(
    <MobilePage />,
    document.getElementById('chat')
)