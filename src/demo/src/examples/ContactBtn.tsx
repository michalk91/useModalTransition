import {
  BaseSyntheticEvent,
  useRef,
  useState,
  useCallback,
  CSSProperties,
} from "react";
import useModalTransition from "use-modal-transition";
import Modal from "../Modal";

interface Props {
  onOpenAnimationStartProp?(e?: HTMLElement): void;
  onOpenAnimationEndProp?(e?: HTMLElement): void;
  onCloseAnimationStartProp?(e?: HTMLElement): void;
  onCloseAnimationEndProp?(e?: HTMLElement): void;
  pauseOnClose?: boolean;
  pauseOnOpen?: boolean;
}

function ContactBtn({
  onOpenAnimationStartProp,
  onOpenAnimationEndProp,
  onCloseAnimationStartProp,
  onCloseAnimationEndProp,
  pauseOnClose,
  pauseOnOpen,
}: Props) {
  const firstElemContainerStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  };

  const firstElemStyle: CSSProperties = {
    display: "block",
    flexGrow: "0",
    padding: "20px",
    border: "1px solid black",
    borderRadius: "20px",
    marginBottom: "40px",
  };

  const modalContainerStyle: CSSProperties = {
    position: "relative",
    backgroundColor: "#f0f0f0",
    borderRadius: "20px",
    minWidth: "40vw",
    maxHeight: "100%",
    maxWidth: "100%",
    border: "1px solid black",
  };

  const closeBtnStyle: CSSProperties = {
    position: "absolute",
    borderRadius: "20px",
    width: "90px",
    height: "90px",
    border: "none",
    fontSize: "40px",
    top: "0",
    left: "calc(100% - 90px)",
  };

  const submitBtnStyle: CSSProperties = {
    display: "block",
    width: "80%",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "10px",
  };

  const inputStyles: CSSProperties = {
    boxSizing: "border-box",
    display: "block",
    margin: "20px auto",
    padding: "10px",
    maxHeight: "100%",
    maxWidth: "100%",
    minWidth: "80%",
  };

  const textInBtnStyle: CSSProperties = {
    textAlign: "center",
    fontSize: "3rem",
  };

  const flexChildStyle: CSSProperties = { flexBasis: "100%", margin: "40px" };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [animating, setAnimating] = useState<boolean>(false);

  const firstElemRef = useRef<HTMLButtonElement>(null);
  const modalElemRef = useRef<HTMLImageElement>(null);

  const onOpenAnimationStart = useCallback((): void => {
    onOpenAnimationStartProp && onOpenAnimationStartProp();
    setAnimating(true);
  }, [onOpenAnimationStartProp]);

  const onOpenAnimationEnd = useCallback((): void => {
    onOpenAnimationEndProp && onOpenAnimationEndProp();
  }, [onOpenAnimationEndProp]);

  const onCloseAnimationStart = useCallback((): void => {
    onCloseAnimationStartProp && onCloseAnimationStartProp();
  }, [onCloseAnimationStartProp]);

  const onCloseAnimationEnd = useCallback((): void => {
    onCloseAnimationEndProp && onCloseAnimationEndProp();
    setAnimating(false);
  }, [onCloseAnimationEndProp]);

  useModalTransition({
    modalOpened: isOpen,
    onOpenAnimationEnd,
    onOpenAnimationStart,
    onCloseAnimationEnd,
    onCloseAnimationStart,
    firstElemRef,
    modalElemRef,
    openEasing: "cubic-bezier(.42,.97,.52,1.49)",
    pauseOnClose,
    pauseOnOpen,
  });

  const onClose = (): void => {
    setIsOpen(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div
          onClick={(e: BaseSyntheticEvent): void => {
            e.stopPropagation();
          }}
          ref={modalElemRef}
          style={modalContainerStyle}
        >
          <button
            style={closeBtnStyle}
            onClick={(): void => {
              setIsOpen(false);
            }}
          >
            X
          </button>
          <form style={{ padding: " 10%" }}>
            <p style={textInBtnStyle}>Write to Us!</p>
            <input
              style={inputStyles}
              type="text"
              placeholder="Your name"
            ></input>
            <input
              style={inputStyles}
              type="text"
              placeholder="Your subname"
            ></input>
            <textarea
              rows={10}
              style={inputStyles}
              placeholder="Your message"
              name="message"
            />
            <button style={submitBtnStyle} type="submit">
              Send
            </button>
          </form>
        </div>
      </Modal>
      <div style={firstElemContainerStyle} className="App">
        <p style={flexChildStyle}>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. At
          dignissimos quo corrupti harum illo alias porro, sint, illum sapiente
          possimus repellendus eveniet consequatur sit accusamus molestias
          soluta corporis quidem in. Lorem, ipsum dolor sit amet consectetur
          adipisicing elit. At dignissimos quo corrupti harum illo alias porro,
          sint, illum sapiente possimus repellendus eveniet consequatur sit
          accusamus molestias soluta corporis quidem in. Lorem, ipsum dolor sit
          amet consectetur adipisicing elit. At dignissimos quo corrupti harum
          illo alias porro, sint, illum sapiente possimus repellendus eveniet
          consequatur sit accusamus molestias soluta corporis quidem in. Lorem,
          ipsum dolor sit amet consectetur adipisicing elit. At dignissimos quo
          corrupti harum illo alias porro, sint, illum sapiente possimus
          repellendus eveniet consequatur sit accusamus molestias soluta
          corporis quidem in. Lorem, ipsum dolor sit amet consectetur
          adipisicing elit. At dignissimos quo corrupti harum illo alias porro,
          sint, illum sapiente possimus repellendus eveniet consequatur sit
          accusamus molestias soluta corporis quidem in.
        </p>
        <button
          data-id="firstBtn"
          style={firstElemStyle}
          ref={firstElemRef}
          onClick={(): void => {
            setIsOpen(true);
          }}
        >
          <p style={{ opacity: animating ? "0" : "1" }}>Write to Us! </p>
        </button>
      </div>
    </>
  );
}

export default ContactBtn;
