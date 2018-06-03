import React from 'react'
import './media-h5css.css'
import './media-webcss.css'

class Media extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const message = this.props.message
        let style = ''
        switch(message.type) {
            case 'chat':
                style = message.user['name'] === this.props.name ? 'media-body-right' : 'media-body-left'
                break
            case 'left':
                style = 'media-body-left-gray'
                break
            case 'hello':
                style = 'media-body-center'
        }
        return(
            <div className={style}>
                <div className="media-context">
                    <p className="media-text">{message.data}</p>
                </div>
                <button className="media-restartButton" onClick={this.props.restartMatch}>重新匹配</button>
            </div>
        )
    }
}

export {Media}