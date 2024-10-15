const apiUrl = 'https://data.brisbane.qld.gov.au/api/explore/v2.1/catalog/datasets/brisbane-city-council-events/records?order_by=start_datetime&limit=100';

const invitation = document.getElementById("invitation");
const filtersContainer = document.getElementById("filters-container");
const friendContainer = document.getElementById("friend-container");
const filtersPopup = document.getElementById("filters-popup");
const friendPopup = document.getElementById("friend-popup");
const openFiltersBtn = document.getElementById("event-type-btn");
const addFriendBtn = document.getElementById("add-friends-btn");
const doneBtn = document.getElementById("done-btn");
const popups = document.querySelectorAll('.popup');
const buttons = document.querySelectorAll('.btn');

const selectedTypes = new Set();
const selectedFriends = new Set();

// For the display
const eventTypes = new Map([
    ["Art", "url('media/stickers/Art.png')"],
    ["Creative", "url('media/stickers/Creative.png')"],
    ["Culture", "url('media/stickers/Culture.png')"],
    ["Exhibitions", "url('media/stickers/Exhibitions.png')"],
    ["Family events", "url('media/stickers/Family Events.png')"],
    ["Featured", "url('media/stickers/Featured.png')"],
    ["Festivals", "url('media/stickers/Festivals.png')"],
    ["Films", "url('media/stickers/Films.png')"],
    ["Fitness & well-being", "url('media/stickers/Fitness&Well being.png')"],
    ["Food", "url('media/stickers/Food.png')"],
    ["Free", "url('media/stickers/Free.png')"],
    ["Green", "url('media/stickers/Green.png')"],
    ["Markets", "url('media/stickers/Markets.png')"],
    ["Music", "url('media/stickers/Music.png')"],
    ["Performing arts", "url('media/stickers/Performing Arts.png')"],
    ["Tours", "url('media/stickers/Tours.png')"],
    ["Workshops", "url('media/stickers/Workshops.png')"]    
]);

function changeSticker(element) {
    element.style.backgroundSize = 'contain';
    element.style.backgroundRepeat = 'no-repeat';
    element.style.backgroundPosition = 'center';
    element.style.backgroundColor = '';
    element.style.width = '200px'; 
    element.style.height = '162px';
    element.style.color = 'transparent';
}

function changeStyle(element) {
    element.style.backgroundColor = '#ff7f50';
    element.style.color = 'white';
    element.style.fontWeight = 600;
}

function revertStyle(element) {

    element.style.backgroundColor = '#e0f2f1';
    element.style.color = '#00796b';
    element.style.fontWeight = 500;

    if (element.classList.contains('filter')) {
        changeStyle(element);
        element.style.backgroundPosition = '';
        element.style.backgroundSize = 'cover';
        element.style.width = '';
        element.style.height = ''; 
        element.style.backgroundColor = '';
    }
}

openFiltersBtn.addEventListener("click", () => {
    popups.forEach(popup => popup.style.zIndex = 0);
    filtersPopup.style.zIndex = 10;
    buttons.forEach(button => revertStyle(button));
    changeStyle(openFiltersBtn);
});

addFriendBtn.addEventListener("click", () => {
    popups.forEach(popup => popup.style.zIndex = 0);
    friendPopup.style.zIndex = 10;
    buttons.forEach(button => revertStyle(button));
    changeStyle(addFriendBtn);
});

doneBtn.addEventListener("click", async () => {
    selectedTypes.forEach(type => {
        const savedType = document.createElement("div");
        savedType.className = `filter copy`;
        savedType.textContent = type;
        invitation.appendChild(savedType);
        const filter = document.querySelector(`.filter.${type.split(' ')[0]}`);
        const position = filter.getBoundingClientRect();
        savedType.style.left = `${position.left}px`;
        savedType.style.top = `${position.top}px`;
    });

    selectedFriends.forEach(friend => {
        const savedFriend = document.createElement("div");
        savedFriend.className = `friend copy`;
        savedFriend.textContent = friend;
        invitation.appendChild(savedFriend);
        const filter = document.querySelector(`.friend.${friend.split(' ')[1]}`);
        const position = filter.getBoundingClientRect();
        savedFriend.style.left = `${position.left}px`;
        savedFriend.style.top = `${position.top}px`;
    });

    localStorage.setItem('selectedTypes', JSON.stringify(Array.from(selectedTypes)));

    await new Promise(resolve => {
        html2canvas(invitation, { allowTaint: true, useCORS: true }).then(function(canvas) {
            const inviteCard = canvas.toDataURL();
            localStorage.setItem('inviteCard', inviteCard);
            resolve();
        });
    });

    document.querySelectorAll('.copy').forEach(copy => copy.remove());
    window.location.href = 'filtered-events.html';
});

