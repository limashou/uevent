import {useEffect, useState} from "react";
import {debounce} from "lodash";
import Requests from "../../api/Requests";
import Container from "@mui/material/Container";
import {Link} from "react-router-dom";
import Button from "@mui/material/Button";
import CustomSearch from "../../components/CustomSearch";
import Skeleton from "@mui/material/Skeleton";
import CompanyMini from "../../components/CompanyMini";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";

function Events() {
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [searchValue, setSearchValue] = useState('');
    const [searchOptions, setSearchOptions] = useState([]);
    const ONE_PAGE_LIMIT = 4;
    const [loading, setLoading] = useState(true);

    const debouncedFetchData = debounce(async () => {
        setLoading(true); // Установка состояния загрузки перед запросом данных
        const resp = await Requests.allEvents({
            limit: ONE_PAGE_LIMIT,
            searchValue: searchValue
        });
        if (resp.state === true) {
            console.log(resp);
            setEvents(resp.data.rows);
            setTotalPages(resp.data.totalPages);
            setSearchOptions([...new Set(resp.data.rows.map(event => event.name))]);
            if (page > totalPages)
                setPage(1);
        }
        setLoading(false); // Установка состояния загрузки после получения данных
    }, 1000); // Задержка в 2000 миллисекунд (2 секунды)

    useEffect(() => {
        setLoading(true); // Установка состояния загрузки после получения данных
        debouncedFetchData();
        return debouncedFetchData.cancel; // Отмена предыдущего вызова debouncedFetchData при изменении page или searchValue
    }, [page, searchValue]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSearchChange = (event, newValue) => {
        setSearchValue(newValue);
    };
    return (
        <div className="few-blocks">
            <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div>
                    Filters content
                </div>
            </Container>
            <Container>
                <Container sx={{ display: 'flex' }}>
                    <CustomSearch value={searchValue} options={searchOptions} handleSearchChange={handleSearchChange} />
                </Container>
                <Container maxWidth="xl">
                    {loading ? ( // Отображение скелетона во время загрузки
                        Array.from({ length: ONE_PAGE_LIMIT }).map((_, index) => (
                            <Container key={index} sx={{ height: '175px', display: 'flex', alignItems: 'center', gap: 2, p: 2, '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.3)' } }}>
                                <Skeleton variant="circular" width={100} height={100} />
                                <Container sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                    <Skeleton variant="text" width="40%" height={40} />
                                    <Skeleton variant="text" width="80%" height={20} />
                                    <Skeleton variant="text" width="70%" height={20} />
                                    <Skeleton variant="text" width="90%" height={20} />
                                    <Skeleton variant="text" width="50%" height={20} />
                                </Container>
                            </Container>
                        ))
                    ) : (
                        events.map(event => (
                            <div>{JSON.stringify(event)}</div>
                        ))
                    )}
                </Container>
            </Container>
            <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Stack direction="row" spacing={2} justifyContent="center">
                    <Pagination
                        size="small"
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                    />
                </Stack>
            </Container>
        </div>
    )
}

export default Events;
