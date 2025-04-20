
window.audioPlayer = null;
window.audioSongs = ['assets/night-changes.mp3', 'assets/happy.mp3'];
window.audioCurrentIndex = 0;
window.audioIsPlaying = false;
window.headphoneIcon = null;

document.addEventListener('DOMContentLoaded', () => {
    
    const nameText = document.getElementById('name-text');
    if (nameText) {
        
        const originalText = nameText.textContent;
        const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let isScrambling = false; // To prevent multiple scrambles at once
        
        // Function to create the scramble effect
        const runScrambleEffect = () => {
            if (isScrambling) return; // Prevent overlapping effects
            
            isScrambling = true;
            let iterations = 0;
            const interval = setInterval(() => {
                nameText.textContent = nameText.textContent.split('')
                    .map((letter, index) => {
                        if (index < iterations) {
                            return originalText[index];
                        }
                        return possibleChars[Math.floor(Math.random() * possibleChars.length)];
                    })
                    .join('');
                
                if (iterations >= originalText.length) {
                    clearInterval(interval);
                    nameText.textContent = originalText;
                    isScrambling = false;
                }
                
                iterations += 1/6;
            }, 30);
        };
        
        
        runScrambleEffect();
        
        
        setInterval(runScrambleEffect, 8000);
        
        
        nameText.addEventListener('mouseover', () => {
            runScrambleEffect();
        });

       
        nameText.style.cursor = 'pointer';
    }

    // Load the header
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        // Check if fetch is supported
        if (window.fetch) {
            fetch('header.html')
                .then(response => response.text())
                .then(data => {
                    headerContainer.innerHTML = data;
                    // After loading header, initialize navigation
                    initNavigation();
                })
                .catch(error => {
                    console.error('Error loading header:', error);
                    // If header fails to load, still initialize navigation with existing elements
                    loadHeaderFallback();
                });
        } else {
            // Fallback for browsers without fetch support
            loadHeaderFallback();
        }
    } else {
        // If header container doesn't exist, initialize navigation anyway
        initNavigation();
    }

    // Handle revolve hint behavior
    const splineContainer = document.getElementById('spline-container');
    const revolveHint = document.getElementById('revolve-hint');
    
    if (splineContainer && revolveHint) {
        // Hide hint when mouse enters the spline container
        splineContainer.addEventListener('mouseenter', () => {
            revolveHint.style.opacity = '0';
        });
        
        // Show hint when mouse leaves the spline container
        splineContainer.addEventListener('mouseleave', () => {
            revolveHint.style.opacity = '1';
        });
        
        // Also handle touch events for mobile
        splineContainer.addEventListener('touchstart', () => {
            revolveHint.style.opacity = '0';
        });
        
        // Set timeout to show hint again if no interaction
        let touchTimeout;
        document.addEventListener('touchend', () => {
            clearTimeout(touchTimeout);
            touchTimeout = setTimeout(() => {
                if (!splineContainer.matches(':hover')) {
                    revolveHint.style.opacity = '1';
                }
            }, 3000);
        });
    }

    // Fallback method to load header
    function loadHeaderFallback() {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    headerContainer.innerHTML = xhr.responseText;
                } else {
                    // If xhr fails, insert basic header structure
                    headerContainer.innerHTML = `
                        <header class="header">
                            <nav>
                                <ul>
                                    <li><a href="#home" class="active">Home</a></li>
                                    <li><a href="#about">About</a></li>
                                    <li><a href="#skills">Skills</a></li>
                                    <li><a href="#projects">Projects</a></li>
                                    <li><a href="#contact">Contact</a></li>
                                </ul>
                            </nav>
                        </header>
                    `;
                }
                initNavigation();
            }
        };
        xhr.open('GET', 'header.html', true);
        xhr.send();
    }

    // Function to initialize navigation and other functionality
    function initNavigation() {
        // Navigation menu functionality
        const navLinks = document.querySelectorAll('nav ul li a');
        const sections = document.querySelectorAll('.section');
        
        // Get spline container and journey section elements
        const splineContainer = document.getElementById('spline-container');
        const journeySection = document.getElementById('the-journey');
        
        // Function to switch active section
        function switchSection(id) {
            // Hide all sections
            sections.forEach(section => {
                section.classList.remove('active');
            });

            // Show the selected section
            const targetSection = document.getElementById(id);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Update active nav link
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
            
            // Show spline container and journey section only in home section, hide in others
            if (splineContainer) {
                if (id === 'home') {
                    splineContainer.style.display = 'block';
                } else {
                    splineContainer.style.display = 'none';
                }
            }
            
            // Also hide/show the journey section
            if (journeySection) {
                if (id === 'home') {
                    journeySection.style.display = 'flex';
                } else {
                    journeySection.style.display = 'none';
                }
            }
        }

        // Add click event to nav links
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = link.getAttribute('href').substring(1);
                switchSection(sectionId);

                // If on mobile, scroll to top
                if (window.innerWidth < 992) {
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Add smooth scrolling for all links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const sectionId = this.getAttribute('href').substring(1);
                switchSection(sectionId);
            });
        });
    }

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Simple form validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }
            
            // For demo purposes, just show an alert
            // In a real application, you would send the data to a server
            alert(`Thank you for your message, ${name}! I'll get back to you soon.`);
            contactForm.reset();
        });
    }

    // Add some subtle animations for glass cards
    const glassCards = document.querySelectorAll('.glass-card');
    
    // Simple reveal animation when in viewport
    const revealCard = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    };
    
    const cardObserver = new IntersectionObserver(revealCard, {
        root: null,
        threshold: 0.1
    });
    
    glassCards.forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        cardObserver.observe(card);
    });

    // Social Icons Animation
    const socialIcons = document.querySelectorAll('.social-links-vertical .social-icon');
    socialIcons.forEach((icon, index) => {
        icon.style.opacity = 0;
        icon.style.transform = 'translateX(20px)';
        icon.style.transition = 'all 0.3s ease';
        icon.style.transitionDelay = `${index * 0.1}s`;
        
        setTimeout(() => {
            icon.style.opacity = 1;
            icon.style.transform = 'translateX(0)';
        }, 500);
    });

    // Remove existing cursor trailer if it exists
    const existingTrailer = document.querySelector('.cursor-trailer');
    if (existingTrailer) {
        existingTrailer.remove();
    }

    // Smooth Cursor Implementation
    const cursorOuter = document.querySelector('.cursor-outer');
    const cursorInner = document.querySelector('.cursor-inner');
    const body = document.body;
    
    let mouseX = 0;
    let mouseY = 0;
    let outerX = 0;
    let outerY = 0;
    let innerX = 0;
    let innerY = 0;
    
    // Update mouse position
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Show cursor when mouse moves
        body.classList.remove('cursor-hidden');
    });
    
    // Hide cursor when mouse leaves window
    document.addEventListener('mouseout', () => {
        body.classList.add('cursor-hidden');
    });
    
    // Animate the cursor with smooth follow
    const animateCursor = () => {
        // Smooth follow for outer cursor
        outerX += (mouseX - outerX) * 0.15;
        outerY += (mouseY - outerY) * 0.15;
        
        // Smoother follow for inner cursor
        innerX += (mouseX - innerX) * 0.25;
        innerY += (mouseY - innerY) * 0.25;
        
        // Apply positions
        if (cursorOuter) {
            cursorOuter.style.transform = `translate(${outerX}px, ${outerY}px)`;
        }
        
        if (cursorInner) {
            cursorInner.style.transform = `translate(${innerX}px, ${innerY}px)`;
        }
        
        // Continue animation
        requestAnimationFrame(animateCursor);
    };
    
    // Start animation
    animateCursor();
    
    // Add hover effects for clickable elements
    const handleHoverEvents = () => {
        const interactiveElements = document.querySelectorAll('a, button, .social-icon, .btn, input, textarea, .project-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                if (cursorOuter) {
                    cursorOuter.style.transition = 'transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease';
                    cursorOuter.style.transform = `translate(${outerX}px, ${outerY}px) scale(1.5)`;
                    cursorOuter.style.backgroundColor = 'rgba(127, 90, 240, 0.1)';
                    cursorOuter.style.borderColor = 'var(--primary-color)';
                }
            });
            
            element.addEventListener('mouseleave', () => {
                if (cursorOuter) {
                    cursorOuter.style.transition = 'transform 0.2s ease, background-color 0.2s ease, border-color 0.2s ease';
                    cursorOuter.style.transform = `translate(${outerX}px, ${outerY}px) scale(1)`;
                    cursorOuter.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    cursorOuter.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }
            });
        });
    };
    
    // Initialize cursor effects if elements exist
    if (cursorOuter && cursorInner) {
        handleHoverEvents();
        // Add the cursor-hidden class initially
        body.classList.add('cursor-hidden');
    }

    // Flying Cards Effect
    const homeSection = document.getElementById('home');
    if (homeSection) {
        // Create flying cards container
        const flyingCardsContainer = document.createElement('div');
        flyingCardsContainer.className = 'flying-cards-container';
        homeSection.appendChild(flyingCardsContainer);

        // Project Card data
        const cardData = [
            { 
                color: '#4ade80', 
                text: 'Angry Birds Game', 
                image: 'images/angry-birds.png', 
            },
            { 
                color: '#f472b6', 
                text: 'Kadena Blockchain', 
                image: 'images/block-chain.png', // Replace with actual image path when available
                
            },
            { 
                color: '#fbbf24', 
                text: 'Research Collab', 
                image: 'images/research-collab.png',
            },
            { 
                color: '#c084fc', 
                text: 'Burn AI', 
                image: 'images/burn-ai.jpg', 
            }
        ];

        // Create flying cards
        cardData.forEach((card, index) => {
            const flyingCard = document.createElement('div');
            flyingCard.className = 'flying-card';
            flyingCard.style.cssText = `
                position: absolute;
                width: 150px;
                height: 190px;
                border-radius: 12px;
                background-color: ${card.color};
                transform-origin: center center;
                box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
                transition: transform 0.5s ease-out, opacity 0.5s ease-out;
                opacity: 0;
                overflow: hidden;
                transform: translate(0, 0) scale(0.5) rotate(0deg);
                z-index: 1;
                pointer-events: none;
            `;
            
            // Card content with image and text (larger title, no description)
            flyingCard.innerHTML = `
                <div style="height: 75%; width: 100%; overflow: hidden; position: relative;">
                    <img src="${card.image}" alt="${card.text}" style="width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0;">
                    <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.7) 100%);"></div>
                </div>
                <div style="height: 25%; display: flex; flex-direction: column; justify-content: center; padding: 8px; background-color: rgba(17, 24, 39, 0.8);">
                    <p style="text-align: center; font-size: 14px; color: white; font-weight: 600; margin: 0; line-height: 1.2;">${card.text}</p>
                </div>
            `;
            
            // Add click event to open project details
            flyingCard.addEventListener('click', () => {
                
                const projectsSection = document.getElementById('projects');
                if (projectsSection) {
                    // Hide all sections
                    document.querySelectorAll('.section').forEach(section => {
                        section.classList.remove('active');
                    });
                    
                    // projects section
                    projectsSection.classList.add('active');
                    
                    //  active nav link
                    document.querySelectorAll('nav ul li a').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#projects') {
                            link.classList.add('active');
                        }
                    });
                }
            });
            
            flyingCardsContainer.appendChild(flyingCard);
        });

        // Get the main glass card and all flying cards
        const mainCard = homeSection.querySelector('.glass-card');
        const flyingCards = flyingCardsContainer.querySelectorAll('.flying-card');
        let hoverTimeouts = [];
        
        // Calculate positions when main card is hovered
        function calculatePositions() {
            const distance = 320; // Increased distance from center
            
            flyingCards.forEach((card, i) => {
                // Calculate position based on index
                const angle = (i / flyingCards.length) * 2 * Math.PI;
                const x = Math.cos(angle) * distance;
                const y = Math.sin(angle) * distance;
                const rotation = (i % 2 === 0) ? 5 : -5; // Alternate rotation
                
                card.dataset.x = x;
                card.dataset.y = y;
                card.dataset.rotation = rotation;
            });
        }
        
        calculatePositions();

        // Reset all cards function
        function resetAllCards() {
            // Clear any pending animations
            hoverTimeouts.forEach(timeout => clearTimeout(timeout));
            hoverTimeouts = [];
            
            // Reset all cards immediately
            flyingCards.forEach((card) => {
                card.style.opacity = '0';
                card.style.transform = 'translate(0, 0) scale(0.5) rotate(0deg)';
            });
        }

        // Handle main card hover
        mainCard.addEventListener('mouseenter', () => {
            // Clear any previous timeouts
            resetAllCards();
            
            // Show cards with staggered animation
            flyingCards.forEach((card, i) => {
                const timeout = setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = `translate(${card.dataset.x}px, ${card.dataset.y}px) scale(1) rotate(${card.dataset.rotation}deg)`;
                }, i * 100);
                hoverTimeouts.push(timeout);
            });
        });

        mainCard.addEventListener('mouseleave', resetAllCards);
        
        // Also reset cards on page scroll or window blur for extra safety
        window.addEventListener('scroll', resetAllCards);
        window.addEventListener('blur', resetAllCards);
        
        // Adjust flying card positions when window is resized
        window.addEventListener('resize', calculatePositions);
    }
    
   
    initVoiceAssistant();

    // Music Player Implementation
    // headphone image
    const headphoneImg = document.createElement('img');
    headphoneImg.src = 'images/headphones.png';
    headphoneImg.alt = 'Headphones';
    headphoneImg.className = 'floating-headphone';
    document.body.appendChild(headphoneImg);
    
    
    window.headphoneIcon = headphoneImg;

    //  audio element
    const audio = document.createElement('audio');
    audio.id = 'customAudio';
    audio.loop = true;
    audio.volume = 0.5; 
    document.body.appendChild(audio);

    // global references
    window.audioPlayer = audio;
    
   
    console.log("Audio player created:", window.audioPlayer);
    console.log("Audio songs available:", window.audioSongs);
    
    // Function to update song source
    const updateSong = (index) => {
        console.log(`Updating song to index ${index}: ${window.audioSongs[index]}`);
        window.audioPlayer.src = window.audioSongs[index];
        window.audioCurrentIndex = index;
        if (window.audioIsPlaying) {
            playAudio();
        }
    };

    
    const playAudio = async () => {
        try {
            console.log("Attempting to play audio");
            const playPromise = window.audioPlayer.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log("Audio playback started successfully");
                    window.audioIsPlaying = true;
                    window.headphoneIcon.classList.add('playing');
                }).catch(err => {
                    console.error("Playback error:", err);
                    // Auto-play was prevented, we need user interaction
                    alert("Please click anywhere on the page to enable audio playback");
                });
            }
        } catch (err) {
            console.error("Error in playAudio function:", err);
        }
    };

    // Function to stop audio
    const stopAudio = () => {
        console.log("Stopping audio");
        window.audioPlayer.pause();
        window.audioPlayer.currentTime = 0;
        window.audioIsPlaying = false;
        window.headphoneIcon.classList.remove('playing');
    };

    // Initialize first song
    updateSong(window.audioCurrentIndex);

    // click events
    headphoneImg.addEventListener('click', async () => {
        try {
            if (!window.audioIsPlaying) {
                // First click: Play first song
                window.audioIsPlaying = true;
                window.audioCurrentIndex = 0;
                updateSong(window.audioCurrentIndex);
                await playAudio();
                console.log('🎵 Playing Song 1');
            } else if (window.audioCurrentIndex === 0) {
                // Second click: Switch to second song
                window.audioCurrentIndex = 1;
                updateSong(window.audioCurrentIndex);
                console.log('🎵 Playing Song 2');
            } else {
                // Third click: Stop playing
                stopAudio();
                console.log('⏸️ Stopped');
            }
        } catch (err) {
            console.error('Playback error:', err);
        }
    });

    // Make sure to expose the audio control functions globally
    window.playAudio = playAudio;
    window.stopAudio = stopAudio;
    window.updateSong = updateSong;
});

