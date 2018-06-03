import React from 'react'
import './match-begin-h5css.css'
import './match-begin-webcss.css'
import ImageBoy from '../../image/boy.jpg'
import ImageGirl from '../../image/girl.jpg'

class MatchBegin extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            genderOrder: 1
        }
    }

    changeGender(gender) {
        this.setState({"genderOrder": gender})
    }

    render() {

        return (
                <section className = "match-begin-context">
                <p className = "match-begin-title" > “ 有些话，我只愿同陌生人讲 ” </p>
                <section className = "match-begin-group">
                <section className = "match-begin-gender" >
                <div onClick = {() => this.changeGender(1)}> <span className = {
                    this.state.genderOrder === 1 ? "gender-select" : ""
                } ><img src = {ImageBoy} /></span><p>男孩子</p> </div> 
                <div onClick = {
                    () => this.changeGender(0)
                }> <span className = {
                    this.state.genderOrder === 0 ? "gender-select" : ""
                }> 
                <img src = {ImageGirl} />
                </span>
                <p>女孩子</p> 
                </div> 
                </section> 
                <button className = "match-begin-start" onClick = {() => this.props.getGender(this.state["genderOrder"])}> 开始匹配 </button> 
                </section>
                </section>
        )
    }
}

export {MatchBegin}