import {createContext, useContext, useEffect, useState} from "react";
import {Outlet, useParams} from "react-router-dom";
import Requests from "../../api/Requests";
import {UserContext} from "../RootLayout";

export const CompanyDataContext = createContext();

function CompanyDataWrapper({ children }) {
    const { company_id } = useParams();
    const [companyData, setCompanyData] = useState(null);
    const [companyMembers, setCompanyMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userData] = useContext(UserContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const companyDataResponse = await Requests.companyById(company_id);
                if (companyDataResponse.state === true) {
                    companyDataResponse.data.logo = Requests.get_company_logo_link(companyDataResponse.data.id);
                    if (companyDataResponse.data.founder_id === userData.id)
                        companyDataResponse.data.permissions = true;
                    setCompanyData(companyDataResponse.data);
                    setLoading(false);
                }

                const companyMembersResponse = await Requests.companyMembers(company_id);
                if (companyMembersResponse.state === true) {
                    setCompanyMembers(companyMembersResponse.data);
                }
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
        setLoading
    };

    return (
        <CompanyDataContext.Provider value={contextValue}>
            <Outlet />
        </CompanyDataContext.Provider>
    );
}

export default CompanyDataWrapper;
