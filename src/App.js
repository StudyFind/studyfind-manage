import firebase from "firebase";

import { FirebaseProvider } from "@studyfind/firebase";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";

import ResetPassword from "./ResetPassword";
import VerifyEmail from "./VerifyEmail";

const app = firebase.initializeApp({
  apiKey: "AIzaSyB0_PyqZxFZm8t0jY3PAFyP8oMxFalCYGA",
  authDomain: "studyfind-researcher.firebaseapp.com",
  databaseURL: "https://studyfind-researcher.firebaseio.com",
  projectId: "studyfind-researcher",
  storageBucket: "studyfind-researcher.appspot.com",
  messagingSenderId: "434311866185",
  appId: "1:434311866185:web:2794d11ef74480179f1c98",
});

const theme = extendTheme({
  config: {
    useSystemColorMode: true,
    initialColorMode: "dark",
  },
});

function App() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  const code = params.get("oobCode");

  return (
    <FirebaseProvider app={app}>
      <ChakraProvider theme={theme}>
        <Flex height="100vh" width="100vw" justify="center" align="center">
          {mode === "resetPassword" ? <ResetPassword code={code} /> : <VerifyEmail code={code} />}
        </Flex>
      </ChakraProvider>
    </FirebaseProvider>
  );
}

export default App;
