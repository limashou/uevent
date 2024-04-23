import {Outlet} from "react-router-dom";
import {createContext, Suspense, useEffect, useState} from "react";
import CustomNavigation from "../components/CustomNavigation";
import Requests from "../api/Requests";
export const UserContext = createContext();

function RootLayout() {
    const [userData, setUserData] = useState(undefined);

    useEffect(() => {
        const fetchData = async () => {
            const resp = await Requests.user_by_id('me');
            if (resp.state === true){
                resp.data.photo = Requests.get_avatar_link(resp.data.id);
                setUserData(resp.data);
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
