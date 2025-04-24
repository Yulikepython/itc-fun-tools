import React, {useContext, useState} from "react"

export const UserContext = React.createContext()

export const ToolsProviders = ({ children }) =>{
    const [currentUser, setCurrentUser] = useState("AnonymousUser")
    return (
        <UserContext.Provider value={currentUser}>
            {children}
        </UserContext.Provider>
    )
}


export const useUserContext = () => {
    return useContext(UserContext)
}
