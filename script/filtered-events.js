const apiUrl = 'https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/brisbane-city-council-events/records?order_by=start_datetime&limit=100';
const selectedTypes = JSON.parse(localStorage.getItem('selectedTypes')) || [];
const eventTypeReplacements = { 'Aboriginal and Torres Strait Islander': 'Aboriginal & Torres Strait' };
const inviteFilters = localStorage.getItem('inviteFilters');
const selectedDate = localStorage.getItem('selectedDate');

function parseSelectedDate(dateString) {
  if (!dateString) return null;
  const [day, month, year] = dateString.split(' / ').map(Number);
  return new Date(year, month - 1, day);
}

function isDateInRange(selectedDate, startDate, endDate) {
  if (!selectedDate) return true;
  const selected = parseSelectedDate(selectedDate);
  const start = new Date(startDate);
  const end = new Date(endDate);
  return (selected >= start && selected <= end) || (selected.getDate() == start.getDate() && selected.getMonth() == start.getMonth());
}

async function getFilteredEvents() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data?.results) {
            const filteredEvents = data.results.filter(event => {
                const eventTypes = event.event_type ? event.event_type.split(',').map(type => type.trim()) : [];
                const correctedEventTypes = eventTypes.map(type => eventTypeReplacements[type] || type);
                const typeMatch = selectedTypes.every(type => correctedEventTypes.includes(type));
                const dateMatch = isDateInRange(selectedDate, event.start_datetime, event.end_datetime);
                return typeMatch && dateMatch;
            });
            return filteredEvents;
        } else {
            throw new Error('No events found');
        }
    } catch (error) {
        console.error("Error fetching events:", error);
        return [];
    }
}

function createPopup(event) {
    const popup = document.createElement('div');
    popup.classList.add('event-popup');
    const imageUrl = event.eventimage || '';
    const imageTag = imageUrl ? `<img src="${imageUrl}" alt="${event.subject}" />` : '';
    console.log(imageUrl);

    popup.innerHTML = `
        <div class="event-popup-content">
            ${imageTag}
            <div class="event-popup-details">
                <h2>${event.subject}</h2>
                <p><strong>Date/Time:</strong> ${event.formatteddatetime}</p>
                <p><strong>Location:</strong> ${event.location || 'TBA'}</p>
                <p><strong>Cost:</strong> ${event.cost || 'Free'}</p>
                <p><strong>Event Type:</strong> ${event.event_type || 'N/A'}</p>
                <p class="event-description">${event.description || 'No description available'}</p>
                <div class="popup-buttons">
                    <button onclick="closePopup()" class="close-button">Close</button>
                    <button onclick="finalizeEvent('${event.web_link}', '${event.location}', '${imageUrl}')" class="finalize-button">Finalize Card</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(popup);
}

function finalizeEvent(eventId, location, image) {
    localStorage.setItem('eventId', eventId);
    localStorage.setItem('eventLoc', location);
    localStorage.setItem('eventImg', image);
    window.location.href = 'invitation.html';
}

function closePopup() {
    const popup = document.querySelector('.event-popup');
    if (popup) {
        popup.remove();
    }
}

async function renderFilteredEvents() {
    try {
        const events = await getFilteredEvents();
        const eventList = document.getElementById('event-list');
        eventList.innerHTML = '';

        if (events.length === 0) {
            eventList.innerHTML = '<p>No events match the selected filters.</p>';
            return;
        }

        events.forEach(event => {
            const eventElement = document.createElement('div');
            eventElement.classList.add('event-item');
            eventElement.innerHTML = `
                <h2>${event.subject}</h2>
                <p><strong>Location:</strong> ${event.location || 'TBA'}</p>
                <p><strong>Date:</strong> ${event.formatteddatetime}</p>
                <p><strong>Type:</strong> ${event.event_type || 'N/A'}</p>
            `;
            eventElement.addEventListener('click', () => createPopup(event));
            eventList.appendChild(eventElement);
        });
    } catch (error) {
        document.getElementById('event-list').innerHTML = '<p>Error loading events. Please try again later.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderFilteredEvents();
});