import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import firebase from "../../firebase.js";

const EditFacilityScreen = ({ route, navigation }) => {
  const { facility } = route.params;

  const [facilityName, setFacilityName] = useState(facility.facilityName || "");
  const [description, setDescription] = useState(facility.description || "");
  const [amenities, setAmenities] = useState("");
  const [dayTourStartTime, setDayTourStartTime] = useState("");
  const [nightTourStartTime, setNightTourStartTime] = useState("");
  const [dayPrice, setDayPrice] = useState(facility.dayTourPrice.price || "");
  const [nightPrice, setNightPrice] = useState(
    facility.nightTourPrice.price || "",
  );
  const [childEntranceFee, setChildEntranceFee] = useState(
    facility.childEntranceFee || "",
  );
  const [adultEntranceFee, setAdultEntranceFee] = useState(
    facility.adultEntranceFee || "",
  );
  const [selectedImages, setSelectedImages] = useState(facility.images || []);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const amenitiesArray = facility.amenities
      ? facility.amenities.split("\n").map((item) => item.trim())
      : [];
    setAmenities(amenitiesArray.join(", "));

    setDayTourStartTime(facility.dayTourPrice.startTime || "");
    setNightTourStartTime(facility.nightTourPrice.startTime || "");
  }, []);

  const [isDayTourStartTimePickerVisible, setDayTourStartTimePickerVisible] =
    useState(false);
  const [
    isNightTourStartTimePickerVisible,
    setNightTourStartTimePickerVisible,
  ] = useState(false);

  const isSaveDisabled = () => {
    return (
      !facilityName ||
      !description ||
      !amenities ||
      !dayPrice ||
      !nightPrice ||
      !childEntranceFee ||
      !adultEntranceFee ||
      !dayTourStartTime ||
      !nightTourStartTime ||
      selectedImages.length === 0
    );
  };

  const handleSavePress = async () => {
    try {
      const user = firebase.auth().currentUser;

      if (!user) {
        console.error("No authenticated user.");
        return;
      }

      const userId = user.uid;
      const facilitiesRef = firebase.database().ref(`facilities/${userId}`);

      setIsLoading(true);

      const imagesRef = firebase.storage().ref(`images/${facility.id}`);

      const uploadTasks = selectedImages.map(async (imageUri, index) => {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const imageName = `${new Date().getTime()}_${index}`;
        const imageRef = imagesRef.child(imageName);
        await imageRef.put(blob);
        const imageUrl = await imageRef.getDownloadURL();

        return imageUrl;
      });

      const imageUrls = await Promise.all(uploadTasks);

      const updatedFacility = {
        facilityName,
        description,
        amenities: amenities
          .split(",")
          .map((item) => item.trim())
          .join("\n"),
        dayTourPrice: {
          startTime: dayTourStartTime,
          price: dayPrice,
        },
        nightTourPrice: {
          startTime: nightTourStartTime,
          price: nightPrice,
        },
        childEntranceFee,
        adultEntranceFee,
        images: imageUrls,
        availability: "Available",
      };

      await facilitiesRef.child(facility.id).update(updatedFacility);

      const affiliatesRef = firebase.database().ref(`affiliates/${userId}`);
      const snapshot = await affiliatesRef.once("value");
      const affiliateData = snapshot.val();
      const username = affiliateData.username || "Unknown User";

      let logMessage = `${username} edited facility ${facility.facilityName}.`;

      if (facilityName !== facility.facilityName) {
        logMessage += ` Facility name changed to ${facilityName}.`;
      }

      if (description !== facility.description) {
        logMessage += ` Description updated.`;
      }

      if (amenities !== facility.amenities) {
        logMessage += ` Amenities updated.`;
      }

      if (dayPrice !== facility.dayTourPrice.price) {
        logMessage += ` Day tour price changed to ${dayPrice}.`;
      }

      if (nightPrice !== facility.nightTourPrice.price) {
        logMessage += ` Night tour price changed to ${nightPrice}.`;
      }

      if (childEntranceFee !== facility.childEntranceFee) {
        logMessage += ` Child entrance fee changed to ${childEntranceFee}.`;
      }

      if (adultEntranceFee !== facility.adultEntranceFee) {
        logMessage += ` Adult entrance fee changed to ${adultEntranceFee}.`;
      }

      if (selectedImages !== facility.images) {
        logMessage += ` Images updated.`;
      }

      const logsRef = firebase.database().ref(`logs/${userId}`);
      const newLogRef = logsRef.push();
      newLogRef.set({
        message: logMessage,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
      });

      setIsLoading(false);

      navigation.goBack();
    } catch (error) {
      console.error("Error updating facility: ", error);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleImagePick = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        multiple: true,
      });

      if (!result.cancelled) {
        const newImages = [
          ...selectedImages,
          ...result.assets.map((asset) => asset.uri),
        ].slice(0, 3);
        setSelectedImages(newImages);
      }
    } catch (error) {
      // console.error('Error picking images:', error);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const newImages = selectedImages.filter(
      (_, index) => index !== indexToRemove,
    );
    setSelectedImages(newImages);
  };

  const showDayTourStartTimePicker = () => {
    setDayTourStartTimePickerVisible(true);
  };

  const hideDayTourStartTimePicker = () => {
    setDayTourStartTimePickerVisible(false);
  };

  const handleDayTourStartTimeConfirm = (time) => {
    setDayTourStartTime(
      time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    );
    hideDayTourStartTimePicker();
  };

  const showNightTourStartTimePicker = () => {
    setNightTourStartTimePickerVisible(true);
  };

  const hideNightTourStartTimePicker = () => {
    setNightTourStartTimePickerVisible(false);
  };

  const handleNightTourStartTimeConfirm = (time) => {
    setNightTourStartTime(
      time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    );
    hideNightTourStartTimePicker();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.screen}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Facility</Text>
          <TouchableOpacity
            onPress={handleSavePress}
            style={styles.saveButton}
            disabled={isSaveDisabled()}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#088B9C" />
            ) : (
              <Text
                style={[
                  styles.buttonText,
                  isSaveDisabled() && { color: "gray" },
                ]}
              >
                Save
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <TouchableOpacity
          onPress={handleImagePick}
          style={styles.imageUploadButton}
        >
          <Ionicons name="images" size={24} color="#088B9C" />
          <Text style={styles.imageUploadText}>Upload Images</Text>
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imageScrollView}
        >
          {selectedImages.map((image, index) => (
            <View key={index} style={{ position: "relative" }}>
              <Image
                source={{ uri: image }}
                style={[styles.selectedImage, { marginRight: 10 }]}
              />
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => handleRemoveImage(index)}
              >
                <Ionicons name="close-circle" size={20} color="red" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Facility Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter facility name"
              value={facilityName}
              onChangeText={(text) => setFacilityName(text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Enter description"
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={(text) => setDescription(text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Amenities</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              placeholder="Enter amenities (comma-separated)"
              multiline
              textAlignVertical="top"
              value={amenities}
              onChangeText={(text) => setAmenities(text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Day Tour Price</Text>
            <View style={styles.priceContainer}>
              <TouchableOpacity
                onPress={showDayTourStartTimePicker}
                style={styles.touchableTime}
              >
                <Text>{dayTourStartTime || "Select Start Time"}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isDayTourStartTimePickerVisible}
                mode="time"
                onConfirm={handleDayTourStartTimeConfirm}
                onCancel={hideDayTourStartTimePicker}
              />
              <TextInput
                style={[styles.input, styles.priceInput]}
                placeholder="Price"
                keyboardType="phone-pad"
                value={dayPrice}
                onChangeText={(text) => setDayPrice(text)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Night Tour Price</Text>
            <View style={styles.priceContainer}>
              <TouchableOpacity
                onPress={showNightTourStartTimePicker}
                style={styles.touchableTime}
              >
                <Text>{nightTourStartTime || "Select Start Time"}</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isNightTourStartTimePickerVisible}
                mode="time"
                onConfirm={handleNightTourStartTimeConfirm}
                onCancel={hideNightTourStartTimePicker}
              />
              <TextInput
                style={[styles.input, styles.priceInput]}
                placeholder="Price"
                keyboardType="phone-pad"
                value={nightPrice}
                onChangeText={(text) => setNightPrice(text)}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Entrance Fee</Text>
            <View style={styles.priceContainer}>
              <TextInput
                style={[styles.input, styles.entranceInput]}
                placeholder="Child"
                keyboardType="phone-pad"
                value={childEntranceFee}
                onChangeText={(text) => setChildEntranceFee(text)}
              />
              <TextInput
                style={[styles.input, styles.entranceInput]}
                placeholder="Adult"
                keyboardType="phone-pad"
                value={adultEntranceFee}
                onChangeText={(text) => setAdultEntranceFee(text)}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 0,
    backgroundColor: "white",
  },
  screen: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomColor: "#ddd",
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonText: {
    fontSize: 15,
    color: "#088B9C",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  imageScrollView: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
  },
  imageUploadButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
  },
  imageUploadText: {
    marginLeft: 10,
    color: "#088B9C",
    fontWeight: "bold",
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  removeImageButton: {
    position: "absolute",
    top: 0,
    right: 10,
    borderRadius: 10,
    padding: 5,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "#8d8d8d",
    fontSize: 14,
    marginBottom: 10,
  },
  input: {
    backgroundColor: "white",
    borderRadius: 20,
    paddingLeft: 15,
    borderColor: "#ccc",
    borderWidth: 1,
    height: 40,
  },
  multilineInput: {
    height: 150,
    textAlignVertical: "top",
    padding: 10,
    paddingTop: 10,
  },
  touchableTime: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    marginRight: 5,
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priceInput: {
    flex: 1,
  },
  entranceInput: {
    flex: 1,
    marginLeft: 5,
  },
});

export default EditFacilityScreen;
