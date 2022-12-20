import { Fragment, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ActiveLinkContext, SearchStringContext } from "../context/Context";
import { Menu, Transition } from "@headlessui/react";

const Navbar = () => {
  const { setActiveLink } = useContext(ActiveLinkContext);
  const { setSearchString } = useContext(SearchStringContext);

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
          <figure className="w-10">
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
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            name=""
            id=""
            placeholder="Search"
          />
          <button type="submit" onClick={handleSubmit} className="px-4 bg-transparent">
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
          {/* {authData !== null && (
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="flex w-full justify-center items-center rounded-md text-sm font-medium text-white focus:outline-none">
                  <figure className="w-10 h-10 rounded-full overflow-hidden">
                    <img src={authData.photoURL} alt="" />
                  </figure>
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
                      onClick={logOut}
                    >
                      logout
                    </button>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          )} */}
          {true && (
            <button
              type="button"
              className="bg-white rounded-3xl px-5 py-2"
              // onClick={handleLogin}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