async function getBrisbaneEvents() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data && data.results) {
            return data.results;
        } else {
            throw new Error('No events found');
        }
    } catch (error) {
        console.error("Error fetching events:", error);
        throw new Error('No events found');
    }
}

for (let i = 0; i < 10; i++) {
    const friend = document.createElement("div");
    letter = String.fromCharCode(65 + i);
    friend.className = `friend ${letter}`;
    friend.textContent = `Friend ${letter}`;
    friendContainer.appendChild(friend);

    const row = Math.floor(i / 5);
    const col = i % 5;
    friend.style.left = `${col * 120}px`;
    friend.style.top = `${row * 70}px`;

    friend.addEventListener("mousedown", startDragging);
    friend.addEventListener("touchstart", startDragging);
}

async function renderBrisbaneEvents() {

    Array.from(eventTypes.keys()).forEach((type, index) => {
        const filter = document.createElement("div");
        filter.className = `filter ${type.split(' ')[0]}`;
        filter.textContent = type;
        filtersContainer.appendChild(filter);

        const row = Math.floor(index / 5);
        const col = index % 5;
        filter.style.left = `${col * 120}px`;
        filter.style.top = `${row * 70}px`;

        changeStyle(filter);
        filter.style.backgroundImage = eventTypes.get(type);
        filter.style.webkitTextStroke = '0.2px black';
        filter.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.9)';

        filter.addEventListener("mousedown", startDragging);
        filter.addEventListener("touchstart", startDragging);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderBrisbaneEvents();
});

function getEventPosition(e) {
    return e.touches
        ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
        : { x: e.clientX, y: e.clientY };
}

const initialFilterPosMap = new Map();
const initialFriendPosMap = new Map();

function startDragging(e) {
    e.preventDefault();
    const element = e.target;
    const initialPos = getEventPosition(e);
    const initialElementPos = { x: element.offsetLeft, y: element.offsetTop };

    if (element.classList.contains('filter') && !element.classList.contains('dragged')) {
        initialFilterPosMap.set(element, initialElementPos);
    } else if (element.classList.contains('friend') && !element.classList.contains('dragged')) {
        initialFriendPosMap.set(element, initialElementPos);
    }

    element.classList.add('dragged');
    element.classList.add('dragging');

    function moveElement(e) {
        const currentPos = getEventPosition(e);
        const dx = currentPos.x - initialPos.x;
        const dy = currentPos.y - initialPos.y;

        element.style.left = `${initialElementPos.x + dx}px`;
        element.style.top = `${initialElementPos.y + dy}px`;

        const elementRect = element.getBoundingClientRect();
        const targetRect = invitation.getBoundingClientRect();

        if (
            elementRect.left < targetRect.right &&
            elementRect.right > targetRect.left &&
            elementRect.top < targetRect.bottom &&
            elementRect.bottom > targetRect.top
        ) {
            
            if (element.classList.contains('filter')) {
                changeSticker(element);
            } else {
                element.style.backgroundColor = 'blue';
                element.style.backgroundImage = '';
            }

        } else {
            revertStyle(element);
        }
    }

    function stopDragging() {
        document.removeEventListener("mousemove", moveElement);
        document.removeEventListener("mouseup", stopDragging);
        document.removeEventListener("touchmove", moveElement);
        document.removeEventListener("touchend", stopDragging);

        const elementRect = element.getBoundingClientRect();
        const targetRect = invitation.getBoundingClientRect();

        element.classList.remove('dragging');

        if (
            elementRect.left < targetRect.right &&
            elementRect.right > targetRect.left &&
            elementRect.top < targetRect.bottom &&
            elementRect.bottom > targetRect.top
        ) {

            if (element.classList.contains('filter')) {
                changeSticker(element);
            } else {
                element.style.backgroundColor = 'blue';
                element.style.backgroundImage = '';
            }

            if (!element.classList.contains('friend')) {
                selectedTypes.add(element.textContent);
            } else {
                selectedFriends.add(element.textContent);
            }
        } else {
            revertStyle(element);
            if (element.classList.contains('filter')) {
                element.style.left = `${initialFilterPosMap.get(element).x}px`;
                element.style.top = `${initialFilterPosMap.get(element).y}px`;
                selectedTypes.delete(element.textContent);
            } else if (element.classList.contains('friend')) {
                element.style.left = `${initialFriendPosMap.get(element).x}px`;
                element.style.top = `${initialFriendPosMap.get(element).y}px`;
                selectedFriends.delete(element.textContent);
            }
        }
    }

    document.addEventListener("mousemove", moveElement);
    document.addEventListener("mouseup", stopDragging);
    document.addEventListener("touchmove", moveElement);
    document.addEventListener("touchend", stopDragging);
}
