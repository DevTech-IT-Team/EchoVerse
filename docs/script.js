document.addEventListener('DOMContentLoaded', () => {
  // ===============================
  // NAVBAR SCROLL EFFECT
  // ===============================
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add scrolled class when scrolling down
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero && currentScroll < window.innerHeight) {
      const slideshow = hero.querySelector('.slideshow');
      if (slideshow) {
        const parallaxSpeed = currentScroll * 0.5;
        slideshow.style.transform = `translateY(${parallaxSpeed}px)`;
      }

      // Fade out scroll indicator as user scrolls
      const scrollIndicator = document.querySelector('.scroll-indicator');
      if (scrollIndicator) {
        const opacity = Math.max(0, 1 - (currentScroll / 300));
        scrollIndicator.style.opacity = opacity;
      }
    }

    lastScroll = currentScroll;
  });

  // ===============================
  // ACTIVE LINK HIGHLIGHTING
  // ===============================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const mobileLinks = document.querySelectorAll('.mobile-menu a[href^="#"]');

  function updateActiveLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        // Update desktop nav links
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });

        // Update mobile nav links
        mobileLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });

    // Handle home section (when at top of page)
    if (scrollY < 100) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#home') {
          link.classList.add('active');
        }
      });
      mobileLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#home') {
          link.classList.add('active');
        }
      });
    }
  }

  window.addEventListener('scroll', updateActiveLink);
  window.addEventListener('load', updateActiveLink);

  // ===============================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ===============================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href !== '#') {
        e.preventDefault();
        let target;
        let offsetTop;

        if (href === '#home') {
          offsetTop = 0;
        } else {
          target = document.querySelector(href);
          if (target) {
            offsetTop = target.offsetTop - 80;
          } else {
            return;
          }
        }

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });

        // Close mobile menu if open
        const mobileMenu = document.getElementById("mobileMenu");
        const hamburger = document.querySelector('.hamburger');
        if (mobileMenu && mobileMenu.classList.contains('active')) {
          mobileMenu.classList.remove('active');
          hamburger.textContent = '☰';
        }
      }
    });
  });

  // ===============================
  // MOBILE MENU TOGGLE
  // ===============================
  window.toggleMenu = function () {
    const mobileMenu = document.getElementById("mobileMenu");
    const hamburger = document.querySelector('.hamburger');

    mobileMenu.classList.toggle("active");
    hamburger.classList.toggle("open");
  };

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    const mobileMenu = document.getElementById("mobileMenu");
    const hamburger = document.querySelector('.hamburger');

    if (mobileMenu && mobileMenu.classList.contains('active')) {
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        mobileMenu.classList.remove('active');
        hamburger.classList.remove("open");
      }
    }
  });

  // Close mobile menu on window resize
  window.addEventListener('resize', () => {
    const mobileMenu = document.getElementById("mobileMenu");
    const hamburger = document.querySelector('.hamburger');

    if (window.innerWidth > 768 && mobileMenu.classList.contains('active')) {
      mobileMenu.classList.remove('active');
      hamburger.classList.remove("open");
    }
  });

  // ===============================
  // LOGO CLICK → SCROLL TO TOP
  // ===============================
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===============================
  // HERO SLIDESHOW (ARROWS + DOTS)
  // ===============================
  let currentSlide = 0;
  let slideInterval;

  const slides = document.querySelectorAll('.slide');
  const indicators = document.querySelectorAll('.indicator');
  const prevBtn = document.querySelector('.slide-nav.prev');
  const nextBtn = document.querySelector('.slide-nav.next');

  function updateSlide() {
    if (!slides.length) return;

    slides.forEach((slide, index) => {
      slide.classList.remove('active');
      if (indicators[index]) {
        indicators[index].classList.remove('active');
      }
    });

    slides[currentSlide].classList.add('active');
    if (indicators[currentSlide]) {
      indicators[currentSlide].classList.add('active');
    }
  }

  function changeSlide(direction) {
    if (!slides.length) return;

    currentSlide += direction;

    if (currentSlide < 0) {
      currentSlide = slides.length - 1;
    } else if (currentSlide >= slides.length) {
      currentSlide = 0;
    }

    updateSlide();
    resetSlideInterval();
  }

  function goToSlide(index) {
    if (!slides.length) return;

    currentSlide = index;
    updateSlide();
    resetSlideInterval();
  }

  // 🔑 EXPOSE THESE FOR INLINE onclick=""
  window.changeSlide = changeSlide;
  window.goToSlide = goToSlide;

  function resetSlideInterval() {
    if (!slides.length) return;
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
      changeSlide(1);
    }, 5000);
  }

  if (slides.length > 0) {
    // start slideshow
    updateSlide();
    slideInterval = setInterval(() => {
      changeSlide(1);
    }, 5000);

    // extra: also wire arrows via JS (in case)
    if (prevBtn) {
      prevBtn.addEventListener('click', () => changeSlide(-1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => changeSlide(1));
    }

    // Pause on hover
    const slideshow = document.querySelector('.slideshow');
    if (slideshow) {
      slideshow.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
      });

      slideshow.addEventListener('mouseleave', () => {
        resetSlideInterval();
      });
    }

    // Keyboard navigation (only when hero section is in view)
    document.addEventListener('keydown', (e) => {
      const hero = document.querySelector('.hero');
      if (hero) {
        const rect = hero.getBoundingClientRect();
        const isInView = rect.top >= 0 && rect.bottom <= window.innerHeight;

        if (isInView) {
          if (e.key === 'ArrowLeft') {
            changeSlide(-1);
          } else if (e.key === 'ArrowRight') {
            changeSlide(1);
          }
        }
      }
    });
  }

  // ===============================
  // ABOUT SECTION SLIDESHOW
  // ===============================
  (function () {
    const aboutSlides = document.querySelectorAll(".about-slide");
    if (!aboutSlides.length) return;

    let aboutIndex = 0;

    function showAboutSlide(index) {
      aboutSlides.forEach((slide, i) => {
        slide.classList.toggle("active", i === index);
      });
    }

    function nextAboutSlide() {
      aboutIndex = (aboutIndex + 1) % aboutSlides.length;
      showAboutSlide(aboutIndex);
    }

    // start with first slide
    showAboutSlide(aboutIndex);

    // change every 2s
    setInterval(nextAboutSlide, 2000);
  })();

  // ===============================
  // SCROLL INDICATOR CLICK
  // ===============================
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const aboutSection = document.querySelector('#about');
      if (aboutSection) {
        const offsetTop = aboutSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });

    scrollIndicator.style.cursor = 'pointer';
  }

  // ===============================
  // ANIMATED COUNTER
  // ===============================
  function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = Math.floor(target);
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(start);
      }
    }, 16);
  }

  // ===============================
  // INTERSECTION OBSERVER FOR ANIMATIONS
  // ===============================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger counter animation for stats
        if (entry.target.classList.contains('stat-card')) {
          const counter = entry.target.querySelector('.counter');
          const target = parseInt(entry.target.getAttribute('data-target'));
          if (counter && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            animateCounter(counter, target);
          }
        }
      }
    });
  }, observerOptions);

  // Observe fade-in text elements
  document.querySelectorAll('.fade-in-text').forEach(el => {
    observer.observe(el);
  });

  // Observe stat cards
  document.querySelectorAll('.stat-card').forEach(el => {
    observer.observe(el);
  });

  // Observe feature items
  document.querySelectorAll('.feature-item').forEach(el => {
    observer.observe(el);
  });

  // Observe music cards
  document.querySelectorAll('.music-card').forEach(el => {
    observer.observe(el);
  });

  // Observe event cards
  document.querySelectorAll('.event-card').forEach(el => {
    observer.observe(el);
  });

  // ===============================
  // COUNTDOWN FOR MYSTERY EVENT
  // ===============================
  const countdownElement = document.getElementById('countdown');
  if (countdownElement) {
    const eventDate = new Date('July 1, 2025 20:00:00 EST').getTime();

    setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate - now;

      if (distance < 0) {
        countdownElement.innerText = "LIVE NOW!";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countdownElement.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
  }
});



//----------------------------------------- song list ----------------------------------------------



// ===========================
// script.js (separate file)
// Interactivity: search, A-Z, copy, download, toast
// ===========================

