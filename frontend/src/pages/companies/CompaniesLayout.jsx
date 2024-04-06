import {Outlet} from "react-router-dom";
import {Suspense} from "react";
import CustomNavigation from "../../components/CustomNavigation";
import {Skeleton} from "@mui/material";

function CompaniesLayout() {

    return (
        <Suspense fallback={<Skeleton variant="rectangular" width={210} height={118} />}>
            <Outlet />
        </Suspense>
    );
}

export default CompaniesLayout;
