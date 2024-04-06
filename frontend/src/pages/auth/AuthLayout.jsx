import {Outlet} from "react-router-dom";
import {Suspense} from "react";

function AuthLayout() {
    return (
        <div className="center-block">
            <Suspense fallback={<h1>Loading...</h1>}>
                <Outlet />
            </Suspense>
        </div>
    );
}

export default AuthLayout;
