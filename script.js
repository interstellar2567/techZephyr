var locoScroll; // Declare globally

function locomotiveAnimation() {
    gsap.registerPlugin(ScrollTrigger);

    locoScroll = new LocomotiveScroll({
        el: document.querySelector("#main"),
        smooth: true,

        // for tablet smooth
        tablet: { smooth: true },

        // for mobile
        smartphone: { smooth: true }
    });
    locoScroll.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy("#main", {
        scrollTop(value) {
            return arguments.length
                ? locoScroll.scrollTo(value, 0, 0)
                : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight
            };
        }
    });

    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

    ScrollTrigger.refresh();
}

function loadingAnimation() {

    var tl = gsap.timeline()
    tl.from("#page1", {
        opacity: 0,
        duration: 0.2,
        delay: 0.2
    })
    tl.from("#page1", {
        transform: "scaleX(0.7) scaleY(0.2) translateY(80%)",
        borderRadius: "150px",
        duration: 2,
        ease: "expo.out"
    })
    tl.from("nav", {
        opacity: 0,
        delay: -0.2
    })
    tl.from("#page1 h1, #page1 p, #page1 div", {
        opacity: 0,
        duration: 0.5,
        stagger: 0.2
    })
}

function navAnimation() {
    // No dropdown effects - navbar is static

    // Add click event for "Community projects" nav item
    const navElems = document.querySelectorAll('.nav-elem');
    if (navElems[0]) { // First nav-elem: Community projects
        const link = navElems[0].querySelector('a');
        if (link) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                if (locoScroll) {
                    locoScroll.scrollTo("#page2");
                }
            });
        }
        navElems[0].style.cursor = 'pointer'; // Make it look clickable
    }

    // Add click event for "Where Skills Connect" nav item
    if (navElems[1]) { // Second nav-elem: Where Skills Connect
        navElems[1].addEventListener('click', function() {
            if (locoScroll) {
                locoScroll.scrollTo("#page5");
            }
        });
        navElems[1].style.cursor = 'pointer'; // Make it look clickable
    }
}

function page2Animation() {
    var rightElems = document.querySelectorAll(".right-elem")

    rightElems.forEach(function (elem) {
        elem.addEventListener("mouseenter", function () {




            gsap.to(elem.childNodes[3], {
                opacity: 1,
                scale: 1
            })
        })
        elem.addEventListener("mouseleave", function () {
            gsap.to(elem.childNodes[3], {
                opacity: 0,
                scale: 0
            })
        })
        elem.addEventListener("mousemove", function (dets) {

            gsap.to(elem.childNodes[3], {
                x: dets.x - elem.getBoundingClientRect().x - 90,
                y: dets.y - elem.getBoundingClientRect().y - 215
            })
        })
    })

    // Splash cursor effect for #page2-left
    const page2Left = document.getElementById('page2-left');
    page2Left.addEventListener('mousemove', function(e) {
        const rect = page2Left.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Create splash particle
        const splash = document.createElement('div');
        splash.className = 'splash-particle';
        splash.style.left = x + 'px';
        splash.style.top = y + 'px';
        page2Left.appendChild(splash);

        // Animate the splash
        gsap.fromTo(splash, {
            scale: 0,
            opacity: 1
        }, {
            scale: 1,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            onComplete: function() {
                splash.remove();
            }
        });
    });
}

function page3VideoAnimation() {
    var page3Center = document.querySelector(".page3-center")
    var video = document.querySelector("#page3 video")

    page3Center.addEventListener("click", function () {
        video.play()
        gsap.to(video, {
            transform: "scaleX(1) scaleY(1)",
            opacity: 1,
            borderRadius: 0
        })
    })
    video.addEventListener("click", function () {
        video.pause()
        gsap.to(video, {
            transform: "scaleX(0.7) scaleY(0)",
            opacity: 0,
            borderRadius: "30px"
        })
    })


    var sections = document.querySelectorAll(".sec-right")

    sections.forEach(function (elem) {
        elem.addEventListener("mouseenter", function () {
            elem.childNodes[3].style.opacity = 1
            elem.childNodes[3].play()
        })
        elem.addEventListener("mouseleave", function () {
            elem.childNodes[3].style.opacity = 0
            elem.childNodes[3].load()
        })
    })

}

