import {
  BaseSyntheticEvent,
  CSSProperties,
  useEffect,
  useRef,
  useState,
  ComponentState,
} from "react";
import useModalTransition from "../../../useModalTransition";
import Modal from "../Modal";

interface Props {
  onOpenAnimationStart?(e?: HTMLElement): void;
  onOpenAnimationEnd?(e?: HTMLElement): void;
  onCloseAnimationStart?(e?: HTMLElement): void;
  onCloseAnimationEnd?(e?: HTMLElement): void;
  pauseOnClose?: boolean;
  pauseOnOpen?: boolean;
}

interface StateArgs {
  isOpen: boolean;
  imgLoaded: boolean;
  activeIndex: number;
  animating: boolean;
}

function Gallery({
  onOpenAnimationStart,
  onOpenAnimationEnd,
  onCloseAnimationStart,
  onCloseAnimationEnd,
  pauseOnClose,
  pauseOnOpen,
}: Props) {
  const [modalInfo, setModalInfo] = useState<ComponentState>(
    (state: StateArgs) => ({
      ...state,
      isOpen: false,
      imgLoaded: false,
      activeIndex: 0,
      animating: false,
    })
  );

  const images: { src: string }[] = [
    {
      src: "https://cdn.pixabay.com/photo/2023/03/16/11/45/gdansk-7856554_1280.jpg",
    },
    {
      src: "https://cdn.pixabay.com/photo/2022/05/28/11/27/gdansk-7227096_1280.jpg",
    },
    {
      src: "https://cdn.pixabay.com/photo/2022/10/30/11/43/baltic-sea-7557291_1280.jpg",
    },

    {
      src: "https://cdn.pixabay.com/photo/2018/10/28/20/51/gdansk-3779874_1280.jpg",
    },
    {
      src: "https://cdn.pixabay.com/photo/2015/11/15/21/19/gdansk-1044857_1280.jpg",
    },
    {
      src: "https://cdn.pixabay.com/photo/2015/08/15/23/49/poland-890355_1280.jpg",
    },

    {
      src: "https://cdn.pixabay.com/photo/2015/02/10/11/14/the-seagulls-630915_1280.jpg",
    },
    {
      src: "https://cdn.pixabay.com/photo/2016/12/29/08/24/sea-1938070_1280.jpg",
    },
    {
      src: "https://cdn.pixabay.com/photo/2019/11/12/21/35/gdansk-4622104_1280.jpg",
    },

    {
      src: "https://cdn.pixabay.com/photo/2018/08/23/09/24/gdansk-3625496_1280.jpg",
    },
    {
      src: "https://cdn.pixabay.com/photo/2022/09/05/16/17/baltic-sea-7434540_1280.jpg",
    },
    {
      src: "https://cdn.pixabay.com/photo/2017/07/20/23/33/sopot-2524136_1280.jpg",
    },

    {
      src: "https://cdn.pixabay.com/photo/2022/02/06/20/31/hotel-6998046_1280.jpg",
    },
    {
      src: "https://cdn.pixabay.com/photo/2015/05/04/10/35/the-pier-752170_1280.jpg",
    },
    {
      src: "https://cdn.pixabay.com/photo/2018/03/26/17/30/architecture-3263347_1280.jpg",
    },
    {
      src: "https://cdn.pixabay.com/photo/2017/08/03/19/15/kosciuszko-square-2577963_1280.jpg",
    },
    {
      src: "https://cdn.pixabay.com/photo/2014/04/16/20/14/cliff-325875_1280.jpg",
    },
    {
      src: "https://cdn.pixabay.com/photo/2019/05/14/22/17/cliff-4203687_1280.jpg",
    },
  ];

  const firstElemRef = useRef<HTMLImageElement>(null);
  const modalElemRef = useRef<HTMLImageElement>(null);
  const modalRef = useRef<HTMLElement>(null);

  useModalTransition({
    modalOpened: modalInfo.isOpen,
    onOpenAnimationEnd,
    onOpenAnimationStart,
    onCloseAnimationEnd,
    onCloseAnimationStart,
    firstElemRef,
    modalElemRef,
    imgLoaded: modalInfo.imgLoaded,
    openEasing: "cubic-bezier(.25,.75,.5,1.25)",
    pauseOnOpen,
    pauseOnClose,
    activeIndex: modalInfo.activeIndex,
    modalRef,
  });

  const onClose = (): void => {
    setModalInfo((state: StateArgs) => ({ ...state, isOpen: false }));
  };

  useEffect(() => {
    if (!modalInfo.isOpen)
      setModalInfo((state: StateArgs) => ({ ...state, imgLoaded: false }));
  }, [modalInfo.isOpen]);

  const containerStyle: CSSProperties = {
    backgroundColor: "#FAF9F7",
    columnCount:
      window.innerWidth > 1200 ? "4" : window.innerWidth > 650 ? "3" : "2",
    padding: "30px",
  };

  const firstImgStyle: CSSProperties = {
    border: "1px solid black",
    borderRadius: "10px",
    maxWidth: "100%",
    display: "block",
    marginBottom: "20px",
    userSelect: "none",
  };

  const modalImgStyle: CSSProperties = {
    borderRadius: "10px",
    width: "auto",
    height: "auto",
    maxHeight: "100%",
    maxWidth: "100%",
    border: "2px solid black",
  };

  const buttonStyle: CSSProperties = {
    position: "fixed",
    fontSize: "40px",
    zIndex: "10",
    backgroundColor: "white",
    padding: "5px",
    userSelect: "none",
  };
  console.log("modal", modalInfo.animating);
  return (
    <>
      <Modal modalRef={modalRef} isOpen={modalInfo.isOpen} onClose={onClose}>
        <div
          style={{ right: "5% ", ...buttonStyle }}
          onClick={(e: BaseSyntheticEvent) => {
            e.stopPropagation();
            setModalInfo((state: StateArgs) => ({
              ...state,
              activeIndex:
                state.activeIndex < images.length - 1
                  ? state.activeIndex + 1
                  : state.activeIndex,
            }));
          }}
        >
          &gt;
        </div>
        <div
          style={{
            left: "5% ",
            ...buttonStyle,
          }}
          onClick={(e: BaseSyntheticEvent) => {
            e.stopPropagation();
            setModalInfo((state: StateArgs) => ({
              ...state,
              activeIndex:
                state.activeIndex > 0
                  ? state.activeIndex - 1
                  : state.activeIndex,
            }));
          }}
        >
          &lt;
        </div>
        {images.map((item, index) => (
          <img
            key={index}
            onLoad={(): void => {
              index === modalInfo.activeIndex &&
                setModalInfo((state: StateArgs) => ({
                  ...state,
                  imgLoaded: true,
                }));
            }}
            onClick={(): void => {
              setModalInfo((state: StateArgs) => ({ ...state, isOpen: false }));
            }}
            ref={modalInfo.activeIndex === index ? modalElemRef : null}
            src={item.src}
            alt={`modal_${index}`}
            style={{
              display: index === modalInfo.activeIndex ? "block" : "none",
              ...modalImgStyle,
            }}
          />
        ))}
      </Modal>
      <div style={containerStyle} className="App">
        {images.map((item, index) => (
          <img
            key={index}
            onClick={() => {
              setModalInfo((state: StateArgs) => ({
                ...state,
                isOpen: true,
                activeIndex: index,
              }));
            }}
            ref={modalInfo.activeIndex === index ? firstElemRef : null}
            src={item.src}
            alt={`first_${index}`}
            style={firstImgStyle}
          />
        ))}
      </div>
    </>
  );
}

export default Gallery;
