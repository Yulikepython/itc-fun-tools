import React from "react"
import {Spinner} from "react-bootstrap"

const SpinnerComponent = () => {
    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    )
}

export default SpinnerComponent