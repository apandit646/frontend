import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

export default function LeafletMap() {
  const [location, setLocation] = useState({
    latitude: 37.78825, // Default latitude
    longitude: -122.4324, // Default longitude
  });

  useEffect(() => {
    const socket = new WebSocket('wss://your-websocket-server.com'); // Replace with your WebSocket URL

    socket.onopen = () => {
      console.log('WebSocket Connected');
    };

    const sendLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          const data = JSON.stringify({ latitude, longitude });
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(data);
            console.log('Location sent:', data);
          }
        },
        (error) => console.error('Error getting location:', error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    };

    // Fetch location immediately and then every 30 seconds
    sendLocation();
    const interval = setInterval(sendLocation, 30000);

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.latitude && data.longitude) {
          setLocation({
            latitude: data.latitude,
            longitude: data.longitude,
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };

    socket.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    return () => {
      clearInterval(interval);
      socket.close();
    };
  }, []);

  return (
    <View style={styles.container}>
      <MapView 
        style={styles.map}
        region={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={location} title="Live Location" />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
