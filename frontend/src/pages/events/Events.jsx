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
import EventMini from "../../components/EventMini";
import CustomInputField from "../../components/CustomInputField";
import CustomMultiSelect from "../../components/CustomMultiSelect";
import {FORMATS, THEMES} from "../../Utils/InputHandlers";
import CustomSelector from "../../components/CustomSelector";

function Events() {
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [searchValue, setSearchValue] = useState('');
    const [searchOptions, setSearchOptions] = useState([]);
    const ONE_PAGE_LIMIT = 4;
    const [loading, setLoading] = useState(true);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');


    const [formatsFilter, setFormatsFilter] = useState([]);
    const [themesFilter, setThemesFilter] = useState([]);
    const [companyFilter, setCompanyFilter] = useState(undefined);

    const debouncedFetchData = debounce(async () => {
        setLoading(true);
        const data = {
            limit: ONE_PAGE_LIMIT,
            searchValue: searchValue,
        }
        if (new Date(dateFrom).toString() !== 'Invalid Date')
            data.dateFrom = new Date(dateFrom).toISOString()
        if (new Date(dateTo).toString() !== 'Invalid Date')
            data.dateTo = new Date(dateTo).toISOString()
        if (formatsFilter.length > 0){
            data.formats = formatsFilter;
        }
        if (themesFilter.length > 0){
            data.themes = themesFilter;
        }
        if (companyFilter){
            data.company_id = companyFilter;
        }

        const resp = await Requests.allEvents(data);
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
    }, [page, searchValue, dateFrom, dateTo, formatsFilter, themesFilter, companyFilter]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSearchChange = (event, newValue) => {
        setSearchValue(newValue);
    };


    const [companiesFilters, setCompaniesFilters] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await Requests.allCompaniesFilters();
                if (resp.state === true) {
                    // alert(JSON.stringify(resp.data));
                    setCompaniesFilters(resp.data.map(({id, name}) => (
                        {value: id, label: name}
                    )));
                }
            } catch (error) {
                console.error("Error fetching founders:", error);
            }
        };
        fetchData();
    }, []);
    return (
        <div className="few-blocks">
            <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <CustomInputField
                    onChangeChecked={(key, value) => setDateFrom(value)}
                    id="eventDateFrom"
                    label="Date from"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                />
                <CustomInputField
                    onChangeChecked={(key, value) => setDateTo(value)}
                    id="eventDateTo"
                    label="Date to"
                    type="datetime-local"
                    InputLabelProps={{ shrink: true }}
                />
                <CustomMultiSelect options={FORMATS} label="Formats" onChange={(values) => {
                    setFormatsFilter(values.map(({value}) => value));
                }} />
                <CustomMultiSelect options={THEMES} label="Themes" onChange={(values) => {
                    setThemesFilter(values.map(({value}) => value));
                }} />
                <CustomSelector options={companiesFilters} label="Company" onChange={(value) => {
                    setCompanyFilter(value);
                }} />
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
                            <EventMini eventData={event} />
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
