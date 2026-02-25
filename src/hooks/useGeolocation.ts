import { useEffect, useState } from 'react';

const useGeolocation = () => {
    const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by this browser.');
            return;
        }

        const success = (position: GeolocationPosition) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });
        };

        const failure = (err: GeolocationPositionError) => {
            setError(err.message);
        };

        navigator.geolocation.getCurrentPosition(success, failure);

        const watchId = navigator.geolocation.watchPosition(success, failure);

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, []);

    return { location, error };
};

export default useGeolocation;