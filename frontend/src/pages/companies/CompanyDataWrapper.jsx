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

    const [companyMembers, setCompanyMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [notificationsEnable, setNotificationsEnable] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const companyDataResponse = await Requests.companyById(company_id);
                if (companyDataResponse.state === true) {
                    companyDataResponse.data.data.logo = Requests.get_company_logo_link(companyDataResponse.data.data.id);
                    setCompanyData(companyDataResponse.data.data);
                    setPermissions(companyDataResponse.data.permissions);
                }

                const companyMembersResponse = await Requests.companyMembers(company_id);
                if (companyMembersResponse.state === true) {
                    setCompanyMembers(companyMembersResponse.data);
                    if (companyMembersResponse.data.some(member => member.id === userData.id)){
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
        notificationsEnable
    };

    return (
        <CompanyDataContext.Provider value={contextValue}>
            <Outlet />
        </CompanyDataContext.Provider>
    );
}

export default CompanyDataWrapper;
