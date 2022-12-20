const formatViews = (num: number) => {
  const formattedViews = new Intl.NumberFormat("en-US", {
    notation: "compact",
  }).format(num);
  return formattedViews;
};
export default formatViews;