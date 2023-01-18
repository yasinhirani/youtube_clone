import React, { useState, useEffect, useRef, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import ReactPlayer from "react-player";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import formatViews from "../shared/ViewesFormatter";
// import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
// import { db } from "../Firebase";
import {
  // IChannelDetails,
  IRecommendations,
  IVideoDetails,
} from "../shared/model/videos.model";
import axios from "axios";
import { AuthDataContext } from "../context/Context";
import { privateAxios } from "../shared/service/axios";
import { toast } from "react-toastify";
import ToastConfig from "./ToastConfig";

const VideoDetail = () => {
  const { authData } = useContext(AuthDataContext);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("v");

  const [recommendations, setRecommendations] = useState<IRecommendations[]>(
    []
  );
  const [videoDetail, setVideoDetail] = useState<IVideoDetails | null>(null);
  // const [channelDetail, setChannelDetail] = useState<IChannelDetails | null>(
  //   null
  // );
  const [readFullDescription, setReadFullDescription] =
    useState<boolean>(false);

  const [skeletonLoadingLength, setSkeletonLoadingLength] = useState<
    Array<number>
  >(new Array(10).fill(0));
  const [chapterVisible, setChapterVisible] = useState<boolean>(false);

  const divRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReactPlayer>(null);

  const getVideoRecommendations = async () => {
    setRecommendations([]);
    setSkeletonLoadingLength(new Array(10).fill(0));
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
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
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
        "X-RapidAPI-Host": "youtube138.p.rapidapi.com",
      },
    };
    await axios
      .get(
        `https://youtube138.p.rapidapi.com/video/details/?id=${id}&hl=en&gl=IN`,
        options
      )
      .then((res) => {
        setVideoDetail(res.data);
        if (res.data.chapters.length > 0) {
          setChapterVisible(true);
        }
        // getChannelDetails(res.data.channelId);
      });
  };

  // const getChannelDetails = async (channelId: string) => {
  //   const options = {
  //     method: "GET",
  //     headers: {
  //       "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
  //       "X-RapidAPI-Host": "youtube-v31.p.rapidapi.com",
  //     },
  //   };
  //   await axios
  //     .get(
  //       `https://youtube-v31.p.rapidapi.com/channels?part=snippet%2Cstatistics&id=${channelId}`,
  //       options
  //     )
  //     .then((res) => {
  //       setChannelDetail(res.data?.items[0]);
  //     });
  // };

  const handleHistoryUpload = async () => {
    if (authData) {
      let historyAvailable = false;
      await privateAxios
        .get(`/api/historyAvailable?videoId=${id}`)
        .then((res) => {
          // console.log(res.data);
          historyAvailable = res.data.success;
        })
        .catch((err) => {
          if (err.code === "ERR_NETWORK") {
            toast.error("Server issue", ToastConfig);
          } else {
            toast.error(
              "Token invalid, please logout and login again",
              ToastConfig
            );
          }
        });
      if (historyAvailable) {
        setTimeout(() => {
          privateAxios.post("/api/updateTime", {
            videoId: id,
            time: new Date().getTime(),
          });
        }, 2000);
        return;
      }
      if (videoDetail) {
        setTimeout(() => {
          privateAxios
            .post("/api/history", {
              channelName: videoDetail.author.title,
              title: videoDetail.title,
              videoId: videoDetail.videoId,
              description: videoDetail.description,
              thumbnail: videoDetail.thumbnails[3].url,
              time: new Date().getTime(),
            })
            .catch((err) => {
              if (err.code === "ERR_NETWORK") {
                toast.error("Server issue", ToastConfig);
              } else {
                toast.error(
                  "Token invalid, please logout and login again",
                  ToastConfig
                );
              }
            });
        }, 2000);
      }
    }
  };

  useEffect(() => {
    getVideoRecommendations();
    getVideoDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <section className="flex flex-col lg:flex-row flex-grow bg-[#0f0f0f] px-5 lg:space-x-5 overflow-y-auto space-y-5 lg:space-y-0">
      <div className="flex-grow flex flex-col py-5">
        <div className="player-wrapper">
          <ReactPlayer
            className="absolute top-0 left-0"
            ref={playerRef}
            url={`https://www.youtube.com/watch?v=${id}`}
            width="100%"
            height="100%"
            controls
            playing
            onStart={handleHistoryUpload}
            pip={true}
          />
        </div>
        {videoDetail && videoDetail.chapters.length > 0 && !chapterVisible && (
          <div>
            <button
              className="text-white mt-4"
              onClick={() => {
                setChapterVisible(true);
                if (divRef.current && window.innerWidth < 1024) {
                  divRef.current.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              View Chapters
            </button>
          </div>
        )}
        <div className="mt-5">
          {videoDetail && (
            <h2 className="text-white font-semibold text-xl">
              {videoDetail.title}
            </h2>
          )}
          {videoDetail && (
            <Link
              to={`/channel?id=${videoDetail.author.channelId}`}
              className="flex items-center space-x-4 mt-4"
            >
              <figure className="w-10 h-10 rounded-full overflow-hidden">
                <img src={videoDetail.author.avatar[1].url} alt="" />
              </figure>
              <div>
                <h4 className="text-white font-semibold">
                  {videoDetail.author.title}
                </h4>
                <p className="text-secondary font-medium text-xs">
                  {formatViews(videoDetail.author.stats.subscribers)}{" "}
                  subscribers
                </p>
              </div>
            </Link>
          )}
          {videoDetail && (
            <div className="mt-3 bg-[#282828] p-4 rounded-lg">
              <div className="flex items-center space-x-5 text-sm">
                <p className="text-white font-semibold">
                  {formatViews(videoDetail.stats.views)} views
                </p>
                <p className="text-white font-semibold">
                  {videoDetail.publishedDate}
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
        <div ref={divRef} className="lg:py-5">
          {chapterVisible && (
            <div className="flex flex-col border border-gray-600 rounded-lg mb-5 h-96 overflow-auto">
              <div className="flex justify-between items-center space-x-4 w-full border-b border-gray-600 p-3">
                <h5 className="text-white">Chapters</h5>
                <button
                  className="text-white text-lg"
                  onClick={() => setChapterVisible(false)}
                >
                  x
                </button>
              </div>
              <div className="flex flex-col space-y-5 mt-3 p-3">
                {videoDetail &&
                  videoDetail.chapters.map((chapter) => {
                    return (
                      <button
                        key={Math.random()}
                        className="text-left text-white flex items-center space-x-4"
                        onClick={() => {
                          if (playerRef.current) {
                            playerRef.current.seekTo(
                              chapter.startingMs / 1000,
                              "seconds"
                            );
                          }
                        }}
                      >
                        <figure className="w-14">
                          <img src={chapter.thumbnails[0].url} alt="" />
                        </figure>
                        <span>{chapter.title}</span>
                      </button>
                    );
                  })}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 gap-5">
            {recommendations && recommendations.length > 0
              ? recommendations.map((recommendation) => {
                  return (
                    <div
                      key={Math.random()}
                      className="flex items-start space-x-4"
                    >
                      <Link
                        to={`/watch?v=${recommendation.id.videoId}`}
                        onClick={() => setChapterVisible(false)}
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
                      </Link>
                      <div>
                        <Link
                          to={`/watch?v=${recommendation.id.videoId}`}
                          onClick={() => setChapterVisible(false)}
                        >
                          <h4 className="text-white font-semibold line-clamp-2 break-word">
                            {recommendation.snippet.title}
                          </h4>
                        </Link>
                        <Link
                          to={`/channel?id=${recommendation.snippet.channelId}`}
                        >
                          <p className="text-secondary font-medium text-sm">
                            {recommendation.snippet.channelTitle}
                          </p>
                        </Link>
                        <p className="text-secondary font-medium text-xs">
                          {new Date(
                            recommendation?.snippet?.publishedAt
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
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
                          <Skeleton
                            height={100}
                            className="w-44 min-w-[11rem]"
                          />
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
        </div>
      </aside>
    </section>
  );
};

export default VideoDetail;
