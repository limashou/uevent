import React, {useEffect, useState} from "react";
import Requests from "../api/Requests";
import {Announcement} from "./Announcement";
import Typography from "@mui/material/Typography";

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
        <>
            {news.length === 0 &&
                <Typography>There is no news...</Typography>
            }
            {news.length > 0 &&
                news.map((announcement) => (
                    <Announcement
                        key={`announcement-${announcement.id}`}
                        announcementData={announcement}
                        onDelete={(id) => {
                            setNews(news.filter(announcement => announcement.id !== id));
                        }}
                    />
                ))
            }
        </>
    )
}

export default CompanyNewsElement;
