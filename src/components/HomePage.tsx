import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { youtubeContext } from "../context/Context";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import formatViews from "../shared/ViewesFormatter";
import { ActiveLinkContext, TrendingVideosContext } from "../context/Context";
// import { IVideos } from "../shared/model/videos.model";
import axios from "axios";

const HomePage = () => {
  const { setActiveLink } = useContext(ActiveLinkContext);
  const { trendingVideos, setTrendingVideos } = useContext(
    TrendingVideosContext
  );

  const [skeletonLoadingLength, setSkeletonLoadingLength] = useState<
    Array<number>
  >(new Array(50).fill(0));
  // const [trendingVideos, setTrendingVideos] = useState<IVideos[]>([]);
  const [progressBarPercent, setProgressBarPercent] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // get trending videos
  const getTrendingVideos = async () => {
    await axios
      .get(
        "https://youtube-v2.p.rapidapi.com/trending/?lang=en&country=in&section=Now",
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key":
              "b270c8a6c1mshfa428feb3857501p110f3cjsn471755706752",
            "X-RapidAPI-Host": "youtube-v2.p.rapidapi.com",
          },
          onDownloadProgress: (progressEvent) => {
            setIsLoading(true);
            let percentage = 0;
            if (progressEvent.total !== undefined) {
              percentage = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgressBarPercent(percentage);
              if (percentage === 100) {
                setTimeout(() => {
                  setIsLoading(false);
                }, 400);
              }
            }
          },
        }
      )
      .then((res) => {
        setTrendingVideos(res.data.videos);
        res.data.videos.length > 0 && setSkeletonLoadingLength([]);
      });
  };

  useEffect(() => {
    trendingVideos.length <= 0 && getTrendingVideos();
    setActiveLink("Home");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="flex-grow p-5 bg-[#0f0f0f] overflow-y-auto">
      {/* <h2 className="text-white font-semibold text-3xl mb-5">Trending</h2> */}
      {isLoading && (
        <progress
          className="absolute top-0 h-1 bg-red-600 left-0 w-full z-20"
          value={`${progressBarPercent}`}
          max={100}
        />
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-[90rem] mx-auto">
        {trendingVideos &&
        trendingVideos !== undefined &&
        trendingVideos.length > 0 ? (
          trendingVideos
            .filter((videos) => videos.type === "NORMAL")
            .map((videos) => {
              return (
                <div key={Math.random()} className="flex flex-col">
                  <Link to={`/watch?v=${videos.video_id}`}>
                    <figure className="w-full relative">
                      <img
                        src={videos.thumbnails[2].url}
                        alt=""
                        className="w-full h-auto home__thumbnail rounded-xl"
                      />
                      {videos.video_length !== "" && (
                        <figcaption className="bg-black bg-opacity-80 rounded-md px-1.5 py-0.5 absolute right-2 bottom-2 text-xs text-white font-semibold">
                          {videos.video_length}
                        </figcaption>
                      )}
                    </figure>
                    <h4 className="text-white my-2 text-base font-medium line-clamp-2">
                      {videos.title}
                    </h4>
                  </Link>
                  <Link to={`/channel?id=${videos.channel_id}`}>
                    <p className="text-secondary font-medium text-sm">
                      {videos.author}
                    </p>
                    {videos.video_length !== "UPCOMING" && (
                      <p className="text-secondary font-medium text-xs mt-1">
                        {formatViews(videos.number_of_views)} •{" "}
                        {videos.published_time}
                      </p>
                    )}
                  </Link>
                </div>
              );
            })
        ) : (
          <SkeletonTheme baseColor="#282828" highlightColor="#404040">
            {skeletonLoadingLength.map(() => {
              return (
                <div key={Math.random()}>
                  <Skeleton width="100%" height={150} borderRadius="8px" />
                  <h4 className="text-white my-2 text-base font-semibold line-clamp-2">
                    <Skeleton width="100%" />
                  </h4>
                  <p className="text-gray-400 text-sm">
                    <Skeleton width={120} />
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    <Skeleton width={80} />
                  </p>
                </div>
              );
            })}
          </SkeletonTheme>
        )}
      </div>
    </section>
  );
};

export default HomePage;
