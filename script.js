'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal'); //returns a nodeList//getElementsbyClassName
const headerLinks = document.querySelectorAll('.nav__link'); //features,operations,testimonials
const learnMore = document.querySelector('.btn--scroll-to');
const header = document.querySelector('.header');
const tabContainer = document.querySelector('.operations__tab-container'); //container contains tab buttons
const tabContents = document.querySelector('.operations__content');
const tabButtons = document.querySelectorAll('.operations__tab');
const navBar = document.querySelector('.nav');
const featureSection = document.getElementById('section--1');
const operationSection = document.getElementById('section--2');
const testimonialSection = document.getElementById('section--3');
const signUpSection = document.querySelector('.section--sign-up');

const openModal = function (
  event //event is used to remove default behaviour of href=#(ie.page jumping to top)
) {
  event.preventDefault(); //used to prevent page jumping to top.
  //displays modal by removing hidden
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden'); //blur background when modal is opened
};

const closeModal = function () {
  modal.classList.add('hidden'); //modal disappears
  overlay.classList.add('hidden'); //overlay also disappears
};

//nodeList doesnt have methods of array,but it certainly has forEach()
btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});
//basically whenever a buttons is clicked,loop runs to know the clicked button
//there are two buttons which can open the modal.

//these are three ways to close a modal(click on 'X' or click on blur or click escape key)
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

//keydown is basically a single key press.
// !modal.classList.contains('hidden') means that modal is open at this point of time
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//CHANGE 1(implementing smooth scrolling to different sections)
let id;

//event handler function()
// const smoothMovement = function (event) {
// event.preventDefault(); //bcoz '#' creates immediate movement effect
// id = this.getAttribute('href').substring(1); //'this' refers to link
//getAttribute()gets attribute
//then we need to remove first character (ie.#)

// document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
// };

//attaching event handler for all 3 header links
// headerLinks.forEach(link => link.addEventListener('click', smoothMovement));

//attaching event handler for the learnMore button
// learnMore.addEventListener('click', function (event) {
// event.preventDefault();

//technique 1
// document.getElementById('section--1').scrollIntoView({ behavior: 'smooth' });

//technique 2(complicatd)
// let section1coords = section1.getBoundingClientRect();
// window.scrollTo({
//   //object is passed
//   left: section1coords.left + window.pageXOffset,
//   top: section1coords.top + window.pageYOffset,

//   behavior: 'smooth',
// });
// });

//CHANGE 1(alternative)(event Delegation)

//all the smoothMovement target elements are inside header
//so its better to add only 1 event listner and handle all them inside single function
//reduces code.
header.addEventListener(
  'click',
  function (
    e //header is parent element.(e contains targetElement.)
  ) {
    e.preventDefault(); //removes # effect

    //to handle (learn more).
    if (e.target.classList.contains('btn--scroll-to')) {
      document
        .getElementById('section--1')
        .scrollIntoView({ behavior: 'smooth' });
    }
    //to handle 'OPEN ACCOUNT'
    else if (e.target.classList.contains('btn--show-modal')) {
      //just dont do anything
    }
    //to handle header links
    else if (e.target.classList.contains('nav__link')) {
      //to handle header links
      id = e.target.getAttribute('href').substring(1);
      //this above statement doesnt work for 'open account' bcoz href=#.
      //so id becomes empty and throws 'CANNOT READ PROPERTIES OF NULL'

      document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
    }
  }
);

//CHANGE 2(tabbed component in operations section)
const changeTab = function (e) {
  if (e.target.classList.contains('btn')) {
    //or (e.target) will be falsy for null values
    //or Guard Clause if(!tabButton) return.(tabButton will be null/falsy if i click elsewhere in the container)
    //only for buttons else,dont do anything.
    const tabButton = e.target.closest('.operations__tab'); //this button was clicked
    //closest() bcoz when clicked on span() its not working

    const currentTabNumber = tabButton.dataset.tab;
    //using this we can get tabContent and tabIcon.

    let previousTabNumber;
    //first remove active from the button
    tabButtons.forEach(button => {
      if (button.classList.contains('operations__tab--active')) {
        button.classList.remove('operations__tab--active');
        previousTabNumber = button.dataset.tab;
      }
    });

    //now add active to target button
    tabButton.classList.add('operations__tab--active');

    //now tabButton activeness has been added
    //need to display tabContent based on button
    // (need to handle content,icon,active)

    //hide present content by removing active
    document
      .querySelector(`.operations__content--${previousTabNumber}`)
      .classList.remove('operations__content--active');

    //add active to new content
    document
      .querySelector(`.operations__content--${currentTabNumber}`)
      .classList.add('operations__content--active');
  }
};

tabContainer.addEventListener('click', changeTab);

