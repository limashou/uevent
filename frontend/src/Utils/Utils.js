import Requests from "../api/Requests";

export function hexToRgba(hex, alpha = 1) {
    const hexColor = hex.replace(/^#/, '');
    const bigint = parseInt(hexColor, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export async function logout(){
    localStorage.removeItem('user_id');
    const resp = await Requests.logout();
    if (resp.state === true){
        window.location.href = '/auth/login';
    }
    else
        alert(`logout error ${JSON.stringify(resp)}`)
}
