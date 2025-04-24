import React from "react"
import { useEffect } from "react"
import {Link} from "react-router-dom"

import logo from "../media/logo_funtools.png"

const Header = ({setOutputApps, defaultApps}) => {
    const searchHandler = e => {
        e.preventDefault()
        setOutputApps(defaultApps.filter(app=>app.searchq.includes(e.target.value.toLowerCase())))
    }

    return (
        <>
            <header>
                <div className="logo-title">
                    <Link to="/">
                        <img src={logo} />
                    </Link>
                </div>
                    <div id="searchDiv">
                    <div className="input-group flex-nowrap" id="search-div">
                        {/* <span className="input-group-text" id="addon-wrapping">
                            <i className="bi bi-search"></i>
                        </span> */}
                        <input 
                            type="text" 
                            className="form-control" 
                            placeholder="アプリを検索.." 
                            // aria-label="Username" 
                            aria-describedby="addon-wrapping"
                            onChange={searchHandler}
                            id="searchForm"
                        />
                    </div>
                </div>                
            </header>
            {/* <SearchModal /> */}
        </>
    )
}

export default Header