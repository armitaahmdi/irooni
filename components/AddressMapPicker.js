"use client";

import { useAddressMapPicker } from "@/hooks/useAddressMapPicker";
import MapSearchBar from "./address/MapSearchBar";
import MapContainer from "./address/MapContainer";
import SelectedAddress from "./address/SelectedAddress";

export default function AddressMapPicker({
  onLocationSelect,
  initialLat = 35.6892,
  initialLng = 51.3890,
  initialAddress = "",
}) {
  const {
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
  } = useAddressMapPicker({ onLocationSelect, initialLat, initialLng, initialAddress });

  return (
    <div className="w-full space-y-4">
      <MapSearchBar
        searchInputRef={searchInputRef}
        isSearching={isSearching}
        searchResults={searchResults}
        showSearchResults={showSearchResults}
        onSearch={handleSearch}
        onSelectResult={handleSelectSearchResult}
        onFocus={() => {
          if (searchResults.length > 0) {
            setShowSearchResults(true);
          }
        }}
      />

      <MapContainer mapRef={mapRef} isMapLoaded={isMapLoaded} error={error} />

      <SelectedAddress selectedLocation={selectedLocation} />
    </div>
  );
}
