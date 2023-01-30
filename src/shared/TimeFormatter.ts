const TimeFormatter = (milliseconds: number) => {
  const ms = milliseconds;
  const hrs = Math.floor(ms / 1000 / 3600);
  const min = Math.floor(((ms / 1000) % 3600) / 60);
  const sec = Math.floor(((ms / 1000) % 3600) % 60);
  if (hrs > 0) {
    return hrs + ":" + min + ":" + sec;
  } else {
    return min + ":" + sec;
  }
};

export default TimeFormatter;
