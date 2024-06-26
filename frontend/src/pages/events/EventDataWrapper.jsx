import {createContext, useEffect, useState} from "react";
import {Outlet, useParams} from "react-router-dom";
import Requests from "../../api/Requests";

export const EventDataContext = createContext();
function EventDataWrapper({ children }) {
    const { event_id } = useParams();
    const [eventData, setEventData] = useState();

    const [eventEditPermission, setEventEditPermission] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const eventDataResponse = await Requests.eventById(event_id);
                if (eventDataResponse.state === true) {
                    setEventData(eventDataResponse.data.data);
                    if (eventDataResponse?.data?.permissions?.company_edit === true){
                        setEventEditPermission(true);
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching event data:", error);
            }
        };
        fetchData();
    }, [event_id]);

    const [visitorsWithName, setVisitorsWithName] = useState([]);
    const [anonVisitors, setAnonVisitors] = useState(undefined);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resp = await Requests.eventTickets(event_id);
                if (resp.state === true) {
                    setTickets(resp.data);
                }

                const respUsers = await Requests.eventUsers(event_id);
                if (respUsers.state === true){
                    setVisitorsWithName(respUsers.data.users);
                    setAnonVisitors(respUsers.data.visitorCounts);
                }
                // alert(JSON.stringify(respUsers));
            } catch (error) {
                console.error("Error fetching event data:", error);
            }
        };
        fetchData();
    }, [event_id]);

    const contextValue = {
        eventData,
        setEventData,
        eventEditPermission,
        tickets,
        setTickets,
        visitorsWithName,
        setVisitorsWithName,
        anonVisitors,
        setAnonVisitors,
        loading
    };

    return (
        <EventDataContext.Provider value={contextValue}>
            <Outlet />
        </EventDataContext.Provider>
    );
}

export default EventDataWrapper;
