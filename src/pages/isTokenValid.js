import { jwtDecode } from "jwt-decode";

export function isTokenValid(token){
    try {
        if(token){
            const {exp} = jwtDecode(token);
            if(Date.now() < exp * 1000){
                return true;
            }
        }
    } catch (error) {
        return false;
    }
    return false;
}