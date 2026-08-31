import { UserProvider, useUser } from "./context/UserContext";
import { AppEntitlementsProvider } from "./context/AppEntitlementsContext";
import { FeatureAccessProvider } from "./context/FeatureAccessContext";
import MainApp from "./screens/MainApp/MainApp";
import Onboarding from "./screens/Onboarding/Onboarding";

function AppContent() {
  const {
    user,
    loading,
    error,
    refreshUser,
  } = useUser();

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
        <div style={{ textAlign: "center" }}>
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

          <div style={{ color: "#aaa" }}>
            Loading...
          </div>
        </div>
      </div>
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

  return <MainApp />;
}

export default function App() {
  return (
    <UserProvider>
      <AppEntitlementsProvider>
        <FeatureAccessProvider>
          <AppContent />
        </FeatureAccessProvider>
      </AppEntitlementsProvider>
    </UserProvider>
  );
}
