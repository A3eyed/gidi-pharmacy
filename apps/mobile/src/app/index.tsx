import { Redirect } from 'expo-router';

/** The dashboard lives in the tab navigator. This file must not render null. */
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
