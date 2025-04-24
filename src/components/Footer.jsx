import React from "react"
import { Link } from "react-router-dom"

import logo from "../media/logo_funtools.png"

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-title">
                <Link to="/">
                    <img src={logo} />
                </Link>
            </div>
            <div className="link-sec">
                <div>
                    <a href="https://itc.tokyo/privacy/" target="_blank">Privacy Policy</a>
                </div>
                <div>
                    <a href="https://itc.tokyo/terms-of-service/" target="_blank">
                        Terms of Service
                    </a>
                </div>
                <div>
                    <a href="https://itc.tokyo/external-transmission-discipline/" target="_blank">
                        外部送信規律
                    </a>
                </div>
                <div>
                    <a href="https://itc.tokyo/" target="_blank">運営者サイト</a>
                </div>
                <div>
                    <a href="https://itc.tokyo/contact/" target="_blank">Contact</a>
                </div>
            </div>
            <div className="footer-container__copyright">
                &copy; 2021 Hiroshi Nishito All Rights Reserved.
            </div>
        </footer>
    )
}

export default Footer