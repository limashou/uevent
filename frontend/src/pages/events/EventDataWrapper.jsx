import {createContext, useContext, useEffect, useState} from "react";
import {Outlet, useParams} from "react-router-dom";
import Requests from "../../api/Requests";

export const EventDataContext = createContext();
function EventDataWrapper({ children }) {
    const { event_id } = useParams();
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const eventDataResponse = await Requests.eventById(event_id);
                if (eventDataResponse.state === true) {
                    console.log(eventDataResponse);
                    setEventData(eventDataResponse.data);
                }

                // const companyMembersResponse = await Requests.companyMembers(company_id);
                // if (companyMembersResponse.state === true) {
                //     setCompanyMembers(companyMembersResponse.data);
                // }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching event data:", error);
            }
        };
        fetchData();
    }, [event_id]);

    const contextValue = {
        eventData,
        setEventData,
        loading
    };

    return (
        <EventDataContext.Provider value={contextValue}>
            <Outlet />
        </EventDataContext.Provider>
    );
}

export default EventDataWrapper;
