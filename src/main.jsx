import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";
import { AnnouncementsProvider } from "./context/AnnouncementsContext";
import { RulesProvider } from "./context/RulesContext";
import App from "./App";
import { MessProvider } from "./context/MessContext";
import { PollsSuggestionsProvider } from "./context/PollsSuggestionsContext";
import { ComplaintsProvider } from "./context/ComplaintsContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <AnnouncementsProvider>
            <RulesProvider>
              <MessProvider>
                <PollsSuggestionsProvider>
                  <ComplaintsProvider>
                    <App />
                  </ComplaintsProvider>
                </PollsSuggestionsProvider>
              </MessProvider>
            </RulesProvider>
          </AnnouncementsProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
