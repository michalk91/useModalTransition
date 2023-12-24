## useModalTransition hook
A library that allows the transition between an element on a website and a modal element.
	
## Features
-	Animate what is impossible in pure css,
-	Based on “flip animation technique”,
-	Supports react and nextjs,
-	It's a hook, so there's no problem with the container ruining your style
-	uses the Web Animations API (WAAPI),
-	Lightweight,
-	Wait until image in modal is loaded,
-	Images in Modal height and width property can be set to “auto”( when “imgLoaded” added),
-	Works with “scrset”(when “imgLoaded” added),
-	Many configuration options,
-	Tested by Cypress

## Demo
 https://use-modal-transition.vercel.app/

	
## Setup
To run this project, install it locally using npm:

```
npm i use-modal-transition
```

## Quick start
1) Import useModalTransition hook:
```
import useModalTransition from "use-modal-transition";
```

2)	Assign a refs to the elements you want to animate and ref to modal.
```
const firstElemRef = useRef<HTMLDivElement>(null);
const modalElemRef = useRef<HTMLDivElement>(null);
const modalRef = useRef<HTMLElement>(null);

   
 <Modal modalRef={modalRef} isOpen={isOpen} onClose={onClose}>
   <div ref={modalElemRef}></div>
 </Modal>

   <div ref={firstElemRef}></div>
 
```

3)	Create state for the modal.
```
const [isOpen, setIsOpen] = useState<boolean>(false);
```

4)	Put the refs and the Modal state as “modalOpened” property,
```
 useModalTransition({
    modalOpened: isOpen,
    firstElemRef,
    modalElemRef,
    modalRef,
  });
```

5)	Change the state onClick to start the animation.
```
 return (
    <>
      <Modal modalRef={modalRef} isOpen={isOpen} onClose={onClose}>
        <div
          onClick={() => {
            setIsOpen(false);
          }}
          ref={modalElemRef}
        ></div>
      </Modal>
      
        <div
          ref={firstElemRef}
          onClick={() => {
            setIsOpen(true);
          }}
        ></div>
 
    </>
  );
```

## Usage details

Property       | Default      | Type          | Details
------------- | ------------- | ------------- | -------------
modalOpened(state) | -  | boolean  | Changing this to „true” starts open animation, changing to “false” starts close animation.
firstElemRef(ref)  | -  | React.RefObject<HTMLElement>  | Reference to element on page, needed to download dimensions for animation.
modalElemRef(ref)  | -  | React.RefObject<HTMLElement>  | Reference to element on page, needed to download dimensions for animation.
openDuration  | 280  | number  | Opening animation duration (ms)
closeDuration  | 280  | number  | Closing animation duration (ms)
imgLoaded | -  | boolean  | You have to pass result of img tag “onload” event or “onLoadingComplete” from <Image> NextJS Component. Highly Recommended when you make transition between images.
modalSelector  | - | string  | Accepts querySelector selectors. To prevent flickering when you have transition between images.  You can do the same by use “modalElemRef”.
modalRef(ref)  | - | React.RefObject<HTMLElement>  | Accept ref which have access to your Modal. To prevent flickering when you have transition between images. You can do the same by use “modalSelector”.
hideFirstElem  | true | boolean  | It hides first element when modal is opened.
disableOpenAnimation | false | boolean  | Set it to true when you have to disable open animation.
disableCloseAnimation | false | boolean  | Set it to true when you have to disable close animation.
openEasing | “ease-in” | string  | Open animation easing function. You can pass here e.g. cubic-bezier.
closeEasing | “ease-out” | string  | Close animation easing function. You can pass here e.g. cubic-bezier.
transformOrigin | center| string  | transformOrigin CSS property value.
pauseOnOpen | false | boolean  | Property for debugging. Pause element before animation start. Work on firstElemRef. (open animation).
pauseOnClose | false | boolean  | Property for debugging. Pause element before animation start. Work on modalElemRef (close animation).
onOpenAnimationStart | - | function(element: HTMLElement)  | Called when the open animation is ready to start.
onOpenAnimationEnd | - | function(element: HTMLElement)  | Called when the open animation is finished.
onCloseAnimationStart | - | function(element: HTMLElement)  | Called when the close animation is ready to start.
onCloseAnimationEnd | - | function(element: HTMLElement)  | Called when the close animation is finished.
activeIndex | - | number / string  | This must be the id of your active element. You need this when you want the first element to become visible after changing the element (id). If you have hideFirstElem set to false, you don't need it.

## Posible problems
####	Element is covers by others
   Solution: use callback functions (onOpenAnimationStart, onOpenAnimationEnd, onCloseAnimationStart, onCloseAnimationEnd) to change “z-index” property during animation.
  

 ####	Container with overflow: “hidden” property covers element
  Solution: use callback functions (onOpenAnimationStart, onOpenAnimationEnd, onCloseAnimationStart, onCloseAnimationEnd) to change “overflow” property during animation.
  
 ####	Sometimes the animation doesn't start(when use images)
  Solution: When you use the images you have to pass “imgLoaded” prop to hook. 


 ####	Elements are distorted during animation
  Solution: Check that you are not animating parent elements that are larger than the elements you want to animate. 




