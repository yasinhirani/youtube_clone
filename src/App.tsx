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
} from "./components/index";
import {
  ActiveLinkContext,
  SearchStringContext,
  TrendingVideosContext,
} from "./context/Context";
import { IVideos } from "./shared/model/videos.model";

function App() {
  const location = useLocation();

  const [activeLink, setActiveLink] = useState<string | null>("");
  const [searchString, setSearchString] = useState<string | null>("");
  const [trendingVideos, setTrendingVideos] = useState<IVideos[]>([]);

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

  return (
    <ActiveLinkContext.Provider value={ActiveLinkState}>
      <SearchStringContext.Provider value={SearchStringState}>
        <TrendingVideosContext.Provider value={TrendingVideosState}>
          <div className="w-full h-full flex flex-col overflow-hidden">
            <Navbar />
            <div
              className={`w-full flex ${
                location.pathname.includes("watch") && "flex-col"
              } flex-grow overflow-hidden mt-20 ${
                !location.pathname.includes("watch") && "mb-16 sm:mb-0"
              }`}
            >
              {!location.pathname.includes("watch") && <Sidebar />}
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchResult />} />
                <Route path="/watch" element={<VideoDetail />} />
                <Route path="/channel" element={<ChannelDetail />} />
                <Route path="/history" element={<History />} />
              </Routes>
            </div>
            {!location.pathname.includes("watch") && <BottomNavigation />}
          </div>
        </TrendingVideosContext.Provider>
      </SearchStringContext.Provider>
    </ActiveLinkContext.Provider>
  );
}

export default App;
