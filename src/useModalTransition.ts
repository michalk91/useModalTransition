import { useCallback, useState, useLayoutEffect, useRef } from "react";

interface Props {
  /**
   * You should pass the react state here. Changing this to „true” starts open animation, changing to “false” starts close animation.
   */
  readonly modalOpened: boolean;
  /**
   * You can pass function here. Called when the open animation is ready to start.
   */
  onOpenAnimationStart?(e?: HTMLElement): void;
  /**
   * Optional. You can pass function here. Called when the open animation is finished.
   */
  onOpenAnimationEnd?(e?: HTMLElement): void;
  /**
   *  Optional. You can pass function here. Called when the close animation is ready to start.
   */
  onCloseAnimationStart?(e?: HTMLElement): void;
  /**
   * Optional.  You can pass function here. Called when the close animation is finished.
   */
  onCloseAnimationEnd?(e?: HTMLElement): void;
  /**
   * You should pass the react useRef here. Reference to element on page, needed to download dimensions for animation.
   */
  readonly firstElemRef: React.RefObject<HTMLElement>;
  /**
   * You should pass the react useRef here. Reference to element in modal, needed to download dimensions for animation.
   */
  readonly modalElemRef: React.RefObject<HTMLElement>;
  /**
   *  Optional. Opening animation duration (ms). Default value: 280ms.
   */
  readonly openDuration?: number;
  /**
   *  Optional. Closing animation duration (ms).  Default value: 280ms.
   */
  readonly closeDuration?: number;
  /**
   * Optional. You have to pass result of img tag “onload” event or “onLoadingComplete” from <Image> NextJS Component.
   Highly Recommended when you make transition between images.
   */
  readonly imgLoaded?: boolean;
  /**
   * Optional. Accepts querySelector selectors. To prevent flickering when you have transition between images.  You can do the same by use “modalElemRef”
   */

  readonly modalSelector?: string;
  /**
   * Optional. It hides first element when modal is opened. Default value: true.
   */
  readonly hideFirstElem?: boolean;
  /**
   * Optional. Accepts react useRef. To prevent flickering when you have transition between images.  You can do the same by use “modalSelector”.
   */
  readonly modalRef?: React.RefObject<HTMLElement>;
  /**
   * Optional. Close animation easing function. You can pass here e.g. cubic-bezier. Default value: "ease-out".
   */
  readonly closeEasing?: string;
  /**
   * Optional. Open animation easing function. You can pass here e.g. cubic-bezier. Default value: "ease-in".
   */
  readonly openEasing?: string;
  /**
   * Optional. TransformOrigin CSS property value. Default value: "center".
   */
  readonly transformOrigin?: "left top" | "center";
  /**
   * Optional. Property for debugging. Pause element before animation start. Work on firstElemRef. (open animation).
   */
  readonly pauseOnOpen?: boolean;
  /**
   * Optional. Property for debugging. Pause element before animation start. Work on modalElemRef (close animation).
   */
  readonly pauseOnClose?: boolean;
  /**
   * Optional. Set it to true when you have to disable open animation.
   */
  readonly disableOpenAnimation?: boolean;
  /**
   * Optional. Set it to true when you have to disable close animation.
   */
  readonly disableCloseAnimation?: boolean;
  /**
   * Optional. You can pass the react state here. This must be the id of your active element. You need this when you want the first element to become visible after changing the element (id). If you have hideFirstElem set to false, you don't need it.
   */
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
  modalSelector,
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
        : document.querySelector<HTMLElement>(`${modalSelector}`);

    //hide modal when image isn't loaded
    if (imgLoaded !== undefined) {
      if (modal && !imgLoaded) modal.style.opacity = "0";
      else if (modal && imgLoaded) {
        modal.style.opacity = "1";
      }
    }

    if (firstElem) previousFirstElem.current = firstElem;

    if (modalElem) {
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
