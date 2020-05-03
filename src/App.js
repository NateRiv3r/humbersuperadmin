import React from "react";
import RouterMain from "./router";
import { StateProvider } from "./stateManagement/store";

function App() {
  return (
    <StateProvider>
      <RouterMain />
    </StateProvider>
  );
}

export default App;
