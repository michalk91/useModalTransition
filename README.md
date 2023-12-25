## useModalTransition hook
This is a react hook for adding transition between an element on your page and an element in modal.
	
## Features
-	Animate what is impossible in pure css,
-	Based on the “flip animation technique”,
-	Support react and nextjs,
-	It's a hook, so there's no problem with the container ruining your style
-	Use the Web Animations API (WAAPI),
-	Lightweight,
-	Wait until image in modal is loaded,
-	Images in Modal height and width property can be set to “auto” (when “imgLoaded” added),
-	Works with “scrset” (when “imgLoaded” added),
-	Many configuration options,
-	Tested in Cypress

## Demo
 https://use-modal-transition.vercel.app/

	
## Setup
To run this project, install it locally using npm:

```
npm i use-modal-transition
```

## Quick start
1) Import the “useModalTransition” hook:
```javascript
import useModalTransition from "use-modal-transition";
```

2) Assign refs to the elements you want to animate.
```javascript
const firstElemRef = useRef<HTMLDivElement>(null);
const modalElemRef = useRef<HTMLDivElement>(null);
const modalRef = useRef<HTMLElement>(null);

<Modal modalRef={modalRef} isOpen={isOpen} onClose={onClose}>
   <div ref={modalElemRef}></div>
</Modal>

<div ref={firstElemRef}></div> 
```

3)	Create a state for the modal
```javascript
const [isOpen, setIsOpen] = useState(false);
```

4)	Call the hook and pass the references and modal state
```javascript
 useModalTransition({
    modalOpened: isOpen,
    firstElemRef,
    modalElemRef,
    modalRef,
  });
```

5)	Change the state onClick to start the animation.
```javascript
 return (
    <>
    <Modal modalRef={modalRef} isOpen={isOpen} onClose={onClose}>
        <div
          onClick={() => {
            setIsOpen(false);
          }}
          ref={modalElemRef}>
        </div>
     </Modal>
      
     <div
       ref={firstElemRef}
       onClick={() => {
       setIsOpen(true);
       }}>
     </div>
 
    </>
  );
```

## Usage details

Property       | Default      | Type          | Details
------------- | ------------- | ------------- | -------------
modalOpened | -  | boolean  | Changing this to „true” starts opening the animation, changing to “false” starts closing the animation.
firstElemRef(ref)  | -  | React.RefObject<HTMLElement>  | Reference to an element on the page, needed to download the dimensions for the animation.
modalElemRef(ref)  | -  | React.RefObject<HTMLElement>  | Reference to an element in the modal, needed to download the dimensions for the animation.
openDuration  | 280  | number  | Opening the animation duration (ms).
closeDuration  | 280  | number  | Closing the animation duration (ms).
imgLoaded | -  | boolean  | You have to pass the result of img tag “onload” event or “onLoadingComplete” from the <Image> NextJS Component. Highly recommended when you make the transition between images.
modalSelector  | - | string  | It accepts querySelector selectors. To prevent flickering when you have the transition between images. You can do the same by using “modalRef”
modalRef(ref)  | - | React.RefObject<HTMLElement>  | Accept the ref which have access to your Modal. To prevent flickering when you have the transition between images. You can do the same by using “modalSelector”
hideFirstElem  | true | boolean  | It hides the first element when the modal is opened.
disableOpenAnimation | false | boolean  | Set it to ‘true’ when you have to disable the opening of the animation.
disableCloseAnimation | false | boolean  | Set it to true when you have to disable closing the animation.
openEasing | “ease-in” | string  | Open the animation easing function. You can pass here e.g. cubic-bezier.
closeEasing | “ease-out” | string  | Close the animation easing function. You can pass here e.g. cubic-bezier.
transformOrigin | center| string  | transformOrigin CSS property value.
pauseOnOpen | false | boolean  | A property for debugging. Pause an element before the animation starts. It works on the firstElemRef (opening the animation).
pauseOnClose | false | boolean  | A property for debugging. Pause an element before the animation starts. It works on modalElemRef (close animation).
onOpenAnimationStart | - | function(element: HTMLElement)  | Called when the opening animation is ready to start. It is provided a reference to the DOM element (modalElemRef) being transitioned as the argument.
onOpenAnimationEnd | - | function(element: HTMLElement)  | Called when the opening animation is finished. It is provided a reference to the DOM element (modalElemRef) being transitioned as the argument.
onCloseAnimationStart | - | function(element: HTMLElement)  | Called when the closing animation is ready to start. It is provided a reference to the DOM element (firstElemRef) being transitioned as the argument.
onCloseAnimationEnd | - | function(element: HTMLElement)  | Called when the closing animation is finished. It is provided a reference to the DOM element (firstElemRef) being transitioned as the argument.
activeIndex | - | number / string  | This must be the ID of your active element. You need this when you want the first element to become visible after changing its ID. If you have hideFirstElem set to false, you don't need it.

### Functions that hook returns
Hook also returns a function called "restartAnimation", which can be used to restart the animation. A practical example of its usage is when you have a lightbox and you want to restart the animation each time you change a slide.

## Posible problems
####	An element is being covered by others
  Solution: use the callback functions (onOpenAnimationStart, onOpenAnimationEnd, onCloseAnimationStart, onCloseAnimationEnd) to change the “z-index” property during the animation.
  

 ####	Container with the overflow: "hidden" property covers an element
  Solution: use the callback functions (onOpenAnimationStart, onOpenAnimationEnd, onCloseAnimationStart, onCloseAnimationEnd) to change the “overflow” property during the animation.
  
 ####	Sometimes the animation doesn't start(when use images)
  Solution: When you use the images you have to pass the “imgLoaded” prop to hook. 

 ####	Elements are distorted during the animation
  Solution: Check that you are not animating any parent elements that are larger than the elements you want to animate. You can use the prop “pauseOnOpen” or “PauseOnClose”.
  During the animation the element should perfectly cover the element that is going to be under it.

  ## About the flip animation technique
   https://css-tricks.com/animating-layouts-with-the-flip-technique/
