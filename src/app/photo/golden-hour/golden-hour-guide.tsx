"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CAMERA_SETTINGS,
  COLOR_TEMPERATURES,
  LIGHT_PHASES,
  PLANNING_TIPS,
  SEASONAL_NOTES,
  TWILIGHT_DURATION_EXAMPLES,
} from "@/lib/converters/photo/golden-hour";
import {
  formatDuration,
  formatSunTime,
  getCurrentLightPhase,
  getSunPosition,
  getSunTimes,
  getTimeUntilGoldenHour,
} from "@/lib/converters/photo/sun-position";

type LocationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; lat: number; lng: number; locationName?: string }
  | { status: "error"; message: string };

export function GoldenHourGuide() {
  const [location, setLocation] = useState<LocationState>({ status: "idle" });
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [now, setNow] = useState(() => new Date());
  const [manualMode, setManualMode] = useState(false);
  const [manualLat, setManualLat] = useState("40.7128");
  const [manualLng, setManualLng] = useState("-74.0060");

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Request geolocation
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation({ status: "error", message: "Geolocation is not supported by your browser" });
      return;
    }

    setLocation({ status: "loading" });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Try to get location name via reverse geocoding (optional)
        let locationName: string | undefined;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          locationName =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county;
        } catch {
          // Ignore geocoding errors
        }
        setLocation({ status: "success", lat: latitude, lng: longitude, locationName });
      },
      (error) => {
        let message = "Failed to get location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location permission denied. You can enter coordinates manually.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information unavailable";
            break;
          case error.TIMEOUT:
            message = "Location request timed out";
            break;
        }
        setLocation({ status: "error", message });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Get effective coordinates (from geolocation or manual input)
  const getCoordinates = (): { lat: number; lng: number } | null => {
    if (manualMode) {
      const lat = parseFloat(manualLat);
      const lng = parseFloat(manualLng);
      if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng };
      }
      return null;
    }
    if (location.status === "success") {
      return { lat: location.lat, lng: location.lng };
    }
    return null;
  };

  const coords = getCoordinates();
  const dateForCalc = new Date(`${selectedDate}T12:00:00`);
  const sunTimes = coords ? getSunTimes(dateForCalc, coords.lat, coords.lng) : null;
  const sunPosition = coords ? getSunPosition(now, coords.lat, coords.lng) : null;
  const currentPhase = coords ? getCurrentLightPhase(now, coords.lat, coords.lng) : null;
  const nextGoldenHour = coords ? getTimeUntilGoldenHour(now, coords.lat, coords.lng) : null;

  return (
    <div className="space-y-6">
      {/* Location & Date Controls */}
      <div className="p-4 rounded-lg border bg-muted/30 space-y-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-2 items-center">
            {!manualMode ? (
              <button
                onClick={requestLocation}
                disabled={location.status === "loading"}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
              >
                {location.status === "loading" ? (
                  <>
                    <span className="animate-spin">&#9696;</span>
                    Getting location...
                  </>
                ) : (
                  <>
                    <span>&#128205;</span>
                    {location.status === "success" ? "Update Location" : "Use My Location"}
                  </>
                )}
              </button>
            ) : null}
            <button
              onClick={() => setManualMode(!manualMode)}
              className="px-3 py-2 rounded-md border hover:bg-muted text-sm"
            >
              {manualMode ? "Use Geolocation" : "Enter Manually"}
            </button>
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm">Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 rounded-md border bg-background"
            />
          </div>
        </div>

        {/* Manual Coordinate Input */}
        {manualMode && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Latitude</label>
              <input
                type="number"
                value={manualLat}
                onChange={(e) => setManualLat(e.target.value)}
                step="0.0001"
                min="-90"
                max="90"
                className="w-full h-10 px-3 rounded-md border bg-background"
                placeholder="e.g., 40.7128"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Longitude</label>
              <input
                type="number"
                value={manualLng}
                onChange={(e) => setManualLng(e.target.value)}
                step="0.0001"
                min="-180"
                max="180"
                className="w-full h-10 px-3 rounded-md border bg-background"
                placeholder="e.g., -74.0060"
              />
            </div>
          </div>
        )}

        {/* Location Status */}
        {location.status === "error" && (
          <p className="text-sm text-destructive">{location.message}</p>
        )}
        {location.status === "success" && !manualMode && (
          <p className="text-sm text-muted-foreground">
            Location:{" "}
            {location.locationName || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
          </p>
        )}
      </div>

      {/* Current Conditions (only show if we have coordinates) */}
      {coords && sunPosition && currentPhase && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className={`p-4 rounded-lg border ${
              currentPhase.name.includes("Golden")
                ? "bg-amber-500/20 border-amber-500"
                : currentPhase.name.includes("Blue")
                  ? "bg-blue-500/20 border-blue-500"
                  : "bg-muted/30"
            }`}
          >
            <p className="text-sm text-muted-foreground">Current Phase</p>
            <p className="text-xl font-bold">{currentPhase.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{currentPhase.description}</p>
          </div>
          <div className="p-4 rounded-lg border bg-muted/30">
            <p className="text-sm text-muted-foreground">Sun Altitude</p>
            <p className="text-xl font-bold">{sunPosition.altitude.toFixed(1)}°</p>
            <p className="text-xs text-muted-foreground mt-1">
              Azimuth: {sunPosition.azimuth.toFixed(1)}°
            </p>
          </div>
          {nextGoldenHour && !currentPhase.name.includes("Golden") && (
            <div className="p-4 rounded-lg border bg-amber-500/10 col-span-2">
              <p className="text-sm text-muted-foreground">Next Golden Hour</p>
              <p className="text-xl font-bold">{nextGoldenHour.phase}</p>
              <p className="text-sm">
                Starts in <strong>{formatDuration(nextGoldenHour.timeUntil)}</strong> at{" "}
                {formatSunTime(nextGoldenHour.startTime)}
              </p>
            </div>
          )}
          {currentPhase.name.includes("Golden") && (
            <div className="p-4 rounded-lg border bg-amber-500/20 border-amber-500 col-span-2">
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                Golden Hour is NOW!
              </p>
              <p className="text-sm">Make the most of this magical light</p>
            </div>
          )}
        </div>
      )}

      {/* Sun Times for Selected Date */}
      {coords && sunTimes && (
        <div className="space-y-4">
          <p className="text-sm font-medium">
            Sun Times for{" "}
            {new Date(selectedDate).toLocaleDateString(undefined, { dateStyle: "full" })}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-3 rounded-lg border bg-orange-500/10">
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Sunrise</p>
              <p className="text-xl font-bold">{formatSunTime(sunTimes.sunrise)}</p>
            </div>
            <div className="p-3 rounded-lg border bg-yellow-500/10">
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Solar Noon</p>
              <p className="text-xl font-bold">{formatSunTime(sunTimes.solarNoon)}</p>
            </div>
            <div className="p-3 rounded-lg border bg-orange-500/10">
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Sunset</p>
              <p className="text-xl font-bold">{formatSunTime(sunTimes.sunset)}</p>
            </div>
            <div className="p-3 rounded-lg border bg-muted/30">
              <p className="text-sm font-medium">Day Length</p>
              <p className="text-xl font-bold">
                {sunTimes.sunrise && sunTimes.sunset
                  ? formatDuration(sunTimes.sunset.getTime() - sunTimes.sunrise.getTime())
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-lg border bg-amber-500/10">
              <p className="font-medium text-amber-600 dark:text-amber-400 mb-2">
                Morning Golden Hour
              </p>
              <p className="text-lg font-bold">
                {formatSunTime(sunTimes.goldenHourMorningStart)} -{" "}
                {formatSunTime(sunTimes.goldenHourMorningEnd)}
              </p>
              {sunTimes.goldenHourMorningStart && sunTimes.goldenHourMorningEnd && (
                <p className="text-sm text-muted-foreground">
                  Duration:{" "}
                  {formatDuration(
                    sunTimes.goldenHourMorningEnd.getTime() -
                      sunTimes.goldenHourMorningStart.getTime()
                  )}
                </p>
              )}
            </div>
            <div className="p-4 rounded-lg border bg-amber-500/10">
              <p className="font-medium text-amber-600 dark:text-amber-400 mb-2">
                Evening Golden Hour
              </p>
              <p className="text-lg font-bold">
                {formatSunTime(sunTimes.goldenHourEveningStart)} -{" "}
                {formatSunTime(sunTimes.goldenHourEveningEnd)}
              </p>
              {sunTimes.goldenHourEveningStart && sunTimes.goldenHourEveningEnd && (
                <p className="text-sm text-muted-foreground">
                  Duration:{" "}
                  {formatDuration(
                    sunTimes.goldenHourEveningEnd.getTime() -
                      sunTimes.goldenHourEveningStart.getTime()
                  )}
                </p>
              )}
            </div>
            <div className="p-4 rounded-lg border bg-blue-500/10">
              <p className="font-medium text-blue-600 dark:text-blue-400 mb-2">Morning Blue Hour</p>
              <p className="text-lg font-bold">
                {formatSunTime(sunTimes.blueHourMorningStart)} -{" "}
                {formatSunTime(sunTimes.blueHourMorningEnd)}
              </p>
            </div>
            <div className="p-4 rounded-lg border bg-blue-500/10">
              <p className="font-medium text-blue-600 dark:text-blue-400 mb-2">Evening Blue Hour</p>
              <p className="text-lg font-bold">
                {formatSunTime(sunTimes.blueHourEveningStart)} -{" "}
                {formatSunTime(sunTimes.blueHourEveningEnd)}
              </p>
            </div>
          </div>

          {/* Twilight Times */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Twilight Phase</th>
                  <th className="text-left py-2">Morning Start</th>
                  <th className="text-left py-2">Evening End</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-muted">
                  <td className="py-2">Civil Twilight (-6°)</td>
                  <td className="py-2">{formatSunTime(sunTimes.civilTwilightStart)}</td>
                  <td className="py-2">{formatSunTime(sunTimes.civilTwilightEnd)}</td>
                </tr>
                <tr className="border-b border-muted">
                  <td className="py-2">Nautical Twilight (-12°)</td>
                  <td className="py-2">{formatSunTime(sunTimes.nauticalTwilightStart)}</td>
                  <td className="py-2">{formatSunTime(sunTimes.nauticalTwilightEnd)}</td>
                </tr>
                <tr className="border-b border-muted">
                  <td className="py-2">Astronomical Twilight (-18°)</td>
                  <td className="py-2">{formatSunTime(sunTimes.astronomicalTwilightStart)}</td>
                  <td className="py-2">{formatSunTime(sunTimes.astronomicalTwilightEnd)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Prompt to use location if not set */}
      {!coords && (
        <div className="p-6 rounded-lg border bg-muted/30 text-center">
          <p className="text-lg font-medium mb-2">Get Accurate Sun Times</p>
          <p className="text-muted-foreground mb-4">
            Use your location to calculate precise golden hour and twilight times for your area.
          </p>
          <button
            onClick={requestLocation}
            className="px-6 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Enable Location
          </button>
        </div>
      )}

      {/* Light Phases Reference */}
      <div className="space-y-4">
        <p className="text-sm font-medium">Light Phases by Sun Elevation</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LIGHT_PHASES.map((phase) => (
            <div
              key={phase.name}
              className={`p-4 rounded-lg border ${
                phase.name === "Golden Hour"
                  ? "bg-amber-500/10 border-amber-500/30"
                  : phase.name.includes("Blue") || phase.name.includes("Civil")
                    ? "bg-blue-500/10 border-blue-500/30"
                    : phase.name === "Night"
                      ? "bg-slate-900/20 border-slate-500/30"
                      : "bg-muted/30"
              }`}
            >
              <p className="font-medium">{phase.name}</p>
              <p className="text-sm text-muted-foreground">{phase.sunElevation}</p>
              <p className="text-xs mt-2">{phase.description}</p>
              <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                {phase.photographyTips.map((tip, i) => (
                  <li key={i}>&#8226; {tip}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Color Temperature */}
      <div className="space-y-4">
        <p className="text-sm font-medium">Color Temperature Reference</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Phase</th>
                <th className="text-left py-2">Temperature</th>
                <th className="text-left py-2">Color</th>
              </tr>
            </thead>
            <tbody>
              {COLOR_TEMPERATURES.map((temp) => (
                <tr key={temp.phase} className="border-b border-muted">
                  <td className="py-2">{temp.phase}</td>
                  <td className="py-2">{temp.kelvin}</td>
                  <td className="py-2 text-muted-foreground">{temp.color}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Camera Settings */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="p-4 rounded-lg border bg-amber-500/10">
          <p className="font-medium mb-2">Golden Hour Settings</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              <strong>WB:</strong> {CAMERA_SETTINGS.goldenHour.whiteBalance}
            </li>
            <li>
              <strong>ISO:</strong> {CAMERA_SETTINGS.goldenHour.iso}
            </li>
            <li className="text-xs mt-2">{CAMERA_SETTINGS.goldenHour.notes}</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg border bg-blue-500/10">
          <p className="font-medium mb-2">Blue Hour Settings</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              <strong>WB:</strong> {CAMERA_SETTINGS.blueHour.whiteBalance}
            </li>
            <li>
              <strong>ISO:</strong> {CAMERA_SETTINGS.blueHour.iso}
            </li>
            <li className="text-xs mt-2">{CAMERA_SETTINGS.blueHour.notes}</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg border bg-slate-500/10">
          <p className="font-medium mb-2">Night Settings</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              <strong>WB:</strong> {CAMERA_SETTINGS.night.whiteBalance}
            </li>
            <li>
              <strong>ISO:</strong> {CAMERA_SETTINGS.night.iso}
            </li>
            <li className="text-xs mt-2">{CAMERA_SETTINGS.night.notes}</li>
          </ul>
        </div>
      </div>

      {/* Duration by Latitude */}
      <div className="space-y-4">
        <p className="text-sm font-medium">Twilight Duration by Latitude</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Latitude</th>
                <th className="text-left py-2">Season</th>
                <th className="text-left py-2">Golden Hour</th>
                <th className="text-left py-2">Blue Hour</th>
              </tr>
            </thead>
            <tbody>
              {TWILIGHT_DURATION_EXAMPLES.map((ex, i) => (
                <tr key={i} className="border-b border-muted">
                  <td className="py-2">{ex.latitude}°</td>
                  <td className="py-2 capitalize">{ex.season}</td>
                  <td className="py-2">{ex.goldenHour}</td>
                  <td className="py-2">{ex.blueHour}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Planning Tips */}
      <div className="p-4 rounded-lg border bg-muted/30">
        <p className="font-medium mb-2">Planning Tips</p>
        <ul className="text-sm text-muted-foreground space-y-1">
          {PLANNING_TIPS.map((tip, i) => (
            <li key={i}>&#8226; {tip}</li>
          ))}
        </ul>
      </div>

      {/* Seasonal Notes */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="p-4 rounded-lg border bg-amber-500/10">
          <p className="font-medium mb-2">Summer Considerations</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              <strong>High Latitude:</strong> {SEASONAL_NOTES.summer.highLatitude}
            </li>
            <li>
              <strong>Mid Latitude:</strong> {SEASONAL_NOTES.summer.midLatitude}
            </li>
            <li>
              <strong>Low Latitude:</strong> {SEASONAL_NOTES.summer.lowLatitude}
            </li>
          </ul>
        </div>
        <div className="p-4 rounded-lg border bg-blue-500/10">
          <p className="font-medium mb-2">Winter Considerations</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>
              <strong>High Latitude:</strong> {SEASONAL_NOTES.winter.highLatitude}
            </li>
            <li>
              <strong>Mid Latitude:</strong> {SEASONAL_NOTES.winter.midLatitude}
            </li>
            <li>
              <strong>Low Latitude:</strong> {SEASONAL_NOTES.winter.lowLatitude}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
