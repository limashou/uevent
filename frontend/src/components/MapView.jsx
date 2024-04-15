import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const MapView = ({ lat, lng }) => {
    const mapStyles = {
        height: '400px',
        width: '100%',
    };

    const isScriptLoaded = () => {
        return !!window.google;
    };

    return (
        <>
            {isScriptLoaded() ? (
                <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={8}
                    center={{ lat, lng }}
                >
                    <Marker position={{ lat, lng }} />
                </GoogleMap>
            ) : (
                <LoadScript
                    googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                    libraries={['places']}
                >
                    <GoogleMap
                        mapContainerStyle={mapStyles}
                        zoom={8}
                        center={{ lat, lng }}
                    >
                        <Marker position={{ lat, lng }} />
                    </GoogleMap>
                </LoadScript>
            )}
        </>
    );
};

export default MapView;