// SONG ARRAY (extracted from your PDF)
// NOTE: this array is long but intentionally kept here so the page works offline.
const songs = [
"3 Doors Down - Loser",
"3 Doors Down – Here Without You",
"3 Doors Down – Kryptonite",
"3 Doors Down – When I’m Gone",
"311 - Beautiful Disaster",
"311 - Champagne",
"311 - Down",
"311 – All Mixed Up",
"50 Cent – Candy Shop (feat. Olivia)",
"50 Cent – In Da Club",
"50 Cent – Just A Lil Bit",
"50 Cent – P.I.M.P.",
"5th Dimension - Age of Aquarius",
"ABBA - Dancing Queen",
"ABBA - Fernando",
"ABBA – Dancing Queen",
"ABBA – Gimme! Gimme!",
"Gimme! (A Man After Midnight)",
"ABBA – Mama Mia",
"ABBA – SOS",
"ABBA – Take A Chance On Me",
"ACDC - Back In Black",
"ACDC – Big Balls",
"ACDC – Dirty Deeds",
"ACDC – Hell’s Bells",
"ACDC – Highway To Hell",
"ACDC – Shoot To Thrill",
"ACDC – T.N.T.",
"ACDC – The Jack",
"ACDC – Thunderstruck",
"ACDC – You Shook Me All Night Long",
"Ace Of Base – All That She Wants",
"Ace Of Base – Beautiful Life",
"Ace Of Base – Cruel Summer",
"Ace Of Base – Don’t Turn Around",
"Ace Of Base – The Sign",
"Aerosmith - Jaded",
"Aerosmith – Crazy",
"Aerosmith – Dream On",
"Aerosmith – Dude (Looks Like A Lady)",
"Aerosmith – I Don’t Want to Miss a Thing",
"Aerosmith – Jamie’s Got a Gun",
"Aerosmith – Sweet Emotion",
"Aerosmith – Walk This Way",
"Afroman - Colt 45",
"Afroman – Because I Got High",
"Al Green – Here I Am",
"Al Green – How Can You Mend a Broken Heart",
"Al Green – Let’s Stay Together",
"Al Green – Love and Happiness",
"Alabama - Dixieland Delight",
"Alanis Morissette – Hand in My Pocket",
"Alanis Morissette – Head Over Feet",
"Alanis Morissette – Ironic",
"Alanis Morissette – Thank U",
"Alanis Morissette – Uninvited",
"Alanis Morissette – You Learn",
"Alanis Morissette – You Oghta Know",
"Alicia Keys – A Woman’s Worth",
"Alicia Keys – Fallin’",
"Alicia Keys – Girl on Fire",
"Alicia Keys – If I Ain’t Got You",
"Alicia Keys – No One",
"Alicia Keys – You Don’t Know My Name",
"Alphaville – Forever Young",
"Amy Winehouse – Rehab",
"Amy Winehouse – Valerie",
"Amy Winehouse – You Know I’m No Good",
"Andrew Sisters - Boogie Woogie Bugle Boy",
"Audioslave - Cochise",
"Audioslave – I Am The Highway",
"Audioslave – Like A Stone",
"Audioslave – Show Me How To Live",
"Avicii – Wake Me Up",
"Avril Lavigne – Complicated",
"Avril Lavigne – Sk8er Boi",
"Avril Lavigne – When You’re Gone",
"AWOLNATION - Sail",
"B-52’s – Love Shack",
"B-52’s – Rock",
"B.O.B. – Nothin’ On You (feat. Bruno Mars)",
"Bachman-Turner Overdrive – Let It Ride",
"Bachman-Turner Overdrive – Takin’ Care Of Business",
"Bachman-Turner Overdrive – You Ain’t Seen Nothing Yet",
"Backstreet Boys - As Long As You Love Me",
"Backstreet Boys - Everybody",
"Backstreet Boys – I Want It That Way",
"Bad Religion - 21st Century (Digital boy)",
"Bad Religion – Sorrow",
"Barenaked Ladies – If I Had $1,000,000",
"Barenaked Ladies – One Week",
"Barenaked Ladies – Pinch Me",
"BB Mack - Back Here Baby",
"Beastie Boys - Sabotage",
"Beastie Boys – Brass Monkey",
"Beastie Boys – Fight For Your Right",
"Beastie Boys – Girls",
"Beastie Boys – Intergalactic",
"Beastie Boys – No Sleep Till Brooklynn",
"Beastie Boys – Paul Revere",
"Beastie Boys – Sure Shot",
"Beck – Devil’s Haircut",
"Beck – E-Pro",
"Beck – Loser",
"Beck – Where It’s At",
"Bee Gees – How Deep Is Your Love",
"Bee Gees – Stayin’ Alive",
"Bee Gees – You Should Be Dancing",
"Bell Biv DeVoe – Poison",
"Ben Folds Five – Brick",
"Ben Folds Five – Song for the Dumped",
"Ben Folds Five – The Luckiest",
"Big & Rich – Save a Horse (Ride a Cowboy)",
"Bill Medley & Jennifer Warnes – (I’ve Had) The Time Of My Life",

"Bill Withers - Ain't No Sunshine",
"Bill Withers – Lovely Day",
"Bill Withers – Use Me Up",
"Billy Idol – Dancing With Myself",
"Billy Idol – Rebel Yell",
"Billy Idol – White Wedding",
"Billy Joel - Allentown",
"Billy Joel - Movin' Out (Anthony’s Song)",
"Billy Joel - My Life",
"Billy Joel - New York State of Mind",
"Billy Joel - Piano Man",
"Billy Joel - Scenes From An Italian Restaurant",
"Billy Joel - Vienna",
"Billy Joel – Big Shot",
"Billy Joel – Captain Jack",
"Billy Joel – It’s Still Rock and Roll To Me",
"Billy Joel – Just The Way You Are",
"Billy Joel – Only The Good Die Young",
"Billy Joel – Rootbeer Rag",
"Billy Joel – She’s Always A Woman",
"Billy Joel – The Downeaster ‘Alexa’",
"Billy Joel – The Longest Time",
"Billy Joel – Uptown Girl",
"Billy Joel – We Didn’t Start The Fire",
"Billy Joel – You May Be Right",
"Black Eyed Peas – I Gotta Feeling",
"Black Eyed Peas – Let Get It Started",
"Black Eyed Peas – My Humps",
"Black Sabbath – Black Sabbath",
"Black Sabbath – Iron Man",
"Black Sabbath – War Pigs",
"Blackstreet – No Diggitty",
"Blind Melon – No Rain",
"Blink 182 - All The Small Things",
"Blink 182 – Adam’s Song",
"Blink 182 – Aliens Exist",
"Blink 182 – Dammit",
"Blink 182 – Feeling This",
"Blink 182 – First Date",
"Blink 182 – I Miss You",
"Blink 182 – The Rock Show",
"Blink 182 – What’s My Age Again",
"Blondie – Call Me",
"Blondie – Heart Of Glass",
"Blondie – One Way Or Another",
"Blondie – The Tide Is High",
"Bloodhound Gang - The Bad Touch",
"Bloodhound Gang – The Ballad Of Chasey Lain",
"Blue Oyster Cult - Burnin' For You",
"Blue Oyster Cult – Don’t Fear (The Reaper)",
"Blue Swede & Bjorn Skifs – Hooked On A Feeling",
"Blur – Song 2",
"Bob Marley – Buffalo Soldier",
"Bob Marley – Could You Be Loved",
"Bob Marley – I Shot The sheriff",
"Bob Marley – Is This Love",
"Bob Marley – Jammin",
"Bob Marley – No Woman, No Cry",
"Bob Marley – One Love / People Get Ready",
"Bob Marley – Redemption Song",
"Bob Marley – Roots, Rock, Reggae",
"Bob Marley – Stir It Up",
"Bob Marley – Three Little Birds",
"Bob Marley – Waiting In Vain",
"Bob Seger – Against The Wind",
"Bob Seger – Hollywood Nights",
"Bob Seger – Katmandu",
"Bob Seger – Mainstreet",
"Bob Seger – Night Moves",
"Bob Seger – Old Time Rock & Roll",
"Bob Seger – Rock And Roll Never Forgets",
"Bob Seger – Still The Same",
"Bob Seger – Turn The Page",
"Bobby Darin – Mack the Knife",
"Bobby Darin – Splish Splash",
"Bon Jovi - Dead Or Alive",
"Bon Jovi - Runaway",
"Bon Jovi – Livin’ On A Prayer",
"Bon Jovi – You Give Love A Bad Name",
"Bone Thugs & Harmony - East 1999",
"Bowling For Soup - 1985",
"Brian Setzer Orchestra – Jump, Jive An’ Wail",
"Brian Setzer Orchestra – Rock This Town",
"Britney Spears - Womanizer",
"Britney Spears – Hit Me Baby One More Time",
"Britney Spears – I Love Rock ‘N’ Roll",
"Britney Spears – I’m a Slave 4 U",
"Britney Spears – Lucky",
"Britney Spears – Oops I Did It",
"Britney Spears – Toxicity",
"Brooks & Dunn - Boot Scootin' Boogie",
"Brooks & Dunn – Neon Moon",
"Bruno Mars - Grenade",
"Bruno Mars - Locked out of Heaven",
"Bruno Mars - Treasure",
"Bruno Mars – 24K Magic",
"Bruno Mars – Just The Way You Are",
"Bruno Mars – Marry You",
"Bruno Mars – That’s What I Like",
"Bruno Mars – When I Was Your Man",
"Bryan Adams – (Everything I Do) I Do It For You",
"Bryan Adams – Heaven",
"Bryan Adams – Run To You",
"Bryan Adams – Summer Of 69",
"Buffalo Springfield – What’s Goin’ Round",
"Cake - Going The Distance",
"Cake - I Will Survive",
"Cake - Never There",
"Cake – Short Skirt Long Jacket",
"Cake – War Pigs",
"Carly Rae Jepsen - Call Me Maybe",
"Carly Simon – You’re So Vain",
"Carrie Underwood - Before He Cheats",
"Carrie Underwood – Jesus Take The Wheel",
"Chappell Roan - Pink Pony Club",
"Chappell Roan – HOT TO GO!",
"Cheap Trick – I Want You To Want Me",
"Cheap Trick – Surrender",
"Cher - Believe",
"Cher – I Got You Babe",
"Cherry Poppin’ Daddies – Zoot Suit Riot",
"Chicago - Saturday In The Park",
"Chicago - You're The Inspiration",
"Chicago – 25 or 6 to 4",
"Chicago – Does Anybody Really Know What Time It is",
"Chicago – Its Hard To Say I’m Sorry",
"Chicago – Will You Still Love Me",
"Childish Gambino - Redbone",
"Chris Cornell – Billie Jean",
"Chuck Berry – Johnny Be Goode",
"Chuck Berry – My Ding A Ling",
"Cindi Lauper – All Though the Night",
"Cindi Lauper – Girls Just Want To Have Fun",
"Cindi Lauper – Time After Time",
"Citizen Cope – Bullet and a Target",
"Citizen Cope – Hurricane Waters",
"Citizen Cope – Penitentiary",
"Citizen Cope – Son’s Gonna Rise (feat. Carlos Santana)",
"Coldplay – Amsterdam",
"Coldplay – Clocks",
"Coldplay – Don’t Panic",
"Coldplay – Everything’s Not Lost",
"Coldplay – Fix You",
"Coldplay – For You",
"Coldplay – In My Place",
"Coldplay – Speed Of Sound",
"Coldplay – The Scientist",
"Coldplay – Till Kingdom Come",
"Coldplay – Trouble",
"Coldplay – Viva La Vida",
"Coldplay – What If",
"Coldplay – Yellow",
"Collective Soul - Shine",
"Collective Soul – December",
"Collective Soul – The World I Know",
"Collin Freestone - Badly Baby",
"Collin Freestone - Dosido",
"Collin Freestone - Everyday",
"Collin Freestone – Dirty Hands",
"Collin Freestone – Good As Dead",
"Collin Freestone – Slim 2 None",
"Collin Freestone – Start Again",
"Coolio – Fantistic Voyage",
"Coolio – Gangsta’s Paradise",
"Crazytown - Butterfly",
"Creedence Clearwater Revival – Bad Moon Rising",
"Creedence Clearwater Revival – Born On The Bayou",
"Creedence Clearwater Revival – Down On The Corner",
"Creedence Clearwater Revival – Down On The Corner",
"Creedence Clearwater Revival – Fortunate Son",
"Creedence Clearwater Revival – Green River",
"Creedence Clearwater Revival – Have You Ever Seen The Rain",
"Creedence Clearwater Revival – Hey Tonight",
"Creedence Clearwater Revival – I heard It Throught The Grapevine",

"Creedence Clearwater Revival – Lodi",
"Creedence Clearwater Revival – Looking Out My Back Door",

"Creedence Clearwater Revival – Proud Mary",
"Creedence Clearwater Revival – Run Through The Jungle",

"Creedence Clearwater Revival – Susie Q",
"Creedence Clearwater Revival – Travelin’ Band",
"Creedence Clearwater Revival – Up Around The Bend",
"Creedence Clearwater Revival – Who’ll Stop The Rain",
"Cyndi Lauper - Girls Just Wanna Have Fun",
"Cyndi Lauper – Time After Time",
"Daft Punk - Around The World",
"Daft Punk - Get Lucky",
"Daniel Powter – Bad Day",
"Darius Rucker – Wagon Wheel",
"Daryl Hall & John Oates - You Make My Dreams",
"Daryl Hall & John Oates – I Can’t Go For That",
"Daryl Hall & John Oates – Kiss On My List",
"Daryl Hall & John Oates – Maneater",
"Daryl Hall & John Oates – Private Eyes",
"Daryl Hall & John Oates – Rich Girl",
"Daryl Hall & John Oates – Sara Smile",
"Daryl Hall & John Oates – You Make My Dreams (Come True)",

"Dave Matthews Band - Crash Into Me",
"Dave Matthews Band - Crush",
"Dave Matthews Band – Ants Marching",
"Dave Matthews Band – Too Much",
"David Allen Coe – You Never Even Call Me by My Name",

"David Bowie - Heroes",
"David Bowie – Changes",
"David Bowie – Let’s Dance",
"David Bowie – Space Oddity",
"David Bowie – Under Pressure",
"David Guetta – Titanium (feat. Sia)",
"Dead Or Alive - You Spin Me Round",
"Def Leppard – Hysteria",
"Def Leppard – Love Bites",
"Def Leppard – Photgraph",
"Def Leppard – Pour Some Sugar On Me",

"Def Leppard – Rock Of Ages",
"Destiny's Child - Say My Name",
"Dexys Midnight Runners - Come On Eileen",

"Dierks Bentley – Come A Little Closer",
"Dierks Bentley – Drunk On A Plane",
"Dierks Bentley – Lot Of Leavin’ Left To Do",
"Dierks Bentley – So So Long",
"Dierks Bentley – What Was I Thinkin’",
"Dire Straits – Money For Nothing",
"Dire Straits – Sultans Of Swing",
"Divinyls – I Touch Myself",
"Dixie Chicks – Cowboy Take Me Away",
"Dixie Chicks – Goodbye Earl",
"Dixie Chicks – Landslide",
"Dobie Gray - Drift Away",
"Don Henley - Dirty Laundry",
"Don Henley – All She Wants To Do Is Dance",
"Don Henley – The Boys Of Summer",
"Don McLean - American Pie",
"Dr. Dre – Forgot About Dre",
"Dr. Dre – Next Episode (feat Snoop Dogg)",
"Dr. Dre – Still D.R.E. Nunn",
"Dropkick Murphy’s – I’m Shipping Up To Boston",
"Drowning Pool - Bodies",
"Duran Duran – Hungry Like the Wolf",
"Duran Duran – Ordinary World",
"Eagles - Desperado",
"Eagles – Already Gone",
"Eagles – Heartache Tonight",
"Eagles – Hotel California",
"Eagles – I Can’t Tell You Why",
"Eagles – Lyin; Eyes",
"Eagles – One Of These Nights",
"Eagles – Peceful Easy Feeling",
"Eagles – Seven Bridges Road",
"Eagles – Take It Easy",
"Eagles – Take It To The Limit",
"Eagles – Withchy Woman",
"Earth, Wind & Fire -",
"Earth, Wind & Fire – Boogie Wonderland (feat. Earth, Wind & Fire)",

"Earth, Wind & Fire – Let’s Groove",
"Earth, Wind & Fire – September",
"Eddie Money – Take Me Home Tonight",
"Eddie Money – Two Tickets to Paradise",
"Edwin Mcain – I’ll Be",
"Edwin McCain – I Could Not Ask For More",
"Eiffel 65 – Blue (Da Ba Dee)",
"Electric Six - Danger! High Voltage",
"Electric Six – Gay Bar",
"Elton John - Benny and The Jets",
"Elton John - Crocodile Rock",
"Elton John – Candle In The Wind",
"Elton John – Daniel",
"Elton John – Don’t Go Breaking My Heartache",

"Elton John – Don’t Let The Sun Go Down On Me",

"Elton John – Goodbye Yellow Brick Road",
"Elton John – I’m Still Standing",
"Elton John – Rocket Man",
"Elton John – Saturday Night’s Alright (For Fighting)",

"Elton John – Tiny Dancer",
"Elton John – Your Song",
"Elvis Presley -",
"Elvis Presley – A Little Less Conversation",
"Elvis Presley – All Shook Up",
"Elvis Presley – Always On My Mind",
"Elvis Presley – Blue Christmas",
"Elvis Presley – Can’t Help Falling In Love",
"Elvis Presley – Heartbreak Hotel",
"Elvis Presley – Hound Dog",
"Elvis Presley – Jailhouse Rock",
"Elvis Presley – Suspicious Minds",
"Emerson, Lake & Palmer – Lucky Man",
"Eric Clapton – Change the World",
"Eric Clapton – Last Will and Testament",
"Eric Clapton – Lay Down Sally",
"Eric Clapton – Layla",
"Eric Clapton – My Father’s Eyes",
"Eric Clapton – Sunshine Of Your Love",
"Eric Clapton – Tears in Heaven",
"Eric Clapton – Wonderful Tonight",
"Etta James - At Last",
"Eurythmics – Sweet Dreams",
"Eve 6 - Promise",
"Eve 6 – Here’s to the Night",
"Eve 6 – Inside Out",
"Eve 6 – On The Roof Again",
"Everclear – Father Of Mine",
"Everclear – I Will But You A New Life",
"Everclear – Santa Monica",
"Everclear – Wonderful",
"Extreme – More Than Words",
"Fall Out Boy – Dance, Dance",
"Fall Out Boy – Sugar, We’re Goin Down",
"Fastball – Out Of My Head",
"Fastball – The Way",
"Fenix TX – Flight 601 (All I’ve Got Is Time)",
"Fenix TX – Threesome",
"Finger Eleven – Paralyzer",
"Five For Fighting – 100 Years",
"Five For Fighting – Superman (It’s Not Easy)",
"Fleetwood Mac – Don’t Stop",
"Fleetwood Mac – Dreams",
"Fleetwood Mac – Everywhere",
"Fleetwood Mac – Go Your Own Way",
"Fleetwood Mac – Rhiannon",
"Fleetwood Mac – The Chain",
"Flogging Molly – Drunken Lullabies",
"Flogging Molly – What’s Left of the Flag",
"Foo Fighters - Everlong",
"Foo Fighters – All My Life",
"Foo Fighters – Best of You",
"Foo Fighters – Learn To Fly",
"Foo Fighters – My Hero",
"Foo Fighters – The Pretenders",
"Foo Fighters – Times Like These",
"Foster the People – Helena Beat",
"Foster the People – Pumped Up Kicks",

"Frank Sinatra – Fly Me To The Moon",
"Frank Sinatra – My Way",
"Frank Sinatra – New York, New York",
"Frank Sinatra – That’s Life",
"Frank Sinatra – The Way You Look Tonight",
"Frankie Goes To Hollywood – Relax (Come Fighting)",
"Frankie Valli & The Four Seasons – Big Girls Don’t Cry",
"Frankie Valli & The Four Seasons – Can’t Take My Eyes off You",

"Frankie Valli & The Four Seasons – December, 1963 (Oh, What a Night)",

"Frankie Valli & The Four Seasons – Grease",
"Frankie Valli & The Four Seasons – Sherry",
"Franz Ferdinand – Take Me Out",
"Free – Alright Now",
"Fuel – Bad Day",
"Fuel – Hemorrhage (In My Hands)",
"Fuel – Shimmer",
"Garth Brooks – Ain’t Goin’ Down (Till The Sun Comes Up)",

"Garth Brooks – Callin’ Baton Rouge",
"Garth Brooks – Friends In Low Places",
"Garth Brooks – Rodeo",
"Garth Brooks – The Dance",
"Garth Brooks – Two Pina Coladas",
"Gary Allen – Life Ain’t Always Beautiful",
"Gary Allen – Right Where I Need To Be",
"Gary Allen – Smoke Rings In The Dark",
"Gary Numan – Cars",
"Gary Wright – Dreamweaver",
"Gavin DeGraw – Chariot",
"Gavin DeGraw – I Don’t Wanna Be",
"Georgia Satellites – Keep Your Hands to Yourself",
"Ginuwine - Pony",
"Glen Miller Band – A String of Pearls",
"Glen Miller Band – Chattanooga Choo-Choo",
"Glen Miller Band – In The Mood",
"Glen Miller Band – Little Brown Jug",
"Glen Miller Band – Moonlight Serenade",
"Glen Miller Band – Pennsylvania 6-5000",
"Gnarls Barkley - Crazy",
"Go West – King of Wishful Thinking",
"Gogol Bordello – American Wedding",
"Gogol Bordello – Start Wearing Purple",
"Gogol Bordello – Wonderlust King",
"Goldfinger - Superman",
"Goldfinger – 99 Red Balloons",
"Good Charlotte – Girls & Boys",
"Good Charlotte – I Don’t Wanna Be In Love",
"Good Charlotte – I Just Wanna Live",
"Good Charlotte – Lifestyles of the Rich & Famous",
"Good Charlotte – Little Things",
"Good Charlotte – The Anthem",
"Gorillaz – Clint Eastwood",
"Gorillaz – Dare",
"Gorillaz – Feel Good Inc",
"Gorillaz – Kids With Guns",
"Gorillaz – Last Living Souls",
"Gorillaz – New Gold (feat. Tame Impala)",
"Green Day - Basket Case",
"Green Day - Good Riddance (Time Of Your Life)",
"Green Day - Holiday",
"Green Day – All By Myself",
"Green Day – American Idiot",
"Green Day – Boulevard of Broken Dreams",
"Green Day – Brainstew",
"Green Day – Longview",
"Green Day – Minority",
"Green Day – She",
"Green Day – Wake Me Up When September Ends",
"Green Day – Welcome To Paradise",
"Green Day – When I Come Around",
"Gretchen Wilson – Redneck Woman",
"Guns N' Roses - Sweet Child O' Mine",
"Guns N' Roses – Knockin’ On Heaven’s Door",
"Guns N' Roses – November Rain",
"Guns N' Roses – Paradise City",
"Guns N' Roses – Welcome To The Jungle",
"Hank Williams Jr. - A Country Boy Can Survive",
"Hank Williams Jr. – Family Tradition",
"Hank Williams Jr. – Whiskey Bent And Hell Bound",
"Heart – Alone",
"Heart – Barracuda",
"Heart – These Dreams",
"Hinder – Lips Of An Angel",
"Hoobastank – Crawling In The Dark",
"Hoobastank – The Reason",
"Hootie & The Blowfish - Only Wanna Be With You",
"House Of Pain - Jump Around",
"Huey Lewis and the News – Heart And Soul",
"Huey Lewis and the News – If This Is It",
"Huey Lewis and the News – The Power of Love",
"Ice Cube – Check Yo Self",
"Ice Cube – Down For Whatever",
"Ice Cube – It Was A Good Day",
"Iggy Pop - Lust For Life",
"Illiterate Light – Better Than I Used To",
"Illiterate Light – Sweet Beast",
"Incubus – Are You In?",
"Incubus – Drive",
"Incubus – Nice To Know You",
"Incubus – Pardon Me",
"Incubus – Stellar",
"Incubus – The Warmth",
"Incubus – Wish You Were Here",
"INXS – By My Side",
"INXS – Devil Inside",
"INXS – Never Tear Us Apart",
"Jackson 5 - I Want You Back",
"Jackson 5 – ABC",
"Jackson 5 – I’ll Be There",
"James Brown - I Feel Good",
"Jamiroqui – Canned Heat",
"Jamiroqui – Cosmic Girl",
"Jamiroqui – Virtual Insanity",
"JAY-Z – 99 Problems",
"JAY-Z – Big Pimpin’ (feat UGK)",
"JAY-Z – Dirt Off Your Shoulder",
"JAY-Z – Empire State Of Mind (feat. Alicia Keys)",
"JAY-Z – Hard Knock Life",
"Jeff Buckley - Hallelujah",
"Jerry Lee Lewis – Great Balls Of Fire",
"Jerry Lee Lewis – Whole Lotta Shakin’ Goin’ On",
"Jet – Are You Gonna Be My Girl",
"Jet – Cold Hard Bitch",
"Jet – Look What You’ve Done",
"Jewel – Foolish Games",
"Jewel – Who Will Save Your Soul",
"Jewel – You Were Meant For Me",
"Jim Croce – Bad Bad Leroy Brown",
"Jim Croce – You Don’t Mess Around With Jim",
"Jimmy Eat World – Bleed American",
"Jimmy Eat World – Sweetness",
"Jimmy Eat World – The Middle",
"Joan Jett - Bad Reputation",
"Jodi Benson – Part Of Your World (from Satanic",
"Disney’s, The Little Mermaid)",
"Joe Cocker – Feelin’ Alright",
"Joe Cocker – With A Little Help From My Friends",
"Joe Cocker – You Are So Beautiful",
"Joe Cocker – You Can Leave Your Hat On",
"Joe Jackson – Steppin’ Out",
"Joe Walsh – Funk #49",
"Joe Walsh – In The City",
"Joe Walsh – Life’s Been Good",
"Joe Walsh – Rocky Mountain Way",
"John Denver – Country Roads",
"John Denver – Thank God I’m a Country Boy",
"John Mellencamp – Hurts So Good",
"John Mellencamp – Jack 7 Diane",
"John Mellencamp – Pink Houses",
"John Mellencamp – Small Town",
"John Parr – St. Elmos Fire (Man in Motion)",
"Johnny Cash - Jackson",
"Johnny Cash – A Boy Named Sue",
"Johnny Cash – Folsom Prison Blues",
"Johnny Cash – Hurt",
"Johnny Cash – I Walk The Line",
"Johnny Cash – Ring of Fire",
"Journey - Any Way You Want It",
"Journey - Don't Stop Believin'",
"Journey - Lights",
"Journey – Faithfully",
"Journey – Lovin’, Touchin’, Squeezin’",
"Journey – Open Armstrong",
"Journey – Seperate Ways",
"Journey – Wheel In The Sky",
"Jungle - Casio",
"Justin Timberlake - Can't Stop The Feeling",
"Justin Timberlake – Cry Me a River",
"Justin Timberlake – My Love",
"Justin Timberlake – Rock Your Body",
"Justin Timberlake – Sexy Back",
"Justin Timberlake – What Goes Around / Comes Around",

"K-Ci & JoJo - All My Life",
"Kansas – Carry on Wayward Son",
"Kansas – Dust In The Wind",
"Katy Perry – California Gurls",
"Katy Perry – Firework",
"Katy Perry – Hot N Cold",
"Katy Perry – Roar",
"Katy Perry – Teenage Dream",
"Keane – Everybody’s Changing",
"Keane – Somewhere Only We Know",
"Kelly Clarkson – Since U Been Gone",
"Kenny Loggins - Footloose",
"Kenny Loggins – Danger Zone",
"Kings Of Leon - Use Somebody",
"Kings Of Leon – Sex On Fire",
"Kool & The Gang - Celebration",
"Kool & The Gang – Get Down On It",
"Korn – A.D.I.D.A.S.",
"Korn – Alone I Break",
"Korn – Beg for Me",
"Korn – Blind",
"Korn – Falling Away From Me",
"Korn – Freak On a Leash",
"Korn – Here To Stay",
"Korn – Make Me Bad",
"Korn – Thoughtless",
"Korn – Trash",
"La Bouche – Be My Lover",
"Lady Guyguy - Bad Romance",
"Lady Guyguy - Just Dance",
"Lady Guyguy – Born This Way",
"Lady Guyguy – Paparazzi",
"Lady Guyguy – Poker Face",
"Lady Guyguy – Shallow",
"Lady Guyguy – You And I",
"Led Zeppelin – All Of My Love",
"Led Zeppelin – Black Dog",
"Led Zeppelin – Dazed and Confused",
"Led Zeppelin – Dyer Maker",
"Led Zeppelin – Going To California",
"Led Zeppelin – Good Times Bad Timesj",
"Led Zeppelin – Immigrant Song",
"Led Zeppelin – In My Time Of Dying",
"Led Zeppelin – Kashmir",
"Led Zeppelin – Misty  Mountain Hop",
"Led Zeppelin – Stairway To Heaven",
"Led Zeppelin – The Ocean",
"Led Zeppelin – Whole Lotta Love",
"Lenny Kravitz – American Woman",
"Lenny Kravitz – Fly Away",
"Lenny Kravitz – It Ain’t Over Till It’s Over",
"Lenny Kravitz – Mama Said",
"Level 42 - Something About You",
"Lil Nas X – Old Town Road (feat. Billy Ray Cyrus)",
"Lil’ Troy – Wanna Be A Baller",
"Limp Bizkit - Faith",
"Limp Bizkit – Break Stuff",
"Limp Bizkit – Hot Dog",
"Limp Bizkit – My Generation",
"Limp Bizkit – My Way",
"Limp Bizkit – N-2 Gether Now",
"Limp Bizkit – Nookie",
"Limp Bizkit – Re-Arranged",
"Limp Bizkit – Rollin",
"Linkin Park – Breaking The Habit",
"Linkin Park – Crawling",
"Linkin Park – In The End",
"Linkin Park – One Step Closer",
"Linkin Park – Papercut",
"Lit - My Own Worst Enemy",
"Little Big Town - Boondocks",
"Little Big Town – Girl Crush",
"Little Big Town – Pontoon",
"Lizzo - Juice",
"Lizzo – About Damn Time",
"Lizzo – Good as Hell",
"Lizzo – Truth Hurts",
"LMFAO - Party Rock Anthem",
"LMFAO – I’m Sexy and I know It",
"Lonestar – Baby I’m Amazed By You",
"Looking Glass - Brandy",
"Los Del Rio - Macarena",
"Louis Armstrong – La vie en rose",
"Louis Armstrong – What A Wonderful World",
"Luke Bryan – Country Girl",
"Luke Combs – Beautiful Crazy",
"Luke Combs – Fast Car",
"Lynyrd Skynyrd - Sweet Home Alabama",
"Lynyrd Skynyrd – Call Me The Breeze",
"Lynyrd Skynyrd – Free Bird",
"Lynyrd Skynyrd – Gimme Three Steps",
"Lynyrd Skynyrd – Simple Man",
"Lynyrd Skynyrd – That Smell",
"Lynyrd Skynyrd – Tuesday’s Gone",
"Lynyrd Skynyrd – What’s Your Name",
"Macklemore – Downtown (feat. Eric Nally,",
"Grandmaster Caz, Kool Moe Dee & Melle Mel)",
"Macklemore – Thrift Shop",
"Macy Gray – I Try",
"Manu Chao – Bongo",
"Manu Chao – Me Gusta",
"Marc Anthony – I Need To Know",
"Marc Anthony – You Sang To Me",
"Marcy Playground – Sex and Candy",
"Marilyn Manson – Beautiful People",
"Marilyn Manson – Disposable Teens",
"Marilyn Manson – Rock Is Dead",
"Marilyn Manson – Sweet Dreams",
"Marilyn Manson – Tainted Love",
"Marilyn Manson – The Dope Show",
"Mark Bronson - Uptown Funk (feat. Bruno Mars)",
"Mark Morrison – Return of the Mack",
"Maroon 5 - Moves Like Jagger",
"Maroon 5 – Girls Like You",
"Maroon 5 – Harder To Breathe",
"Maroon 5 – Memories",
"Maroon 5 – She Will Be Loved",
"Maroon 5 – Sugar",
"Maroon 5 – Sunday Morning",
"Maroon 5 – This Love",
"Marvin Gaye – Ain’t No Mountain High Enough",
"Marvin Gaye – I Heard It Through The Grapevine",
"Marvin Gaye – Let’s Get It On",
"Marvin Gaye – Sexual Healing",
"Marvin Gaye – What’s Going On",
"Mary J. Blige – Family Affair",
"Matchbox 20 – 3AM",
"Matchbox 20 – Back 2 Good",
"Matchbox 20 – Bent",
"Matchbox 20 – Bright Lights",
"Matchbox 20 – If You’re Gone",
"Matchbox 20 – Push",
"Matchbox 20 – Real World",
"Matisyahu – King Without a Crown",
"Matisyahu – One Day",
"Matthew Wilder – Break My Stride",
"Meatloaf – I’d Do Anything For Love (But I Won’t Do That)",

"Meatloaf – Paradise By the DashBoard Light",
"Metallica - The Struggle Within",
"Metallica – Don’t Tread On Me",
"Metallica – Enter Sandman",
"Metallica – Fuel",
"Metallica – Master of Puppets",
"Metallica – Nothing Else Matters",
"Metallica – Sad But True",
"Metallica – The Unforgiven",
"Metallica – The Unforgiven II",
"Metallica – Through The Never",
"Metallica – Wherever I May Roam",
"MGMT – Electric Feel",
"MGMT – Kids",
"MGMT – Time To Pretend",
"Michael Andrews – Mad World",
"Michael Jackson - Billie Jean",
"Michael Jackson - Thriller",
"Michael Jackson – Beat It",
"Michael Jackson – Don’t Stop Till You Get Enough",
"Michael Jackson – Man In The Mirror",
"Michael Jackson – Rock With You",
"Michael Jackson – Smooth Criminal",
"Michael Jackson – The Way You Make Me Feel",
"Michelle Branch – Everywhere",
"Miley Cyrus – Flowers",
"Miley Cyrus – Party In The U.S.A.",
"Miley Cyrus – Wrecking Ball",
"Moby – Extreme Ways",
"Moby – Porcelain",
"Modest Mouse – Float On",
"Montell Jordan - This Is How We Do It",
"Morgan Wallen – Last Night",
"Morgan Wallen – Wasted On You",
"Morgan Wallen – Whiskey Glasses",
"Mötley Crüe– Girls, Girls, Girls",
"Mötley Crüe– Home Sweet Home",
"Mötley Crüe– Kickstart My Heart",
"Motörhead - Ace Of Spades",
"My Chemical Romance - Teenagers",
"My Chemical Romance – Welcome to the Black Parade",

"Naked Eyes – Always Something There To Remind Me",

"Naked Eyes – Promises, Promises",
"Nat King Cole – For Sentimental Reasons",
"Nat King Cole – L.O.V.E.",
"Nat King Cole – The Party’s Over",
"Nat King Cole – Unforgettable",
"Neil Diamond - Sweet Caroline",
"Nelly – #1",
"Nelly – Batter Up (feat. Muphy Lee & Ali)",
"Nelly – Country Grammer",
"Nelly – E.I.",
"Nelly – Hot In Herre",
"Nelly – Just A Dream",
"Nelly – Ride Wit Me (feat. City Spud)",
"Nerf Herder – 5000 Ways To Die",
"New Found Glory – My Friend’s Over You",
"Nickelback – How You Remind Me",
"Nickelback – Rockstar",
"Nickelback – Saturday Night’s Alright (For Fighting)",

"Nickelback – Too Bad",
"Nirvana – All Apologies",
"Nirvana – Come As You Are",
"Nirvana – Heart-Shaped Box",
"Nirvana – In Bloom",
"Nirvana – Lithium",
"Nirvana – Polly",
"Nirvana – Rape Me",
"Nirvana – Smells Like Teen Spirit",
"Nirvana – Something In The Way",
"Nirvana – The Man Who Sold The World",
"Nitty Gritty Dirt Band – Fishin’ in the Dark",
"No Doubt - Just A Girl",
"No Doubt – Don’t Speak",
"No Doubt – Its My Life",
"No Doubt – Spiderwebs",
"Norah Jones – Come Away With Me",
"Norah Jones – Don’t Know Why",
"Norah Jones – Sunrise",
"Norah Jones – The Nearness Of You",
"Norah Jones – The Prettiest Thing",
"Norah Jones – Turn Me On",
"Notorious B.I.G. – Big Poppa",
"NSYNC - Bye Bye Bye",
"NSYNC - Girlfriend",
"Oasis – Champagne Supernova",
"Oasis – Don’t Look Back In Anger",
"Oasis – Wonderwall",
"Of Montreal – Gronlandic Edit",
"Of Montreal – Tim I Wish You Were Born a Girl",
"Offspring – Gone Away",
"Offspring – Pretty Fly (For A White Guy)",
"Offspring – Self Esteem",
"Offspring – She’s Got Issues",
"Offspring – Staring At The Sun",
"Offspring – The Kids Aren’t Alright",
"Offspring – Why Don’t You Get A Job",
"Old Crow Medicine Show – Wagon Wheel",
"OMC – How Bizarre",
"One Direction – What Makes You Beautiful",
"Orgy – Blue Monday",
"Otis Redding – (Sittin’ On) the Dock of the Bay",
"Outkast - Hey Ya!",
"Outkast - Ms. Jackson",
"Outkast - Roses",
"Outkast - So Fresh, So Clean",
"Outkast – ATLiens",
"Outkast – B.O.B. (Bombs Over Baghdad)",
"Outkast – Rosa Parks",
"Outkast – SpottieOttieDopaliscious",
"Outkast – The Whole World (feat. Killer Mike)",
"Ozzy Osbourne – Crazy Train",
"Ozzy Osbourne – Dreamer",
"Ozzy Osbourne – Goodbye Romance",
"Ozzy Osbourne – Mama, I’m Coming Home",
"Ozzy Osbourne – Mr. Crowley",
"Ozzy Osbourne – No More Tears",
"Ozzy Osbourne – Old LA Tonight",
"Ozzy Osbourne – Paranoid",
"Ozzy Osbourne – Perry Mason",
"P.O.D. – Alive",
"P.O.D. – Boom",
"P.O.D. – Youth Of The Nation",
"Pantera – Cemetary Gates",
"Pantera – Cowboys from Hell",
"Pantera – This Love",
"Pantera – Walk",
"Papa Roach – Last Resort",
"Paramore - Ain't It Fun",
"Pat Benatar - Hit Me With Your Best Shot",
"Paul McCartney & Wings -",
"Paul McCartney & Wings – Band On The Run",
"Paul McCartney & Wings – Live And Let Die",
"Paul Simon -  Me and Julio Down by the Schoolyard",
"Paul Simon – 50 Ways to Leave Your Lover",
"Paul Simon – Kodachrome",
"Paul Simon – Late in the Evening",
"Paul Simon – You Can Call Me Al",
"Pearl Jam – Alive",
"Pearl Jam – Better Man",
"Pearl Jam – Black",
"Pearl Jam – Even Flow",
"Pearl Jam – Jeremy",
"Pearl Jam – Last Kiss",
"Pharrell Williams - Happy",
"Phil Collins – Against All Odds (Take a Look at Me Now)",

"Phil Collins – Another Day in Paradise",
"Phil Collins – Easy Lover",
"Phil Collins – In the Air Tonight",
"Pink - Get The Party Started",
"Pink – So What",
"Pink Floyd – Brick In The Wall",
"Pink Floyd – Comfortably Numb",
"Pink Floyd – Hey You",
"Pink Floyd – Money",
"Pink Floyd – Time",
"Pink Floyd – Us And Them",
"Pink Floyd – Wish You Were Here",
"Pitbull - Fireball",
"Plain White T’s – Hey There Delilah",
"Player – Baby Come Back",
"Poison – Every Rose Has Its Thorn",
"Poison – Nothing But A Good Time",
"Primus – Lacquer Head",
"Primus – The Ballad Of Badacious",
"Prince – 1999",
"Prince – Darling Nikki",
"Prince – I Wanna Be your Lover",
"Prince – I Would Die 4 U",
"Prince – Kiss",
"Prince – Let’s Go Crazy",
"Prince – Little Red Corvette",
"Prince – Purple Rain",
"Prince – Raspberry Beret",
"Prince – When Doves Cry",
"Puddle Of Mudd - Blurry",
"Puddle Of Mudd – She F***ing Hates Me",
"Queen - Bohemian Rhapsody",
"Queen - Don't Stop Me Now",
"Queen – Another One Bites The Dust",
"Queen – Crazy Little Thing Called Love",
"Queen – Fat Bottomed Girls",
"Queen – I Want To Break Free",
"Queen – Love Of My Life",
"Queen – Radio Gaga",
"Queen – Somebody To Love",
"Queen – We Will Rock You / We Are The Champions",
"Queen – You’re My Best Friend",
"Queens Of The Stone Age – Go With The Flow",
"Queens Of The Stone Age – No One Knows",
"R. Kelly – Bump n’ Grind",
"R. Kelly – I Believe I Can Fly",
"R. Kelly – Ignition (Remix)",
"R.E.M. – Everybody Hurts",
"R.E.M. – It’s The End Of The World As We Know It",
"(And I Feel Fine)",
"R.E.M. – Losing My Religion",
"R.E.M. – Man On The Moon",
"R.E.M. – The One I Love",
"Radiohead - Lucky",
"Radiohead – 15 Step",
"Radiohead – 2 + 2 = 5",
"Radiohead – A Wolf At the Door",
"Radiohead – Airbag",
"Radiohead – All I Need",
"Radiohead – Backdrifts",
"Radiohead – Climbing Up The Walls",
"Radiohead – Creep",
"Radiohead – Exit Music (For A Film)",
"Radiohead – Fake Plastic Trees",
"Radiohead – High and Dry",
"Radiohead – House Of Cards",
"Radiohead – In Limbo",
"Radiohead – Karma Police",
"Radiohead – Morning Bell",
"Radiohead – Paranoid Android",
"Radiohead – Pyramid Song",
"Radiohead – Reckoner",
"Radiohead – Sail To The Moon",
"Radiohead – Sit Down. Stand Up",
"Radiohead – Street Spirit (Fade Out)",
"Radiohead – Subterranean Homesick Alien",
"Radiohead – There, There",
"Radiohead – Weird Fishes / Arpeggi",
"Rage Against The Machine - Killing In The Name",
"Rage Against The Machine – Bombtrack",
"Rage Against The Machine – Bulls On Parade",
"Rage Against The Machine – Know Your Enemy",
"Rage Against The Machine – People Of The Sunday",
"Rage Against The Machine – Sleep Now In The Fire",
"Rammstein – Du Hast",
"Rammstein – Engel",
"Rammstein – Sensucht",
"Rammstein – Tier",
"Rancid – Ruby Soho",
"Rancid – Salvation",
"Rancid – Time Bomb",
"Rascal Flatts – Bless The Broken Road",
"Rascal Flatts – Life is a Highway",
"Rascal Flatts – My Wish",
"Rascal Flatts – What Hurts The Most",
"Red Hot Chili Peppers - Californication",
"Red Hot Chili Peppers – Breaking The Girl",
"Red Hot Chili Peppers – By The Way",
"Red Hot Chili Peppers – Otherside",
"Red Hot Chili Peppers – Scar Tissue",
"Red Hot Chili Peppers – Snow (Hey Oh)",
"Red Hot Chili Peppers – Soul To Squeeze",
"Red Hot Chili Peppers – Under The Bridge",
"Redbone – Come And Get Your Love",
"Rehab – Bartender",
"REO Speedwagon – Can’t Fight This Feeling",
"REO Speedwagon – Keep on Loving You",
"REO Speedwagon – Roll with the Changes",
"REO Speedwagon – Take It On the Run",
"Rick Astley - Never Gonna Give You Up",
"Rick Astley – Together Forever",
"Right Said Fred – I’m Too Sexy",
"Rihanna - Don't Stop The Music",
"Rihanna - Umbrella",
"Rihanna - We Found Love",
"Rihanna – Diamond",
"Rob Base & DJ EZ Rock - It Takes Two",

"Robbie Williams – Angels",
"Robbie Williams – Millenium",
"Robin Thicke – Burred Lines (feat T.I. & Pharrell Williams)",

"Rocky Horror Picture Show – Time Warp",

"Roger Creager – Rancho Grande",
"Roy Orbison – Crying",
"Roy Orbison – Dream Baby (How Long Must I Dream)",
"Roy Orbison – Oh, Pretty Woman",
"Roy Orbison – Only the Lonely (Know the Way I Feel)",
"Roy Orbison – Running Scared",
"Roy Orbison – Uptown",
"Roy Orbison – You Got It",
"Rupert Holmes - Escape (The Pina Colada Song)",
"Salt-N-Pepa - Push It",
"Santana - Smooth",
"Santana – Black Magic Woman",
"Santana – Evil Ways",
"Sara Bareilles – Love Song",
"Sara Evans – Sids in the Bucket",
"Sarah McLaughlin – Arms Of The Angel",
"Scarface – No More Tears",
"Scott H. Biram – Lost Case Of Being Found",
"Scott H. Biram – Lost Highway (Hank Willliams)",
"Scott H. Biram – Open Road",
"Scott H. Biram – Truckdriver",
"Seven Mary Three - Cumbersome",
"Shaggy - It Wasn't Me",
"Shakira - Hips Don't Lie",
"Shania Twain – Any Man Of Mine",
"Shania Twain – From This Moment",
"Shania Twain – Man! I Feel Like A Woman!",
"Shania Twain – That Don’t Imprees Me Much",
"Shania Twain – You’re Still The One",
"Silverchair – Abuse Me",
"Silverchair – Ana’s Song (Open Fire)",
"Silverchair – Anthem for the Year 2000",
"Silverchair – Freak",
"Silverchair – Israel’s Son",
"Silverchair – Learn to Hate",
"Silverchair – Straight Lines",
"Silverchair – Tomorrow",
"Simon & Garfunkle - Cecilia",
"Simon & Garfunkle – Mrs. Robinson",
"Simon & Garfunkle – Scarborough Fair / Caticle",
"Simon & Garfunkle – The Boxer",
"Simon & Garfunkle – The Sound of Silence",
"Simple Minds – Don’t You",
"Simple Plan – I’m Just a Kid",
"Simple Plan – Perfect",
"Sisqó– Thong Song",
"Sister Sledge - We Are Family",
"Slayer – Raining Blood",
"Smash Mouth - All Star",
"Smash Mouth - I'm A Believer",
"Smash Mouth – Walking On The Sun",
"Smashing Pumpkins - Landslide",
"Smashing Pumpkins – 1979",
"Smashing Pumpkins – Ava Adore",
"Smashing Pumpkins – Bullet With Butterfly Wings",

"Smashing Pumpkins – Today",
"Smashing Pumpkins – Zero",
"Snoop Dogg – Ain’t No Fun (If The Homies",
"Can’t Have None)",
"Snoop Dogg – Drop It Like Its Hot",
"Snoop Dogg – Gin and Juice",
"Snoop Dogg – Lodi Dodi",
"Snoop Dogg – Next Episode",
"Snoop Dogg – Nuthin’ But A “G” Thang",
"Snoop Dogg – Young, Wild & Freestone",
"Something Corporate – I Woke Up In A Car",
"Soundgarden – Black Hole Sun",
"Soundgarden – The Day I Tried To Live",
"Spacehog – In the Meantime",
"Spice Girls - Wannabe",
"Staind - Outside",
"Staind – For You",
"Staind – It’s Been Awhile",
"Staind – So Far Away",
"Static X – I’m With Stupid",
"Static X – Push It",
"Stealers Wheel – Stuck In The Middle With you",
"Steely Dan – Black Cow",
"Steely Dan – Do It Again",
"Steely Dan – My Old School",
"Steely Dan – Peg",
"Steely Dan – Reeling In The Years",
"Steely Dan – Rikki Don’t Lose That Number",
"Steppenwolf - Born To Be Wild",
"Steppenwolf – Magic Carpet Ride",
"Steve Earle – Copperhead Road",
"Steve Miller Band – Abracadabra",
"Steve Miller Band – Fly Like An Eagle",
"Steve Miller Band – Jet Airliner",
"Steve Miller Band – Jungle Love",
"Steve Miller Band – Rock’n Me",
"Steve Miller Band – Take The Money And Run",
"Steve Miller Band – The Joker",
"Steve Perry – Oh Sherrie",
"Steve Winwood – Back In The High Life Again",
"Steve Winwood – Gimme Some Lovin’",
"Steve Winwood – Higher Love",
"Steve Winwood – Valerie",
"Stevie Ray Vaughan – Pride and Joy",
"Stevie Ray Vaughan – Texas Flood",
"Stevie Wonder - Superstition",
"Stevie Wonder – Boogie On reggae Woman",
"Stevie Wonder – Higher Ground",
"Stevie Wonder – I Wish",
"Stevie Wonder – Livin’ For The City",
"Stevie Wonder – My Cherie Amour",
"Stevie Wonder – Rainbow In The Sky",
"Stevie Wonder – Signed, Sealed, Delivered",

"Stevie Wonder – Sir Duke",
"Stone Temple Pilots - Vasoline",
"Stone Temple Pilots – Creep",
"Stone Temple Pilots – Dead & Bloated",

"Stone Temple Pilots – Interstate Love Song",

"Stone Temple Pilots – Plush",
"Sublime – 40oz. To Freedom",
"Sublime – 5446 Thats My Number/Ball And Chain",
"Sublime – Badfish",
"Sublime – Caress Me Down",
"Sublime – Date Rape",
"Sublime – Doin’ Time",
"Sublime – KRS-One",
"Sublime – Live At E’s",
"Sublime – Rivers Of Babylon",
"Sublime – Same In The End",
"Sublime – Santeria",
"Sublime – Scarlett Begonias",
"Sublime – Seed",
"Sublime – Smoke Two Joints",
"Sublime – Waiting For My Ruca",
"Sublime – What I Got",
"Sublime – Wrong Way",
"Suicidal Tendencies – Cyco Vision",
"Suicidal Tendencies – Institutionalized",
"Sum 41 – Fat Lip",
"Sum 41 – In Too Deep",
"Sum 41 – Still Waiting",
"Survivor - Eye Of The Tiger",
"System Of A Down – Arials",
"System Of A Down – BYOB",
"System Of A Down – Chop Suey!",
"System Of A Down – Sugar",
"System Of A Down – Toxicity",
"System Of A Down – Violent Pornography",
"Talking Heads – And She Was",
"Talking Heads – Burning Down the House",
"Talking Heads – Once in a Lifetime",
"Talking Heads – Psycho Killer",
"Talking Heads – Take Me to the River",
"Talking Heads – This Must Be the Place",
"Tame Impala – Is It True",
"Tame Impala – It Might Be Time",
"Tame Impala – Lost In Yesterday",
"Tame Impala – The Less I Know The Better",
"Taylor Swift - Shake It Off",
"Taylor Swift - Trouble",
"Taylor Swift – 22",
"Taylor Swift – Black Space",
"Taylor Swift – Love Story",
"Taylor Swift – Shake It Offspring",
"Taylor Swift – We Are Never Ever Getting Back Together",

"Taylor Swift – You Belong With Me",
"Team America (Southpark Movie) – America, F**K Yeah!",

"Team America (Southpark Movie) – Everyone Has AIDS",

"Tears For Fears – Everybody Wants To Rule he World",

"Tears For Fears – Head Over Heels",
"Tenacious D – Fuck Her Gently",
"Tenacious D – The Metal",
"Tenacious D – Tribute",
"Tenacious D – Wonderboy",
"Texas Tornadoes – (Hey Baby) Que Paso",
"The All-American Rejects - Dirty Little Secret",
"The All-American Rejects – Gives You Hell",
"The All-American Rejects – Move Along",
"The All-American Rejects – Swing, Swing",
"The B-52's - Love Shack",
"The Beach Boys - Disney Girls",
"The Beach Boys – California Girls",
"The Beach Boys – Do You Wanna Dance?",
"The Beach Boys – Don’t Worry Baby",
"The Beach Boys – God Only Knows",
"The Beach Boys – Good Vibrations",
"The Beach Boys – Help Me, Rhonda",
"The Beach Boys – I Get Around",
"The Beach Boys – In My Room",
"The Beach Boys – Kokomo",
"The Beach Boys – Little Duece Coupe",
"The Beach Boys – Surfer Girl",
"The Beach Boys – Surfin’ Safari",
"The Beach Boys – Surfin’ U.S.A.",
"The Beach Boys – Would’t It Be Nice",
"The Beatles – 8 Days a Week",
"The Beatles – A Day In The Lifestyles",
"The Beatles – Back In The U.S.S.R.",
"The Beatles – Come Together",
"The Beatles – Don’t Let Me Down",
"The Beatles – Drive My Car",
"The Beatles – Help!",
"The Beatles – Here Comes The Sun",
"The Beatles – Hey Jude",
"The Beatles – I Want You (She’s So Heavy)",
"The Beatles – Lady Madonna",
"The Beatles – Let It Be",
"The Beatles – Michelle",
"The Beatles – Ob-La-Di, Ob-La-Da",
"The Beatles – Strawberry Fields Forever",
"The Beatles – Twist And Shout",
"The Beatles – With A Little Help From My Friends",
"The Beatles – Yesterday",
"The Beatles (Lennon/McCartney) - Because",
"The Black Eyed Peas - I Gotta Feeling",
"The Black Eyed Peas – My Humps",
"The Black Keys – Gold on the Ceiling",
"The Black Keys – Lonely Boy",
"The Black Keys – Tighten Up",
"The Cars – Drive",
"The Cars – Good Times Roll",
"The Cars – It’s All I Can Do",
"The Cars – Just What I Needed",
"The Cars – My Best Friend’s Girl",
"The Cars – Shake It Up",
"The Cars – You’re All I’ve Got Tonight",
"The Chainsmokers - Closer",
"The Clash - Should I Stay Or Should I Go",

"The Clash – Rock The Casbah",
"The Commodores - Brick House",
"The Cure - Just Like Heaven",
"The Cure - Lovesong",
"The Darkness – I Believe in a Thing Called Love",
"The Doobie Brothers – Black Water",
"The Doobie Brothers – China Grove",
"The Doobie Brothers – Listen To The Music",
"The Doobie Brothers – Long Train Runnin’",
"The Doobie Brothers – Takin’ It To The Streets",
"The Doobie Brothers – What a Fool Believes",
"The Doors – Break on Through (To the Other Side)",
"The Doors – Five to One",
"The Doors – Hello, I Love You",
"The Doors – L.A. Woman",
"The Doors – Light My Fire",
"The Doors – Love Her Madly",
"The Doors – Love Me Two Times",
"The Doors – Riders on the Storm",
"The Doors – Roadhouse Blues",
"The Doors – Touch Me",
"The Format – The First Single (You Know Me)",
"The Format – Tune Out",
"The Foundations – Build Me Up Buttercup",
"The Fray – How to Save a Life",
"The Fray – Over Me Head (Cable Car)",
"The Jacksons – Blame It On The Boogie",
"The Killers - Mr. Brightside",
"The Killers - Somebody Told Me",
"The Killers – When You Were Young",
"The Lonely Island – Dick In A Box",
"The Lonely Island – I’m On A Boat",
"The Monkees - I'm A Believer",
"The Monkees – Daydream Believer",
"The Outfield - Your Love",
"The Police - Every Little Thing She Does Is Magic",
"The Police – Don’t Stand So Close To Me",
"The Police – Every Breath You Take",
"The Police – Message In A Bottle",
"The Police – Roxanne",
"The Pretenders – Brass In Pocket",
"The Refreshments - Banditos",
"The Righteous Brothers – Unchained Melody",
"The Righteous Brothers – You’ve Lost That Lovin’ Feelin’",

"The Rolling Stones - Start Me Up",
"The Rolling Stones – Beast Of Burden",
"The Rolling Stones – Brown Sugar",
"The Rolling Stones – Gimme Shelter",
"The Rolling Stones – Honky Tonk Woman",
"The Rolling Stones – Miss You",
"The Rolling Stones – Paint It, Black",
"The Rolling Stones – Sympathy For The Devil",

"The Rolling Stones – Under My Thumb",
"The Rolling Stones – You Can’t Always Get What You Want",

"The Romantics – Talking In Your Sleep",
"The Romantics – What I Like About You",
"The Strokes - Last Nite",
"The Strokes – You Only Live Once",
"The Temptations - My Girl",
"The Verve – Bittersweet Symphony",
"The Verve Pipe – The Freshman",
"The Wallflowers - 6th Avenue Heartache",
"The Wallflowers – One Headlight",
"The Weekend – Blinding Lights",
"The Weekend – Can’t Feel My Face",
"The Weekend – Save Your Tears",
"The White Stripes – Dead Leaves and the Dirty Ground",

"The White Stripes – Fell In Love With a Girl",
"The White Stripes – My Doorbell",
"The White Stripes – Seven Nation Army",
"The White Stripes – We’re Going to Be",
"Thin Lizzy – The Boys Are Back In Town",
"Third Eye Blind – Graduate",
"Third Eye Blind – How’s It Going to Be",
"Third Eye Blind – Jumper",
"Third Eye Blind – Never Let You Go",
"Third Eye Blind – Semi-Charmed Life",
"Tiffany – I Think We’re Alone Now",
"Tim McGraw – Back When",
"Tim McGraw – BBQ Stain",
"Tim McGraw – Don’t Take The Girl",
"Tim McGraw – Down On The Farm",
"Tim McGraw – I Like It, I Love It",
"Tim McGraw – Indian Outlaw",
"Tim McGraw – Its Your Love (fear. Faith Hill)",
"Tim McGraw – Just To See You Smile",
"Tim McGraw – Live Like You Were Dying",
"Tim McGraw – My Next 30 Years",
"Tim McGraw – She Never Lets It Go To Her Heart",
"Tim McGraw – Where The Green Grass Grows",
"Tina Turner – Proud Mary",
"Tina Turner – What’s Love Got to Do with It",
"TLC - No Scrubs",
"TLC - Waterfalls",
"Toby Keith – Beer For My Horses",
"Toby Keith – Courtesy Of The Red, White, And Blue",
"Toby Keith – I Love This Bar",
"Toby Keith – Red Solo Cup",
"Toby Keith – Should’ve Been A Cowboy",
"Tom Petty – American Girl",
"Tom Petty – Breakdown",
"Tom Petty – Don’t Do Me Like That",
"Tom Petty – Free Fallin’",
"Tom Petty – I Won’t Back Down",
"Tom Petty – Learn To Fly",
"Tom Petty – Mary Jane’s Last Dance",
"Tom Petty – Runnin’ Down A Dream",
"Tom Petty – You Don’t Know How It Feels",

"Tom Petty – You Wreck Me",
"Tom Waits – Christmas Card From A",
"Hooker In Minneapolis",
"Tom Waits – Goin’ Out West",
"Tom Waits – Warm Beer and Cold Women",
"Tonic – If You Could Only See",
"Tonic – You Wanted More",
"Toto - Africa",
"Toto - Rosanna",
"Toto – Hold The Line",
"Trace Adkins – Every Light In The House",
"Trace Adkins – Honky Tonk Badonkadonk",
"Tracy Chapman – Fast Car",
"Tracy Chapman – Give Me One Reason",
"Train – Drive By",
"Train – Drops of Jupiter (Tell Me)",
"Train – Hey, Soul Sister",
"Tupac - Changes",
"Tupac – California Love",
"U2 – Beautiful Day",
"U2 – I Still Haven’t Found What I’m Looking For",
"U2 – New Year’s Day",
"U2 – Pride (In The Name Of Love)",
"U2 – Sunday Bloody Sunday",
"U2 – Where The Streets Have No Name",
"U2 – With Or Without You",
"UGK – Int’l Players Anthem (I Choose You)",
"Usher - Yeah!",
"Van Halen - Panama",
"Van Halen – Ain’t Talkin’ Bout Love",
"Van Halen – Hot for Teacher",
"Van Halen – Jamie’s Cryin’",
"Van Halen – Jump",
"Van Halen – Right Now",
"Van Halen – Runnin’ with the Devil",
"Van Halen – You Really Got Me",
"Van Morrison - Brown Eyed Girl",
"Van Morrison – Into The Mystic",
"Van Morrison – Moondance",
"Van Morrison – Wild Night",
"Vanessa Carlton – 1000 Miles",
"Vanilla Ice - Ice Ice Baby",
"Village People – Y.M.C.A.",
"Violent Femmes – Blister In The Sun",
"Walk The Moon - Shut Up And Dance",
"Wall Of Voodoo – Mexican Radio",
"Warren G – Regulate (feat. Nate Dogg)",
"Weezer - Beverly Hills",
"Weezer – Buddy Holly",
"Weezer – Hash Pipe",
"Weezer – Island In The Sun",
"Weezer – Say It Ain’t So",
"Weezer – Undone – The Sweater Song",
"Wheatus - Teenage Dirtbag",
"Whitesnake – Here I Go Again On My Own",
"Whitney Houston - I Wanna Dance With Somebody",

"Whitney Houston – I Will Always Love You",
"Wild Cherry - Play That Funky Music",
"Will Smith - Gettin' Jiggy Wit It",
"Willie Nelson – Always On My Mind",
"Wilson Pickett – Mustang Sally",
"Zac Brown Band – Chicken Fried",
"Zac Brown Band – Toes",
"ZZ Top - Legs",
"ZZ Top - Sharp Dressed Man",
"ZZ Top – Gimme All Your Lovin’",
"ZZ Top – I’m Bad, I’m Nationwide",
"ZZ Top – La Grange",
"ZZ Top – Tush"

];

