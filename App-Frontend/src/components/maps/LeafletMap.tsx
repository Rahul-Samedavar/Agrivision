import { WebView, WebViewProps } from "react-native-webview";
import { ViewStyle } from "react-native";

export default function LeafletMap({
    markers,
    style,
}: {
    markers: Array<{ lat: number; lon: number; title: string }>;
    style?: ViewStyle;
}) {
    const center = markers.length
        ? [markers[0].lat, markers[0].lon]
        : [15.87, 74.51];

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <style>html, body, #map { margin: 0; padding: 0; height: 100%; width: 100%; }</style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map').setView([${center[0]}, ${center[1]}], ${markers.length ? 15 : 12});

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        const markers = ${JSON.stringify(markers)};

        markers.forEach(m => {
          L.marker([m.lat, m.lon]).addTo(map).bindPopup(m.title);
        });
      </script>
    </body>
    </html>
  `;

    return <WebView source={{ html }} style={style} />;
}