import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/utils/firebase";

import { SignupPage } from "./pages/SignupPage";
import LegalPage from "./pages/LegalPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/Login";

const App: React.FC = () => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={!user ? <HomePage /> : <Navigate to="/signup" />}
          />
          <Route
            path="/signup"
            element={!user ? <SignupPage /> : <Navigate to="/" />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/legal" element={<LegalPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
