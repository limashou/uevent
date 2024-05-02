import {useEffect, useState} from "react";
import CustomSearch from "./CustomSearch";
import Requests from "../../api/Requests";
import {debounce} from "lodash";

export function CompaniesSearch({handleIdSelect = (company_id) => {}}) {

    const [loading, setLoading] = useState(false);
    const [companiesSearch, setCompaniesSearch] = useState('');
    const [companiesSearchOptions, setCompaniesSearchOptions] = useState([]);

    const handleCompaniesSearchChange = (event, newValue) => {
        setCompaniesSearch(newValue);
    };

    function findForId() {
        const index = companiesSearchOptions.findIndex(item => item.name === companiesSearch);
        if (index !== -1) {
            const id = companiesSearchOptions[index].id;
            handleIdSelect(id);
            return true;
        }
        return false;
    }

    async function searchCompanies() {
        const resp = await Requests.allCompanies(
            {
                searchValue: companiesSearch
            }
        );
        if (resp.state === true && resp?.data?.rows?.length > 0){
            const nameIds = resp.data.rows.map(({name, id}) => ({name, id}));
            findForId();
            setCompaniesSearchOptions(nameIds);
        }
    }

    const debouncedFetchData = debounce(async () => {
        setLoading(true);
        await searchCompanies();
        setLoading(false);
    }, 1000);

    useEffect(() => {
        setCompaniesSearchOptions([]);
        if (!companiesSearch || companiesSearch.trim() === ''){
            handleIdSelect(undefined);
        }
        else if (!findForId()){
            setLoading(true);
            debouncedFetchData();
            return debouncedFetchData.cancel;
        }
    }, [companiesSearch]);

    return (
        <>
            <CustomSearch
                value={companiesSearch}
                options={companiesSearchOptions.map(({name}) => name)}
                handleSearchChange={handleCompaniesSearchChange}
                label="Search for company"
                loading={loading}
            />
        </>
    )
}
