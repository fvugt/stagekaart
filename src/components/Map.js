import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';

const RECENT_YEAR_THRESHOLD = 2025;

const hasRecentStudent = (students = []) =>
  students.some((student) => {
    const year = parseInt(student.year, 10);
    return !Number.isNaN(year) && year >= RECENT_YEAR_THRESHOLD;
  });

const applyMarkerColor = (marker, isRecent) => {
  const iconElement = marker.getElement();
  if (!iconElement) return;

  iconElement.classList.add('internship-marker-default');
  if (isRecent) {
    iconElement.classList.add('marker-has-recent');
    iconElement.classList.remove('marker-no-recent');
  } else {
    iconElement.classList.add('marker-no-recent');
    iconElement.classList.remove('marker-has-recent');
  }
};

const Map = ({ internships, selectedInternship, onInternshipSelect, zoomToInternship, onZoomComplete }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerClusterGroupRef = useRef(null);
  const markersRef = useRef({});



  // Initialize map only once
  useEffect(() => {
    if (!mapRef.current) return;

    console.log('Map: Initializing map');

    const map = L.map(mapRef.current).setView([52.1326, 5.2913], 7);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    // Initialize marker cluster group
    const markerClusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 60,
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      animate: false,
      animateAddingMarkers: false,
      disableClusteringAtZoom: 14,
    });

    map.addLayer(markerClusterGroup);
    mapInstanceRef.current = map;
    markerClusterGroupRef.current = markerClusterGroup;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerClusterGroupRef.current = null;
      }
    };
  }, []); // Empty dependency array - only runs once

  // Update markers when internships change
  useEffect(() => {
    if (!markerClusterGroupRef.current) return;

    console.log('Map: Updating markers for', internships.length, 'internships');

    // Clear existing markers
    markerClusterGroupRef.current.clearLayers();
    markersRef.current = {};

    // Add new markers for each internship
    internships.forEach((internship) => {
      // Check if coordinates are valid
      if (!internship.coordinates || !Array.isArray(internship.coordinates) || internship.coordinates.length !== 2) {
        console.warn('Invalid coordinates for internship:', internship.companyName, internship.coordinates);
        return;
      }

      const [lat, lng] = internship.coordinates;
      if (typeof lat !== 'number' || typeof lng !== 'number') {
        console.warn('Invalid coordinate types for internship:', internship.companyName, internship.coordinates);
        return;
      }

      const isRecent = hasRecentStudent(internship.students);

      // Create marker with coordinates
      const marker = L.marker(internship.coordinates);

      marker.on('add', () => applyMarkerColor(marker, isRecent));

      // Add click handler to open side panel
      marker.on('click', () => {
        onInternshipSelect(internship);
        // No map movement - just open the details panel
      });

      markerClusterGroupRef.current.addLayer(marker);
      markersRef.current[internship.id] = marker;

      // Fallback to ensure color is applied even if icon exists immediately
      setTimeout(() => applyMarkerColor(marker, isRecent), 0);
    });
  }, [internships, onInternshipSelect]); // Only update when internships or callback changes

  // Update marker styles when selectedInternship changes
  useEffect(() => {
    if (!markersRef.current) return;

    const updateMarkerStyles = () => {
      Object.keys(markersRef.current).forEach((id) => {
        const marker = markersRef.current[id];
        const isSelected = (selectedInternship && selectedInternship.id === parseInt(id)) || 
                          (zoomToInternship && zoomToInternship.id === parseInt(id));
        
        // Add or remove CSS class for selection styling
        const iconElement = marker.getElement();
        if (iconElement) {
          if (isSelected) {
            iconElement.classList.add('selected-marker');
          } else {
            iconElement.classList.remove('selected-marker');
          }
        }
      });
    };

    // Update styles immediately
    updateMarkerStyles();

    // Also update styles after zoom/move events (when markers are recreated)
    if (mapInstanceRef.current) {
      mapInstanceRef.current.on('zoomend', updateMarkerStyles);
      mapInstanceRef.current.on('moveend', updateMarkerStyles);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off('zoomend', updateMarkerStyles);
        mapInstanceRef.current.off('moveend', updateMarkerStyles);
      }
    };
  }, [selectedInternship, zoomToInternship]);

  // Handle zooming to internship from search
  useEffect(() => {
    if (zoomToInternship && mapInstanceRef.current && zoomToInternship.coordinates) {
      const [lat, lng] = zoomToInternship.coordinates;
      mapInstanceRef.current.flyTo([lat, lng], 14, {
        duration: 1.5,
        easeLinearity: 0.25
      });
      
      // Call onZoomComplete after animation
      setTimeout(() => {
        onZoomComplete();
      }, 1500);
    }
  }, [zoomToInternship, onZoomComplete]);

  return <div ref={mapRef} className="w-full h-full" />;
};

export default Map; 