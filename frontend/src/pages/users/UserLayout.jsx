import {Outlet} from "react-router-dom";
import {createContext, Suspense, useEffect, useState} from "react";
import CustomNavigation from "../../components/CustomNavigation";
import Requests from "../../api/Requests";
import {logout} from "../../Utils/Utils";

export const UserContext = createContext();

function UserLayout() {
    const [userData, setUserData] = useState({
        username: 'Loading...',
        full_name: 'Loading...',
        avatar: Requests.get_img_link(localStorage.getItem('user_id'))
    });

    useEffect(() => {
        const fetchData = async () => {
            const resp = await Requests.user_by_id('me');
            if (resp.state === true){
                resp.data.avatar = userData.avatar;
                setUserData(resp.data);
            }
            else
                await logout();
        };
        fetchData();
    }, []);

    return (
        <>
            <UserContext.Provider value={[userData, setUserData]}>
                <CustomNavigation />
                <div className={'main-content'}>
                    <div className="center-block">
                        <Suspense fallback={<h1>Loading...</h1>}>
                            <Outlet />
                        </Suspense>
                    </div>
                </div>
            </UserContext.Provider>
        </>
    );
}

export default UserLayout;
