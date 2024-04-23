import {Outlet} from "react-router-dom";
import {createContext, Suspense, useEffect, useState} from "react";
import CustomNavigation from "../components/CustomNavigation";
import Requests from "../api/Requests";
import {User} from "../api/Types";
import {logout} from "../Utils/Utils";
export const UserContext = createContext();

function RootLayout() {
    const [userData, setUserData] = useState(new User);

    useEffect(() => {
        const fetchData = async () => {
            const resp = await Requests.user_by_id('me');
            if (resp.state === true){
                const { id, username, password, photo, email, full_name } = resp.data;
                const user = new User(id, username, password, photo, email, full_name);
                user.photo = Requests.get_avatar_link(resp.data.id);
                setUserData(user);
            }
        };
        fetchData();
    }, []);

    return (
        <UserContext.Provider value={[userData, setUserData]}>
            <CustomNavigation />
            <div className={'main-content'}>
                <Suspense fallback={<h1>Loading...</h1>}>
                    <Outlet />
                </Suspense>
            </div>
        </UserContext.Provider>
    );
}

export default RootLayout;
