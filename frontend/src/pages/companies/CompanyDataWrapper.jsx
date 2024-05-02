import {createContext, useContext, useEffect, useState} from "react";
import {Outlet, useParams} from "react-router-dom";
import Requests from "../../api/Requests";
import {UserContext} from "../RootLayout";

export const CompanyDataContext = createContext();

function CompanyDataWrapper({ children }) {
    const { company_id } = useParams();
    const [userData] = useContext(UserContext);
    const [companyData, setCompanyData] = useState(null);

    const [permissions, setPermissions] = useState({
        company_edit: false,
        eject_members: false,
        news_creation: false,
        event_creation: false
    });


    const [actions, setActions] = useState({
        canSubscribe: false,
    });
    const [companyMembers, setCompanyMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notificationsEnable, setNotificationsEnable] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await Requests.companyById(company_id);
                if (resp.state === true) {
                    resp.data.data.logo = Requests.get_company_logo_link(resp.data.data.id);
                    setCompanyData(resp.data.data);
                    setPermissions(resp.data.permissions);
                    setActions(resp.data.actions);
                }

                const resp2 = await Requests.companyMembers(company_id);
                if (resp2.state === true) {
                    setCompanyMembers(resp2.data);
                    if (userData && resp2.data.some(member => member.id === userData.id)){
                        setNotificationsEnable(true);
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching company data:", error);
            }
        };
        fetchData();
    }, [company_id]);

    const contextValue = {
        companyData,
        setCompanyData,
        companyMembers,
        setCompanyMembers,
        loading,
        setLoading,
        permissions,
        actions,
        setActions,
        notificationsEnable
    };

    return (
        <CompanyDataContext.Provider value={contextValue}>
            <Outlet />
        </CompanyDataContext.Provider>
    );
}

export default CompanyDataWrapper;
