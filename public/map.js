const latitude = 28.5286;   // Saket, Delhi
const longitude = 77.2197;

const map = L.map('map').setView([latitude, longitude], 15);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Add a marker for Saket
const marker = L.marker([latitude, longitude]).addTo(map);
marker.bindPopup("<b>Saket, Delhi</b><br>Approx Location").openPopup();
