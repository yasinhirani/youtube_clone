import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { youtubeContext } from "../context/Context";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import formatViews from "../shared/ViewesFormatter";
import { ActiveLinkContext } from "../context/Context";
import { IVideos } from "../shared/model/videos.model";

const HomePage = () => {
  const { setActiveLink } = useContext(ActiveLinkContext);

  const [skeletonLoadingLength, setSkeletonLoadingLength] = useState<
    Array<number>
  >(new Array(50).fill(0));
  const [trendingVideos, setTrendingVideos] = useState<IVideos[]>([]);

  // get trending videos
  const getTrendingVideos = async () => {
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "b270c8a6c1mshfa428feb3857501p110f3cjsn471755706752",
        "X-RapidAPI-Host": "youtube-v2.p.rapidapi.com",
      },
    };
    const res = await fetch(
      "https://youtube-v2.p.rapidapi.com/trending/?lang=en&country=in&section=Now",
      options
    );
    const data = await res.json();
    setTrendingVideos(data.videos);
    data.videos.length > 0 && setSkeletonLoadingLength([]);
  };

  useEffect(() => {
    getTrendingVideos();
    setActiveLink("Home");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="flex-grow p-5 bg-[#0f0f0f] overflow-y-auto">
      {/* <h2 className="text-white font-semibold text-3xl mb-5">Trending</h2> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-[90rem] mx-auto">
        {trendingVideos &&
        trendingVideos !== undefined &&
        trendingVideos.length > 0 ? (
          trendingVideos
            .filter((videos) => videos.type === "NORMAL")
            .map((videos) => {
              return (
                <div key={Math.random()} className="flex flex-col">
                  <Link
                    to={`/videoDetail/${videos.video_id}`}
                  >
                    <figure className="w-full relative">
                      <img
                        src={videos.thumbnails[2].url}
                        alt=""
                        className="w-full h-auto home__thumbnail rounded-lg"
                      />
                      {videos.video_length !== "" && (
                        <figcaption className="bg-black bg-opacity-95 rounded-lg px-2 py-1 absolute right-2 bottom-2 text-xs text-white font-semibold">
                          {videos.video_length}
                        </figcaption>
                      )}
                    </figure>
                    <h4 className="text-white my-2 text-base font-semibold line-clamp-2">
                      {videos.title}
                    </h4>
                  </Link>
                  <Link to={`/channelDetail/${videos.channel_id}`}>
                    <p className="text-gray-400 font-medium text-sm">
                      {videos.author}
                    </p>
                    {videos.video_length !== "UPCOMING" && (
                      <p className="text-gray-400 font-medium text-xs mt-1">
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
