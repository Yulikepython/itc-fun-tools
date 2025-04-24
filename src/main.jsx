import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter} from "react-router-dom"
import App from './App'

import { ToolsProviders } from "./utils/ToolsPrividers"

ReactDOM.render(
  <React.StrictMode>
    <ToolsProviders>
      <BrowserRouter>  
        <App />
      </BrowserRouter>
    </ToolsProviders>
  </React.StrictMode>,
  document.getElementById('root')
)
