import { Loading } from "@/components/Loading";
import { NavBar } from "@/components/NavBar";
import Profile from "@/components/Profile";
import { authStatus, useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import Auth from "./Auth";

export default function Home() {
  const { status, authenticate } = useAuth();

  useEffect(() => {
    authenticate();
  }, [authenticate]);

  if (status === authStatus.Unknown) {
    return (
      <>
        <NavBar />
        <Loading />
      </>
    );
  } else if (status === authStatus.Guest) {
    return <Auth />;
  } else if (status === authStatus.Authentificated) {
    return (
      <>
        <NavBar />
        <Profile />
      </>
    );
  }
}
