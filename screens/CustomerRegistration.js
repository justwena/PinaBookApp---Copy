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
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import firebase from "../firebase";

const CustomerRegistration = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      setUsername("");
      setContactNo("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError(null);
      setLoading(false);
    });

    return unsubscribe;
  }, [navigation]);

  const handleRegister = async () => {
    try {
      setLoading(true);

      if (!username || !contactNo || !email || !password || !confirmPassword) {
        setError("Please fill in all fields.");
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }

      const response = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      await firebase.database().ref(`customers/${response.user.uid}`).set({
        username,
        contactNo,
        email,
        password,
      });

      console.log("Customer registered successfully!", response.user.uid);
      setLoading(false);

      Alert.alert(
        "Registration Successful",
        "Your account has been successfully registered. Please login to continue.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ],
        { cancelable: false },
      );
    } catch (error) {
      // console.error("Error registering customer:", error.message);
      setLoading(false);
      setError(error.message);
    }
  };

  const handleNavigateToAffiliateRegistration = () => {
    navigation.navigate("AffiliateRegistration");
  };

  return (
    <ImageBackground
      source={require("../assets/background.png")}
      style={styles.backgroundImage}
    >
      <StatusBar barStyle="light-content" backgroundColor="#095e69" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "null"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
            <View style={styles.contentWrapper}>
              <Text style={styles.aboveText}>Sign Up</Text>
              <Text style={styles.mainText}>
                <Text style={styles.asText}>as </Text>
                <Text style={styles.customerText}>Customer</Text>
              </Text>

              <View style={styles.separator} />

              <View style={styles.registerButtonContainer}>
                <Text style={styles.registerText}>
                  Become our Affiliate! Register{" "}
                </Text>
                <TouchableOpacity
                  onPress={handleNavigateToAffiliateRegistration}
                >
                  <Text style={styles.signUpText}>here</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <Text style={styles.placeholder}>Username</Text>
                  <TextInput
                    style={styles.input}
                    placeholder=""
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.placeholder}>Contact No.</Text>
                  <TextInput
                    style={styles.input}
                    placeholder=""
                    value={contactNo}
                    onChangeText={(text) => setContactNo(text)}
                    keyboardType="phone-pad"
                    maxLength={11}
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.placeholder}>Email Address</Text>
                  <TextInput
                    style={styles.input}
                    placeholder=""
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={styles.placeholder}>Password</Text>
                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      style={styles.passInput}
                      placeholder=""
                      value={password}
                      onChangeText={(text) => setPassword(text)}
                      secureTextEntry={secureTextEntry}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
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
                <View style={styles.inputContainer}>
                  <Text style={styles.placeholder}>Confirm Password</Text>
                  <View style={styles.passwordInputContainer}>
                    <TextInput
                      style={styles.passInput}
                      placeholder=""
                      value={confirmPassword}
                      onChangeText={(text) => setConfirmPassword(text)}
                      secureTextEntry={confirmSecureTextEntry}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() =>
                        setConfirmSecureTextEntry(!confirmSecureTextEntry)
                      }
                    >
                      <Ionicons
                        name={confirmSecureTextEntry ? "eye-off" : "eye"}
                        size={24}
                        color="white"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.errorContainer}>
                  {error && <Text style={styles.error}>{error}</Text>}
                </View>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                  >
                    <Text style={styles.buttonText}>Back</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.registerButton}
                    onPress={handleRegister}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={styles.buttonText}>Register</Text>
                    )}
                  </TouchableOpacity>
                </View>
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
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "flex-end",
    paddingBottom: 20,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "flex-end",
  },
  aboveText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    letterSpacing: 0.5,
    marginBottom: -5,
  },
  mainText: {
    fontSize: 35,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  asText: {
    color: "white",
  },
  customerText: {
    color: "#ffc119",
  },
  separator: {
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
    marginVertical: 10,
    marginHorizontal: 100,
    right: 100,
  },
  registerButtonContainer: {
    flexDirection: "row",
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
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: "100%",
  },
  inputContainer: {
    marginBottom: 5,
    height: 66,
  },
  placeholder: {
    color: "white",
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    height: 35,
    borderColor: "white",
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 20,
    fontSize: 14,
  },
  passInput: {
    flex: 1,
    height: 35,
    borderColor: "white",
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 20,
    fontSize: 14,
    marginRight: 5,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  eyeIconContainer: {
    padding: 5,
    marginLeft: 10,
  },
  errorContainer: {
    marginBottom: 10,
  },
  error: {
    color: "white",
    textAlign: "center",
    backgroundColor: "#cf2129",
    padding: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 15,
  },
  registerButton: {
    backgroundColor: "#088B9C",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
    alignSelf: "center",
    width: 130,
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
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
});

export default CustomerRegistration;
