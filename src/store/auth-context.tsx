import { createContext, useState, ReactNode } from "react";

interface AuthContextType {
    token: string | null;
    email: string | null;
    isAuthenticated: boolean;
    authenticate: (token: string, email: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    token: '',
    email: '',
    isAuthenticated: false,
    authenticate: () => {},
    logout: () => {},
});

interface AuthContextProviderProps {
    children: ReactNode;
}

function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [authToken, setAuthToken] = useState<string | null>();
    const [email, setEmail] = useState<string | null>();

    function authenticate(token: string, emailAddress : string) {
        setAuthToken(token);
        setEmail(emailAddress);
    }

    function logout() {
        setAuthToken(null);
    }

    const value: AuthContextType = {
        token: authToken,
        email: email,
        isAuthenticated: !!authToken,
        authenticate,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContextProvider;
