import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native";
import { TouchableOpacity } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { Provider, useDispatch, useSelector } from "react-redux";
import { login, logout, selectUser } from "./features/userSlice";
import { store } from "./app/store";
import { auth } from "./firebase";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerWithLogoutButton = (props) => (
  <ScrollView
    contentContainerStyle={{
      flex: 1,
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <SafeAreaView
      style={{ paddingTop: 20 }}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <DrawerItemList {...props} />
    </SafeAreaView>
    <TouchableOpacity>
      <View style={styles.item}>
        <View style={styles.iconContainer}>
          {/* <Image
            source={require("./img/logout.png")}
            style={styles.icon}
          ></Image> */}
        </View>
        <Text style={styles.label}>Version 1.0.0</Text>
      </View>
    </TouchableOpacity>
  </ScrollView>
);
function MyDrawer({ user }) {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerWithLogoutButton {...props} />}
    >
      {user && <Drawer.Screen name="Home" component={HomeScreen} />}
      <Drawer.Screen name="Login" component={LoginScreen} />
    </Drawer.Navigator>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      console.log("userAuth", userAuth);
      if (userAuth) {
        setUser(userAuth);
      } else {
        setUser(null);

        dispatch(logout());
      }
    });
    console.log("page loaded");
  }, []);
  return (
    <NavigationContainer>
      <MyDrawer user={user} />
      {/* <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator> */}
    </NavigationContainer>
  );
}

export default function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    margin: 16,
    fontWeight: "bold",
    color: "rgba(0, 0, 0, .87)",
  },
  iconContainer: {
    marginHorizontal: 16,
    width: 24,
    alignItems: "center",
  },
  icon: {
    width: 24,
    height: 24,
  },
});
