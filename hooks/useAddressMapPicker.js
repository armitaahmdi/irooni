import { useEffect, useRef, useState } from "react";

const NESHAN_API_KEY = process.env.NEXT_PUBLIC_NESHAN_API_KEY || "";

export function useAddressMapPicker({ onLocationSelect, initialLat, initialLng, initialAddress }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const vectorSourceRef = useRef(null);
  const searchInputRef = useRef(null);
  const [selectedLocation, setSelectedLocation] = useState({
    lat: initialLat,
    lng: initialLng,
    address: initialAddress,
  });
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!NESHAN_API_KEY) {
      setError(
        "API Key نشان تنظیم نشده است. لطفاً NEXT_PUBLIC_NESHAN_API_KEY را در فایل .env.local اضافه کنید."
      );
      return;
    }

    if (typeof window !== "undefined" && window.ol) {
      initializeMap();
    } else {
      let attempts = 0;
      const maxAttempts = 100;

      const checkOpenLayers = setInterval(() => {
        attempts++;
        if (typeof window !== "undefined" && window.ol) {
          clearInterval(checkOpenLayers);
          initializeMap();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkOpenLayers);
          setError("خطا در بارگذاری نقشه. لطفاً صفحه را رفرش کنید.");
        }
      }, 100);

      return () => clearInterval(checkOpenLayers);
    }
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const ol = window.ol;

    const map = new ol.Map({
      target: mapRef.current,
      layers: [
        new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: `https://api.neshan.org/v1/static?x={x}&y={y}&z={z}&key=${NESHAN_API_KEY}`,
            tileSize: 256,
          }),
        }),
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([selectedLocation.lng, selectedLocation.lat]),
        zoom: 15,
      }),
    });

    const vectorSource = new ol.source.Vector();
    const vectorLayer = new ol.layer.Vector({ source: vectorSource });
    map.addLayer(vectorLayer);

    vectorSourceRef.current = vectorSource;
    mapInstanceRef.current = map;

    addMarker(selectedLocation.lat, selectedLocation.lng);

    map.on("click", (e) => {
      const coordinate = ol.proj.toLonLat(e.coordinate);
      const newPosition = { lat: coordinate[1], lng: coordinate[0] };
      addMarker(newPosition.lat, newPosition.lng);
      setSelectedLocation({ ...selectedLocation, ...newPosition });
      reverseGeocode(newPosition.lat, newPosition.lng);
    });

    setIsMapLoaded(true);
  };

  const addMarker = (lat, lng) => {
    if (!mapInstanceRef.current || !vectorSourceRef.current) return;
    const ol = window.ol;

    vectorSourceRef.current.clear();

    const marker = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat([lng, lat])),
    });

    marker.setStyle(
      new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src:
            "data:image/svg+xml;base64," +
            btoa(`
            <svg width="32" height="48" viewBox="0 0 32 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 0C7.163 0 0 7.163 0 16c0 11.5 16 32 16 32s16-20.5 16-32C32 7.163 24.837 0 16 0z" fill="#286378"/>
              <circle cx="16" cy="16" r="6" fill="white"/>
            </svg>
          `),
          scale: 1,
        }),
      })
    );

    vectorSourceRef.current.addFeature(marker);
    markerRef.current = marker;
  };

  const handleSearch = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://api.neshan.org/v1/search?term=${encodeURIComponent(query)}&lat=${selectedLocation.lat}&lng=${selectedLocation.lng}`,
        { headers: { "Api-Key": NESHAN_API_KEY } }
      );

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        setSearchResults(data.items);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    } catch (error) {
      console.error("Error searching:", error);
      setSearchResults([]);
      setShowSearchResults(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (result) => {
    const newPosition = {
      lat: result.location.y,
      lng: result.location.x,
      address: result.title || result.address || "",
    };

    addMarker(newPosition.lat, newPosition.lng);

    if (mapInstanceRef.current) {
      const ol = window.ol;
      mapInstanceRef.current.getView().setCenter(ol.proj.fromLonLat([newPosition.lng, newPosition.lat]));
      mapInstanceRef.current.getView().setZoom(17);
    }

    setSelectedLocation(newPosition);
    setShowSearchResults(false);
    searchInputRef.current.value = result.title || result.address || "";

    if (onLocationSelect) {
      onLocationSelect(newPosition);
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(`https://api.neshan.org/v5/reverse?lat=${lat}&lng=${lng}`, {
        headers: { "Api-Key": NESHAN_API_KEY },
      });

      const data = await response.json();
      if (data.formatted_address || data.address) {
        const address = data.formatted_address || data.address || "";
        setSelectedLocation({ lat, lng, address });
        if (onLocationSelect) {
          onLocationSelect({ lat, lng, address });
        }
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
    }
  };

  return {
    mapRef,
    searchInputRef,
    selectedLocation,
    isMapLoaded,
    searchResults,
    isSearching,
    showSearchResults,
    setShowSearchResults,
    error,
    handleSearch,
    handleSelectSearchResult,
  };
}

