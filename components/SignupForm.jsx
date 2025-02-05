import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router"; // Import useRouter

export default function SignupScreen() {
  const router = useRouter(); // Initialize router
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6 && /[A-Za-z]/.test(password) && /\d/.test(password);
  };

  const handleSignup = async () => {
    const { fullName, email, password, confirmPassword } = formData;
    let validationErrors = {};

    if (!fullName) validationErrors.fullName = "Full Name is required";
    if (!email) validationErrors.email = "Email is required";
    else if (!validateEmail(email)) validationErrors.email = "Invalid email format";

    if (!password) validationErrors.password = "Password is required";
    else if (!validatePassword(password)) validationErrors.password = "Password must be at least 6 characters long and contain letters and numbers";

    if (!confirmPassword) validationErrors.confirmPassword = "Confirm Password is required";
    else if (password !== confirmPassword) validationErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await AsyncStorage.setItem("user", JSON.stringify({ fullName, email }));
      Alert.alert("Success", "Signup successful! You can now login.");
      router.push("/login"); // Use router.push instead of navigation.navigate
    } catch (error) {
      Alert.alert("Error", "Something went wrong during signup");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidContainer}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
            <View style={styles.formContainer}>
              <Text style={styles.title}>Create Account</Text>
              
              {Object.keys(errors).map((key) => errors[key] && (<Text key={key} style={styles.errorText}>{errors[key]}</Text>))}
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChangeText={(value) => handleChange("fullName", value)}
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  placeholder="Enter your email"
                  value={formData.email}
                  onChangeText={(value) => handleChange("email", value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  placeholder="Create password"
                  value={formData.password}
                  onChangeText={(value) => handleChange("password", value)}
                  secureTextEntry
                  style={styles.input}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleChange("confirmPassword", value)}
                  secureTextEntry
                  style={styles.input}
                />
              </View>

              <TouchableOpacity style={styles.signupButton} onPress={handleSignup} activeOpacity={0.8}>
                <Text style={styles.signupButtonText}>Sign Up</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.loginLink} 
                onPress={() => router.push("/login")} // Use router.push here too
              >
                <Text style={styles.loginLinkText}>
                  Already have an account? <Text style={styles.loginTextBold}>Login</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  keyboardAvoidContainer: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingVertical: 20 },
  formContainer: { backgroundColor: "white", marginHorizontal: 20, borderRadius: 15, padding: 20, elevation: 5 },
  title: { fontSize: 28, fontWeight: "bold", color: "#333", marginBottom: 25, textAlign: "center" },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 16, color: "#666", marginBottom: 8, fontWeight: "500" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: "#fafafa" },
  signupButton: { backgroundColor: "#007AFF", padding: 15, borderRadius: 8, marginTop: 10 },
  signupButtonText: { color: "white", textAlign: "center", fontSize: 18, fontWeight: "600" },
  loginLink: { marginTop: 15, padding: 10 },
  loginLinkText: { textAlign: "center", color: "#666", fontSize: 14 },
  loginTextBold: { color: "#007AFF", fontWeight: "600" },
  errorText: { color: "red", fontSize: 14, textAlign: "center", marginBottom: 5 }
});