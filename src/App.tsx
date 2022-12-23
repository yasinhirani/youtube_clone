import { useMemo, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
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
                location.pathname.includes("videoDetail") && "flex-col"
              } flex-grow overflow-hidden mt-20`}
            >
              {!location.pathname.includes("videoDetail") && <Sidebar />}
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchResult />} />
                <Route path="/videoDetail/:id" element={<VideoDetail />} />
                <Route path="/channelDetail/:id" element={<ChannelDetail />} />
                <Route path="/history" element={<History />} />
              </Routes>
            </div>
          </div>
        </TrendingVideosContext.Provider>
      </SearchStringContext.Provider>
    </ActiveLinkContext.Provider>
  );
}

export default App;
