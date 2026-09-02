import {
  useState,
} from "react";

import {
  UserProvider,
  useUser,
} from "./context/UserContext";

import {
  AppEntitlementsProvider,
} from "./context/AppEntitlementsContext";

import {
  FeatureAccessProvider,
} from "./context/FeatureAccessContext";

import MainApp from "./screens/MainApp/MainApp";
import Onboarding from "./screens/Onboarding/Onboarding";
import Welcome from "./screens/Welcome/Welcome";
import AuthScreen from "./screens/Auth/AuthScreen";
import VerifyEmail from "./screens/VerifyEmail/VerifyEmail";
import {
  TermsPage,
  PrivacyPage,
} from "./screens/Legal/LegalPages";

function AuthenticatedApp() {
  return (
    <AppEntitlementsProvider>
      <FeatureAccessProvider>
        <MainApp />
      </FeatureAccessProvider>
    </AppEntitlementsProvider>
  );
}

function AppContent() {
  const currentPath =
    typeof window !== "undefined"
      ? window.location.pathname
      : "/";

  const isTermsPage =
    currentPath === "/terms";

  const isPrivacyPage =
    currentPath === "/privacy";

  const isEmailVerificationPage =
    typeof window !== "undefined" &&
    window.location.pathname ===
      "/verify-email";

  const {
    user,
    authenticated,
    loading,
    error,
    refreshUser,
  } = useUser();

  const [
    authScreenOpen,
    setAuthScreenOpen,
  ] = useState(false);

  if (isTermsPage) {
    return <TermsPage />;
  }

  if (isPrivacyPage) {
    return <PrivacyPage />;
  }

  if (isEmailVerificationPage) {
    return <VerifyEmail />;
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: "#050505",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial, sans-serif",
          padding: 24,
        }}
      >
        <div
          style={{
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 3,
              marginBottom: 12,
            }}
          >
            IRONAGE
          </div>

          <div
            style={{
              color: "#aaa",
            }}
          >
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    if (authScreenOpen) {
      return (
        <AuthScreen
          back={() =>
            setAuthScreenOpen(false)
          }
        />
      );
    }

    return (
      <Welcome
        start={() =>
          setAuthScreenOpen(true)
        }
      />
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: "#050505",
          color: "#fff",
          padding: 24,
          fontFamily: "Arial, sans-serif",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            maxWidth: 500,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 800,
              letterSpacing: 2,
              marginBottom: 20,
            }}
          >
            IRONAGE
          </div>

          <div
            style={{
              border: "1px solid #333",
              borderRadius: 16,
              padding: 20,
              background: "#0b0b0b",
            }}
          >
            <div
              style={{
                color: "#ff4444",
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              Authentication Error
            </div>

            <div
              style={{
                color: "#ccc",
                lineHeight: 1.5,
                marginBottom: 20,
                wordBreak: "break-word",
              }}
            >
              {error}
            </div>

            <button
              onClick={() => {
                void refreshUser();
              }}
              style={{
                width: "100%",
                marginTop: 24,
                padding: "14px 18px",
                border: 0,
                borderRadius: 12,
                background: "#d4af37",
                color: "#000",
                fontWeight: 800,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              RETRY
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user.onboardingCompleted) {
    return <Onboarding />;
  }

  return <AuthenticatedApp />;
}

export default function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}
