
  maptilersdk.config.apiKey = mapToken;
  const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element in which the SDK will render the map
    style: maptilersdk.MapStyle.STREETS,
    center: mapCoordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
  });
// console.log(mapCoordinates);
  const marker = new maptilersdk.Marker({color:"red"})
  .setLngLat(mapCoordinates)
  .setPopup(new maptilersdk.Popup({ offset: 25 })
  .setText("Exact Location Provided After Booking"))
  .addTo(map);
