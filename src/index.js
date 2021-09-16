import React from "react";
import ReactDOM from "react-dom";

import firebase from "firebase";

import { FirebaseProvider } from "@studyfind/firebase";
import { ChakraProvider } from "@chakra-ui/react";

import App from "./App";

const app = firebase.initializeApp({
  apiKey: "AIzaSyB0_PyqZxFZm8t0jY3PAFyP8oMxFalCYGA",
  authDomain: "studyfind-researcher.firebaseapp.com",
  databaseURL: "https://studyfind-researcher.firebaseio.com",
  projectId: "studyfind-researcher",
  storageBucket: "studyfind-researcher.appspot.com",
  messagingSenderId: "434311866185",
  appId: "1:434311866185:web:2794d11ef74480179f1c98",
});

ReactDOM.render(
  <FirebaseProvider app={app}>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </FirebaseProvider>,
  document.getElementById("root")
);
