import Container from "@mui/material/Container";
import CustomSearch from "../../components/inputs/CustomSearch";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import Requests from "../../api/Requests";
import Button from "@mui/material/Button";
import CompanyMini from "../../components/CompanyMini";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import {debounce} from 'lodash';
import {FounderSearch} from "../../components/inputs/FounderSearch";
import Grid from "@mui/material/Grid";
import CompanyMiniSkeleton from "../../components/skeletons/CompanyMiniSkeleton";

function Companies() {
    const [companies, setCompanies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [searchValue, setSearchValue] = useState('');
    const [searchOptions, setSearchOptions] = useState([]);

    const [founderIdFilter, setFounderIdFilter] = useState(undefined);
    const ONE_PAGE_LIMIT = 4;
    const [loading, setLoading] = useState(true);

    const debouncedFetchData = debounce(async () => {
        setLoading(true); // Установка состояния загрузки перед запросом данных
        const params = {
            limit: ONE_PAGE_LIMIT,
            searchValue: searchValue
        };
        if (founderIdFilter){
            params.founder_id = founderIdFilter;
        }
        const resp = await Requests.allCompanies(params);
        if (resp.state === true) {
            setCompanies(resp.data.rows);
            setTotalPages(resp.data.totalPages);
            setSearchOptions([...new Set(resp.data.rows.map(company => company.name))]);
            if (page > totalPages)
                setPage(1);
        }
        setLoading(false);
    }, 1000);

    useEffect(() => {
        setLoading(true);
        debouncedFetchData();
        return debouncedFetchData.cancel;
    }, [page, searchValue, founderIdFilter]);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSearchChange = (event, newValue) => {
        setSearchValue(newValue);
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} md={2}>
                <Stack direction="column" gap={2}>
                    <Link to="/companies/creation">
                        <Button sx={{width: '100%'}} variant="outlined">
                            Create company
                        </Button>
                    </Link>
                    <FounderSearch handleIdSelect={setFounderIdFilter} />
                </Stack>
            </Grid>
            <Grid item xs={12} md={8}>
                <Container>
                    <Container sx={{ display: 'flex' }}>
                        <CustomSearch value={searchValue} options={searchOptions} handleSearchChange={handleSearchChange} />
                    </Container>
                    <Container maxWidth="xl">
                        {loading ? (
                            Array.from({ length: ONE_PAGE_LIMIT }).map((_, index) => (
                                <CompanyMiniSkeleton key={index} />
                            ))
                        ) : (
                            companies.map(company => (
                                <CompanyMini
                                    companyData={company}
                                    key={company.id}
                                />
                            ))
                        )}
                    </Container>
                </Container>
            </Grid>
            <Grid item xs={12} md={2}>
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
            </Grid>
        </Grid>
    )
}

export default Companies;