//Change 3(navigation in nav bar effect)
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    //this cond is to handle siblings of link
    //fade out its siblings
    const link = e.target;

    //nav__links is grandParent(use closest)and from there select all individual nav__link's
    siblings = link.closest('.nav__links').querySelectorAll('.nav__link');

    //traverse this siblings nodeList and reduce opacity of link's siblings
    siblings.forEach(sibling => {
      if (sibling !== link) {
        //link is excluded
        //link should not fade out
        sibling.style.opacity = this; //bcoz of bind() this contains opacity.
      }
    });

    //fade out logo seperately
    link.closest('.nav__links').previousElementSibling.style.opacity = this; //logo is faded out here
  } else if (e.target.classList.contains('nav__logo')) {
    //handles logo
    //now fade out entire nav__links.(ie.rightSibling)
    const logo = e.target;
    logo.nextElementSibling.style.opacity = this;
  }
};

//passing 'paramters' into function reference
//enable hover effect
let siblings;
navBar.addEventListener('mouseover', handleHover.bind(0.5));

//disable hover effect
navBar.addEventListener('mouseout', handleHover.bind(1));

//CHANGE 4(sticky navigation Bar)

//---------->stick navBar based on features section loction(not on header's location)

/*
const stickyNav = function () {
  //get features section locations
  const featureLoc = featureSection.offsetTop; //681 pixels
  //calculates the features section location from top of page in pixels

  //if windowsYAxis >= featureLoc
  //add sticky
  if (window.pageYOffset >= featureLoc) {
    navBar.classList.add('sticky');
  }
  //(<)remove sticky.
  else {
    navBar.classList.remove('sticky');
  }
};

window.addEventListener('scroll', stickyNav);
*/

//---------->alternative for change 4
// let section1Top = featureSection.getBoundingClientRect().top;
// window.addEventListener('scroll', function () {
//   if (window.scrollY >= section1Top) {
//     navBar.classList.add('sticky');
//   } else {
//     navBar.classList.remove('sticky');
//   }
// });

//---------->Using ObserveIntersection API for Change 4(ie.navsticky effect)
let navBarHeight = getComputedStyle(navBar).height;
const stickyNav = function (entries, observer) {
  //is called each time when the observed element(header)'s visibility hits threshold value.
  //entries is array of threshold values mentioned in stickyConditions.

  const [entry] = entries;

  if (entry.isIntersecting) {
    //remove sticky for true(bcoz visbility>0 is true)
    navBar.classList.remove('sticky');
  } //add sticky for false.(bcoz visbility<=0 is true)
  else {
    navBar.classList.add('sticky');
  }
};

const stickyConditions = {
  root: null, //root is the element that the target is intersecting.
  //here we want entire viewport hence root is null.
  threshold: 0, //percentage of intersection where stickyNav will be called.
  //when visibility of target(header) becomes zero stick the navBar.
  rootMargin: `-${navBarHeight}`, //(-90pixels for header section )
};

//step 1:get reference for header section.
const headerObserver = new IntersectionObserver(stickyNav, stickyConditions); //based on options,callBack is called.
//step 2:attach an abserver object to this element and call obersve()
headerObserver.observe(header);
//observer is variable
//observe is function

//------------->CHANGE 5(revealing elements on scroll)
//Step 1: get reference of all sections
const sections = document.querySelectorAll('.section');

//step 2:loop over the sections nodeList and hide them
sections.forEach(section => {
  section.classList.add('section--hidden');
});

//definition for revealSection function.
const revealSection = function (entries) {
  const [entry] = entries; //only one entry so,destructured

  if (!entry.isIntersecting) {
    //if not 10% visible then return
    return;
  } //visibility>10%
  else {
    //entry.target contains info,so no need to use 'this'
    this.classList.remove('section--hidden'); //'this' points to section reference
    sectionObserver.unobserve(this); //once revealed no need to observe that section.
  }
};

const revealConditions = {
  root: null, //here root is null,because we want intersection in entire viewport
  threshold: 0.1, //min 10 percent visibility.(>10)
};

//step 3:create instance for IntersectionObserver
let sectionObserver;
sections.forEach(section => {
  sectionObserver = new IntersectionObserver(
    revealSection.bind(section), //bind section to each function.
    revealConditions
  );
  sectionObserver.observe(section); //call observe function on each section
});

//------>CHANGE 6(lazy loading images)

//step 1:get reference of all lazy images
const lazyImages = document.querySelectorAll('img[data-src'); //selects all images which have data-src.

