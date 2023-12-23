import { CSSProperties, memo, ReactNode } from "react";

import { createPortal } from "react-dom";

interface Props {
  readonly children: ReactNode;
  readonly isOpen: boolean;
  onClose(): void;
  readonly modalRef?: React.RefObject<HTMLElement>;
}

const Modal = ({ children, isOpen, onClose, modalRef }: Props) => {
  const containerStyle: CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: " center",
    alignItems: "center",
  };

  return (
    <>
      {isOpen &&
        createPortal(
          <div
            ref={modalRef as React.RefObject<HTMLDivElement>}
            onClick={onClose}
            style={containerStyle}
          >
            {children}
          </div>,
          document.body
        )}
    </>
  );
};

export default memo(Modal);
