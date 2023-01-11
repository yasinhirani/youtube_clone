import { createContext } from "react";
import {
  ISearchStringContext,
  IActiveLinkContext,
  ITrendingVideosContext,
  IAuthDataContext,
} from "../shared/model/videos.model";

export const ActiveLinkContext = createContext<IActiveLinkContext>({
  activeLink: null,
  setActiveLink: () => {},
});

export const SearchStringContext = createContext<ISearchStringContext>({
  searchString: null,
  setSearchString: () => {},
});

export const TrendingVideosContext = createContext<ITrendingVideosContext>({
  trendingVideos: [],
  setTrendingVideos: () => [],
});

export const AuthDataContext = createContext<IAuthDataContext>({
  authData : "",
  setAuthData: () => {},
});

// export const AuthContext = createContext<any>(null);

// const AuthContextProvider = ({ children }: any) => {
//   const auth = getAuth();

//   const [authData, setAuthData] = useState<any>([]);

//   const logOut = () => {
//     signOut(auth);
//   };

//   useEffect(() => {
//     onAuthStateChanged(auth, (currentUser) => {
//       if (currentUser) {
//         setAuthData(currentUser);
//       }
//     });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return (
//     <AuthContext.Provider value={{ authData, logOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export { AuthContextProvider };