//definition and object for API
let imageReveal;
const revealImage = function (entries) {
  const [entry] = entries;

  if (entry.isIntersecting) {
    //if entry is intersecting
    imageReveal = entry.target;
    imageReveal.src = imageReveal.dataset.src; //first change the src of image.

    //then remove blur class(this may not be recommended for slow internet connections)
    // imageReveal.classList.remove('lazy-img');
    // imageObserver.unobserve(imageReveal);

    //once image is loaded 'load' event is generated.
    imageReveal.addEventListener('load', function () {
      imageReveal.classList.remove('lazy-img');
    });
    //this is to handle slow internet connections

    imageObserver.unobserve(imageReveal);
  }
};

const revealImgConditions = {
  root: null,
  threshold: 0, //>=0 percent visibility

  rootMargin: '200px',
};

//step 2:create IntersectionObserver for images
const imageObserver = new IntersectionObserver(
  revealImage,
  revealImgConditions
);

//step 3:loop over the lazyImages and add observer.
lazyImages.forEach(image => {
  imageObserver.observe(image);
});

//------->CHANGE 7-->(slider Component)
let activeSlide;
let inactiveSlide;
let slides;

function init() {
  activeSlide = 0; //current active slide
  inactiveSlide = 0; //previously active slide
  //used this in displaying slides and assignActiveDot logic

  //step 1:slides are overlapping on each other so,move them apart using translateX().
  //get reference of all slides.
  slides = document.querySelectorAll('.slide');
  //now loop over them and move them apart.
  goToSlide(); //initially slides will sit accordingly and activeSlide is 0 for initial case
  // assignActiveDot();why is this causing error?
}

init(); //initialization
//assignActiveDot() why is this causing error?

// Delay the call to assignActiveDot() until the next repaint
requestAnimationFrame(() => {
  assignActiveDot();
});

//step 2:select two buttons and add eventListeners to them.
const previousButton = document.querySelector('.slider__btn--left');
const nextButton = document.querySelector('.slider__btn--right');

//function definitions
function goToSlide() {
  slides.forEach((slide, index) => {
    slide.style.transform = `translateX(${(index - activeSlide) * 100}%)`;
  });
}

//
function showPrevSlide() {
  if (activeSlide == 0) {
    inactiveSlide = activeSlide;
    activeSlide = slides.length - 1; //bcoz after slides.forEach() slides[2] will be displayed
  } else {
    inactiveSlide = activeSlide;
    activeSlide--;
  }
  goToSlide();
  assignActiveDot();
}
//0      100  200(initial)
//-200  -100  0
//-100   0   100
//0     100  200

function showNextSlide() {
  if (activeSlide == slides.length - 1) {
    inactiveSlide = activeSlide;
    activeSlide = 0;
  } else {
    inactiveSlide = activeSlide;
    activeSlide++;
  }
  goToSlide();
  assignActiveDot();
}
//0      100    200(initial)
//-100   0      100
//-200  -100    0
//0     100     200

//------->CHANGE 7-->Part-2(slider dots implementation)
let html;
//step 1:get the reference of dots
const dotsContainer = document.querySelector('.dots');

//step 2:call createDots() 3 times
for (let index = 0; index < slides.length; index++) {
  createDots(index);
}

//step 3:create dots inside its container.
function createDots(index) {
  html = document.createElement('button'); //insert this html variable into the container
  html.setAttribute('class', 'dots__dot');
  html.setAttribute('id', `dot--${index}`);

  dotsContainer.appendChild(html);
}

//step 4:add active class to the first dot
//step 4 is handled after init() function call.

//step 5:use 'activeSlide' to add 'active' class to the dots
//before that remove active class from previous slide.
assignActiveDot();
function assignActiveDot() {
  //remove
  document
    .getElementById(`dot--${inactiveSlide}`)
    .classList.remove('dots__dot--active');

  //add
  document
    .getElementById(`dot--${activeSlide}`)
    .classList.add('dots__dot--active');
}

// (EVENT HANDLING SECTION)
//step 6:attach event listener to dots.
dotsContainer.addEventListener('click', function (e) {
  if (!e.target.classList.contains('dots__dot')) {
    //guard block
    return;
  } else {
    inactiveSlide = activeSlide; //else just deactivate all dots and assign dot to activeSlide
    activeSlide = e.target.getAttribute('id').substring(5); //using dataset would have helped here
    goToSlide();
    assignActiveDot();
  }
});

//changing slides using keyboard
document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') {
    showPrevSlide();
  } else if (e.key === 'ArrowRight') {
    showNextSlide();
  }
});

//changing slides using buttons
previousButton.addEventListener('click', showPrevSlide);
nextButton.addEventListener('click', showNextSlide);

//PRACTISE
///*

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('DOM Contents are Loaded', e);
});
//DOMContentsLoaded is only for html not for images and external sources.

window.addEventListener('load', function (e) {
  console.log('page fully load', e);
});

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault(); //in this case prevents from immediate unloading the page
//   console.log('before unload event', e);
//   e.returnValue = '';
// }); //we use this event to ask users if they are sure to leave the page
