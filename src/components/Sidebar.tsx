import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { ActiveLinkContext } from '../context/Context';

const Sidebar = () => {
  const {activeLink, setActiveLink} = useContext(ActiveLinkContext);
  return (
    <aside className="w-52 min-w-[13rem] hidden md:block bg-[#0f0f0f]">
      <div className="mt-5">
        <ul className="flex flex-col text-white space-y-3 mx-4">
          <li>
            <Link
              to="/"
              className={`${
                activeLink === "Home" && "bg-white bg-opacity-[0.1]"
              } flex items-center space-x-2 px-6 py-2 rounded-lg hover:bg-white hover:bg-opacity-[0.1] transition-all`}
              onClick={() => setActiveLink("Home")}
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
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              to="/history"
              className={`${
                activeLink === "History" && "bg-white bg-opacity-[0.1]"
              } flex items-center space-x-2 px-6 py-2 rounded-lg hover:bg-white hover:bg-opacity-[0.1] transition-all`}
              onClick={() => setActiveLink("History")}
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
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>History</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar