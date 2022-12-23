import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import formatViews from "../shared/ViewesFormatter";
// import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
// import { db } from "../Firebase";
import {
  IChannelDetails,
  IRecommendations,
  IVideoDetails,
} from "../shared/model/videos.model";
import axios from "axios";

const VideoDetail = () => {
  const { id } = useParams();
  // console.log(id);

  const [recommendations, setRecommendations] = useState<IRecommendations[]>(
    []
  );
  const [videoDetail, setVideoDetail] = useState<IVideoDetails | null>(null);
  const [channelDetail, setChannelDetail] = useState<IChannelDetails | null>(
    null
  );
  const [readFullDescription, setReadFullDescription] =
    useState<boolean>(false);

  const [skeletonLoadingLength, setSkeletonLoadingLength] = useState<
    Array<number>
  >(new Array(10).fill(0));

  const divRef = useRef<HTMLDivElement>(null);

  const getVideoRecommendations = async () => {
    setRecommendations([]);
    setSkeletonLoadingLength(new Array(10).fill(0));
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "b270c8a6c1mshfa428feb3857501p110f3cjsn471755706752",
        "X-RapidAPI-Host": "youtube-v31.p.rapidapi.com",
      },
    };
    await axios
      .get(
        `https://youtube-v31.p.rapidapi.com/search?relatedToVideoId=${id}&part=id%2Csnippet&type=video&maxResults=50`,
        options
      )
      .then((res) => {
        setRecommendations(res.data.items);
        setSkeletonLoadingLength([]);
      });
    if (divRef.current && window.innerWidth > 1024) {
      divRef.current.scrollIntoView();
    }
  };

  const getVideoDetails = async () => {
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "b270c8a6c1mshfa428feb3857501p110f3cjsn471755706752",
        "X-RapidAPI-Host": "youtube-v3-alternative.p.rapidapi.com",
      },
    };
    await axios
      .get(
        `https://youtube-v3-alternative.p.rapidapi.com/video?id=${id}`,
        options
      )
      .then((res) => {
        setVideoDetail(res.data);
        getChannelDetails(res.data.channelId);
      });
  };

  const getChannelDetails = async (channelId: string) => {
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "b270c8a6c1mshfa428feb3857501p110f3cjsn471755706752",
        "X-RapidAPI-Host": "youtube-v31.p.rapidapi.com",
      },
    };
    await axios
      .get(
        `https://youtube-v31.p.rapidapi.com/channels?part=snippet%2Cstatistics&id=${channelId}`,
        options
      )
      .then((res) => {
        setChannelDetail(res.data?.items[0]);
      });
  };

  const handleHistoryUpload = async () => {
    let historyAvailable = false;
    await axios
      .get(`http://localhost:8080/historyAvailable?videoId=${videoDetail?.id}`)
      .then((res) => {
        console.log(res.data);
        historyAvailable = res.data.isAvailable;
      });
    if (historyAvailable) {
      return;
    }
    if (videoDetail) {
      setTimeout(() => {
        axios
          .post("http://localhost:8080/history", {
            channelName: videoDetail.channelTitle,
            title: videoDetail.title,
            videoId: videoDetail.id,
            description: videoDetail.description,
            thumbnail: videoDetail.thumbnail[3].url,
            time: new Date().getTime(),
          })
          .catch(() => console.log("something went wrong"));
      }, 2000);
    }
  };

  useEffect(() => {
    getVideoRecommendations();
    getVideoDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <section className="flex flex-col lg:flex-row flex-grow bg-[#0f0f0f] p-5 lg:space-x-5 overflow-y-auto space-y-5 lg:space-y-0">
      <div className="flex-grow">
        <div className="w-full h-[400px] lg:h-full">
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${id}`}
            width="100%"
            height="100%"
            controls
            playing
            onStart={handleHistoryUpload}
            pip={true}
          />
        </div>
        <div className="mt-5">
          {videoDetail && (
            <h2 className="text-white font-semibold text-xl">
              {videoDetail.title}
            </h2>
          )}
          {channelDetail && (
            <Link
              to={`/channelDetail/${channelDetail.id}`}
              className="flex items-center space-x-4 mt-4"
            >
              <figure className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={channelDetail.snippet?.thumbnails?.medium?.url}
                  alt=""
                />
              </figure>
              <div>
                <h4 className="text-white font-semibold">
                  {channelDetail.snippet?.title}
                </h4>
                <p className="text-gray-400 font-medium text-xs">
                  {formatViews(+channelDetail.statistics?.subscriberCount)}{" "}
                  subscribers
                </p>
              </div>
            </Link>
          )}
          {videoDetail && (
            <div className="mt-3 bg-[#282828] p-4 rounded-lg">
              <div className="flex items-center space-x-5 text-sm">
                <p className="text-white font-semibold">
                  {formatViews(+videoDetail.viewCount)} views
                </p>
                <p className="text-white font-semibold">
                  {videoDetail.publishDate}
                </p>
              </div>
              <div
                className={`space-y-3 ${
                  !readFullDescription && "line-clamp-3"
                } mt-3`}
              >
                {videoDetail.description &&
                  videoDetail.description.split("\n\n").map((des: string) => (
                    <p
                      className="font-semibold text-base text-white"
                      key={Math.random()}
                    >
                      {des}
                    </p>
                  ))}
              </div>
              {!readFullDescription && (
                <button
                  className="font-semibold text-white text-sm"
                  onClick={() => setReadFullDescription(true)}
                >
                  show more
                </button>
              )}
              {readFullDescription && (
                <button
                  className="font-semibold text-white text-sm"
                  onClick={() => {
                    setReadFullDescription(false);
                    if (divRef.current && window.innerWidth > 1024) {
                      divRef.current.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  show less
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <aside className="w-full lg:w-96 lg:min-w-[25rem]">
        <div ref={divRef} className="grid grid-cols-1 gap-5">
          {recommendations && recommendations.length > 0
            ? recommendations.map((recommendation) => {
                return (
                  <Link
                    to={`/videoDetail/${recommendation.id.videoId}`}
                    key={Math.random()}
                    className="flex items-start space-x-4"
                  >
                    <figure className="w-44 min-w-[11rem] relative">
                      <img
                        className="min-w-full h-full rounded-xl"
                        src={recommendation.snippet.thumbnails.medium.url}
                        alt=""
                      />
                      {/* {recommendation.video_length !== "" && (
                        <figcaption className="bg-black bg-opacity-95 rounded-lg px-2 py-1 absolute right-2 bottom-2 text-xs text-white font-semibold">
                          {recommendation.video_length}
                        </figcaption>
                      )} */}
                    </figure>
                    <div>
                      <h4 className="text-white font-semibold line-clamp-2 break-all">
                        {recommendation.snippet.title}
                      </h4>
                      <Link
                        to={`/channelDetail/${recommendation.snippet.channelId}`}
                      >
                        <p className="text-gray-400 font-medium text-sm">
                          {recommendation.snippet.channelTitle}
                        </p>
                      </Link>
                      <p className="text-gray-400 font-medium text-xs">
                        {new Date(
                          recommendation?.snippet?.publishedAt
                        ).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </Link>
                );
              })
            : skeletonLoadingLength.map(() => {
                return (
                  <SkeletonTheme
                    baseColor="#282828"
                    highlightColor="#404040"
                    borderRadius="12px"
                    key={Math.random()}
                  >
                    <div className="flex items-start space-x-4">
                      <div>
                        <Skeleton height={100} className="w-44 min-w-[11rem]" />
                      </div>
                      <div className="w-full">
                        <h4 className="text-white font-semibold line-clamp-2">
                          <Skeleton width="100%" count={2} />
                        </h4>
                        <p className="text-gray-400 text-sm mt-1">
                          <Skeleton width="100%" />
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          <Skeleton width="100%" />
                        </p>
                      </div>
                    </div>
                  </SkeletonTheme>
                );
              })}
        </div>
      </aside>
    </section>
  );
};

export default VideoDetail;