// ---------- UI references ----------
const listEl = document.getElementById('songList');
const searchInput = document.getElementById('searchInput');
const alphaBar = document.getElementById('alphaBar');
const clearBtn = document.getElementById('clearBtn');
const showAllBtn = document.getElementById('showAllBtn');
const downloadTxt = document.getElementById('downloadTxt');
const toastEl = document.getElementById('toast');
const listWrap = document.getElementById('listWrap');

// Because the songs array is large, we render in small chunks for snappier feel.
function makeList(items) {
  listEl.innerHTML = '';
  const frag = document.createDocumentFragment();

  items.forEach((s, i) => {
    const li = document.createElement('li');
    li.tabIndex = 0;
    li.setAttribute('role', 'button');
    li.dataset.index = i;

    const span = document.createElement('div');
    span.className = 'title';
    span.textContent = s;

    const copy = document.createElement('div');
    copy.className = 'copy';
    copy.textContent = 'Copy';

    li.appendChild(span);
    li.appendChild(copy);
    frag.appendChild(li);
  });

  listEl.appendChild(frag);
}

// initial render
makeList(songs);

// ---------- alphabet bar ----------
const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
letters.forEach(l => {
  const btn = document.createElement('button');
  btn.textContent = l;
  btn.addEventListener('click', () => {
    document.querySelectorAll('.alpha button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterByLetter(l);
    // smooth scroll to top of list
    listWrap.scrollTo({ top: 0, behavior: 'smooth' });
  });
  alphaBar.appendChild(btn);
});

function filterByLetter(letter) {
  const filtered = songs.filter(s => {
    if (!s) return false;
    const t = s.trim();
    const m = t.match(/[A-Z]/i);
    if (!m) return false;
    return m[0].toUpperCase() === letter;
  });
  makeList(filtered.length ? filtered : ['(no matches)']);
}

// ---------- search ----------
let searchTimer = null;
searchInput.addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(()=> applySearch(q), 180);
});

