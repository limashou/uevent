import {useEffect, useState} from "react";
import Requests from "../api/Requests";
import {Announcement} from "./Announcement";

function CompanyNewsElement({ company_id }) {
    const [news, setNews] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await Requests.companyNews(company_id, {page: page});
                if (resp.state === true) {
                    setNews(resp.data.rows);
                }
            } catch (error) {
                console.error("Error fetching founders:", error);
            }
        };
        fetchData();
    }, [company_id, page]);

    return (
        news.map((announcement) => (
            <Announcement announcementData={announcement} />
        ))
    )
}

export default CompanyNewsElement;