// Voice Assistant Implementation
function initVoiceAssistant() {
    //  AI assistant container with explicit positioning
    const aiAssistant = document.createElement('div');
    aiAssistant.style.position = 'fixed';
    aiAssistant.style.bottom = '20px';
    aiAssistant.style.left = '0';
    aiAssistant.style.zIndex = '1000';
    aiAssistant.style.pointerEvents = 'none';
    aiAssistant.style.width = 'auto';
    aiAssistant.style.display = 'flex';
    aiAssistant.style.flexDirection = 'column';
    aiAssistant.style.alignItems = 'flex-start';
    
    // Preload and cache voices as early as possible
    let availableVoices = [];
    let voicesLoaded = false;
    
    function loadVoices() {
        availableVoices = window.speechSynthesis.getVoices();
        voicesLoaded = availableVoices.length > 0;
        return voicesLoaded;
    }
    
    // Try loading voices immediately
    loadVoices();
    
    // Also set up event for when voices are loaded
    if (!voicesLoaded && 'speechSynthesis' in window) {
        window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    }
    
    // spline viewer with its own container
    const splineContainer = document.createElement('div');
    splineContainer.style.pointerEvents = 'auto';
    splineContainer.style.transform = 'scale(0.25)';
    splineContainer.style.transformOrigin = 'bottom left';
    splineContainer.style.margin = '0';
    splineContainer.style.padding = '0';
    splineContainer.style.position = 'relative';
    
    // spline viewer
    const splineViewer = document.createElement('spline-viewer');
    splineViewer.setAttribute('url', 'https://prod.spline.design/6fCT6ICmBBHzwket/scene.splinecode');
    splineViewer.setAttribute('background', 'transparent');
    splineViewer.setAttribute('loading-anim', 'true');
    splineViewer.style.cursor = 'pointer';
    
    
    const splineWrapper = document.createElement('div');
    splineWrapper.style.position = 'relative';
    splineWrapper.style.width = '100%';
    splineWrapper.style.height = '150%';
    
    
    const helloText = document.createElement('div');
    helloText.textContent = 'Hi..I am Pippo!';

    // Gradient glassmorphism background
    helloText.style.background = 'linear-gradient(145deg, rgba(58, 0, 88, 0.3), rgba(255, 0, 128, 0.1))';
    helloText.style.border = '1px solid rgba(255, 255, 255, 0.1)';
    helloText.style.borderRadius = '999px'; // pill shape
    helloText.style.backdropFilter = 'blur(20px)';
    helloText.style.webkitBackdropFilter = 'blur(20px)';
    helloText.style.boxShadow = `
    inset 0 0 10px rgba(255, 0, 128, 0.2),
    0 0 10px rgba(255, 0, 255, 0.2)
    `;

    // Typography
    helloText.style.color = '#ffffff';
    helloText.style.fontSize = '100px';
    helloText.style.fontWeight = '500';
    helloText.style.letterSpacing = '2px';
    helloText.style.fontFamily = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
    helloText.style.textAlign = 'center';
    helloText.style.textTransform = 'uppercase';
    helloText.style.textShadow = '0 0 8px rgba(255, 255, 255, 0.3)';

    // Layout and spacing
    helloText.style.padding = '12px 30px';
    helloText.style.whiteSpace = 'nowrap';
    helloText.style.pointerEvents = 'none';
    helloText.style.zIndex = '100';

    
    helloText.style.position = 'absolute';
    helloText.style.left = '80%'; 
    helloText.style.bottom = '0';
    helloText.style.transform = 'translateX(-50%)';
    
    // Function to update position based on screen size
    const updatePosition = () => {
        if (window.innerWidth < 480) {
            splineContainer.style.transform = 'scale(0.2)';
        } else if (window.innerWidth < 768) {
            splineContainer.style.transform = 'scale(0.22)';
        } else {
            splineContainer.style.transform = 'scale(0.25)';
        }
        
        
        splineViewer.addEventListener('load', () => {
          
            setTimeout(() => {
                const watermarkElement = splineContainer.querySelector('.watermark');
                if (watermarkElement) {
                    
                    const rect = watermarkElement.getBoundingClientRect();
                    if (rect.width > 0) {
                        helloText.style.width = `${rect.width}px`;
                    }
                }
            }, 500);
        });
    };
    
    // Initial position
    updatePosition();
    
   
    window.addEventListener('resize', updatePosition);
    

    splineWrapper.appendChild(splineViewer);
    splineWrapper.appendChild(helloText);
    splineContainer.appendChild(splineWrapper);
    aiAssistant.appendChild(splineContainer);
    document.body.appendChild(aiAssistant);
    
  
    const aiStatus = helloText;
    let recognition;
    let isListening = false;
    
  
    splineViewer.addEventListener('load', () => {
        splineViewer.style.pointerEvents = 'auto';
    });
    
    // Initialize speech recognition 
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
            isListening = true;
            aiStatus.textContent = 'Listening..';
            aiStatus.classList.add('active');
        };
        
        recognition.onend = () => {
            isListening = false;
            aiStatus.textContent = 'Hi..I am Pippo!';
            aiStatus.classList.remove('active');
        };
        
        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            processCommand(command);
        };
    }
    
    
    function processCommand(command) {
        console.log('Received command:', command);
        
        // Navigation and general commands
        if (command.includes('home')) {
            speak('Taking you to the home section');
            navigateToSection('home');
        } else if (command.includes('about')) {
            speak('Navigating to the about section');
            navigateToSection('about');
        } else if (command.includes('skills')) {
            speak('Showing you my skills');
            navigateToSection('skills');
        } else if (command.includes('projects')) {
            speak('Here are my projects');
            navigateToSection('projects');
        } else if (command.includes('contact')) {
            speak('Let\'s get in touch');
            navigateToSection('contact');
        } else if (command.includes('journey')) {
            speak('Exploring my journey');
            navigateToSection('the-journey');
        } else if (command.includes('github')) {
            speak('Opening GitHub profile');
            window.open('https://github.com/yashasvi-official', '_blank');
        } else if (command.includes('linkedin')) {
            speak('Opening LinkedIn profile');
            window.open('https://linkedin.com', '_blank');
        } else if (command.includes('instagram')) {
            speak('Opening Instagram profile');
            window.open('https://www.instagram.com/yashasvi._bansal?igsh=OHZuM2o5M3lzMHZo&utm_source=qr', '_blank');
        } else if (command.includes('discord')) {
            speak('Opening Discord profile');
            window.open('http://discordapp.com/users/715868590556971019', '_blank');
        } else if (command.includes('who are you') || command.includes('who you are')) {
            speak('I am Pippo, your personal assistant');
        } else if (command.includes('your name') || command.includes('name')) {
            speak('I am Pippo');
        } else if (command.includes('your age') || command.includes('how old')) {
            speak('I am as old as the sun and as young as a cocoon');
        }
        // Music control commands with better debugging
        else if (command.includes('play') || command.includes('music')) {
            console.log("Voice command detected: Play music");
            speak('Playing music');
            
            // Ensure the audio player exists
            if (window.audioPlayer) {
                console.log("Calling play audio from voice command");
                window.audioIsPlaying = true;
                window.playAudio();
            } else {
                console.error("Audio player not available");
                speak("Sorry, the audio player is not available");
            }
        } else if(command.includes('stop') || command.includes('pause')) {
            console.log("Voice command detected: Stop music");
            speak('Stopping the music');
            
            if (window.audioPlayer) {
                console.log("Calling stop audio from voice command");
                window.stopAudio();
            } else {
                console.error("Audio player not available");
            }
        } else if(command.includes('next') || command.includes('change song')) {
            console.log("Voice command detected: Next song");
            speak('Playing the next song');
            
            if (window.audioPlayer && window.audioSongs) {
                console.log("Changing to next song from voice command");
                window.audioCurrentIndex = (window.audioCurrentIndex + 1) % window.audioSongs.length;
                window.updateSong(window.audioCurrentIndex);
                window.playAudio();
            } else {
                console.error("Audio player or songs not available");
            }
        } else if(command.includes('how are you')){
            speak('I am fine, thank you for asking');
        }
        else {
            speak('Sorry, I didn\'t understand.');
        }
    }
    
    function navigateToSection(sectionId) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show the target section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Update active nav link
            document.querySelectorAll('nav ul li a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
            
            // Show spline container only in home section, hide in others
            const splineContainer = document.getElementById('spline-container');
            if (splineContainer) {
                if (sectionId === 'home') {
                    splineContainer.style.display = 'block';
                } else {
                    splineContainer.style.display = 'none';
                }
            }
            
            // Also hide/show the journey section
            const journeySection = document.getElementById('the-journey');
            if (journeySection) {
                if (sectionId === 'home') {
                    journeySection.style.display = 'flex';
                } else {
                    journeySection.style.display = 'none';
                }
            }
        }
    }
    
    // Speak function with voice selection
    async function speak(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            
            // Make sure voices are loaded before speaking
            if (!voicesLoaded) {
                // Try loading voices again
                if (!loadVoices()) {
                    // If still not loaded, wait for the event
                    await new Promise(resolve => {
                        const voiceLoadedHandler = () => {
                            loadVoices();
                            window.speechSynthesis.removeEventListener('voiceschanged', voiceLoadedHandler);
                            resolve();
                        };
                        window.speechSynthesis.addEventListener('voiceschanged', voiceLoadedHandler);
                        
                        // Set a timeout in case voices never load
                        setTimeout(resolve, 1000);
                    });
                }
            }
            
           
           
            let selectedVoice = 
            availableVoices.find(voice => voice.name.includes('Microsoft Zira')) ||
            availableVoices.find(voice => voice.name.includes('Google UK English Female')) ||
            availableVoices.find(voice => voice.name.includes('Google US English Female')) ||
                availableVoices.find(voice => voice.name.includes('Female') && voice.lang.includes('en')) ||
                availableVoices.find(voice => voice.lang.includes('en-GB')) ||
                availableVoices.find(voice => voice.lang.includes('en-US'));
            
            // If found, set the voice
            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }
            
            // Adjust parameters for more natural speech
            utterance.rate = 0.8;    
            utterance.pitch = 1.2;    
            utterance.volume = 1.0;   
            
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();
            
            // Start the new speech
            window.speechSynthesis.speak(utterance);
            
            // Return a promise that resolves when speech is done
            return new Promise(resolve => {
                utterance.onend = resolve;
            });
        }
        return Promise.resolve(); // Return resolved promise if speech synthesis not available
    }
    
    // click event to avatar
    splineViewer.addEventListener('click', async () => {
        if (!recognition) {
            alert('Speech recognition is not supported in your browser');
            return;
        }
        
        if (!isListening) {
            // First, speak the greeting
            await speak('How can I help you today?');
            
            // Then start listening AFTER speech is complete
            recognition.start();
        } else {
            recognition.stop();
        }
    });
} 