function applySearch(q) {
  document.querySelectorAll('.alpha button').forEach(b => b.classList.remove('active'));
  if (!q) {
    makeList(songs);
    return;
  }
  const filtered = songs.filter(s => s.toLowerCase().includes(q));
  makeList(filtered.length ? filtered : ['(no matches)']);
  // give user an easy visual hint
  if (filtered.length === 1) {
    showToast(`${filtered.length} match`);
  } else {
    showToast(`${filtered.length} matches`);
  }
}

// clear button
clearBtn.addEventListener('click', () => {
  searchInput.value = '';
  document.querySelectorAll('.alpha button').forEach(b => b.classList.remove('active'));
  makeList(songs);
  searchInput.focus();
  showToast('Search cleared');
});

// show all button
showAllBtn.addEventListener('click', () => {
  searchInput.value = '';
  document.querySelectorAll('.alpha button').forEach(b => b.classList.remove('active'));
  makeList(songs);
  listWrap.scrollTo({ top: 0, behavior: 'smooth' });
  showToast('Showing all songs');
});

// ---------- copy to clipboard + highlight ----------
listEl.addEventListener('click', async (ev) => {
  const li = ev.target.closest('li');
  if (!li) return;
  const title = li.querySelector('.title').textContent;
  try {
    await navigator.clipboard.writeText(title);
    li.classList.add('flash');
    setTimeout(()=> li.classList.remove('flash'), 900);
    showToast(`Copied: ${truncate(title, 60)}`);
  } catch (err) {
    // fallback - select text
    const range = document.createRange();
    range.selectNodeContents(li.querySelector('.title'));
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    showToast('Copied (fallback)');
  }
});

