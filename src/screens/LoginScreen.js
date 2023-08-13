import { useNavigation } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  auth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "../firebase";
import { login } from "../features/userSlice";
import { useDispatch } from "react-redux";
import Checkbox from "expo-checkbox";
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [errorList, setErrorList] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("Home");
      }
    });

    return unsubscribe;
  }, []);

  const validate = () => {
    let errors = {};
    if (!email) {
      errors.emailIsEmpty = "You need to enter your e-mail address";
    }
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      errors.emailFormatInvalid = "Your e-mail format doesn't seem right";
    }

    if (!password) {
      errors.passIsEmpty = "You need a password";
    }

    if (password && password.length <= 4)
      errors.passIsStrong = "You need a stronger password";

    return errors;
  };

  const handleSignUp = () => {
    if (!name) {
      return alert("Please enter a full name");
    }

    console.log("register the user");

    createUserWithEmailAndPassword(auth, email, password)
      .then((userAuth) => {
        updateProfile(userAuth.user, {
          displayName: name,
        })
          .then(
            dispatch(
              login({
                email: userAuth.user.email,
                uid: userAuth.user.uid,
                displayName: name,
              })
            )
          )
          .catch((error) => {
            console.log("user not updated");
          });
      })
      .catch((err) => {
        alert(err);
      });

    // createUserWithEmailAndPassword(auth, email, password)
    //   .then((userCredentials) => {
    //     const user = userCredentials.user;
    //     console.log("Registered with:", user.email);
    //   })
    //   .catch((error) => alert(error.message));
  };

  const handleLogin = () => {
    let check = validate();
    console.log("check", check);
    if (Object.keys(check).length > 0) {
      setErrorList(check);
      return;
    } else {
      setErrorList({});
      signInWithEmailAndPassword(auth, email, password)
        .then((userAuth) => {
          dispatch(
            login({
              email: userAuth.user.email,
              uid: userAuth.user.uid,
              displayName: userAuth.user.displayName,
            })
          );
          navigation.navigate("Home");
        })
        .catch((err) => {
          alert(err);
        });
    }

    // signInWithEmailAndPassword(auth, email, password)
    //   .then((userCredentials) => {
    //     const user = userCredentials.user;
    //     console.log("Logged in with:", user.email);
    //   })
    //   .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Full Name (required if registering)"
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>
      {errorList?.emailIsEmpty && (
        <Text style={styles.error}>{errorList?.emailIsEmpty}</Text>
      )}
      {errorList?.emailFormatInvalid && (
        <Text style={styles.error}>{errorList?.emailFormatInvalid}</Text>
      )}
      {errorList?.passIsEmpty && (
        <Text style={styles.error}>{errorList?.passIsEmpty}</Text>
      )}
      {errorList?.passIsStrong && (
        <Text style={styles.error}>{errorList?.passIsStrong}</Text>
      )}

      <View
        style={{
          paddingHorizontal: 40,
          padding: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={setIsChecked}
          color={isChecked ? "#4630EB" : undefined}
        />
        <Text style={{ fontSize: 11 }}>
          By logging in, I accept the terms & conditions of the platform
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          disabled={!isChecked}
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox: {
    margin: 8,
  },
  error: {
    color: "red",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },
});
