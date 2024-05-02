import {useEffect, useState} from "react";
import {debounce} from "lodash";
import Requests from "../../api/Requests";
import Container from "@mui/material/Container";
import CustomSearch from "../../components/inputs/CustomSearch";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import EventMini from "../../components/EventMini";
import CustomInputField from "../../components/inputs/CustomInputField";
import CustomMultiSelect from "../../components/inputs/CustomMultiSelect";
import {FORMATS, THEMES} from "../../Utils/InputHandlers";
import {CompaniesSearch} from "../../components/inputs/CompaniesSearch";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import EventMiniSkeleton from "../../components/skeletons/EventMiniSkeleton";

function Events() {
    const [events, setEvents] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [searchValue, setSearchValue] = useState('');
    const [searchOptions, setSearchOptions] = useState([]);
    const ONE_PAGE_LIMIT = 4;
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');


    //filters:
    const [formatsFilter, setFormatsFilter] = useState([]);
    const [themesFilter, setThemesFilter] = useState([]);
    const [companyIdFilter, setCompanyIdFilter] = useState(undefined);

    const debouncedFetchData = debounce(async () => {
        setLoading(true);
        const data = {
            limit: ONE_PAGE_LIMIT,
            searchValue: searchValue,
            page: page
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
        if (companyIdFilter){
            data.company_id = companyIdFilter;
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
        setLoading(false);
        setSearchLoading(false);
    }, 1000);

    useEffect(() => {
        setLoading(true);
        debouncedFetchData();
        return debouncedFetchData.cancel; // Отмена предыдущего вызова debouncedFetchData при изменении page или searchValue
    }, [page, searchValue, dateFrom, dateTo, formatsFilter, themesFilter, companyIdFilter]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSearchChange = (event, newValue) => {
        setSearchValue(newValue);
        setSearchLoading(true);
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} md={2}>
                <Container sx={{
                    backgroundColor: "background.default",
                    padding: 2,
                    borderRadius: 2,
                    display: 'flex', flexDirection: 'column', gap: 2,
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)'
                }}>
                    <Stack direction="column" gap={2}>
                        <CompaniesSearch handleIdSelect={setCompanyIdFilter} />
                        <CustomMultiSelect options={FORMATS} label="Formats" onChange={(values) => {
                            setFormatsFilter(values.map(({value}) => value));
                        }} />
                        <CustomMultiSelect options={THEMES} label="Themes" onChange={(values) => {
                            setThemesFilter(values.map(({value}) => value));
                        }} />
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
                    </Stack>
                </Container>
            </Grid>
            <Grid item xs={12} md={8}>
                <Container sx={{
                    backgroundColor: "background.default",
                    padding: 2,
                    borderRadius: 2,
                    display: 'flex', flexDirection: 'column', gap: 2
                }}>
                    <Container sx={{ display: 'flex' }} disableGutters>
                        <CustomSearch value={searchValue} options={searchOptions} handleSearchChange={handleSearchChange} />
                    </Container>
                    <Container maxWidth="xl" disableGutters>
                        {loading ? (
                            Array.from({ length: ONE_PAGE_LIMIT }).map((_, index) => (
                                <>
                                    <EventMiniSkeleton />
                                    {index < ONE_PAGE_LIMIT - 1 && <Divider />}
                                </>
                            ))
                        ) : (
                            events.map((event, index) => (
                                <>
                                    <EventMini eventData={event} key={event.id} />
                                    {index < events.length - 1 && <Divider />}
                                </>
                            ))
                        )}
                    </Container>
                </Container>
            </Grid>
            <Grid item xs={12} md={2}>
                <Container maxWidth="sm" sx={{
                    backgroundColor: "background.default",
                    padding: 2,
                    borderRadius: 2,
                    display: 'flex', flexDirection: 'column', gap: 2
                }}>
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
            </Grid>
        </Grid>
    )
}

export default Events;
