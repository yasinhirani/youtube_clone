import { Fragment, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ActiveLinkContext,
  AuthDataContext,
  SearchStringContext,
} from "../context/Context";
import { Menu, Transition } from "@headlessui/react";

const Navbar = () => {
  const { setActiveLink } = useContext(ActiveLinkContext);
  const { setSearchString } = useContext(SearchStringContext);
  const { authData, setAuthData } = useContext(AuthDataContext);

  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    navigate("/search");
    setSearchString(searchValue);
  };

  return (
    <nav className="flex items-center h-20 bg-[#0f0f0f] fixed top-0 z-10 w-full">
      <div className="w-full flex justify-between items-center space-x-5 px-6 py-2">
        <Link
          to="/"
          onClick={() => {
            setActiveLink("Home");
          }}
        >
          <figure className="w-14">
            <img
              className="w-full h-auto"
              src="/images/youtube_logo.png"
              alt="Youtube"
            />
          </figure>
        </Link>
        <form className="w-72 flex items-center rounded-3xl bg-gray-200 overflow-hidden">
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
        <div>
          {authData !== "" && (
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="flex w-full justify-center items-center rounded-md text-lg font-medium text-white focus:outline-none">
                  <div className="flex items-center space-x-2">
                    <span className="capitalize">
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
                  <Menu.Item>
                    <button
                      className="w-full text-left px-3 py-2"
                      type="button"
                      onClick={() => {
                        localStorage.clear();
                        setAuthData("");
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
      </div>
    </nav>
  );
};

export default Navbar;
