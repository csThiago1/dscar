import Constants from "expo-constants";
import { Platform } from "react-native";

interface AppConfig {
  apiUrl: string;
}

const getLocalHost = () => {
  if (Platform.OS === "android") {
    return "10.0.2.2"; // Android Studio Emulator
  }
  if (Platform.OS === "ios") {
    return "localhost"; // iOS Simulator
  }
  return "localhost"; // Web
};

const ENV = {
  development: {
    apiUrl: "http://192.168.3.29:3333/api",
  },
  staging: {
    apiUrl: "https://staging.api.minhaoficina.app/api",
  },
  production: {
    apiUrl: "https://api.minhaoficina.app/api",
  },
} as const;

const getEnvVars = (env = Constants.expoConfig?.extra?.ENV): AppConfig => {
  if (env === "production") {
    return ENV.production;
  }
  if (env === "staging") {
    return ENV.staging;
  }
  return ENV.development;
};

export const config = getEnvVars();
