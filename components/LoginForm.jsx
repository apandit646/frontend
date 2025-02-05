import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Make sure this file is located at app/signup.js or app/(auth)/signup.js
export default function SignupForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      await AsyncStorage.setItem(
        "user",
        JSON.stringify({ username, password })
      );
      Alert.alert(
        "Success",
        "Account created!",
        [
          {
            text: "OK",
            onPress: () => router.push("/(auth)/login")
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            <Text style={styles.title}>Create Account</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                placeholder="Enter your username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignup}
              activeOpacity={0.8}
            >
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => router.push("/")}
            >
              <Text style={styles.loginLinkText}>
                Already have an account? <Text style={styles.loginTextBold}>Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {
    padding: width * 0.05,
    marginHorizontal: width * 0.05,
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.03,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: width * 0.04,
    color: "#666",
    marginBottom: height * 0.01,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: height * 0.015,
    fontSize: width * 0.04,
    backgroundColor: "#fafafa",
  },
  signupButton: {
    backgroundColor: "#007AFF",
    padding: height * 0.02,
    borderRadius: 8,
    marginTop: height * 0.02,
  },
  signupButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: width * 0.045,
    fontWeight: "600",
  },
  loginLink: {
    marginTop: height * 0.02,
    padding: height * 0.01,
  },
  loginLinkText: {
    textAlign: "center",
    color: "#666",
    fontSize: width * 0.035,
  },
  loginTextBold: {
    color: "#007AFF",
    fontWeight: "600",
  },
});