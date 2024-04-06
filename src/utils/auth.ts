interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}

export const isLoggedIn = (): { loggedIn: boolean; user?: User } => {
    if (typeof window === "undefined") {
        return { loggedIn: false };
    }

    const token = localStorage.getItem("token");

    if (token) {
        // verify the token expiration
        const tokenParts = token.split(".");

        if (tokenParts.length !== 3) {
            return { loggedIn: false };
        }

        const encodedPayload = tokenParts[1];

        try {
            const rawPayload = atob(encodedPayload);
            const payload = JSON.parse(rawPayload);
            const expirationUnix = payload.exp;
            const now = new Date().getTime();
            const currentUnix = Math.round(now / 1000);

            if (expirationUnix < currentUnix) {
                console.log("Token has expired")
                // Token has expired
                return { loggedIn: false };
            }
            // Get user details from localStorage
            const userDataString = localStorage.getItem("userData");
            if (userDataString) {
                const userData: { user: User } = JSON.parse(userDataString);
                const { user } = userData;
                return { loggedIn: true, user };
            }
        } catch (error) {
            console.error("Error decoding token payload:", error);
            return { loggedIn: false };
        }
    }
    return { loggedIn: false };
};