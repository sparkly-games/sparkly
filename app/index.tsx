import { useEffect } from "react";
import { router } from "expo-router";

const App = () => {
  useEffect(() => {
    setTimeout(() => {
        router.push("/stable");
    }, 1000);
  }, []);
};

export default App;