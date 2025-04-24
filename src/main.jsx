import React from 'react'
import ReactDOM from 'react-dom/client'
import {BrowserRouter} from "react-router-dom"
import App from './App'

import { ToolsProviders } from "./utils/ToolsPrividers"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ToolsProviders>
      <BrowserRouter>  
        <App />
      </BrowserRouter>
    </ToolsProviders>
  </React.StrictMode>
)
