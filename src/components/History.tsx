import React, { useEffect, useState, useContext } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ActiveLinkContext, AuthDataContext } from "../context/Context";
import { IHistories } from "../shared/model/videos.model";
import { privateAxios } from "../shared/service/axios";
import ToastConfig from "./ToastConfig";

const History = () => {
  const { setActiveLink } = useContext(ActiveLinkContext);
  const { authData } = useContext(AuthDataContext);
  // const navigate = useNavigate();

  const [historyData, setHistoryData] = useState<IHistories[]>([]);
  const [historyDataLoading, setHistoryDataLoading] = useState<boolean>(false);
  const [historyAvailabilityMessage, setHistoryAvailabilityMessage] =
    useState<string>("");
  const [skeletonLoadingLength, setSkeletonLoadingLength] = useState<
    Array<number>
  >(new Array(5).fill(0));

  const getHistoryData = async () => {
    setHistoryDataLoading(true);
    if (authData) {
      privateAxios
        .get("/getHistoryData")
        .then((res) => {
          setHistoryData(res.data);
          if (res.data.length === 0) {
            setHistoryAvailabilityMessage("No History Found");
          }
          setHistoryDataLoading(false);
        })
        .catch((err) => {
          console.log(err);
          if (err.code === "ERR_NETWORK") {
            toast.error("Server issue", ToastConfig);
          } else {
            toast.error(
              "Token invalid, please logout and login again",
              ToastConfig
            );
          }
          setHistoryData([]);
          setHistoryDataLoading(false);
          setHistoryAvailabilityMessage("No History Available");
          // if (err.response.data.message.name === "JsonWebTokenError") {
          //   localStorage.clear();
          //   setAuthData("");
          //   navigate("/login");
          // }
        });
    } else {
      setHistoryAvailabilityMessage("Please login to see your history");
      setHistoryData([]);
      setHistoryDataLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (authData) {
      await privateAxios
        .post("/deleteHistory", { videoId: id })
        .then((res) => {
          if (res.data.success) {
            getHistoryData();
          } else {
            console.log("some error occurred");
          }
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
    }
  };

  // const updateTimeStamp = async (videoId: string) => {
  //   if (authData) {
  //     await privateAxios.post("/updateTime", {
  //       videoId: videoId,
  //       time: new Date().getTime(),
  //     });
  //   }
  // };

  useEffect(() => {
    getHistoryData();
    setActiveLink("History");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    historyData.length > 0 && setSkeletonLoadingLength([]);
  }, [historyData]);

  return (
    <div className="bg-[#0f0f0f] flex-grow overflow-y-auto px-5 sm:px-10 py-6">
      <div className="grid grid-cols-1 gap-8 w-full max-w-[90rem] mx-auto">
        <h2 className="text-lg text-white font-semibold">Watch History</h2>
        {historyData &&
          historyData.map((data) => {
            return (
              <div className="relative" key={Math.random()}>
                <Link
                  to={`/watch?v=${data.videoId}`}
                  className="flex flex-col sm:flex-row sm:items-start sm:space-x-5 space-y-4 sm:space-y-0"
                  // onClick={() => updateTimeStamp(data.videoId)}
                >
                  <figure className="w-full sm:w-56 lg:w-64 min-w-[14rem] lg:min-w-[16rem] rounded-xl overflow-hidden">
                    <img className="min-w-full" src={data.thumbnail} alt="" />
                  </figure>
                  <div>
                    <h4 className="text-white text-lg font-medium line-clamp-2 history__card-title mb-1 mr-10">
                      {data.title}
                    </h4>
                    <p className="text-secondary font-medium text-sm mt-2">
                      {data.channelName}
                    </p>
                    <p className="text-secondary  text-xs line-clamp-2 mt-2 break-word">
                      {data.description}
                    </p>
                  </div>
                </Link>
                <button
                  className="p-3 absolute right-0 -top-2 text-right"
                  onClick={() => handleDelete(data.videoId)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    className="w-5 text-black sm:text-white font-bold"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
        {historyDataLoading && historyData.length <= 0 && (
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
        {historyData && !historyDataLoading && historyData.length <= 0 && (
          <h4 className="text-2xl text-white font-semibold">
            {historyAvailabilityMessage}
          </h4>
        )}
      </div>
    </div>
  );
};

export default History;
