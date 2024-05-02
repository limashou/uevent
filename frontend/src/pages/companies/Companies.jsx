import Container from "@mui/material/Container";
import CustomSearch from "../../components/inputs/CustomSearch";
import {Link} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import Requests from "../../api/Requests";
import Button from "@mui/material/Button";
import CompanyMini from "../../components/CompanyMini";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

import {debounce} from 'lodash';
import {FounderSearch} from "../../components/inputs/FounderSearch";
import Grid from "@mui/material/Grid";
import CompanyMiniSkeleton from "../../components/skeletons/CompanyMiniSkeleton";
import Divider from "@mui/material/Divider";
import {UserContext} from "../RootLayout";
import Typography from "@mui/material/Typography";

function Companies() {
    const [userData] = useContext(UserContext);
    const [companies, setCompanies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [searchValue, setSearchValue] = useState('');
    const [searchOptions, setSearchOptions] = useState([]);

    const [founderIdFilter, setFounderIdFilter] = useState(undefined);
    const ONE_PAGE_LIMIT = 4;
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);

    const debouncedFetchData = debounce(async () => {
        setLoading(true);
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
        setSearchLoading(false);

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
        setSearchLoading(true);
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} md={2}>
                <Container sx={{
                    backgroundColor: "background.default",
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)'
                }}>
                    <Stack direction="column" gap={2}>
                        {userData &&
                            <Link to="/companies/creation">
                                <Button sx={{width: '100%'}} variant="outlined">
                                    Create company
                                </Button>
                            </Link>
                        }
                        <FounderSearch handleIdSelect={setFounderIdFilter} />
                    </Stack>
                </Container>
            </Grid>
            <Grid item xs={12} md={8}>
                <Container sx={{
                    backgroundColor: "background.default",
                    padding: 2,
                    borderRadius: 2,
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)'
                }}>
                    <Container sx={{ display: 'flex' }} disableGutters>
                        <CustomSearch
                            value={searchValue}
                            options={searchOptions}
                            handleSearchChange={handleSearchChange}
                            loading={searchLoading}
                        />
                    </Container>
                    <Container maxWidth="xl" disableGutters>
                        {loading ? (
                            Array.from({ length: ONE_PAGE_LIMIT }).map((_, index) => (
                                <>
                                    <CompanyMiniSkeleton key={index} />
                                    {index < ONE_PAGE_LIMIT - 1 && <Divider />}
                                </>
                            ))
                        ) : (
                            <>
                                {companies.length === 0 &&
                                    <Typography sx={{mt: 1}}>No one company found</Typography>
                                }
                                {companies.map((company, index) => (
                                    <>
                                        <CompanyMini
                                            companyData={company}
                                            key={company.id}
                                        />
                                        {index < companies.length - 1 && <Divider />}
                                    </>
                                ))}
                            </>
                        )}
                    </Container>
                </Container>
            </Grid>
            <Grid item xs={12} md={2}>
                {totalPages > 1 &&
                    <Container maxWidth="sm" sx={{
                        backgroundColor: "background.default",
                        padding: 2,
                        borderRadius: 2,
                        display: 'flex', flexDirection: 'column', gap: 2,
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)'
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
                }
            </Grid>
        </Grid>
    )
}

export default Companies;
