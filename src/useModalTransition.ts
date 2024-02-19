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
  } else return;
};

const isDeltaCorrect = (delta: Delta) => {
  const { translateX, translateY, scaleHeight, scaleWidth } = delta;

  if (
    (scaleHeight === 1 && scaleWidth === 1) ||
    (translateX === 0 && translateY === 0)
  )
    return false;
  else return true;
};

const invertAndPlay = (
  delta: Delta,
  elem: HTMLElement,
  easing: string,
  duration: number,
  pause: boolean,
  onAnimationStart?: (e?: HTMLElement) => void,
  onAnimationEnd?: (e?: HTMLElement) => void
) => {
  const { translateX, translateY, scaleHeight, scaleWidth } = delta;

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
      easing,
      duration,
    }
  );

  animation.pause();

  if (animation.pending) {
    onAnimationStart && onAnimationStart(elem);
  }
  animation.ready.then(() => {
    !pause && animation.play();
  });
  animation.onfinish = () => {
    onAnimationEnd && onAnimationEnd(elem);
  };
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
  const previousFirstElem = firstElemRef.current; //cache the element to be able to change its styles
  const previousModalDim = !modalOpened
    ? modalElemRef.current?.getBoundingClientRect()
    : undefined; //cache an elem in modal dimensions for close animation;
  const animFinished = useRef<boolean>(false); //after changing modalOpened, the animation should run only once

  const [restartAnim, setRestartAnim] = useState(false);

  const restartAnimation = useCallback(() => {
    setRestartAnim((state) => !state);
  }, []);

  useLayoutEffect(() => {
    animFinished.current = false;
  }, [modalOpened, restartAnim]);

  useLayoutEffect(() => {
    if (previousFirstElem && hideFirstElem) {
      previousFirstElem.style.opacity = "1";
    }
  }, [activeIndex, modalOpened, hideFirstElem, previousFirstElem]);

  useLayoutEffect(() => {
    const modal =
      imgLoaded !== undefined && modalRef
        ? modalRef?.current
        : modalSelector &&
          document.querySelector<HTMLElement>(`${modalSelector}`);
    const firstElem = firstElemRef?.current;
    const modalElem = modalElemRef?.current;

    const firstDim = firstElem && firstElem.getBoundingClientRect();
    const modalDim = modalElem && modalElem.getBoundingClientRect();

    //hide modal and element in modal when image isn't loaded
    if (imgLoaded !== undefined && modal && imgLoaded === false) {
      modal.style.opacity = "0";
    }

    if (
      !animFinished.current &&
      !disableOpenAnimation &&
      modal &&
      modalOpened &&
      imgLoaded !== undefined &&
      firstElem &&
      modalElem
    ) {
      if (!imgLoaded) return;

      modal.style.opacity = "1";

      if (hideFirstElem) {
        firstElem.style.opacity = "0";
      }

      const delta = getDelta(
        firstDim as DOMRect,
        modalDim as DOMRect,
        transformOrigin
      );

      if (!delta || !isDeltaCorrect(delta)) return;

      invertAndPlay(
        //open animation
        delta,
        modalElem,
        openEasing,
        openDuration,
        pauseOnOpen,
        onOpenAnimationStart,
        onOpenAnimationEnd
      );
      animFinished.current = true;
    } else if (
      imgLoaded === undefined &&
      modalElem &&
      !animFinished.current &&
      firstElem
    ) {
      const delta = getDelta(
        firstDim as DOMRect,
        modalDim as DOMRect,
        transformOrigin
      );

      if (hideFirstElem) {
        firstElem.style.opacity = "0";
      }

      if (!delta || !isDeltaCorrect(delta)) return;

      invertAndPlay(
        //open animation without using the imgLoaded prop
        delta,
        modalElem,
        openEasing,
        openDuration,
        pauseOnOpen,
        onOpenAnimationStart,
        onOpenAnimationEnd
      );
      animFinished.current = true;
    }

    if (
      !animFinished.current &&
      !modalOpened &&
      !pauseOnOpen &&
      firstElem &&
      previousModalDim &&
      !disableCloseAnimation
    ) {
      const delta = getDelta(
        previousModalDim,
        firstDim as DOMRect,
        transformOrigin
      );

      if (!delta || !isDeltaCorrect(delta)) return;

      invertAndPlay(
        //close animation
        delta,
        firstElem,
        closeEasing,
        closeDuration,
        pauseOnClose,
        onCloseAnimationStart,
        onCloseAnimationEnd
      );
      animFinished.current = true;
    }
  }, [
    modalOpened,
    imgLoaded,
    closeDuration,
    closeEasing,
    disableCloseAnimation,
    disableOpenAnimation,
    firstElemRef,
    modalElemRef,
    hideFirstElem,
    modalRef,
    modalSelector,
    previousModalDim,
    onOpenAnimationStart,
    onOpenAnimationEnd,
    onCloseAnimationStart,
    onCloseAnimationEnd,
    openDuration,
    openEasing,
    pauseOnOpen,
    pauseOnClose,
    transformOrigin,
    animFinished,
    restartAnim,
  ]);

  return { restartAnimation };
};

export default useModalTransition;
