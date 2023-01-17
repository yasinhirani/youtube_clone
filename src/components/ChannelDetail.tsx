import axios from "axios";
import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Link, useSearchParams } from "react-router-dom";
import { IChannel } from "../shared/model/videos.model";
import formatViews from "../shared/ViewesFormatter";

const ChannelDetail = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [channelDetails, setChannelDetails] = useState<IChannel | null>(null);
  const [skeletonLoadingLength, setSkeletonLoadingLength] = useState<
    Array<number>
  >(new Array(30).fill(0));

  const getChannelDetails = async () => {
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "b270c8a6c1mshfa428feb3857501p110f3cjsn471755706752",
        "X-RapidAPI-Host": "youtube-v3-alternative.p.rapidapi.com",
      },
    };
    axios
      .get(
        `https://youtube-v3-alternative.p.rapidapi.com/channel?id=${id}`,
        options
      )
      .then((res) => {
        setChannelDetails(res.data);
        setSkeletonLoadingLength([]);
      });
  };

  useEffect(() => {
    getChannelDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="bg-[#0f0f0f] flex-grow overflow-y-auto py-6 text-white">
      {channelDetails ? (
        <div>
          {channelDetails.meta.image.banner !== null && (
            <figure className="hidden sm:block">
              <img src={channelDetails?.meta.image?.banner[5].url} alt="" />
            </figure>
          )}
          {channelDetails.meta.image.mobileBanner !== null && (
            <figure className="block sm:hidden">
              <img
                src={channelDetails?.meta.image?.mobileBanner[4].url}
                alt=""
              />
            </figure>
          )}
        </div>
      ) : (
        <SkeletonTheme baseColor="#282828" highlightColor="#404040">
          <Skeleton width="100%" height={200} className="z-10" />
        </SkeletonTheme>
      )}
      <div
        className={`flex flex-col items-center transform ${
          channelDetails?.meta.image.banner !== null && "sm:-translate-y-14"
        } my-10 sm:my-0`}
      >
        {channelDetails ? (
          <>
            <figure className="rounded-full overflow-hidden w-32 h-32">
              <img src={channelDetails?.meta.thumbnail[2].url} alt="" />
            </figure>
            <div className="mt-4">
              <h2 className="font-semibold text-xl mb-2 text-center">
                {channelDetails?.meta.title}
              </h2>
              <p className="font-medium text-base text-center">
                {channelDetails?.meta.subscriberCount} subscribers
              </p>
            </div>
          </>
        ) : (
          <SkeletonTheme baseColor="#303030" highlightColor="#404040">
            <Skeleton
              width={128}
              height={128}
              borderRadius="50%"
              className="z-20"
            />
            <Skeleton width={120} />
            <Skeleton width={60} />
          </SkeletonTheme>
        )}
      </div>
      <div className="px-5 sm:px-10 w-full max-w-[98rem] mx-auto">
        <h4 className="font-semibold text-2xl mb-5">Videos</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {channelDetails && channelDetails.data.length > 0 ? (
            channelDetails.data.map((data) => {
              return (
                <Link key={Math.random()} to={`/watch?v=${data.videoId}`}>
                  <figure className="w-full relative">
                    <img
                      src={data.thumbnail[2].url}
                      alt=""
                      className="w-full h-auto home__thumbnail rounded-xl"
                    />
                    {data.lengthText !== "" && (
                      <figcaption className="bg-black bg-opacity-95 rounded-lg px-2 py-1 absolute right-2 bottom-2 text-xs text-white font-semibold">
                        {data.lengthText}
                      </figcaption>
                    )}
                  </figure>
                  <h4 className="text-white my-2 text-base font-medium line-clamp-2">
                    {data.title}
                  </h4>
                  <p className="text-gray-400 font-medium text-sm">
                    {channelDetails?.meta.title}
                  </p>

                  <p className="text-gray-400 font-medium text-xs mt-1">
                    {formatViews(+data.viewCount)} • {data.publishedText}
                  </p>
                </Link>
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
      </div>
    </section>
  );
};

export default ChannelDetail;
