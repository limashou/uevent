import React, {useEffect, useState} from "react";
import Requests from "../api/Requests";
import {Announcement} from "./Announcement";
import Typography from "@mui/material/Typography";
import {Stack} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Divider from "@mui/material/Divider";

function CompanyNewsElement({ company_id }) {
    const [news, setNews] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <>
            {news.length === 0 &&
                <Typography>There is no news...</Typography>
            }
            {totalPages > 1 &&
                <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
                    <Pagination
                        size="small"
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Stack>
            }
            {news.length > 0 &&
                news.map((announcement, index) => (
                    <React.Fragment key={`announcement-${announcement.id}`}>
                        <Announcement
                            announcementData={announcement}
                            onDelete={(id) => {
                                setNews(news.filter(announcement => announcement.id !== id));
                            }}
                        />
                        {index !== news.length - 1 && <Divider />}
                    </React.Fragment>
                ))
            }

        </>
    )
}

export default CompanyNewsElement;
