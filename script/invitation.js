const invitation = document.getElementById('invitation');
const filter = document.getElementById('filter');
const invitationEventImg = document.getElementById('event');
const addToCalendarBtn = document.getElementById('add-to-calendar');

const inviteFilters = localStorage.getItem('inviteFilters');
const eventLoc = localStorage.getItem('eventLoc');
const eventImg = localStorage.getItem('eventImg');

const proxyUrl = 'imageProxy.php?url=';

// Fetch the image through the proxy and convert it to Data URL
async function convertImageToDataURL(imageUrl) {
    try {
        const response = await fetch(proxyUrl + encodeURIComponent(imageUrl));

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const blob = await response.blob();

        const reader = new FileReader();
        return new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Error fetching image:', error);
        return null;
    }
}


async function initialize() {
    if (eventImg) {
        const eventDataURL = await convertImageToDataURL(eventImg);
        if (eventDataURL) {
            invitationEventImg.style.backgroundImage = `url(${eventDataURL})`;
        }
    }

    if (inviteFilters) {
        filter.style.backgroundImage = `url(${inviteFilters})`;
    }

    if (eventLoc) {
        document.querySelector('.event-details').innerText = eventLoc;
    }
}

initialize();

addToCalendarBtn.addEventListener("click", async () => {
    
    await new Promise(resolve => {
        html2canvas(invitation, { 
            allowTaint: false, 
            useCORS: true,
        }).then(function(canvas) {
            canvas.toBlob(function(blob) {
                localStorage.setItem('inviteCardBlob', blob);
                resolve();
            }, 'image/png');
        }).catch(function(error) {
            console.error("Error creating invite card:", error);
            resolve();
        });
    });

    // window.location.href = 'calendar.html';
});
