export interface IActiveLinkContext {
  activeLink: string | null;
  setActiveLink: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface ISearchStringContext {
  searchString: string | null;
  setSearchString: React.Dispatch<React.SetStateAction<string | null>>;
}

export interface ITrendingVideosContext {
  trendingVideos: IVideos[];
  setTrendingVideos: React.Dispatch<React.SetStateAction<IVideos[]>>;
}

export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface IVideos {
  video_id: string;
  title: string;
  author: string;
  number_of_views: number;
  video_length: string;
  description: string;
  is_live_content?: any;
  published_time: string;
  channel_id: string;
  category?: any;
  type: string;
  keywords: any[];
  thumbnails: Thumbnail[];
}

// For search Result
export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface RichThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface ChannelThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface Video {
  videoId: string;
  title: string;
  lengthText: string;
}

export interface ISearchResult {
  type: string;
  channelId: string;
  title: string;
  channelTitle: string;
  description: string;
  thumbnail: Thumbnail[];
  videoCount: string;
  subscriberCount: string;
  videoId: string;
  viewCount: string;
  publishedText: string;
  lengthText: string;
  richThumbnail: RichThumbnail[];
  channelThumbnail: ChannelThumbnail[];
  playlistId: string;
  videos: Video[];
}

// For search recommendations
export interface Id {
  kind: string;
  videoId: string;
}

export interface Medium {
  url: string;
  width: number;
  height: number;
}

export interface Thumbnails {
  medium: Medium;
}

export interface Snippet {
  publishedAt: Date;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  liveBroadcastContent: string;
  publishTime: Date;
}

export interface IRecommendations {
  id: Id;
  snippet: Snippet;
}

// Channel Detail
export interface Medium {
  url: string;
  width: number;
  height: number;
}

export interface Thumbnails {
  medium: Medium;
}

export interface Snippet {
  title: string;
  description: string;
  customUrl: string;
  publishedAt: Date;
  thumbnails: Thumbnails;
}

export interface Statistics {
  viewCount: string;
  subscriberCount: string;
}

export interface IChannelDetails {
  id: string;
  snippet: Snippet;
  statistics: Statistics;
}

// For video details
export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface IVideoDetails {
  id: string;
  channelTitle: string;
  title: string;
  channelId: string;
  description: string;
  thumbnail: Thumbnail[];
  viewCount: string;
  publishDate: string;
}

// For history list
export interface IHistories {
  videoId: string;
  thumbnail: string;
  channelName: string;
  title: string;
  time: string;
  description: string;
}

// Channel Page details
export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface Banner {
  url: string;
  width: number;
  height: number;
}

export interface MobileBanner {
  url: string;
  width: number;
  height: number;
}

export interface Image {
  banner: Banner[];
  mobileBanner: MobileBanner[];
}

export interface Meta {
  title: string;
  description: string;
  thumbnail: Thumbnail[];
  image: Image;
  subscriberCount: string;
  keywords: string[];
  isFamilySafe: boolean;
  availableCountries: string[];
}

export interface VideoThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface Data {
  videoId: string;
  title: string;
  description: string;
  viewCount: string;
  publishedText: string;
  lengthText: string;
  thumbnail: VideoThumbnail[];
}

export interface IChannel {
  meta: Meta;
  data: Data[];
}
