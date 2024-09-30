const apiUrl = 'https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/brisbane-city-council-events/records?order_by=start_datetime&limit=100';

let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let selectedDay = null;
let allEvents = [];

async function fetchEvents() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data && data.results) {
            allEvents = data.results;
            return data.results;
        }
        console.warn('No events found in the data.');
    } catch (error) {
        console.error("Error fetching events:", error);
    }
}

async function updateEventList(filterType = '', dayFilter = null) {
    try {
        const events = allEvents.length ? allEvents : await fetchEvents();

        const eventList = document.getElementById('event-list');
        eventList.innerHTML = '';
        clearCalendar();

        const filteredEvents = filterType
            ? events.filter(event => event.event_type && event.event_type.toLowerCase().includes(filterType.toLowerCase()))
            : events;

        const currentStart = new Date(currentYear, currentMonth, 1);
        const currentEnd = new Date(currentYear, currentMonth + 1, 0);

        const ongoingEvents = filteredEvents.filter(event => {
            const eventStart = new Date(event.start_datetime);
            const eventEnd = new Date(event.end_datetime);
            return (eventEnd >= currentStart) && (eventStart <= currentEnd);
        });

        const dayFilteredEvents = dayFilter
            ? ongoingEvents.filter(event => {
                const eventStart = new Date(event.start_datetime);
                const eventEnd = new Date(event.end_datetime);
                return (eventStart <= dayFilter && eventEnd >= dayFilter) ||
                    (eventStart.toDateString() === dayFilter.toDateString() && eventEnd.toDateString() === dayFilter.toDateString());
            })
            : ongoingEvents;

        if (dayFilter) {
            if (dayFilteredEvents.length === 0) {
                eventList.innerHTML = '<p>No events found for this day.</p>';
                return;
            }
        } else {
            if (ongoingEvents.length === 0) {
                eventList.innerHTML = '<p>No events found for this month.</p>';
                return;
            }
        }

        (dayFilteredEvents.length > 0 ? dayFilteredEvents : ongoingEvents).forEach(event => {
            const eventStart = new Date(event.start_datetime);
            const eventEnd = new Date(event.end_datetime);

            const eventElement = document.createElement('div');
            eventElement.classList.add('event-item');
            
            const startDateTime = eventStart.toLocaleString();
            const endDateTime = eventEnd.toLocaleString();

            const eventId = localStorage.getItem('eventId');
            const matchId = event.web_link === eventId;

            eventElement.innerHTML = `
                <h3>${event.subject}</h3>
                <p><strong>Location:</strong> ${event.location || 'TBA'}</p>
                <p><strong>Start:</strong> ${startDateTime}</p>
                <p><strong>End:</strong> ${endDateTime}</p>
                <p><strong>Type:</strong> ${event.event_type}</p>
                <a href="${event.web_link}" target="_blank">More details</a>
            `;

            if (matchId) {
                highlightEventInCalendar(event, true);
            }

            eventElement.addEventListener('click', () => {
                if (matchId) {
                    highlightEventInCalendar(event, matchId);
                }
                clearCalendar();
                highlightEventInCalendar(event, matchId);
            });

            eventList.appendChild(eventElement);
        });
    } catch (error) {
        document.getElementById('event-list').innerHTML = '<p>Error loading events. Please try again later.</p>';
    }
}

function highlightEventInCalendar(event, bool) {
    const eventStart = new Date(event.start_datetime);
    const eventEnd = new Date(event.end_datetime);

    const startDate = eventStart.getMonth() === currentMonth ? eventStart.getDate() : 1;
    const endDate = eventEnd.getMonth() === currentMonth ? eventEnd.getDate() : new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let day = startDate; day <= endDate; day++) {
        const dayCell = document.getElementById(`day-${day}`);
        if (dayCell) {
            if (bool) {
                dayCell.style.color = 'rgba(255, 127 ,80, 1)';
                dayCell.style.border = '4px solid rgba(255, 127 ,80, 1)';
            } else {
                dayCell.style.backgroundColor = 'rgba(0, 123, 255, 0.5)';
            }
        }
    }

    const eventDetails = `
        <h3>${event.subject}</h3>
        <p><strong>Location:</strong> ${event.location || 'TBA'}</p>
        <p><strong>Start:</strong> ${eventStart.toLocaleString()}</p>
        <p><strong>End:</strong> ${eventEnd.toLocaleString()}</p>
        <p><strong>Type:</strong> ${event.event_type}</p>
        <a href="${event.web_link}" target="_blank">More details</a>
    `;
    document.getElementById('selected-event').innerHTML = eventDetails;
}

function clearCalendar() {
    const dayCells = document.querySelectorAll('.day-cell');
    dayCells.forEach(cell => {
        cell.style.backgroundColor = '';
    });
}

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';

    const monthGrid = document.createElement('div');
    monthGrid.classList.add('month-grid');

    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
        const dayCell = document.createElement('div');
        dayCell.classList.add('day-cell');
        dayCell.id = `day-${i}`;
        dayCell.innerHTML = `<strong>${i}</strong>`;

        dayCell.addEventListener('click', () => {
            selectedDay = new Date(currentYear, currentMonth, i);
            updateEventList('', selectedDay);
        });

        monthGrid.appendChild(dayCell);
    }

    calendar.appendChild(monthGrid);
    document.getElementById('month-year').textContent = `${getMonthName(currentMonth)} ${currentYear}`;
}

function getMonthName(monthIndex) {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthNames[monthIndex];
}

function previousMonth() {
    selectedDay = null;
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
    updateEventList();
}

function nextMonth() {
    selectedDay = null;
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
    updateEventList();
}

function renderFilterOptions() {
    const filterSelect = document.getElementById('event-type-filter');

    const eventTypes = [
        'Fitness & well-being', 'Food', 'Markets', 'Art & Culture', 'Workshops', 
        'Free', 'Community', 'Sports', 'Family', 'Environment'
    ];

    eventTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.text = type;
        filterSelect.appendChild(option);
    });

    filterSelect.addEventListener('change', () => {
        const selectedType = filterSelect.value;
        updateEventList(selectedType);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderFilterOptions();
    renderCalendar();
    updateEventList();

    document.getElementById('prev-month').addEventListener('click', previousMonth);
    document.getElementById('next-month').addEventListener('click', nextMonth);
});
