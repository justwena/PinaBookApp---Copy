import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  StatusBar,
} from "react-native";
import { CommonActions } from "@react-navigation/native";

const EllipseShape = () => {
  return <View style={styles.ellipseContainer}></View>;
};

const LogoContainer = () => {
  return (
    <View style={styles.logoContainer}>
      <Image
        source={require("../assets/pinabook-white.png")}
        style={styles.logo}
      />
    </View>
  );
};

const MainTextContainer = () => {
  return (
    <View style={styles.mainTextContainer}>
      <Text style={styles.mainText}>
        Discover your{"\n"}
        perfect stay{"\n"}
        with{"\n"}
        PinaBook
      </Text>
    </View>
  );
};

const SubTextContainer = () => {
  return (
    <View style={styles.subTextContainer}>
      <Text style={styles.subText}>
        Explore Pinamalayan’s finest{"\n"}hotels and resorts.
      </Text>
    </View>
  );
};

const ExploreButtonContainer = ({ navigation }) => {
  const navigateToHome = () => {
    navigation.navigate("CustomerHome");
  };

  return (
    <View style={styles.exploreButtonContainer}>
      <TouchableOpacity style={styles.exploreButton} onPress={navigateToHome}>
        <Text style={styles.buttonText}>Explore Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const LoginMessageContainer = ({ navigation }) => {
  const navigateToLogin = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "Login",
          },
        ],
      }),
    );
  };

  return (
    <View style={styles.loginMessageContainer}>
      <Text style={styles.loginMessage}>
        Already have an account?{" "}
        <Text style={styles.signInText} onPress={navigateToLogin}>
          Login
        </Text>
      </Text>
    </View>
  );
};

const WelcomeScreen = ({ navigation }) => {
  const navigateToAdminRegistration = () => {
    navigation.navigate("AdminRegistration");
  };

  return (
    <ImageBackground
      source={require("../assets/greenbg.png")}
      style={styles.backgroundImage}
    >
      <StatusBar barStyle="light-content" backgroundColor="#095e69" />

      <View style={styles.container}>
        <LogoContainer onPress={navigateToAdminRegistration} />

        <MainTextContainer />

        <SubTextContainer />

        <EllipseShape />

        <ExploreButtonContainer navigation={navigation} />

        <LoginMessageContainer navigation={navigation} />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    justifyContent: "center",
  },
  logoContainer: {
    position: "absolute",
    left: 25,
    top: 50,
  },
  logo: {
    width: 130,
    height: 35,
  },
  mainTextContainer: {
    position: "absolute",
    left: 25,
    top: 130,
  },
  mainText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#FFFFFF",
    lineHeight: 55,
    letterSpacing: 0.5,
  },
  subTextContainer: {
    position: "absolute",
    left: 25,
    top: 360,
  },
  subText: {
    fontSize: 16,
    color: "#FFFFFF",
    lineHeight: 25,
    letterSpacing: 0.3,
  },
  exploreButtonContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 150,
  },
  exploreButton: {
    backgroundColor: "#088B9C",
    width: 200,
    height: 47,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    top: 80,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    letterSpacing: 0.3,
  },
  loginMessageContainer: {
    marginBottom: 50,
  },
  loginMessage: {
    fontSize: 14,
    color: "white",
    letterSpacing: 0.3,
  },
  signInText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  ellipseContainer: {
    position: "absolute",
    width: 627,
    height: 627,
    top: 480,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 300,
  },
});

export default WelcomeScreen;
