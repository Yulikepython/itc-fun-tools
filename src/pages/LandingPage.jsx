import React, { useEffect, useState } from "react"


import AppContainer from "../components/AppContainer"


const LandingPage = ({ outputApps, transferPage }) => {

    useEffect(() => {

        transferPage()
    }, [])

    useEffect(() => {
    }, [outputApps])

    return (
        <>
            <div className="lp-container">
                {outputApps.map((app, key) => {
                    return <AppContainer key={key} appElement={app} num={key} />
                })}

            </div>
        </>
    )
}

export default LandingPage