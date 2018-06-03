import React from 'react'
import './match-ready-h5css.css'
import './match-ready-webcss.css'

class MatchReady extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            timer: "one",
            loader: ". . ."
        }
        this.date = new Date()
    }

    componentDidMount() {
        this.timerID = setInterval(() => {
            this.tick()
            this.load()
        }, 500)
    }

    componentWillUnmount() {
        clearInterval(this.timerID)
    }

    tick() {
        let minute = new Date().getTime() - this.date.getTime()
        if(minute <= 60000) {
            return
        }else if(minute >= 300000) {
            this.setState({timer: "three"})
        }else {
            this.setState({timer: "two"})
        }
    }

    load() {
        switch(this.state.loader) {
            case ". . .":
                this.setState({loader: "· . ."})
                break
            case "· . .":
                this.setState({loader: ". · ."})
                break
            case ". · .":
                this.setState({loader: ". . ·"})
                break
            case ". . ·":
                this.setState({loader: ". . ."})
                break
        }
    }

    render() {
        let text = ""
        let leftButton = ""
        switch(this.state.timer) {
            case "one":
                text = "灵魂匹配中 "+this.state.loader
                break
            case "two":
                text = "很快就能找到Ta啦 "+this.state.loader
                leftButton = <button className="match-ready-leftbutton" onClick={this.props.chatout}>退出匹配</button>
                break
            case "three":
                text = "这个时间人比较少哦，先去广场看看吧~"
                leftButton = <button className="match-ready-leftbutton" onClick={this.props.chatout}>退出匹配</button>
                break
        }

        return (
            <section className="match-ready-context">
                <section className="match-ready-group">
                <p className="match-ready-title">{text}</p>
                {leftButton}
                </section>
            </section>
        )
    }
}

export {MatchReady}