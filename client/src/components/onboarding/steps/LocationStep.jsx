import React, { useState } from "react";

const LocationStep = ({ data, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setLocationError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error("Unable to fetch location details.");
          }

          const result = await response.json();
          const address = result.address || {};

          onChange({
            location: {
              type: "Point",
              coordinates: [longitude, latitude],
              city:
                address.city ||
                address.town ||
                address.village ||
                address.municipality ||
                "",
              state: address.state || "",
              country: address.country || "",
              address: result.display_name || "",
            },
          });
        } catch (error) {
          console.error("Location lookup failed:", error);

          // Even if reverse geocoding fails, keep the coordinates.
          onChange({
            location: {
              ...(data.location || {}),
              type: "Point",
              coordinates: [longitude, latitude],
            },
          });

          setLocationError(
            "Location detected, but address details could not be loaded."
          );
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);

        let message = "Unable to get your location.";

        if (error.code === error.PERMISSION_DENIED) {
          message =
            "Location permission was denied. Please allow location access.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "Your location is currently unavailable.";
        } else if (error.code === error.TIMEOUT) {
          message = "Location request timed out. Please try again.";
        }

        setLocationError(message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const location = data.location || {};
  const coordinates = location.coordinates || [0, 0];
  const hasCoordinates = coordinates[0] !== 0 || coordinates[1] !== 0;

  return (
    <div className="space-y-7">
      {/* Heading */}
      <div className="relative">
        <span className="pointer-events-none absolute -top-3 right-0 text-4xl opacity-10 select-none sm:text-5xl">
          📍
        </span>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-rose-600 ring-1 ring-inset ring-rose-100">
          <span>💗</span> Love is closer than you think
        </span>

        <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Your Location
        </h3>

        <p className="mt-1.5 text-sm text-slate-500">
          Add your location so we can find compatible people nearby
        </p>
      </div>

      {/* Location Button */}
      <div className="rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 p-5 sm:p-6">
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:pointer-events-none disabled:opacity-60 sm:w-auto"
        >
          <span className={loading ? "animate-pulse" : ""}>
            {loading ? "💓" : "📍"}
          </span>
          {loading ? "Detecting Location..." : "Use My Current Location"}
        </button>

        {locationError && (
          <p className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            <span>⚠️</span>
            {locationError}
          </p>
        )}
      </div>

      {/* Location Details */}
      <div className="space-y-4">
        {/* City */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <label
            htmlFor="city"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-base">
              🏙️
            </span>
            City
          </label>

          <input
            id="city"
            type="text"
            value={location.city || ""}
            onChange={(e) =>
              onChange({
                location: {
                  ...location,
                  city: e.target.value,
                },
              })
            }
            placeholder="Enter your city"
            className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
          />
        </div>

        {/* State */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <label
            htmlFor="state"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-base">
              🗺️
            </span>
            State
          </label>

          <input
            id="state"
            type="text"
            value={location.state || ""}
            onChange={(e) =>
              onChange({
                location: {
                  ...location,
                  state: e.target.value,
                },
              })
            }
            placeholder="Enter your state"
            className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
          />
        </div>

        {/* Country */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <label
            htmlFor="country"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-base">
              🌍
            </span>
            Country
          </label>

          <input
            id="country"
            type="text"
            value={location.country || ""}
            onChange={(e) =>
              onChange({
                location: {
                  ...location,
                  country: e.target.value,
                },
              })
            }
            placeholder="Enter your country"
            className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
          />
        </div>

        {/* Address */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <label
            htmlFor="address"
            className="flex items-center gap-2 text-sm font-semibold text-slate-700"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-base">
              🏡
            </span>
            Address
          </label>

          <textarea
            id="address"
            rows={3}
            value={location.address || ""}
            onChange={(e) =>
              onChange({
                location: {
                  ...location,
                  address: e.target.value,
                },
              })
            }
            placeholder="Enter your address"
            className="mt-3 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-rose-400 focus:bg-white focus:ring-4 focus:ring-rose-500/10"
          />
        </div>
      </div>

      {/* Coordinates */}
      {hasCoordinates ? (
        <div className="flex items-center gap-3 rounded-2xl border border-green-100 bg-green-50 px-4 py-3.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500 text-sm text-white shadow-[0_0_15px_rgba(34,197,94,0.45)]">
            ✓
          </span>
          <div>
            <p className="text-sm font-semibold text-green-700">
              Location detected successfully 💚
            </p>
            <p className="mt-0.5 text-xs text-green-600">
              Coordinates: {coordinates[1].toFixed(6)},{" "}
              {coordinates[0].toFixed(6)}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default LocationStep;