import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Modal,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import firebase from "../firebase.js";

const CustomHeader = ({ title, navigation }) => (
  <View style={styles.header}>
    <Ionicons
      name="chevron-back"
      size={24}
      color="black"
      onPress={() => navigation.goBack()}
      style={styles.backIcon}
    />
    <Text style={styles.title}>{title}</Text>
  </View>
);

const ProfileContainer = ({ affiliate, handleAddressPress }) => (
  <View style={styles.profileContainer}>
    <Image
      source={require("../assets/default-cover.png")}
      style={styles.coverPhoto}
    />
    <View style={styles.profilePictureContainer}>
      <Image
        source={
          affiliate.profilePicture
            ? { uri: affiliate.profilePicture }
            : require("../assets/profile-picture.jpg")
        }
        style={styles.profilePicture}
      />
      <Text style={styles.usernameText}>{affiliate.username}</Text>
      <TouchableOpacity
        onPress={handleAddressPress}
        style={styles.addressContainer}
      >
        <View style={styles.dataContainer}>
          <Ionicons
            name="location"
            size={20}
            color="#088B9C"
            style={styles.icon}
          />
          <Text style={styles.addressText}>
            {affiliate.address || "No address available"}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  </View>
);

const AffiliateDetailsScreenContent = ({ route, navigation }) => {
  const { affiliate, selectedFacilityId } = route.params;
  const [facilities, setFacilities] = useState([]);
  const [showMapModal, setShowMapModal] = useState(false);
  const [mapRegion, setMapRegion] = useState(null);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (affiliate && affiliate.affiliateId) {
      const dbRef = firebase
        .database()
        .ref("facilities")
        .child(affiliate.affiliateId);
      const handleData = (snapshot) => {
        const data = snapshot.val();
        console.log("Facilities data:", data);
        if (data) {
          const facilitiesArray = Object.entries(data).map(
            ([facilityId, facilityData]) => ({
              id: facilityId,
              ...facilityData,
            }),
          );
          setFacilities(facilitiesArray);
          if (selectedFacilityId) {
            const selectedFacilityIndex = facilitiesArray.findIndex(
              (facility) => facility.id === selectedFacilityId,
            );
            if (selectedFacilityIndex !== -1 && scrollViewRef.current) {
              const yOffset = selectedFacilityIndex * 100;
              scrollViewRef.current.scrollTo({ y: yOffset, animated: true });
            }
          }
        }
      };
      dbRef.on("value", handleData);
      return () => {
        dbRef.off("value", handleData);
      };
    } else {
      console.error("Invalid affiliate object:", affiliate);
    }
  }, [affiliate, selectedFacilityId]);

  const handleAddressPress = () => {
    if (affiliate.latitude && affiliate.longitude) {
      const latitude = parseFloat(affiliate.latitude);
      const longitude = parseFloat(affiliate.longitude);
      setMapRegion({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      setShowMapModal(true);
    } else {
      Alert.alert(
        "Location Unavailable",
        "We are sorry, but the location for this affiliate is not available at the moment.",
      );
    }
  };

  const closeModal = () => {
    setShowMapModal(false);
    setMapRegion(null);
  };

  const navigateToFacilityBooking = (selectedFacility, affiliate) => {
    console.log(
      "Navigating to Facility Booking with selectedFacility:",
      selectedFacility,
      "and affiliate:",
      affiliate,
    );
    navigation.navigate("FacilityBooking", {
      selectedFacility: selectedFacility,
      affiliate: affiliate,
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <CustomHeader title={affiliate.username} navigation={navigation} />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
      >
        <ProfileContainer
          affiliate={affiliate}
          handleAddressPress={handleAddressPress}
        />

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>About</Text>
          <Text style={styles.descriptionText}>
            {affiliate.accountDescription || "No description available"}
          </Text>
        </View>

        <View style={styles.facilityContainer}>
          <Text style={styles.subtitle}>Offers</Text>
          {facilities.length > 0 &&
            facilities.map((item, index) => (
              <TouchableOpacity
                key={`${item.id}_${index}`}
                onPress={() => navigateToFacilityBooking(item, affiliate)}
                style={styles.facilityItemContainer}
              >
                <View style={styles.facilityContentContainer}>
                  <Image
                    source={{ uri: item.images[0] }}
                    style={styles.facilityImage}
                  />

                  <View style={styles.facilityDetailsContainer}>
                    <Text style={styles.facilityName}>{item.facilityName}</Text>

                    <Text style={styles.dayTourPrice}>
                      <Text style={{ fontStyle: "italic" }}>starts at </Text>
                      <Text style={{ color: "#6dc072" }}>
                        {" "}
                        ₱ {item.dayTourPrice.price}
                      </Text>
                    </Text>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={15} color="#888" />
              </TouchableOpacity>
            ))}
          {facilities.length === 0 && <Text>No facilities added yet.</Text>}
        </View>
      </ScrollView>

      <Modal visible={showMapModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderContent}>
              <View style={styles.profileInfo}>
                <Image
                  source={
                    affiliate.profilePicture
                      ? { uri: affiliate.profilePicture }
                      : require("../assets/profile-picture.jpg")
                  }
                  style={styles.modalProfilePicture}
                />
                <View>
                  <Text style={styles.headerTitle}>{affiliate.username}</Text>
                  <Text style={styles.headerSubtitle}>
                    {affiliate.address || "No address available"}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Ionicons name="close-outline" size={18} color="black" />
            </TouchableOpacity>
          </View>
          {mapRegion && (
            <MapView style={styles.map} region={mapRegion || {}}>
              {mapRegion && affiliate.address && (
                <Marker
                  coordinate={{
                    latitude: mapRegion.latitude,
                    longitude: mapRegion.longitude,
                  }}
                  title="Affiliate Address"
                  description={affiliate.address.description}
                />
              )}
            </MapView>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    color: "black",
    fontSize: 16,
    marginLeft: 10,
  },
  backIcon: {
    position: "absolute",
    left: 15,
  },
  profileContainer: {
    backgroundColor: "white",
    marginBottom: 5,
  },
  coverPhoto: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  profilePictureContainer: {
    marginTop: -100,
    zIndex: 1,
  },
  profilePicture: {
    width: 160,
    height: 160,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: "white",
    left: 15,
  },
  usernameText: {
    marginTop: 10,
    fontSize: 25,
    fontWeight: "bold",
    color: "black",
    left: 15,
  },
  affiliateDataContainer: {
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  dataContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    left: 10,
  },
  icon: {
    marginRight: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  descriptionContainer: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 5,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 15,
    textAlign: "justify",
    lineHeight: 20,
  },
  facilityContainer: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 20,
  },
  facilityItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 15,
    marginBottom: 10,
    backgroundColor: "#ededed",
  },
  facilityContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dayTourPrice: {
    fontSize: 13,
    color: "#555",
  },
  facilityImage: {
    width: 80,
    height: 50,
    borderRadius: 10,
    marginRight: 15,
  },
  facilityName: {
    fontSize: 15,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    width: "100%",
    paddingVertical: 13,
    paddingHorizontal: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeaderContent: {
    flex: 1,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  modalProfilePicture: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.8,
  },
  closeButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 50,
    padding: 5,
  },
});

export default AffiliateDetailsScreenContent;
