import CloseIcon from "../../assets/close.svg";

const Modal = ({
  children,
  showModal,
  setShowModal,
  closeIcon = true,
  backgroundColor = "bg-[#FFFFFF]",
  widthFull = false,
  onClose = () => {},
}) => {
  return (
    <div
      className={`justify-center flex fixed inset-0 outline-none focus:outline-none backdrop-blur-sm h-screen py-10 ${
        showModal ? "block" : "hidden"
      } px-2 z-[9990] overflow-y-scroll md:overflow-clip`}
    >
      <div
        className="fixed inset-0 bg-[#070C19] bg-opacity-60"
        onClick={() => {
          onClose();
          setShowModal(false);
        }}
      ></div>
      <div
        className={`relative z-50 md:max-h-[90vh] md:overflow-y-scroll my-auto ${backgroundColor} rounded-lg w-full ${
          widthFull ? "max-w-5xl" : "w-fit"
        } scrollbar`}
      >
        {closeIcon && (
          <div
            className="absolute right-10 top-5 cursor-pointer"
            onClick={() => {
              onClose();
              setShowModal(false);
            }}
          >
            <img src={CloseIcon} alt="close" className="fixed" />
          </div>
        )}

        {/* Content */}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
