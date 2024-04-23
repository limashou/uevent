import {useEffect, useState} from "react";
import Requests from "../api/Requests";

function CompanyNewsElement({ company_id }) {
    const [news, setNews] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await Requests.companyNews(company_id);
                alert(JSON.stringify(resp.data));
                if (resp.state === true) {
                    setNews(resp.data.rows);
                }
            } catch (error) {
                console.error("Error fetching founders:", error);
            }
        };
        fetchData();
    }, [company_id]);

    return (
        <div>{JSON.stringify(news)}</div>
    )
}

export default CompanyNewsElement;
