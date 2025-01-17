import { Loading } from "@/components/Loading";
import { NavBar } from "@/components/NavBar";
import { authStatus, useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

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
  } else if (
    status === authStatus.Guest ||
    status === authStatus.Authentificated
  ) {
    return (
      <div className="relative">
        <NavBar />
        <div className="flex min-h-screen justify-center">
          <h1 className="flex items-center justify-center text-3xl font-bold text-gray-400">
            Welcome to my portfolio app ! You can log in !
          </h1>
        </div>
      </div>
    );
  }
}
