const Banner = ({ image }) => {
  return (
    <img
      src={image}
      alt="Banner"
      className="h-72 w-full rounded-3xl rounded-r-none"
    />
  );
};

export default Banner;
