import {useEffect, useState} from "react";
import CustomSearch from "./CustomSearch";
import Requests from "../../api/Requests";
import {debounce} from "lodash";

export function FounderSearch({handleIdSelect = (founder_id) => {}}) {

    const [loading, setLoading] = useState(false);
    const [founderSearch, setFounderSearch] = useState('');
    const [founderSearchOptions, setFounderSearchOptions] = useState([]);

    const handleCompaniesSearchChange = (event, newValue) => {
        setFounderSearch(newValue);
    };

    function findForId() {
        const index = founderSearchOptions.findIndex(item => item.name === founderSearch);
        if (index !== -1) {
            const id = founderSearchOptions[index].id;
            handleIdSelect(id);
            return true;
        }
        return false;
    }

    async function searchFounder() {
        const resp = await Requests.findUsername(
            {
                username_part: founderSearch,
            }
        );
        if (resp.state === true && resp?.data?.length > 0){
            const nameIds = resp.data.map(({full_name, id}) => ({name: full_name, id}));
            findForId();
            setFounderSearchOptions(nameIds);
        }
    }

    const debouncedFetchData = debounce(async () => {
        setLoading(true);
        await searchFounder();
        setLoading(false);
    }, 1000);

    useEffect(() => {
        setFounderSearchOptions([]);
        if (!founderSearch || founderSearch.trim() === ''){
            handleIdSelect(undefined);
        }
        else if (!findForId()){
            setLoading(true);
            debouncedFetchData();
            return debouncedFetchData.cancel;
        }
    }, [founderSearch]);

    return (
        <>
            {loading &&
                <div>...</div>
            }
            <CustomSearch
                value={founderSearch}
                options={founderSearchOptions.map(({name}) => name)}
                handleSearchChange={handleCompaniesSearchChange}
                label="Founder search"
            />
        </>
    )
}
