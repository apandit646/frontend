import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

import SockJS from 'sockjs-client';
import { SecureStore } from 'expo-secure-store';

export default function LeafletMap() {

  const [stompClient,setStompClient] = useState(null);

  const [location, setLocation] = useState({
    latitude: 37.78825, // Default latitude
    longitude: -122.4324, // Default longitude
  });

  useEffect(() => {
    let socket;
    let interval;

    const connectWebSocket = async () => {
      const token = await SecureStore.getItemAsync('secure_token'); // Retrieve token securely
      
      if (!token) {
        console.error('No token found');
        return;
      }

      socket = new SockJS('http://192.168.5.184:8080/ws-location'); // Use SockJS instead of WebSocket
      socket.onopen = () => {
        console.log('SockJS Connected');
        socket.send(JSON.stringify({ type: 'auth', token })); // Send authentication token
      };

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
          console.error('Error parsing SockJS message:', error);
        }
      };

      socket.onclose = () => {
        console.log('SockJS Disconnected');
      };

      const sendLocation = () => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ latitude, longitude });

            const data = { type: 'locationUpdate', latitude, longitude };
            socket.send(JSON.stringify(data)); // Send location update
            console.log('Location sent:', data);
          },
          (error) => console.error('Error getting location:', error),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      };

      sendLocation();
      interval = setInterval(sendLocation, 30000);
    };

    connectWebSocket();

    return () => {
      clearInterval(interval);
      if (socket) {
        socket.close();
      }
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
