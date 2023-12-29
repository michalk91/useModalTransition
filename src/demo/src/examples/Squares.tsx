import { useRef, useState, CSSProperties } from "react";
import useModalTransition from "use-modal-transition";
import Modal from "../Modal";

interface Props {
  onOpenAnimationStart?(e: HTMLElement): void;
  onOpenAnimationEnd?(e: HTMLElement): void;
  onCloseAnimationStart?(e: HTMLElement): void;
  onCloseAnimationEnd?(e: HTMLElement): void;
  pauseOnClose?: boolean;
  pauseOnOpen?: boolean;
}

function Squares({
  onOpenAnimationStart,
  onOpenAnimationEnd,
  onCloseAnimationStart,
  onCloseAnimationEnd,
  pauseOnClose,
  pauseOnOpen,
}: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const firstElemRef = useRef<HTMLDivElement>(null);
  const modalElemRef = useRef<HTMLDivElement>(null);

  useModalTransition({
    modalOpened: isOpen,
    onOpenAnimationEnd,
    onOpenAnimationStart,
    onCloseAnimationEnd,
    onCloseAnimationStart,
    firstElemRef,
    modalElemRef,
    pauseOnClose,
    pauseOnOpen,
  });

  const onClose = (): void => {
    setIsOpen(false);
  };

  const lastSquareStyle: CSSProperties = {
    position: "relative",
    backgroundColor: "blue",
    width: "60vh",
    height: "60vh",
    maxHeight: "100%",
    maxWidth: "100%",
  };

  const firstSquareStyle: CSSProperties = {
    width: "250px",
    height: "250px",
    backgroundColor: "blue",
  };

  const paddingStyle: CSSProperties = { padding: "5%" };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div
          data-id="lastSquare"
          onClick={() => {
            setIsOpen(false);
          }}
          ref={modalElemRef}
          style={lastSquareStyle}
        ></div>
      </Modal>
      <div style={paddingStyle}>
        <div
          data-id="firstSquare"
          style={firstSquareStyle}
          ref={firstElemRef}
          onClick={() => {
            setIsOpen(true);
          }}
        ></div>
      </div>
    </>
  );
}

export default Squares;
