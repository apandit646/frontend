import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { Picker } from "@react-native-picker/picker"; // Import Picker for role selection
import * as Location from 'expo-location';  // Import Location API

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User"); // Default role is "User"
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  
  const [location, setLocation] = useState(null);  // State to hold location

  // Function to get device location
  async function getDeviceLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Permission to access location was denied.");
      return null;
    }
  
    let location = await Location.getCurrentPositionAsync({});
    return location.coords; // Return the coordinates instead of setting state
  }
  
  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
  
    setLoading(true);
    await  router.push("/map");

    
  
    const coords = await getDeviceLocation();
    if (!coords) {
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post("http://192.168.5.148:8080/auth/login", {
        email,
        password,
        role,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (response.status === 201) {
        router.push("/map");
         // Navigate on successful signup
      } else {
        throw new Error("Unexpected response");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      Alert.alert("Error", "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={{ minHeight: height }} showsVerticalScrollIndicator={false}>
          <View style={[styles.formContainer, { width: width * 0.9 }]}>
            <Text style={[styles.title, { fontSize: width * 0.07 }]}>Create Account</Text>

            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { fontSize: width * 0.04 }]}>Username</Text>
              <TextInput
                  placeholder="Enter your Email"
                  value={email}
                  onChangeText={setEmail}
                  style={[styles.input, { fontSize: width * 0.04 }]}
                  autoCapitalize="none"
                  autoCorrect={false}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { fontSize: width * 0.04 }]}>Password</Text>
              <TextInput
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  style={[styles.input, { fontSize: width * 0.04 }]}
                  autoCapitalize="none"
              />
            </View>

            {/* Role Selection Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { fontSize: width * 0.04 }]}>Select Role</Text>
              <View style={styles.pickerContainer}>
                <Picker selectedValue={role} onValueChange={setRole} style={styles.picker}>
                  <Picker.Item label="User" value="User" />
                  <Picker.Item label="ServiceProvider" value="Admin" />
                </Picker>
              </View>
            </View>

            {/* Signup Button */}
            <TouchableOpacity
                style={[styles.signupButton, { padding: height * 0.018 }]}
                onPress={handleSignup}
                activeOpacity={0.8}
                disabled={loading}
            >
              {loading ? (
                  <ActivityIndicator color="white" />
              ) : (
                  <Text style={[styles.signupButtonText, { fontSize: width * 0.045 }]}>Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <TouchableOpacity style={styles.loginLink} onPress={() => router.push("/")}>
              <Text style={[styles.loginLinkText, { fontSize: width * 0.035 }]}>
                Already have an account? <Text style={styles.loginTextBold}>Sign-Up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  keyboardView: { flex: 1 },
  formContainer: {
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 15,
    padding: "5%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: { fontWeight: "bold", color: "#333", marginBottom: "5%", textAlign: "center" },
  inputContainer: { marginBottom: "4%" },
  label: { color: "#666", marginBottom: "2%", fontWeight: "500" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: "4%", backgroundColor: "#fafafa" },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fafafa",
    overflow: "hidden",
  },
  picker: { height: 50, width: "100%" },
  signupButton: { backgroundColor: "#007AFF", borderRadius: 8, marginTop: "4%", alignItems: "center" },
  signupButtonText: { color: "white", textAlign: "center", fontWeight: "600" },
  loginLink: { marginTop: "4%", padding: "2%" },
  loginLinkText: { textAlign: "center", color: "#666" },
  loginTextBold: { color: "#007AFF", fontWeight: "600" },
});
