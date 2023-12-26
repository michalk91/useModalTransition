import { useCallback, useState, useLayoutEffect, useRef } from "react";

interface Props {
  /**
   * Changing this to „true” starts opening the animation, changing to “false” starts closing the animation.
   */
  readonly modalOpened: boolean;

  /**
   * Called when the opening animation is ready to start. It is provided a reference to the DOM element (modalElemRef) being transitioned as the argument.
   */
  onOpenAnimationStart?(e?: HTMLElement): void;

  /**
   * Called when the opening animation is finished. It is provided a reference to the DOM element (modalElemRef) being transitioned as the argument.
   */
  onOpenAnimationEnd?(e?: HTMLElement): void;

  /**
   * Called when the closing animation is ready to start. It is provided a reference to the DOM element (firstElemRef) being transitioned as the argument.
   */
  onCloseAnimationStart?(e?: HTMLElement): void;

  /**
   * Called when the closing animation is finished. It is provided a reference to the DOM element (firstElemRef) being transitioned as the argument.
   */
  onCloseAnimationEnd?(e?: HTMLElement): void;

  /**
   * Reference to an element on the page, needed to download the dimensions for the animation.
   */
  readonly firstElemRef: React.RefObject<HTMLElement>;

  /**
   * Reference to an element in the modal, needed to download the dimensions for the animation.
   */
  readonly modalElemRef: React.RefObject<HTMLElement>;

  /**
   *  Opening the animation duration (ms). Default value: 280ms.
   */
  readonly openDuration?: number;

  /**
   *  Closing the animation duration (ms).  Default value: 280ms.
   */
  readonly closeDuration?: number;

  /**
   * You have to pass the result of img tag “onload” event or “onLoadingComplete” from the  NextJS Component. Highly recommended when you make the transition between images.
   */
  readonly imgLoaded?: boolean;

  /**
   * It accepts querySelector selectors. To prevent flickering when you have the transition between images. You can do the same by using “modalRef”.
   */
  readonly modalSelector?: string;

  /**
   * Accept the ref which have access to your Modal. To prevent flickering when you have the transition between images. You can do the same by using “modalSelector”.
   */
  readonly modalRef?: React.RefObject<HTMLElement>;

  /**
   * It hides the first element when the modal is opened.
   */
  readonly hideFirstElem?: boolean;

  /**
   * Open the animation easing function. You can pass here e.g. cubic-bezier. Default value: “ease-in”.
   */
  readonly openEasing?: string;

  /**
   * Close the animation easing function. You can pass here e.g. cubic-bezier. Default value: “ease-out”.
   */
  readonly closeEasing?: string;

  /**
   * TransformOrigin CSS property value. Default value: "center".
   */
  readonly transformOrigin?: "left top" | "center";

  /**
   * A property for debugging. Pause an element before the animation starts. It works on the firstElemRef (opening the animation).
   */
  readonly pauseOnOpen?: boolean;

  /**
   *  A property for debugging. Pause an element before the animation starts. It works on modalElemRef (close animation).
   */
  readonly pauseOnClose?: boolean;

  /**
   * Set it to ‘true’ when you have to disable the opening of the animation. Default value: false.
   */
  readonly disableOpenAnimation?: boolean;

  /**
   * Set it to true when you have to disable closing the animation. Default value: false.
   */
  readonly disableCloseAnimation?: boolean;

  /**
   * This must be the ID of your active element. You need this when you want the first element to become visible after changing its ID. If you have hideFirstElem set to false, you don't need it.
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
