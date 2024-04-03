import {Outlet} from "react-router-dom";
import {Suspense} from "react";
import CustomNavigation from "../../components/CustomNavigation";

function UserLayout() {
    return (
        <>
            <CustomNavigation />
            <div className={'main-content'}>
                <div className="center-block">
                    <Suspense fallback={<h1>Loading...</h1>}>
                        <Outlet />
                    </Suspense>
                </div>
            </div>
        </>
    );
}

export default UserLayout;
