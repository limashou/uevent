import Container from "@mui/material/Container";
import CustomSearch from "../../components/inputs/CustomSearch";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Requests from "../../api/Requests";
import Button from "@mui/material/Button";
import CompanyMini from "../../components/CompanyMini";
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';

import { debounce } from 'lodash';
import CustomSelector from "../../components/inputs/CustomSelector";

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
        setLoading(false); // Установка состояния загрузки после получения данных
    }, 1000); // Задержка в 2000 миллисекунд (2 секунды)

    useEffect(() => {
        setLoading(true);
        debouncedFetchData();
        return debouncedFetchData.cancel; // Отмена предыдущего вызова debouncedFetchData при изменении page или searchValue
    }, [page, searchValue, founderIdFilter]);


    const [founders, setFounders] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await Requests.allFoundersFilters();
                if (resp.state === true) {
                    // alert(JSON.stringify(resp.data));
                    setFounders(resp.data.map(({id, full_name}) => (
                        {value: id, label: full_name}
                    )));
                }
            } catch (error) {
                console.error("Error fetching founders:", error);
            }
        };
        fetchData();
    }, []);
    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleSearchChange = (event, newValue) => {
        setSearchValue(newValue);
    };

    return (
        <div className="few-blocks">
            <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Link to="/companies/creation">
                    <Button variant="outlined">
                        Create company
                    </Button>
                </Link>
                <CustomSelector label="Founder" options={founders} onChange={(value) => {
                    setFounderIdFilter(value);
                }} />
            </Container>
            <Container>
                <Container sx={{ display: 'flex' }}>
                    <CustomSearch value={searchValue} options={searchOptions} handleSearchChange={handleSearchChange} />
                </Container>
                <Container maxWidth="xl">
                    {loading ? ( // Отображение скелетона во время загрузки
                        Array.from({ length: ONE_PAGE_LIMIT }).map((_, index) => (
                            <Container key={index}
                                       sx={{ height: '175px', display: 'flex',
                                           alignItems: 'center', gap: 2, p: 2,
                                           boxShadow: "0px 3px 15px rgba(0, 0, 0, 0.2)",
                                       }}
                            >
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
                        companies.map(company => (
                            <CompanyMini companyData={company} key={company.id} />
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

export default Companies;
