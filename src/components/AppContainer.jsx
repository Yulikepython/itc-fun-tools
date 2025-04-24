import React from "react"
import { Link } from "react-router-dom"

const AppContainer = ({ appElement, num }) => {

    return (
        <Link to={appElement.linkTo} id={appElement.id}>
            <div className="appBox">
                <div className="boxMain">
                    <div>
                        <i
                            className={`${appElement.icon}`}
                            style={{ color: `${appElement.color}` }}
                        ></i>
                    </div>
                    <div className="boxContent">
                        <div className="boxContent__title">
                            {appElement.appName}
                        </div>
                        <div className="boxContent__content">
                            {appElement.description}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default AppContainer