// keyboard Enter to copy
listEl.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    e.target.click();
  }
});

// ---------- download .txt ----------
const openPdf = document.getElementById('openPdf');
document.getElementById('downloadTxt')?.addEventListener('click', () => {
  const blob = new Blob([songs.join('\n')], {type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'song-list.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  showToast('song-list.txt ready');
});

// ---------- toast helper ----------
let toastTimer = null;
function showToast(msg, ms = 1800) {
  toastEl.textContent = msg;
  toastEl.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(()=> {
    toastEl.classList.remove('show');
  }, ms);
}

function truncate(str, n){
  return (str.length > n) ? str.slice(0, n-1) + '…' : str;
}

// accessibility: focus list on load
document.addEventListener('DOMContentLoaded', () => {
  listWrap.scrollTop = 0;
  searchInput.focus();
});

// Optional: tiny keyboard navigation (up/down)
let focusedIndex = -1;
document.addEventListener('keydown', (e) => {
  const items = Array.from(listEl.querySelectorAll('li'));
  if (!items.length) return;
  if (e.key === 'ArrowDown') {
    focusedIndex = Math.min(focusedIndex + 1, items.length - 1);
    items[focusedIndex].focus();
    items[focusedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    e.preventDefault();
  } else if (e.key === 'ArrowUp') {
    focusedIndex = Math.max(focusedIndex - 1, 0);
    items[focusedIndex].focus();
    items[focusedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    e.preventDefault();
  } else if (e.key === 'Escape') {
    searchInput.value = '';
    applySearch('');
  }
});



//-------------------------------------------- dashboard javascript --------------------------------------------------

