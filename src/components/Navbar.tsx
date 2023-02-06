import { Fragment, useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ActiveLinkContext,
  AuthDataContext,
  SearchStringContext,
} from "../context/Context";
import { Menu, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import ToastConfig from "./ToastConfig";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { debounce } from "lodash";
import axios from "axios";

const Navbar = () => {
  const { setActiveLink } = useContext(ActiveLinkContext);
  const { setSearchString } = useContext(SearchStringContext);
  const { authData, setAuthData } = useContext(AuthDataContext);

  const navigate = useNavigate();

  const {
    interimTranscript,
    finalTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [searchValue, setSearchValue] = useState("");
  const [searchBarVisible, setSearchBarVisible] = useState<boolean>(false);
  const [autocompleteData, setAutocompleteData] = useState([]);

  const handleSubmit = (e: any, value?: string) => {
    e.preventDefault();
    setAutocompleteData([]);
    navigate(`/search?query=${value ? value : searchValue}`);
    setSearchString(value ? value : searchValue);
    setSearchBarVisible(false);
  };

  const getAutoCompleteValue = useMemo(
    () =>
      debounce((value) => {
        const trimString = value.trim();
        if (trimString.length > 2) {
          getAutoCompleteData(trimString);
        } else {
          setAutocompleteData([]);
        }
      }, 750),
    []
  );

  const getAutoCompleteData = (data: string) => {
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "b270c8a6c1mshfa428feb3857501p110f3cjsn471755706752",
        "X-RapidAPI-Host": "youtube138.p.rapidapi.com",
      },
    };
    axios
      .get(
        `https://youtube138.p.rapidapi.com/auto-complete/?q=${data}&hl=en&gl=IN`,
        options
      )
      .then((res) => {
        setAutocompleteData(res.data.results);
      });
  };

  const startListening = async () => {
    if (browserSupportsSpeechRecognition) {
      await SpeechRecognition.startListening({
        language: "en-IN",
        continuous: false,
      });
    } else {
      console.log("Browser does not support speech recognition");
    }
  };

  useEffect(() => {
    if (finalTranscript !== "") {
      setSearchValue(finalTranscript);
      // console.log(finalTranscript);
      navigate(`/search?query=${finalTranscript}`);
      setSearchString(searchValue);
      setSearchBarVisible(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interimTranscript, finalTranscript]);

  return (
    <nav className="flex items-center h-20 bg-[#0f0f0f] fixed top-0 z-10 w-full">
      <div className="w-full flex justify-between items-center space-x-5 px-6 py-2">
        {/* Logo */}
        <Link
          to="/"
          onClick={() => {
            setActiveLink("Home");
          }}
        >
          <figure className="w-28 hidden sm:block">
            <img
              className="w-full h-auto"
              src="/images/youtube_logo_desktop.png"
              alt="Youtube"
            />
          </figure>
          <figure className="w-12 block sm:hidden">
            <img
              className="w-full h-auto"
              src="/images/youtube_logo_mobile.png"
              alt="Youtube"
            />
          </figure>
        </Link>
        {/* Logo */}
        {/* Search Bar */}
        <form className="w-72 hidden sm:flex items-center rounded-3xl bg-gray-200 relative">
          <input
            className="w-full px-4 py-2 focus:outline-none rounded-l-3xl"
            type="search"
            value={searchValue}
            onChange={(e) => {
              getAutoCompleteValue(e.target.value);
              setSearchValue(e.target.value);
            }}
            name=""
            id=""
            placeholder="Search"
          />
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 bg-transparent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
          <button type="button" onClick={startListening}>
            speak
          </button>
          {autocompleteData.length !== 0 && (
            <div className="absolute w-80 top-12 left-0 h-60 bg-white z-20 px-3 py-1 flex flex-col rounded-xl overflow-auto">
              {autocompleteData.map((data) => {
                return (
                  <button
                    onClick={(e) => {
                      setSearchValue(data);
                      handleSubmit(e, data);
                    }}
                    key={Math.random()}
                    className="text-left py-1"
                  >
                    {data}
                  </button>
                );
              })}
            </div>
          )}
        </form>
        {/* Search Bar */}
        {/* Login and profile section */}
        <div className="flex items-center">
          <button
            type="button"
            className="mr-6 block sm:hidden"
            onClick={() => setSearchBarVisible(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
          {authData !== "" && (
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="flex w-full justify-center items-center rounded-md text-lg font-medium text-white focus:outline-none">
                  <div className="flex items-center space-x-2">
                    <span className="capitalize inline-block w-full max-w-[12ch] overflow-hidden overflow-ellipsis whitespace-nowrap">
                      {localStorage.userEmail.split("@")[0]}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                      />
                    </svg>
                  </div>
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {/* <Menu.Item>
                    <p className="border-b px-3 py-2">{authData}</p>
                  </Menu.Item> */}
                  <Menu.Item>
                    <button
                      className="w-full text-left px-3 py-2"
                      type="button"
                      onClick={() => {
                        localStorage.clear();
                        setAuthData("");
                        toast.success("Logout Successful", ToastConfig);
                        navigate("/");
                      }}
                    >
                      logout
                    </button>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          )}
          {authData === "" && (
            <button
              type="button"
              className="bg-transparent text-sky-600 rounded-md border border-sky-600 px-3 py-1.5 flex items-center space-x-2"
              onClick={() => navigate("/login")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>Sign In</span>
            </button>
          )}
        </div>
        {/* Login and profile section */}
      </div>
      {/* Search for mobile */}
      <div
        className={`h-20 bg-[#0f0f0f] left-0 right-0 flex sm:hidden justify-center items-center space-x-5 absolute z-30 px-5 transform transition-all ${
          searchBarVisible ? "translate-y-0" : "-translate-y-20"
        }`}
      >
        <form className="w-full flex items-center rounded-3xl bg-gray-200 overflow-hidden">
          <input
            className="w-full px-4 py-2 focus:outline-none"
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            name=""
            id=""
            placeholder="Search"
          />
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 bg-transparent"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </button>
        </form>
        <button type="button" onClick={() => setSearchBarVisible(false)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      {/* Search for mobile */}
    </nav>
  );
};

export default Navbar;
