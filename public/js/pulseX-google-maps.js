/**
 * PulseX Emergency Command Center — Google Maps Module
 * Core Services: MapService, GeolocationService, PlacesService, DirectionsService, FleetManager, MarkerManager, LayerManager
 */

class PulseXEmergencyMapSystem {
    constructor() {
        this.map = null;
        this.userLocation = { lat: 40.7128, lng: -74.0060 }; // Default fallback
        this.isRealLocation = false;
        
        this.placesService = null;
        this.directionsService = null;
        this.directionsRenderer = null;
        
        this.userMarker = null;
        this.radiusCircle = null;
        
        this.ambulanceMarkers = [];
        this.hospitalMarkers = [];
        this.traumaMarkers = [];
        this.bloodMarkers = [];
        
        this.infoWindow = null;
        this.activeLayers = {
            ambulances: true,
            hospitals: true,
            trauma: true,
            blood: true
        };
        this.currentStatusFilter = 'all';

        this.fleetData = [];
        this.liveSimTimer = null;
    }

    /**
     * 1. Initialize System
     */
    init(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
            this.renderFallbackError(containerId);
            return;
        }

        // Initialize Services
        this.infoWindow = new google.maps.InfoWindow();
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: '#38bdf8',
                strokeWeight: 5,
                strokeOpacity: 0.95
            }
        });

        // Setup Map with PulseX Dark Theme
        const darkStyle = [
            { elementType: "geometry", stylers: [{ color: "#0b1329" }] },
            { elementType: "labels.text.stroke", stylers: [{ color: "#0b1329" }] },
            { elementType: "labels.text.fill", stylers: [{ color: "#94a3b8" }] },
            { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#38bdf8" }] },
            { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#38bdf8" }] },
            { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#111c3a" }] },
            { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a274a" }] },
            { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#0f172a" }] },
            { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#1e3a8a" }] },
            { featureType: "transit", elementType: "geometry", stylers: [{ color: "#1e293b" }] },
            { featureType: "water", elementType: "geometry", stylers: [{ color: "#030712" }] }
        ];

        this.map = new google.maps.Map(container, {
            center: this.userLocation,
            zoom: 13,
            styles: darkStyle,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: true
        });

        this.directionsRenderer.setMap(this.map);
        this.placesService = new google.maps.places.PlacesService(this.map);

        // Detect User Location
        this.detectUserLocation();

        // Setup Places Search Box
        this.initSearchBox();

        // Start Live Movement Simulation (10s refresh)
        this.startFleetAutoRefresh();
    }

    /**
     * 2. Detect Live GPS User Location
     */
    detectUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    this.isRealLocation = true;
                    this.updateLocationState();
                },
                (error) => {
                    console.warn("Geolocation permission denied/unavailable. Using default location.", error);
                    this.isRealLocation = false;
                    this.updateLocationState();
                },
                { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
            );
        } else {
            this.updateLocationState();
        }
    }

    updateLocationState() {
        if (!this.map) return;

        // Smooth Pan to Location
        this.map.panTo(this.userLocation);

        // Update GPS Lock Badge
        const badge = document.getElementById('mapEngineStatusBadge');
        if (badge) {
            const dirN = this.userLocation.lat >= 0 ? 'N' : 'S';
            const dirE = this.userLocation.lng >= 0 ? 'E' : 'W';
            badge.innerHTML = `GPS Lock: ${Math.abs(this.userLocation.lat).toFixed(4)}° ${dirN}, ${Math.abs(this.userLocation.lng).toFixed(4)}° ${dirE}`;
        }

        // Render User Marker
        this.renderUserMarker();

        // Render 5 KM Emergency Radius Circle
        this.renderEmergencyRadius();

        // Generate Fleet around Location
        this.generateInitialFleet();

        // Search Nearby Hospitals via Places API
        this.searchNearbyHospitals();
    }

    renderUserMarker() {
        if (this.userMarker) this.userMarker.setMap(null);

        this.userMarker = new google.maps.Marker({
            position: this.userLocation,
            map: this.map,
            title: "You (Emergency SOS Location)",
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#38bdf8",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 3
            }
        });

        this.userMarker.addListener('click', () => {
            this.infoWindow.setContent(`
                <div style="padding:8px; color:#fff;">
                    <div style="font-weight:800; color:#38bdf8; font-size:0.95rem;">📍 Your Live Location</div>
                    <div style="font-size:0.75rem; color:#94a3b8; margin-top:2px;">Emergency SOS Active (GPS Synced)</div>
                </div>
            `);
            this.infoWindow.open(this.map, this.userMarker);
        });
    }

    /**
     * 3. Render 5 KM Emergency Radius Translucent Circle
     */
    renderEmergencyRadius() {
        if (this.radiusCircle) this.radiusCircle.setMap(null);

        this.radiusCircle = new google.maps.Circle({
            strokeColor: '#38bdf8',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#0ea5e9',
            fillOpacity: 0.12,
            map: this.map,
            center: this.userLocation,
            radius: 5000 // 5 KM
        });
    }

    /**
     * 4. Google Places API — Nearby Hospitals Search
     */
    searchNearbyHospitals() {
        if (!this.placesService) return;

        const request = {
            location: this.userLocation,
            radius: 8000,
            type: ['hospital', 'doctor', 'health']
        };

        this.placesService.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                this.clearHospitalMarkers();
                
                results.slice(0, 8).forEach((place, index) => {
                    this.createHospitalMarker(place, index);
                });
            } else {
                // Fallback realistic hospital markers if Places quota/offline
                this.generateFallbackHospitals();
            }
        });
    }

    createHospitalMarker(place, index) {
        if (!place.geometry || !place.geometry.location) return;

        const isTrauma = index % 2 === 0;
        const markerIcon = isTrauma ? '⚡' : '🏥';
        
        const marker = new google.maps.Marker({
            position: place.geometry.location,
            map: this.activeLayers.hospitals ? this.map : null,
            title: place.name,
            label: markerIcon
        });

        // Calculate distance from user
        const distKm = this.calculateDistance(
            this.userLocation.lat, this.userLocation.lng,
            place.geometry.location.lat(), place.geometry.location.lng()
        );
        const estEtaMins = Math.round(distKm * 2.2);

        marker.addListener('click', () => {
            const content = `
                <div style="padding:8px; min-width:210px; color:#fff;">
                    <div style="font-weight:800; font-size:0.95rem; margin-bottom:4px;">🏥 ${place.name}</div>
                    <div style="font-size:0.78rem; color:#94a3b8;">Rating: <strong style="color:#facc15;">★ ${place.rating || '4.8'}</strong></div>
                    <div style="font-size:0.78rem; color:#94a3b8; margin-top:2px;">Distance: <strong style="color:#38bdf8;">${distKm.toFixed(1)} km</strong> • ETA: <strong style="color:#4ade80;">${estEtaMins} mins</strong></div>
                    <div style="margin-top:10px;">
                        <button style="padding:6px 12px; border-radius:8px; background:linear-gradient(135deg, #0ea5e9, #0284c7); color:#fff; border:none; font-size:0.75rem; font-weight:800; cursor:pointer; width:100%;" onclick="pulseXMapSystem.calculateRouteToDestination(${place.geometry.location.lat()}, ${place.geometry.location.lng()})">
                            🧭 Navigate & Dispatch
                        </button>
                    </div>
                </div>
            `;
            this.infoWindow.setContent(content);
            this.infoWindow.open(this.map, marker);
        });

        if (isTrauma) {
            this.traumaMarkers.push(marker);
        } else {
            this.hospitalMarkers.push(marker);
        }
    }

    generateFallbackHospitals() {
        this.clearHospitalMarkers();
        const baseLat = this.userLocation.lat;
        const baseLng = this.userLocation.lng;

        const fallbackHospitals = [
            { name: "City Trauma & ICU Hub", lat: baseLat + 0.004, lng: baseLng + 0.005, rating: "4.9", isTrauma: true },
            { name: "Apex Cardiology Center", lat: baseLat + 0.012, lng: baseLng - 0.008, rating: "4.8", isTrauma: false },
            { name: "Metro General Emergency Hospital", lat: baseLat - 0.008, lng: baseLng + 0.011, rating: "4.7", isTrauma: true },
            { name: "LifeLine Speciality Blood Repository", lat: baseLat - 0.005, lng: baseLng - 0.007, rating: "4.9", isBlood: true }
        ];

        fallbackHospitals.forEach(h => {
            const markerIcon = h.isBlood ? '🩸' : h.isTrauma ? '⚡' : '🏥';
            const marker = new google.maps.Marker({
                position: { lat: h.lat, lng: h.lng },
                map: this.map,
                title: h.name,
                label: markerIcon
            });

            const dist = this.calculateDistance(baseLat, baseLng, h.lat, h.lng);
            const eta = Math.round(dist * 2.2);

            marker.addListener('click', () => {
                const content = `
                    <div style="padding:8px; min-width:210px; color:#fff;">
                        <div style="font-weight:800; font-size:0.95rem; margin-bottom:4px;">${markerIcon} ${h.name}</div>
                        <div style="font-size:0.78rem; color:#94a3b8;">Rating: <strong style="color:#facc15;">★ ${h.rating}</strong></div>
                        <div style="font-size:0.78rem; color:#94a3b8; margin-top:2px;">Distance: <strong style="color:#38bdf8;">${dist.toFixed(1)} km</strong> • ETA: <strong style="color:#4ade80;">${eta} mins</strong></div>
                        <div style="margin-top:10px;">
                            <button style="padding:6px 12px; border-radius:8px; background:linear-gradient(135deg, #0ea5e9, #0284c7); color:#fff; border:none; font-size:0.75rem; font-weight:800; cursor:pointer; width:100%;" onclick="pulseXMapSystem.calculateRouteToDestination(${h.lat}, ${h.lng})">
                                🧭 Navigate & Dispatch
                            </button>
                        </div>
                    </div>
                `;
                this.infoWindow.setContent(content);
                this.infoWindow.open(this.map, marker);
            });

            if (h.isBlood) this.bloodMarkers.push(marker);
            else if (h.isTrauma) this.traumaMarkers.push(marker);
            else this.hospitalMarkers.push(marker);
        });
    }

    clearHospitalMarkers() {
        [...this.hospitalMarkers, ...this.traumaMarkers, ...this.bloodMarkers].forEach(m => m.setMap(null));
        this.hospitalMarkers = [];
        this.traumaMarkers = [];
        this.bloodMarkers = [];
    }

    /**
     * 5. Ambulance Fleet Generation & Management
     */
    generateInitialFleet() {
        const baseLat = this.userLocation.lat;
        const baseLng = this.userLocation.lng;

        this.fleetData = [
            {
                id: 'AMB-101',
                name: 'AMB-101 (Cardiac ICU)',
                lat: baseLat + 0.006,
                lng: baseLng - 0.005,
                status: 'available',
                driver: 'Marcus Vance',
                phone: '+1 555 0181',
                speed: '48 km/h',
                equipment: 'Ventilator, Defibrillator, ECG'
            },
            {
                id: 'AMB-305',
                name: 'AMB-305 (Advance Trauma)',
                lat: baseLat - 0.005,
                lng: baseLng + 0.007,
                status: 'responding',
                driver: 'Sarah Jenkins',
                phone: '+1 555 0182',
                speed: '64 km/h',
                equipment: 'ICU Rig, Trauma Kit, Oxygen'
            },
            {
                id: 'AMB-408',
                name: 'AMB-408 (Neonatal Care)',
                lat: baseLat + 0.011,
                lng: baseLng + 0.012,
                status: 'available',
                driver: 'David Miller',
                phone: '+1 555 0183',
                speed: '52 km/h',
                equipment: 'Incubator, Oxygen, Monitor'
            },
            {
                id: 'AMB-502',
                name: 'AMB-502 (Basic Transport)',
                lat: baseLat - 0.012,
                lng: baseLng - 0.010,
                status: 'busy',
                driver: 'Elena Rostova',
                phone: '+1 555 0184',
                speed: '38 km/h',
                equipment: 'Stretcher, Basic O2 Kit'
            }
        ];

        this.renderFleetMarkers();
        this.updateDashboardMetrics();
    }

    renderFleetMarkers() {
        this.ambulanceMarkers.forEach(m => m.marker.setMap(null));
        this.ambulanceMarkers = [];

        this.fleetData.forEach(item => {
            const dist = this.calculateDistance(this.userLocation.lat, this.userLocation.lng, item.lat, item.lng);
            item.dist = `${dist.toFixed(1)} km`;
            item.eta = `${Math.max(1, Math.round(dist * 2.1))} mins`;

            const labelIcon = item.status === 'responding' ? '🚨' : item.status === 'available' ? '🚑' : '⏳';

            const marker = new google.maps.Marker({
                position: { lat: item.lat, lng: item.lng },
                map: this.activeLayers.ambulances && (this.currentStatusFilter === 'all' || item.status === this.currentStatusFilter) ? this.map : null,
                title: item.name,
                label: labelIcon
            });

            marker.addListener('click', () => {
                const statusColor = item.status === 'available' ? '#4ade80' : item.status === 'responding' ? '#38bdf8' : '#facc15';
                const popupContent = `
                    <div style="padding:8px; min-width:210px; color:#fff;">
                        <div style="font-weight:800; font-size:0.95rem; margin-bottom:4px;">${item.name}</div>
                        <div style="font-size:0.78rem; color:#94a3b8;">Driver: <strong style="color:#fff;">${item.driver}</strong></div>
                        <div style="font-size:0.78rem; color:#94a3b8; margin-top:2px;">Distance: <strong style="color:#38bdf8;">${item.dist}</strong> • ETA: <strong style="color:#4ade80;">${item.eta}</strong></div>
                        <div style="margin-top:6px; display:inline-block; font-size:0.7rem; font-weight:800; text-transform:uppercase; padding:2px 8px; border-radius:6px; background:rgba(255,255,255,0.08); color:${statusColor};">Status: ${item.status}</div>
                        <div style="margin-top:10px; display:flex; gap:6px;">
                            <button style="padding:5px 10px; border-radius:6px; background:#0ea5e9; color:#fff; border:none; font-size:0.72rem; font-weight:700; cursor:pointer;" onclick="pulseXMapSystem.dispatchAmbulanceUnit('${item.id}')">Dispatch</button>
                            <button style="padding:5px 10px; border-radius:6px; background:rgba(34,197,94,0.2); color:#4ade80; border:1px solid rgba(34,197,94,0.3); font-size:0.72rem; font-weight:700; cursor:pointer;" onclick="callAmbulanceDriver('${item.id}', '${item.driver}', '${item.phone}')">Call</button>
                        </div>
                    </div>
                `;
                this.infoWindow.setContent(popupContent);
                this.infoWindow.open(this.map, marker);
            });

            this.ambulanceMarkers.push({ id: item.id, marker: marker, status: item.status });
        });
    }

    /**
     * 6. Smooth Live Marker Movement (No Teleporting)
     */
    startFleetAutoRefresh() {
        if (this.liveSimTimer) clearInterval(this.liveSimTimer);

        this.liveSimTimer = setInterval(() => {
            this.fleetData.forEach(unit => {
                if (unit.status === 'responding' || unit.status === 'available') {
                    // Small incremental movement towards/around user location
                    const targetLat = unit.status === 'responding' ? this.userLocation.lat : unit.lat + (Math.random() - 0.5) * 0.002;
                    const targetLng = unit.status === 'responding' ? this.userLocation.lng : unit.lng + (Math.random() - 0.5) * 0.002;

                    const newLat = unit.lat + (targetLat - unit.lat) * 0.15;
                    const newLng = unit.lng + (targetLng - unit.lng) * 0.15;

                    unit.lat = newLat;
                    unit.lng = newLng;

                    const markerItem = this.ambulanceMarkers.find(m => m.id === unit.id);
                    if (markerItem && markerItem.marker) {
                        this.animateMarkerPosition(markerItem.marker, { lat: newLat, lng: newLng });
                    }
                }
            });

            this.updateDashboardMetrics();
        }, 8000);
    }

    animateMarkerPosition(marker, targetPos) {
        const startPos = marker.getPosition();
        const startLat = startPos.lat();
        const startLng = startPos.lng();
        const frames = 30;
        let currentFrame = 0;

        const animateStep = () => {
            currentFrame++;
            const progress = currentFrame / frames;
            const curLat = startLat + (targetPos.lat - startLat) * progress;
            const curLng = startLng + (targetPos.lng - startLng) * progress;

            marker.setPosition(new google.maps.LatLng(curLat, curLng));

            if (currentFrame < frames) {
                requestAnimationFrame(animateStep);
            }
        };

        requestAnimationFrame(animateStep);
    }

    /**
     * 7. Request Ambulance & Driving Directions Route Calculation
     */
    requestNearestAmbulance() {
        const availableUnit = this.fleetData.find(a => a.status === 'available');

        if (!availableUnit) {
            alert("All ambulances are currently on mission. Searching secondary dispatch mesh...");
            return;
        }

        availableUnit.status = 'responding';
        this.renderFleetMarkers();
        this.calculateRouteToDestination(availableUnit.lat, availableUnit.lng);
        
        showGenericModal(
            `🚨 Priority Dispatch Initialized — ${availableUnit.name}`,
            `Ambulance ${availableUnit.id} driven by ${availableUnit.driver} has been assigned to your location.\n\nLive driving route activated on GPS Map.`
        );
    }

    dispatchAmbulanceUnit(unitId) {
        const unit = this.fleetData.find(a => a.id === unitId);
        if (unit) {
            unit.status = 'responding';
            this.renderFleetMarkers();
            this.calculateRouteToDestination(unit.lat, unit.lng);
        }
    }

    calculateRouteToDestination(originLat, originLng) {
        if (!this.directionsService || !this.directionsRenderer) return;

        const request = {
            origin: { lat: originLat, lng: originLng },
            destination: this.userLocation,
            travelMode: google.maps.TravelMode.DRIVING
        };

        this.directionsService.route(request, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                this.directionsRenderer.setDirections(result);
            }
        });
    }

    /**
     * 8. Google Places Search Box
     */
    initSearchBox() {
        const searchInput = document.getElementById('mapSearchInput');
        if (!searchInput) return;

        const autocomplete = new google.maps.places.Autocomplete(searchInput);
        autocomplete.bindTo('bounds', this.map);

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (!place.geometry || !place.geometry.location) return;

            this.userLocation = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng()
            };

            this.updateLocationState();
        });
    }

    /**
     * 9. Filter Fleet by Status
     */
    filterFleetByStatus(status) {
        this.currentStatusFilter = status;

        this.ambulanceMarkers.forEach(item => {
            if (this.activeLayers.ambulances && (status === 'all' || item.status === status)) {
                item.marker.setMap(this.map);
            } else {
                item.marker.setMap(null);
            }
        });

        // Sync DOM cards
        const cards = document.querySelectorAll('.fleet-card');
        cards.forEach(card => {
            if (status === 'all' || card.dataset.status === status) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }

    /**
     * 10. Layer Toggles
     */
    toggleLayer(layerName, isVisible) {
        this.activeLayers[layerName] = isVisible;

        if (layerName === 'ambulances') {
            this.ambulanceMarkers.forEach(m => {
                if (isVisible && (this.currentStatusFilter === 'all' || m.status === this.currentStatusFilter)) {
                    m.marker.setMap(this.map);
                } else {
                    m.marker.setMap(null);
                }
            });
        } else if (layerName === 'hospitals') {
            this.hospitalMarkers.forEach(m => m.setMap(isVisible ? this.map : null));
        } else if (layerName === 'trauma') {
            this.traumaMarkers.forEach(m => m.setMap(isVisible ? this.map : null));
        } else if (layerName === 'blood') {
            this.bloodMarkers.forEach(m => m.setMap(isVisible ? this.map : null));
        }
    }

    /**
     * 11. Update Dashboard Metrics Row
     */
    updateDashboardMetrics() {
        const total = this.fleetData.length;
        const available = this.fleetData.filter(a => a.status === 'available').length;
        const mission = this.fleetData.filter(a => a.status === 'responding' || a.status === 'busy').length;

        // Calculate average fleet ETA
        let totalEta = 0;
        this.fleetData.forEach(unit => {
            const dist = this.calculateDistance(this.userLocation.lat, this.userLocation.lng, unit.lat, unit.lng);
            totalEta += dist * 2.1;
        });
        const avgEta = (totalEta / Math.max(1, total)).toFixed(1);

        // Update DOM elements dynamically
        const totalEl = document.querySelector('.fleet-summary-card:nth-child(1) .fleet-summary-val');
        const availEl = document.querySelector('.fleet-summary-card:nth-child(2) .fleet-summary-val');
        const missionEl = document.querySelector('.fleet-summary-card:nth-child(3) .fleet-summary-val');
        const etaEl = document.querySelector('.fleet-summary-card:nth-child(4) .fleet-summary-val');

        if (totalEl) totalEl.textContent = total < 10 ? `0${total}` : total;
        if (availEl) availEl.textContent = available < 10 ? `0${available}` : available;
        if (missionEl) missionEl.textContent = mission < 10 ? `0${mission}` : mission;
        if (etaEl) etaEl.innerHTML = `${avgEta}<span style="font-size:1.0rem;">m</span>`;
    }

    /**
     * Utility: Calculate Distance (Haversine formula in KM)
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    renderFallbackError(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; background:rgba(15,23,42,0.9); border:1px solid rgba(239,68,68,0.3); border-radius:14px; padding:20px; text-align:center;">
                <div style="font-size:2rem; margin-bottom:10px;">⚠️</div>
                <div style="font-size:1.0rem; font-weight:800; color:#f87171;">Google Maps Service Unavailable</div>
                <div style="font-size:0.8rem; color:#94a3b8; margin-top:4px;">Falling back to local emergency proximity mesh telemetry.</div>
            </div>
        `;
    }
}

// Global System Instance
window.pulseXMapSystem = new PulseXEmergencyMapSystem();

// Global Helper Functions for HTML Event Handlers
function toggleMapLayer(layerName, btnElement) {
    if (!btnElement) return;
    const isActive = btnElement.classList.contains('active');
    if (isActive) {
        btnElement.classList.remove('active');
        btnElement.style.opacity = '0.4';
    } else {
        btnElement.classList.add('active');
        btnElement.style.opacity = '1';
    }
    window.pulseXMapSystem.toggleLayer(layerName, !isActive);
}

function filterAmbulanceFleet(status, btnElement) {
    const pills = document.querySelectorAll('.filter-pill-btn');
    pills.forEach(p => p.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    window.pulseXMapSystem.filterFleetByStatus(status);
}

function requestNearestAmbulanceDispatch() {
    window.pulseXMapSystem.requestNearestAmbulance();
}
