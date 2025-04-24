import React, {useState} from "react"
import {Alert} from "react-bootstrap"
import {Cookies} from "react-cookie"



const MessageFrame = ({msgFrame}) => {
    const {msg, variant} = msgFrame
    return (
        <div className="message-div">
            {msg && variant && <Alert variant={variant}>{msg}</Alert>}
        </div>
    )
}

export default MessageFrame