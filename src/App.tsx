import { useMemo, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import BottomNavigation from "./components/BottomNavigation";
import {
  Navbar,
  Sidebar,
  HomePage,
  VideoDetail,
  ChannelDetail,
  History,
  SearchResult,
  Login,
  Register,
  ProtectedRoute,
} from "./components/index";
import {
  ActiveLinkContext,
  AuthDataContext,
  SearchStringContext,
  TrendingVideosContext,
} from "./context/Context";
import { IVideos } from "./shared/model/videos.model";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const location = useLocation();

  const [activeLink, setActiveLink] = useState<string | null>("");
  const [searchString, setSearchString] = useState<string | null>("");
  const [trendingVideos, setTrendingVideos] = useState<IVideos[]>([]);
  const [authData, setAuthData] = useState<string | null>(
    localStorage.getItem("userEmail") || ""
  );

  const ActiveLinkState = useMemo(
    () => ({
      activeLink,
      setActiveLink,
    }),
    [activeLink]
  );
  const SearchStringState = useMemo(
    () => ({
      searchString,
      setSearchString,
    }),
    [searchString]
  );
  const TrendingVideosState = useMemo(
    () => ({
      trendingVideos,
      setTrendingVideos,
    }),
    [trendingVideos]
  );
  const AuthDataState = useMemo(
    () => ({
      authData,
      setAuthData,
    }),
    [authData]
  );

  return (
    <>
      <AuthDataContext.Provider value={AuthDataState}>
        <ActiveLinkContext.Provider value={ActiveLinkState}>
          <SearchStringContext.Provider value={SearchStringState}>
            <TrendingVideosContext.Provider value={TrendingVideosState}>
              <div className="w-full h-full flex flex-col overflow-hidden">
                {!location.pathname.includes("login") &&
                  !location.pathname.includes("register") && <Navbar />}
                <div
                  className={`w-full flex ${
                    (location.pathname.includes("watch") ||
                      location.pathname.includes("login") ||
                      location.pathname.includes("register")) &&
                    "flex-col"
                  } flex-grow overflow-hidden ${
                    !location.pathname.includes("login") &&
                    !location.pathname.includes("register") &&
                    "mt-20"
                  } ${
                    !location.pathname.includes("watch") &&
                    !location.pathname.includes("login") &&
                    !location.pathname.includes("register") &&
                    "mb-16 sm:mb-0"
                  }`}
                >
                  {!location.pathname.includes("watch") &&
                    !location.pathname.includes("login") &&
                    !location.pathname.includes("register") && <Sidebar />}
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                      path="/login"
                      element={<ProtectedRoute Component={Login} />}
                    />
                    <Route
                      path="/register"
                      element={<ProtectedRoute Component={Register} />}
                    />
                    <Route path="/search" element={<SearchResult />} />
                    <Route path="/watch" element={<VideoDetail />} />
                    <Route path="/channel" element={<ChannelDetail />} />
                    <Route path="/history" element={<History />} />
                  </Routes>
                </div>
                {!location.pathname.includes("watch") &&
                  !location.pathname.includes("login") &&
                  !location.pathname.includes("register") && (
                    <BottomNavigation />
                  )}
              </div>
            </TrendingVideosContext.Provider>
          </SearchStringContext.Provider>
        </ActiveLinkContext.Provider>
      </AuthDataContext.Provider>
      <ToastContainer />
    </>
  );
}

export default App;
