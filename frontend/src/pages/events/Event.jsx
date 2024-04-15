import {useContext} from "react";
import {EventDataContext} from "./EventDataWrapper";

function Event() {
    const { eventData, loading } = useContext(EventDataContext);

    return (
        <>
            {!loading &&
                <div>{JSON.stringify(eventData)}</div>
            }
        </>
    )
}

export default Event;
