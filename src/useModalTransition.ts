import { useCallback, useState, useLayoutEffect, useRef } from "react";

interface Props {
  readonly modalOpened?: boolean;
  onOpenAnimationStart?(e?: HTMLElement): void;
  onOpenAnimationEnd?(e?: HTMLElement): void;
  onCloseAnimationStart?(e?: HTMLElement): void;
  onCloseAnimationEnd?(e?: HTMLElement): void;
  readonly firstElemRef: React.RefObject<HTMLElement>;
  readonly modalElemRef: React.RefObject<HTMLElement>;
  readonly openDuration?: number;
  readonly closeDuration?: number;
  readonly imgLoaded?: boolean;
  readonly modalDataAttr?: string;
  readonly hideFirstElem?: boolean;
  readonly modalRef?: React.RefObject<HTMLElement>;
  readonly closeEasing?: string;
  readonly openEasing?: string;
  readonly transformOrigin?: "left top" | "center";
  readonly pauseOnOpen?: boolean;
  readonly pauseOnClose?: boolean;
  readonly disableOpenAnimation?: boolean;
  readonly disableCloseAnimation?: boolean;
  readonly activeIndex?: number | string;
}

interface Delta {
  translateX: number;
  translateY: number;
  scaleWidth: number;
  scaleHeight: number;
}

const getDelta = (
  first: DOMRect,
  second: DOMRect,
  transformOrigin: "left top" | "center"
): Delta | void => {
  if (transformOrigin === "left top") {
    return {
      translateY: first.top - second.top,
      translateX: first.left - second.left,
      scaleWidth: first.width / second.width,
      scaleHeight: first.height / second.height,
    };
  } else if (transformOrigin === "center") {
    return {
      translateY:
        first.top + first.height / 2 - (second.top + second.height / 2),
      translateX:
        first.left + first.width / 2 - (second.left + second.width / 2),
      scaleWidth: first.width / second.width,
      scaleHeight: first.height / second.height,
    };
  }
};

const useModalTransition = ({
  modalOpened,
  onOpenAnimationStart,
  onOpenAnimationEnd,
  onCloseAnimationStart,
  onCloseAnimationEnd,
  firstElemRef,
  modalElemRef,
  openDuration = 280,
  closeDuration = 280,
  imgLoaded,
  modalDataAttr,
  hideFirstElem = true,
  modalRef,
  activeIndex,
  closeEasing = "ease-out",
  openEasing = "ease-in",
  transformOrigin = "center",
  pauseOnClose = false,
  pauseOnOpen = false,
  disableOpenAnimation = false,
  disableCloseAnimation = false,
}: Props) => {
  const previousFirstElem = useRef<HTMLElement>(); //cache the element to be able to change its styles
  const previousModalElem = useRef<HTMLElement>();
  const previousModalDim = useRef<DOMRect>(); //cache an elem in modal dimensions for close animation;

  const [restartAnim, setRestartAnim] = useState(false);

  const restartAnimation = useCallback((): void => {
    setRestartAnim((state) => !state);
  }, []);

  const invertAndPlay = useCallback(
    (delta: Delta, elem: HTMLElement, animDir: "open" | "close"): void => {
      const { translateX, translateY, scaleHeight, scaleWidth } = delta;

      if (
        (scaleHeight === 0 && scaleWidth === 0) ||
        (translateX === 0 && translateY === 0)
      )
        return;

      const animation = elem.animate(
        [
          {
            transform: ` translate(${translateX}px, ${translateY}px) scale(${scaleWidth}, ${scaleHeight})`,
          },
          {
            transform: `none`,
          },
        ],
        {
          easing: animDir === "open" ? openEasing : closeEasing,
          duration: animDir === "open" ? openDuration : closeDuration,
        }
      );

      if (animDir === "open") {
        if (pauseOnOpen) {
          animation.pause();
        } else if (!pauseOnOpen) {
          animation.play();
        }
      }
      if (animDir === "close") {
        if (pauseOnClose) {
          animation.pause();
        } else if (!pauseOnClose) {
          animation.play();
        }
      }

      animation.ready.then(() => {
        if (animDir === "open")
          onOpenAnimationStart && onOpenAnimationStart(elem);
        else if (animDir === "close")
          onCloseAnimationStart && onCloseAnimationStart(elem);
      });
      animation.onfinish = () => {
        if (animDir === "open") {
          onOpenAnimationEnd && onOpenAnimationEnd(elem);
        } else if (animDir === "close") {
          onCloseAnimationEnd && onCloseAnimationEnd(elem);
        }
      };
    },
    []
  );

  const openAnimation = useCallback(
    (firstElem: HTMLElement, modalElem: HTMLElement) => {
      if (!modalElem || !firstElem) return;
      console.log("first elem", firstElem, hideFirstElem);
      if (hideFirstElem) {
        firstElem.style.opacity = "0";
      }

      const firstDim = firstElem.getBoundingClientRect();
      const modalDim = modalElem.getBoundingClientRect();

      const animDir = "open";
      const delta = getDelta(firstDim, modalDim, transformOrigin);

      if (delta) invertAndPlay(delta, modalElem, animDir);
    },
    [hideFirstElem, getDelta]
  );

  const closeAnimation = useCallback(
    (firstElem: HTMLElement, prevModalElemDim: DOMRect) => {
      const firstDim = firstElem.getBoundingClientRect();
      const animDir = "close";
      const delta = getDelta(prevModalElemDim, firstDim, transformOrigin);
      if (delta) invertAndPlay(delta, firstElem, animDir);
    },
    []
  );

  useLayoutEffect(() => {
    if (previousFirstElem && previousFirstElem.current && hideFirstElem) {
      (previousFirstElem.current as HTMLElement).style.opacity = "1";
    }
  }, [activeIndex, modalOpened]);

  useLayoutEffect(() => {
    const firstElem = firstElemRef?.current;
    const modalElem = modalElemRef?.current;

    const modal =
      modalRef && modalRef.current
        ? modalRef?.current
        : document.querySelector<HTMLElement>(`[data-id=${modalDataAttr}]`);

    //hide modal when image isn't loaded
    if (imgLoaded !== undefined) {
      if (modal && !imgLoaded) modal.style.opacity = "0";
      else if (modal && imgLoaded) {
        modal.style.opacity = "1";
      }
    }

    if (firstElem) previousFirstElem.current = firstElem;

    if (modalElem) {
      previousModalElem.current = modalElem;
      previousModalDim.current = modalElem.getBoundingClientRect();
    }

    if (imgLoaded !== undefined) {
      if (
        modalOpened &&
        imgLoaded &&
        firstElem &&
        modalElem &&
        !disableOpenAnimation
      ) {
        openAnimation(firstElem, modalElem);
      } else if (
        !modalOpened &&
        imgLoaded &&
        firstElem &&
        previousModalDim &&
        previousModalDim.current &&
        !disableCloseAnimation
      ) {
        closeAnimation(firstElem, previousModalDim.current);
      }
    } else if (imgLoaded === undefined) {
      if (modalOpened && firstElem && modalElem && !disableOpenAnimation) {
        openAnimation(firstElem, modalElem);
      } else if (
        !modalOpened &&
        firstElem &&
        previousModalDim &&
        previousModalDim.current &&
        !disableCloseAnimation
      ) {
        closeAnimation(firstElem, previousModalDim.current);
      }
    }
  }, [modalOpened, imgLoaded, restartAnim]);

  return { restartAnimation };
};

export default useModalTransition;
