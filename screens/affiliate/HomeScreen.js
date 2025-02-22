import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import firebase from "../../firebase";

const HomeScreen = () => {
  const [facilitiesCount, setFacilitiesCount] = useState(0);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);
  const [currentUserAffiliateId, setCurrentUserAffiliateId] = useState("");
  const [billReminder, setBillReminder] = useState(null);

  const setupListeners = (affiliateId) => {
    const setupBookingsListener = () => {
      const bookingsRef = firebase.database().ref("bookings");
      const bookingsListener = bookingsRef.on("value", (snapshot) => {
        const bookingsData = snapshot.val();
        console.log("Bookings data:", bookingsData);
        console.log("currentUserAffiliateId:", currentUserAffiliateId);
        if (bookingsData) {
          let pendingCount = 0;
          Object.values(bookingsData).forEach((booking) => {
            console.log("Booking affiliateID:", booking.affiliateID);
            if (
              booking.affiliateID === affiliateId &&
              booking.status === "pending"
            ) {
              pendingCount++;
            }
          });
          setPendingBookingsCount(pendingCount);
        }
      });

      return () => {
        bookingsRef.off("value", bookingsListener);
      };
    };

    const setupFacilitiesListener = () => {
      const facilitiesRef = firebase.database().ref("facilities");
      const facilitiesListener = facilitiesRef.on("value", (snapshot) => {
        const facilitiesData = snapshot.val();
        console.log("Facilities data:", facilitiesData);
        if (facilitiesData) {
          let count = 0;
          if (facilitiesData.hasOwnProperty(currentUserAffiliateId)) {
            const affiliateFacilities = facilitiesData[currentUserAffiliateId];
            count = Object.keys(affiliateFacilities).length;
          }
          setFacilitiesCount(count);
        }
      });

      return () => {
        facilitiesRef.off("value", facilitiesListener);
      };
    };

    setupBookingsListener();
    setupFacilitiesListener();
  };

  useEffect(() => {
    const fetchCurrentUserAffiliateId = async () => {
      try {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
          const userId = currentUser.uid;
          const userSnapshot = await firebase
            .database()
            .ref(`affiliates/${userId}`)
            .once("value");
          const userData = userSnapshot.val();
          if (userData) {
            setCurrentUserAffiliateId(userId);
            console.log("Affiliate ID:", userId);
          }
        }
      } catch (error) {
        console.error("Error fetching current user data:", error);
      }
    };

    fetchCurrentUserAffiliateId();
  }, []);

  useEffect(() => {
    if (currentUserAffiliateId) {
      setupListeners(currentUserAffiliateId);
    }
  }, [currentUserAffiliateId]);

  useEffect(() => {
    const fetchBillReminder = async () => {
      try {
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
          const userId = currentUser.uid;
          const billRemindersRef = firebase
            .database()
            .ref(`billReminders/${userId}`);
          billRemindersRef.on("value", (snapshot) => {
            const remindersData = snapshot.val();
            if (remindersData) {
              const latestReminder = Object.values(remindersData)[0];
              if (latestReminder) {
                setBillReminder(latestReminder.reminderMessage);
              } else {
                setBillReminder(null);
              }
            } else {
              setBillReminder(null);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching bill reminder:", error);
      }
    };

    fetchBillReminder();

    return () => {
      firebase.database().ref("billReminders").off("value");
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={"white"} />
      <View style={styles.header}>
        <Image
          source={require("../../assets/pinabook.png")}
          style={styles.headerImage}
        />
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.touchableOpacity, styles.firstTouchableOpacity]}
          disabled={true}
        >
          <View style={styles.touchableContent}>
            <View style={styles.textContainer}>
              <Text style={styles.touchableText}>{pendingBookingsCount}</Text>
              <Text style={styles.subText}>Pending Bookings</Text>
            </View>
            <Image
              source={require("../../assets/icons/bookings-icon.png")}
              style={styles.icon}
              tintColor={"#4ab550"}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.touchableOpacity, styles.secondTouchableOpacity]}
          disabled={true}
        >
          <View style={styles.touchableContent}>
            <View style={styles.textContainer}>
              <Text style={styles.touchableText}>{facilitiesCount}</Text>
              <Text style={styles.subText}>Facilities</Text>
            </View>
            <Image
              source={require("../../assets/icons/facilities-icon.png")}
              style={styles.icon}
              tintColor={"#d74e4e"}
            />
          </View>
        </TouchableOpacity>
        {billReminder && (
          <View style={styles.billReminderContainer}>
            <Ionicons
              name="warning"
              size={24}
              color="#e25f5f"
              style={styles.billReminderIcon}
            />
            <Text style={styles.billReminderText}>{billReminder}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "white",
  },
  headerImage: {
    width: 120,
    height: 30,
  },
  content: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
  touchableOpacity: {
    backgroundColor: "#E25F5F",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 30,
    width: "100%",
    marginBottom: 10,
  },
  touchableContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  touchableText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  subText: {
    fontSize: 14,
    color: "white",
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  firstTouchableOpacity: {
    backgroundColor: "#6dc072",
  },
  secondTouchableOpacity: {
    backgroundColor: "#e25f5f",
  },
  thirdTouchableOpacity: {
    backgroundColor: "#ffc46b",
  },
  billReminderContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  billReminderIcon: {
    marginRight: 10,
  },
  billReminderText: {
    fontSize: 16,
    color: "black",
  },
});

export default HomeScreen;