function page6Animations() {
    gsap.from("#btm6-part2 h4", {
        x: 0,
        duration: 1,
        scrollTrigger: {
            trigger: "#btm6-part2",
            scroller: "#main",
            // markers:true,
            start: "top 80%",
            end: "top 10%",
            scrub: true
        }
    })
}

function parallaxAnimation() {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to("#parallax-bg", {
        backgroundPosition: "50% 0%",
        ease: "none",
        scrollTrigger: {
            trigger: "#skill-sharing-section",
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            scroller: "#main"
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const main = document.getElementById('main');
    main.style.display = 'block'; // Ensure main content is visible

    // Initialize animations
    locomotiveAnimation();
    navAnimation();
    page2Animation();
    page3VideoAnimation();
    page6Animations();
    loadingAnimation();
    parallaxAnimation();
    // Scroll to #page1
    if (locoScroll) {
        locoScroll.scrollTo("#page1");
    }

    // Handle "Back to Top" link with Locomotive Scroll
    const backToTopLink = document.querySelector('a[href="#page1"]');
    if (backToTopLink) {
        backToTopLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (locoScroll) {
                locoScroll.scrollTo("#page1");
            }
        });
    }

    // Voice Navigation Feature
    const askAssistantBtn = document.getElementById('ask-assistant-btn');
    let recognition;
    let isListening = false;

    askAssistantBtn.addEventListener('click', function() {
        if (!isListening) {
            startListening();
        } else {
            stopListening();
        }
    });

    function startListening() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognition = new SpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onstart = function() {
                isListening = true;
                askAssistantBtn.textContent = 'Listening...';
                const popup = document.querySelector('.voice-popup');
                popup.style.display = 'block';
                speak('Listening for your command.');
            };

            recognition.onresult = function(event) {
                const command = event.results[0][0].transcript.toLowerCase();
                handleCommand(command);
            };

            recognition.onend = function() {
                isListening = false;
                askAssistantBtn.textContent = 'Ask Assistant';
                // Keep popup visible for a few seconds before hiding
                setTimeout(function() {
                    const popup = document.querySelector('.voice-popup');
                    popup.style.display = 'none';
                }, 3000); // 3 seconds delay
            };

            recognition.start();
        } else {
            alert('Speech recognition not supported in this browser.');
        }
    }

    function stopListening() {
        if (recognition) {
            recognition.stop();
        }
    }

    function handleCommand(command) {
        if (command.includes('scroll down')) {
            window.scrollBy(0, window.innerHeight);
            speak('Scrolling down.');
        } else if (command.includes('scroll up')) {
            window.scrollBy(0, -window.innerHeight);
            speak('Scrolling up.');
        } else if (command.includes('go to top')) {
            window.scrollTo(0, 0);
            speak('Going to top.');
        } else if (command.includes('what is this page')) {
            speak('This is the Lazarev digital product design agency website.');
        } else {
            speak('Command not recognized. Try saying scroll down, scroll up, go to top, or what is this page.');
        }
    }

    function speak(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 1;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
        }
    }

    // Skill Sharing Platform
    let skills = []; // Mock data array for skills
    let userLocation = null;
    let map = null;

    // Initialize map
    function initMap() {
        map = L.map('map').setView([51.505, -0.09], 13); // Default view
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    }

    // Get user's location
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setView([userLocation.lat, userLocation.lng], 13);
                L.marker([userLocation.lat, userLocation.lng]).addTo(map).bindPopup('<span style="color: black;">You are here</span>').openPopup();
                // Show the map container after getting location
                document.getElementById('map-container').style.display = 'block';
                // Invalidate map size to ensure proper rendering
                setTimeout(function() {
                    if (map) {
                        map.invalidateSize();
                    }
                }, 100);
            }, function(error) {
                console.error('Error getting location:', error);
                alert('Unable to get your location. Please allow location access.');
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    }

    // Haversine formula for distance calculation
    function calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }

    // Post skill form handler
    const skillForm = document.getElementById('skill-form');
    skillForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('skill-name').value;
        const category = document.getElementById('skill-category').value;
        const description = document.getElementById('skill-description').value;
        const type = document.getElementById('skill-type').value;

        if (!userLocation) {
            alert('Please get your location first.');
            return;
        }

        const skill = {
            id: Date.now(), // Add unique ID
            name,
            category,
            description,
            type,
            lat: userLocation.lat,
            lng: userLocation.lng,
            reviews: [] // Initialize empty reviews array
        };

        skills.push(skill);
        alert('Skill posted successfully!');
        skillForm.reset();
    });

    // Search functionality
    const searchBtn = document.getElementById('search-btn');
    searchBtn.addEventListener('click', function() {
        const keyword = document.getElementById('search-keyword').value.toLowerCase();
        const category = document.getElementById('search-category').value;
        const radius = parseInt(document.getElementById('search-radius').value);

        if (!userLocation) {
            alert('Please get your location first.');
            return;
        }

        let filteredSkills = skills.filter(skill => {
            const distance = calculateDistance(userLocation.lat, userLocation.lng, skill.lat, skill.lng);
            return distance <= radius &&
                   (keyword === '' || skill.name.toLowerCase().includes(keyword) || skill.description.toLowerCase().includes(keyword)) &&
                   (category === '' || skill.category === category);
        });

        // Sort by proximity
        filteredSkills.sort((a, b) => {
            const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
            const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
            return distA - distB;
        });

        displayResults(filteredSkills);
        updateMap(filteredSkills);
    });

    // Display results
    function displayResults(results) {
        const resultsList = document.getElementById('results-list');
        resultsList.innerHTML = '';

        if (results.length === 0) {
            resultsList.innerHTML = '<p>No skills found matching your criteria.</p>';
            return;
        }

        results.forEach((skill) => {
            const distance = calculateDistance(userLocation.lat, userLocation.lng, skill.lat, skill.lng).toFixed(2);
            const averageRating = skill.reviews.length > 0 ? (skill.reviews.reduce((sum, r) => sum + r.rating, 0) / skill.reviews.length).toFixed(1) : 'No ratings';
            const skillDiv = document.createElement('div');
            skillDiv.className = 'skill-result';
            skillDiv.innerHTML = `
                <h3>${skill.name}</h3>
                <p><strong>Category:</strong> ${skill.category}</p>
                <p><strong>Type:</strong> ${skill.type}</p>
                <p><strong>Description:</strong> ${skill.description}</p>
                <p><strong>Distance:</strong> ${distance} km</p>
                <p><strong>Average Rating:</strong> ${averageRating} ⭐ (${skill.reviews.length} reviews)</p>
                <div class="reviews-section">
                    <h4>Reviews:</h4>
                    ${skill.reviews.length > 0 ? skill.reviews.map(review => `<p><strong>${review.reviewer}:</strong> ${review.comment} (${review.rating}⭐)</p>`).join('') : '<p>No reviews yet.</p>'}
                    <button class="btn add-review-btn" data-skill-id="${skill.id}">Add Review</button>
                </div>
            `;
            resultsList.appendChild(skillDiv);
        });

        // Add event listeners for add review buttons
        document.querySelectorAll('.add-review-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const skillId = this.getAttribute('data-skill-id');
                addReview(skillId);
            });
        });
    }

    // Function to add a review
    function addReview(skillId) {
        const reviewer = prompt('Your name:');
        const rating = parseInt(prompt('Rating (1-5):'));
        const comment = prompt('Your review:');

        if (reviewer && rating >= 1 && rating <= 5 && comment) {
            const skill = skills.find(s => s.id === parseInt(skillId));
            if (skill) {
                skill.reviews.push({ reviewer, rating, comment });
                // Re-display results to update the UI
                displayResults(skills.filter(skill => {
                    const distance = calculateDistance(userLocation.lat, userLocation.lng, skill.lat, skill.lng);
                    return distance <= parseInt(document.getElementById('search-radius').value) &&
                           (document.getElementById('search-keyword').value.toLowerCase() === '' || skill.name.toLowerCase().includes(document.getElementById('search-keyword').value.toLowerCase()) || skill.description.toLowerCase().includes(document.getElementById('search-keyword').value.toLowerCase())) &&
                           (document.getElementById('search-category').value === '' || skill.category === document.getElementById('search-category').value);
                }).sort((a, b) => {
                    const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
                    const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
                    return distA - distB;
                }));
            }
        } else {
            alert('Invalid input. Please try again.');
        }
    }

    // Update map with markers
    function updateMap(results) {
        // Clear existing markers
        map.eachLayer(function(layer) {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        // Add user location marker
        L.marker([userLocation.lat, userLocation.lng]).addTo(map).bindPopup('You are here');

        // Add skill markers
        results.forEach(skill => {
            const marker = L.marker([skill.lat, skill.lng]).addTo(map);
            marker.bindPopup(`<b>${skill.name}</b><br>${skill.description}<br>Distance: ${calculateDistance(userLocation.lat, userLocation.lng, skill.lat, skill.lng).toFixed(2)} km`);
        });
    }

    // Get location button
    const getLocationBtn = document.getElementById('get-location-btn');
    getLocationBtn.addEventListener('click', getUserLocation);

    // Initialize map on page load
    initMap();

    // 3D Animations for Skill Sharing Section
    function init3DAnimations() {
        // Floating animation for skill results on load
        gsap.fromTo('.skill-result', {
            y: 50,
            opacity: 0,
            rotationX: -15,
            transformOrigin: 'center bottom'
        }, {
            y: 0,
            opacity: 1,
            rotationX: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#results-section',
                start: 'top 80%',
                scroller: '#main'
            }
        });

        // 3D rotation on hover for form elements
        gsap.set('#post-skill-form, #search-section', { transformStyle: 'preserve-3d' });

        // Animate map markers with 3D effect
        gsap.fromTo('#map-container', {
            scale: 0.9,
            rotationY: -10,
            opacity: 0
        }, {
            scale: 1,
            rotationY: 0,
            opacity: 1,
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '#map-container',
                start: 'top 80%',
                scroller: '#main'
            },
            onComplete: function() {
                if (map) {
                    map.invalidateSize();
                }
            }
        });

        // Parallax 3D effect for background
        gsap.to('#parallax-bg', {
            backgroundPosition: '50% 0%',
            ease: 'none',
            scrollTrigger: {
                trigger: '#skill-sharing-section',
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
                scroller: '#main'
            }
        });

        // 3D hover effects for buttons
        gsap.set('#post-skill-btn, #search-btn, #get-location-btn', { transformStyle: 'preserve-3d' });

        // Add subtle continuous floating to the entire section
        gsap.to('#skill-sharing-section', {
            y: '+=10',
            duration: 3,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1
        });
    }

    // Initialize 3D animations after DOM content loaded
    init3DAnimations();

    // 3D Floating Animation for the Entire Skill Sharing Section
    gsap.to("#skill-sharing-section", {
        y: -5,
        rotationX: 1,
        rotationY: 1,
        duration: 3,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1
    });

    // 3D Hover Effects for the Entire Section
    document.getElementById('skill-sharing-section').addEventListener('mouseenter', () => {
        gsap.to("#skill-sharing-section", {
            rotationX: 3,
            rotationY: 3,
            z: 50,
            duration: 0.5,
            ease: "power2.out"
        });
    });

    document.getElementById('skill-sharing-section').addEventListener('mouseleave', () => {
        gsap.to("#skill-sharing-section", {
            rotationX: 0,
            rotationY: 0,
            z: 0,
            duration: 0.5,
            ease: "power2.out"
        });
    });

    // Mouse-based 3D Tilt Effect for the Entire Section
    document.getElementById('skill-sharing-section').addEventListener('mousemove', (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -15; // Increased sensitivity for more dramatic effect
        const rotateY = (x - centerX) / centerX * 15;

        gsap.to("#skill-sharing-section", {
            rotationX: rotateX,
            rotationY: rotateY,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    document.getElementById('skill-sharing-section').addEventListener('mouseleave', () => {
        gsap.to("#skill-sharing-section", {
            rotationX: 0,
            rotationY: 0,
            duration: 0.5,
            ease: "power2.out"
        });
    });

    // Three.js 3D Background Scene
    function initThreeJSBackground() {
        const section = document.getElementById('skill-sharing-section');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0); // Transparent background
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.top = '0';
        renderer.domElement.style.left = '0';
        renderer.domElement.style.zIndex = '0';
        renderer.domElement.style.opacity = '0.3'; // Low opacity to blend with existing background
        section.appendChild(renderer.domElement);

        // Create floating particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 100;
        const positions = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 20;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            color: 0x27eef5,
            size: 0.1,
            transparent: true,
            opacity: 0.8
        });

        const particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);

        // Add some floating cubes
        const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x27eef5, transparent: true, opacity: 0.5 });
        const cubes = [];

        for (let i = 0; i < 10; i++) {
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.set(
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20,
                (Math.random() - 0.5) * 20
            );
            cubes.push(cube);
            scene.add(cube);
        }

        camera.position.z = 10;

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);

            // Rotate particles
            particles.rotation.x += 0.001;
            particles.rotation.y += 0.001;

            // Animate cubes
            cubes.forEach((cube, index) => {
                cube.rotation.x += 0.01 * (index + 1) * 0.1;
                cube.rotation.y += 0.01 * (index + 1) * 0.1;
                cube.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
            });

            renderer.render(scene, camera);
        }

        animate();

        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Initialize Three.js background after DOM content loaded
    initThreeJSBackground();

    // Profile Modal Logic
    const profileBtn = document.getElementById('profile-btn');
    const profileModal = document.getElementById('profile-modal');
    const profileForm = document.getElementById('profile-form');
    const closeProfileModal = document.getElementById('close-profile-modal');

    // Show profile modal
    profileBtn.addEventListener('click', async function() {
        // Fetch user profile data
        const email = 'srichandanprakruti@gmail.com'; // Assuming this is stored or retrieved from session
        try {
            const response = await fetch(`http://localhost:3000/api/profile/${email}`);
            if (response.ok) {
                const profileData = await response.json();
                // Display profile details
                showProfileDetails(profileData);
            } else {
                // If no profile exists, show create form
                showProfileForm();
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            showProfileForm(); // Fallback to form
        }
        profileModal.style.display = 'flex';
    });

    function showProfileDetails(data) {
        const modalContent = document.querySelector('#profile-modal > div');
        modalContent.innerHTML = `
            <h2 style="color: #27EEF5; font-size: 2.5vw; margin-bottom: 15px; text-shadow: 0 0 10px #27EEF5;">Your Profile</h2>
            <p style="color: #fff; margin-bottom: 20px; font-size: 1.2vw;"><strong>Name:</strong> ${data.name}</p>
            <p style="color: #fff; margin-bottom: 20px; font-size: 1.2vw;"><strong>Email:</strong> ${data.email}</p>
            <p style="color: #fff; margin-bottom: 20px; font-size: 1.2vw;"><strong>Phone:</strong> ${data.phone}</p>
            <p style="color: #fff; margin-bottom: 20px; font-size: 1.2vw;"><strong>Skills:</strong> ${data.skills}</p>
            <button id="edit-profile-btn" style="background: #27EEF5; color: #111; border: none; padding: 12px 25px; border-radius: 10px; font-size: 1.2vw; font-weight: bold; cursor: pointer; box-shadow: 0 0 20px #27EEF5; margin-right: 10px;">Edit Profile</button>
            <button type="button" id="close-profile-modal" style="background: transparent; color: #27EEF5; border: 2px solid #27EEF5; padding: 8px 18px; border-radius: 10px; font-size: 1vw; font-weight: bold; cursor: pointer;">Close</button>
        `;

        // Add event listener for edit button
        document.getElementById('edit-profile-btn').addEventListener('click', function() {
            showProfileForm(data);
        });

        // Re-add close event
        document.getElementById('close-profile-modal').addEventListener('click', function() {
            profileModal.style.display = 'none';
        });
    }

    function showProfileForm(existingData = null) {
        const modalContent = document.querySelector('#profile-modal > div');
        modalContent.innerHTML = `
            <h2 style="color: #27EEF5; font-size: 2.5vw; margin-bottom: 15px; text-shadow: 0 0 10px #27EEF5;">${existingData ? 'Edit Your Profile' : 'Create Your Profile'}</h2>
            <p style="color: #fff; margin-bottom: 20px; font-size: 1.2vw;">${existingData ? 'Update your details to connect with the community.' : 'Share your details to connect with the community.'}</p>
            <form id="profile-form">
                <input type="text" id="profile-name" placeholder="Full Name" style="width: 100%; padding: 12px; margin-bottom: 15px; border: 2px solid #27EEF5; border-radius: 10px; background: rgba(255,255,255,0.1); color: #fff; font-size: 1vw;" required value="${existingData ? existingData.name : ''}">
                <input type="email" id="profile-email" placeholder="Email Address" style="width: 100%; padding: 12px; margin-bottom: 15px; border: 2px solid #27EEF5; border-radius: 10px; background: rgba(255,255,255,0.1); color: #fff; font-size: 1vw;" required value="${existingData ? existingData.email : ''}">
                <input type="tel" id="profile-phone" placeholder="Phone Number" style="width: 100%; padding: 12px; margin-bottom: 15px; border: 2px solid #27EEF5; border-radius: 10px; background: rgba(255,255,255,0.1); color: #fff; font-size: 1vw;" required value="${existingData ? existingData.phone : ''}">
                <textarea id="profile-skills" placeholder="Your Skills (e.g., JavaScript, Design, Marketing)" style="width: 100%; padding: 12px; margin-bottom: 15px; border: 2px solid #27EEF5; border-radius: 10px; background: rgba(255,255,255,0.1); color: #fff; font-size: 1vw; resize: vertical; min-height: 60px;" required>${existingData ? existingData.skills : ''}</textarea>
                <button type="submit" style="background: #27EEF5; color: #111; border: none; padding: 12px 25px; border-radius: 10px; font-size: 1.2vw; font-weight: bold; cursor: pointer; box-shadow: 0 0 20px #27EEF5;">${existingData ? 'Update Profile' : 'Save Profile'}</button>
                <button type="button" id="close-profile-modal" style="background: transparent; color: #27EEF5; border: 2px solid #27EEF5; padding: 8px 18px; border-radius: 10px; font-size: 1vw; font-weight: bold; cursor: pointer; margin-top: 8px;">Cancel</button>
            </form>
        `;

        // Re-add form submission handler
        const profileForm = document.getElementById('profile-form');
        profileForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const name = document.getElementById('profile-name').value;
            const email = document.getElementById('profile-email').value;
            const phone = document.getElementById('profile-phone').value;
            const skills = document.getElementById('profile-skills').value;

            try {
                const response = await fetch('http://localhost:3000/api/profile', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email, phone, skills }),
                });

                if (response.ok) {
                    const data = await response.json();
                    alert(data.message);
                    profileModal.style.display = 'none';
                    // Optionally refresh or show details
                } else {
                    const error = await response.json();
                    alert('Error saving profile: ' + error.error);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error saving profile. Please try again.');
            }
        });

        // Re-add close event
        document.getElementById('close-profile-modal').addEventListener('click', function() {
            profileModal.style.display = 'none';
        });
    }

});
