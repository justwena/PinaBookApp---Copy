import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import firebase from "../firebase.js";
import { ActivityIndicator } from "react-native";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setEmail("");
      setPassword("");
      setError(null);
      setLoading(false);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        if (!navigation.isFocused()) {
          return;
        }

        try {
          setLoading(true);

          const adminSnapshot = await firebase
            .database()
            .ref(`admins/${user.uid}`)
            .once("value");
          if (adminSnapshot.exists()) {
            navigation.navigate("AdminHome");
            return;
          }

          const affiliateSnapshot = await firebase
            .database()
            .ref(`affiliates/${user.uid}`)
            .once("value");
          if (affiliateSnapshot.exists()) {
            navigation.navigate("AffiliateHome");
            return;
          }

          const customerSnapshot = await firebase
            .database()
            .ref(`customers/${user.uid}`)
            .once("value");
          if (customerSnapshot.exists()) {
            navigation.navigate("CustomerHome");
            return;
          }

          setError("User data not found.");
        } catch (error) {
          // console.error("Error fetching user data:", error);
          setError("Error fetching user data.");
        } finally {
          setLoading(false);
        }
      }
    });

    return unsubscribe;
  }, [navigation]);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setError("Please fill in all fields.");
        return;
      }

      setLoading(true);

      const response = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      console.log("User logged in successfully!", response.user.uid);

      const adminSnapshot = await firebase
        .database()
        .ref(`admins/${response.user.uid}`)
        .once("value");
      if (adminSnapshot.exists()) {
        navigation.navigate("AdminHome");
        return;
      }

      const affiliateSnapshot = await firebase
        .database()
        .ref(`affiliates/${response.user.uid}`)
        .once("value");
      if (affiliateSnapshot.exists()) {
        navigation.navigate("AffiliateHome");
        return;
      }

      const customerSnapshot = await firebase
        .database()
        .ref(`customers/${response.user.uid}`)
        .once("value");
      if (customerSnapshot.exists()) {
        navigation.navigate("CustomerHome");
        return;
      }

      setError("User data not found.");
    } catch (error) {
      // console.error("Error logging in:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigation.navigate("Welcome");
  };

  const navigateToRegister = () => {
    navigation.navigate("CustomerRegistration");
  };

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.backgroundImage}
    >
      <StatusBar barStyle="light-content" backgroundColor="#095e69" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.contentContainer}>
            <Text style={styles.mainText}>Sign In</Text>

            <View style={styles.registerButtonContainer}>
              <Text style={styles.registerText}>
                Don't have an account yet?{" "}
              </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={styles.signUpText}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.emailPlaceholder}>Email Address</Text>
                <TextInput
                  style={styles.emailInput}
                  placeholder=""
                  onChangeText={(text) => setEmail(text)}
                  value={email}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.passPlaceholder}>Password</Text>
                <View style={styles.passwordInputContainer}>
                  <TextInput
                    style={styles.input}
                    placeholder=""
                    secureTextEntry={secureTextEntry}
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                  />
                  <View style={styles.eyeIconContainer}>
                    <TouchableOpacity
                      onPress={() => setSecureTextEntry(!secureTextEntry)}
                    >
                      <Ionicons
                        name={secureTextEntry ? "eye-off" : "eye"}
                        size={24}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.errorContainer}>
                {error && <Text style={styles.error}>{error}</Text>}
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={handleBack}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.buttonText}>Login</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  contentContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  mainText: {
    color: "white",
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 0,
    letterSpacing: 0.5,
    alignSelf: "center",
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
  },
  inputContainer: {
    marginBottom: 20,
    height: 50,
  },
  emailPlaceholder: {
    color: "white",
    fontSize: 14,
    marginBottom: 10,
  },
  passPlaceholder: {
    color: "white",
    fontSize: 14,
    marginBottom: 5,
    marginTop: 5,
  },
  input: {
    flex: 1,
    height: 35,
    borderColor: "white",
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 20,
  },
  emailInput: {
    height: 35,
    borderColor: "white",
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 20,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
  },
  backButton: {
    backgroundColor: "transparent",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    alignSelf: "center",
    width: 130,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
  },
  loginButton: {
    backgroundColor: "#088B9C",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    alignSelf: "center",
    width: 130,
  },
  registerButtonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  registerText: {
    color: "white",
    fontSize: 14,
  },
  signUpText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeIconContainer: {
    padding: 10,
  },
  error: {
    color: "white",
    textAlign: "center",
    backgroundColor: "#cf2129",
    padding: 10,
  },
  errorContainer: {
    borderRadius: 10,
    overflow: "hidden",
    margin: 10,
  },
});

export default LoginScreen;
