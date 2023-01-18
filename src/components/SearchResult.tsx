import React, { useContext, useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Link, useSearchParams } from "react-router-dom";
import { SearchStringContext } from "../context/Context";
import "react-loading-skeleton/dist/skeleton.css";
import formatViews from "../shared/ViewesFormatter";
import { ISearchResult } from "../shared/model/videos.model";
import axios from "axios";

const SearchResult = () => {
  const { searchString } = useContext(SearchStringContext);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const [skeletonLoadingLength, setSkeletonLoadingLength] = useState<
    Array<number>
  >(new Array(10).fill(0));
  const [searchResult, setSearchResult] = useState<ISearchResult[]>([]);

  // get search result
  const getSearchResult = async (searchValue: string | null) => {
    setSkeletonLoadingLength(new Array(10).fill(0));
    setSearchResult([]);
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "b270c8a6c1mshfa428feb3857501p110f3cjsn471755706752",
        "X-RapidAPI-Host": "youtube-v3-alternative.p.rapidapi.com",
      },
    };
    await axios
      .get(
        `https://youtube-v3-alternative.p.rapidapi.com/search?query=${searchValue}&geo=IN&lang=en`,
        options
      )
      .then((res) => {
        setSearchResult(res.data.data);
        res.data.data.length > 0 && setSkeletonLoadingLength([]);
      });
  };

  useEffect(() => {
    getSearchResult(query);
  }, [searchString, query]);

  return (
    <div className="bg-[#0f0f0f] flex-grow overflow-y-auto px-5 sm:px-10 py-6">
      <div className="grid grid-cols-1 gap-8 w-full max-w-[90rem] mx-auto">
        {searchResult &&
          // eslint-disable-next-line array-callback-return
          searchResult.map((result) => {
            if (result.type === "channel") {
              return (
                <Link
                  to={`/channel?id=${result.channelId}`}
                  className="flex items-center space-x-8"
                  key={Math.random()}
                >
                  <figure className="w-28 min-w-[80px] rounded-full overflow-hidden">
                    <img src={result.thumbnail[1].url} alt="" />
                  </figure>
                  <div>
                    <h4 className="text-white font-semibold text-xl mb-2">
                      {result.channelTitle}
                    </h4>
                    <p className="text-white text-xs line-clamp-2">
                      {result.description}
                    </p>
                  </div>
                </Link>
              );
            }
            if (result.type === "video") {
              return (
                <div
                  className="flex flex-col sm:flex-row sm:items-start sm:space-x-5 space-y-4 sm:space-y-0"
                  key={Math.random()}
                >
                  <Link to={`/watch?v=${result.videoId}`}>
                    <figure className="w-full sm:w-64 sm:min-w-[16rem] rounded-xl overflow-hidden relative">
                      <img
                        className="min-w-full"
                        src={result.thumbnail[0].url}
                        alt=""
                      />
                      {result.lengthText !== "" && (
                        <figcaption className="bg-black bg-opacity-80 rounded-md px-1.5 py-0.5 absolute right-2 bottom-2 text-xs text-white font-semibold">
                          {result.lengthText}
                        </figcaption>
                      )}
                    </figure>
                  </Link>
                  <div>
                    <Link to={`/watch?v=${result.videoId}`}>
                      <h4 className="text-white text-lg font-medium line-clamp-2 mb-1 break-word">
                        {result.title}
                      </h4>
                      <p className="text-xs font-medium text-secondary mb-4">
                        {formatViews(+result.viewCount)} views •{" "}
                        {result.publishedText}
                      </p>
                    </Link>
                    <Link
                      to={`/channel?id=${result.channelId}`}
                      className="flex items-center space-x-2"
                    >
                      <figure className="w-6 h-6 rounded-full overflow-hidden">
                        <img src={result.channelThumbnail[0].url} alt="" />
                      </figure>
                      <p className="text-secondary font-medium text-xs">
                        {result.channelTitle}
                      </p>
                    </Link>
                  </div>
                </div>
              );
            }
          })}
        {searchResult.length <= 0 && (
          <SkeletonTheme
            baseColor="#282828"
            highlightColor="#404040"
            borderRadius="12px"
            enableAnimation={false}
          >
            {skeletonLoadingLength.map(() => (
              <div
                className="flex flex-col sm:flex-row sm:items-start sm:space-x-5 space-y-4 sm:space-y-0"
                key={Math.random()}
              >
                <div className="block sm:hidden">
                  <Skeleton height={200} />
                </div>
                <div className="hidden sm:block">
                  <Skeleton width={260} height={150} />
                </div>
                <div className="w-full">
                  <Skeleton width="100%" count={2} />
                  <Skeleton width={250} className="mt-4" />
                  <div className="flex items-center space-x-2 w-full mt-4">
                    <Skeleton width={24} height={24} borderRadius="50%" />
                    <Skeleton width={150} />
                  </div>
                </div>
              </div>
            ))}
          </SkeletonTheme>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
