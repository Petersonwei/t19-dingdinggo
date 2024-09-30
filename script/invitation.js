const inviteCard = localStorage.getItem('inviteCard');
const invitation = document.getElementById('invitation');
invitation.style.backgroundImage = `url(${inviteCard})`;

const eventLoc = localStorage.getItem('eventLoc');
document.querySelector('.event-details').innerText = `${eventLoc}`;
console.log(eventLoc);


const eventImg = localStorage.getItem('eventImg');
console.log(eventImg);
document.querySelector('.img').src = `${eventImg}`;