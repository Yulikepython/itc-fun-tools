import React from "react"
import {Link} from "react-router-dom"


const Error404 = () => {
    return (
        <div className="error404-container">
            <div className="error404-main-title">
                404
            </div>
            <div className="error404-message">
                Sorry, the page your're looking for cannot be found.
            </div>
            <div className="error404-link">
                Visit our <Link to={"/"}>homepage</Link> to find what you are looking for.
            </div>
        </div>
    )
}

export default Error404