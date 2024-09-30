var map = L.map('mapid').setView([-27.4698, 153.0251], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function getDistance(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = (lat2 - lat1) * Math.PI / 180;
    var dLon = (lon2 - lon1) * Math.PI / 180;
    var a = 0.5 - Math.cos(dLat) / 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * (1 - Math.cos(dLon)) / 2;
    return R * 2 * Math.asin(Math.sqrt(a));
}

var markers = [];
const geocodeCache = {};

const apiUrl = 'https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/brisbane-city-council-events/records?limit=100';

async function geocodeAddress(address) {
    if (geocodeCache[address]) {
        return geocodeCache[address];
    }

    try {
        let response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        let data = await response.json();

        if (data.length > 0) {
            const result = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
            geocodeCache[address] = result;
            return result;
        } else {
            const simplifiedAddress = simplifyAddress(address);
            response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(simplifiedAddress)}`);
            data = await response.json();

            if (data.length > 0) {
                const result = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
                geocodeCache[simplifiedAddress] = result;
                return result;
            } else {
                return { lat: -27.4698, lng: 153.0251 };
            }
        }
    } catch (error) {
        return { lat: -27.4698, lng: 153.0251 };
    }
}

function simplifyAddress(address) {
    return address
        .replace(/\(.*?\)|,.*$/, '')
        .replace(/Library|Shopping Center|Park/g, '')
        .trim();
}

async function fetchEventData() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data?.results?.length > 0) {
            return data.results.map(record => ({
                subject: record.subject || 'Unnamed Event',
                event_type: record.event_type || 'Unknown',
                venue: record.venue || 'Unknown Venue',
                venueaddress: record.venueaddress || 'Brisbane, QLD, Australia',
                start_datetime: record.start_datetime ? new Date(record.start_datetime) : 'Unknown',
                end_datetime: record.end_datetime ? new Date(record.end_datetime) : 'Unknown',
                web_link: record.web_link || '#'
            }));
        } else {
            throw new Error('No event records found.');
        }
    } catch (error) {
        return [];
    }
}

async function filterEvents() {
    const selectedType = document.getElementById('filter').value;
    const distanceFilter = document.getElementById('distanceFilter').value || 5;
    const searchTerm = document.getElementById('searchBar').value.toLowerCase();

    const eventsData = await fetchEventData();
    markers.forEach(item => map.removeLayer(item.marker));

    navigator.geolocation.getCurrentPosition(async function (position) {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        for (const event of eventsData) {
            if (event.venueaddress) {
                const geocoded = await geocodeAddress(event.venueaddress);

                if (geocoded) {
                    const distance = getDistance(userLat, userLng, geocoded.lat, geocoded.lng);

                    if (
                        (selectedType === 'all' || event.event_type.includes(selectedType)) &&
                        distance <= distanceFilter &&
                        event.subject.toLowerCase().includes(searchTerm)
                    ) {
                        const marker = L.marker([geocoded.lat, geocoded.lng]).bindPopup(
                            `<h3>${event.subject}</h3>
                            <p><strong>Venue:</strong> ${event.venue}</p>
                            <p><strong>Start:</strong> ${event.start_datetime.toLocaleString()}</p>
                            <p><strong>End:</strong> ${event.end_datetime.toLocaleString()}</p>
                            <p><strong>Type:</strong> ${event.event_type}</p>
                            <a href="${event.web_link}" target="_blank">More details</a>
                            <p><strong>Distance:</strong> ${distance.toFixed(2)} km</p>`
                        );
                        marker.addTo(map);
                        markers.push({ marker: marker });
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', filterEvents);
