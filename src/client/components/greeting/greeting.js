import React from 'react'
import {MatchBegin} from '../match-begin/match-begin'
import {MatchReady} from '../match-ready/match-ready'
import {MatchRoom} from '../match-room/match-room'

function Greeting(props) {
    const user = props.userlist
    switch(user.length) {
        case 0:
            return (<MatchBegin getGender={gender => props.getGender(gender)}/>)
            break
        case 1:
            return (<MatchReady chatout={()=>props.chatout()}/>)
            break
        case 2:
            return (<MatchRoom userlist={props.userlist} messagelist={props.messagelist} eventlist={props.eventlist} name={props.name} submitMessage={(...args)=>props.submitMessage(...args)} focusMessage={(...args)=>props.focusMessage(...args)} blurMessage={(...args)=>props.blurMessage(...args)} chatout={()=>props.chatout()} errCode={props.errCode} changeHeader={state=>props.changeHeader(state)} changeFooter={state=>props.changeFooter(state)} restartMatch={()=>props.restartMatch()}/>)
            break
    }
}

export {Greeting}