/**
 * Sandra Sayeg Arquitetura - Main JavaScript
 * Handles lightbox functionality for project galleries
 */

(function() {
    'use strict';

    // Project data with image counts and display names
    const projectData = {
        'casa-da-represa': { count: 34, name: 'Casa da Represa' },
        'gero-panini': { count: 9, name: 'Gero Panini' },
        'apartamento-lh': { count: 15, name: 'Apartamento LH' },
        'casa-af': { count: 15, name: 'Casa AF - Clube de Campo' },
        'casa-cap': { count: 17, name: 'Casa CAP' },
        'casa-ibiuna': { count: 18, name: 'Casa Ibiúna' },
        'casa-tb': { count: 12, name: 'Casa TB' },
        'casa-sn': { count: 30, name: 'Casa SN' },
        'casa-vh': { count: 16, name: 'Casa VH' },
        'duplex-fi': { count: 10, name: 'Duplex FI' },
        'apto-pp': { count: 11, name: 'Apartamento PP' },
        'casa-sao-roque': { count: 4, name: 'Casa São Roque' },
        'casa-as': { count: 23, name: 'Casa A.S.' },
        'casa-valencia': { count: 8, name: 'Casa Valência' },
        'casa-cd': { count: 10, name: 'Casa CD' },
        'apto-fi': { count: 13, name: 'Apartamento FI' },
        'casa-rb': { count: 12, name: 'Casa RB' },
        'apto-iz': { count: 10, name: 'Apartamento IZ' }
    };

    // Lightbox state
    let currentProject = null;
    let currentImages = [];
    let currentIndex = 0;
    let isAnimating = false;
    let touchStartX = 0;
    let touchEndX = 0;

    // DOM Elements
    const lightbox = document.getElementById('lightbox');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxNextImage = document.getElementById('lightbox-next-image');
    const lightboxPreview = document.getElementById('lightbox-preview');
    const lightboxMain = document.querySelector('.lightbox-main');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    // Initialize
    function init() {
        if (!lightbox) return;

        // Bind project card clicks
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', openLightbox);
        });

        // Lightbox controls
        closeBtn?.addEventListener('click', closeLightbox);
        prevBtn?.addEventListener('click', goToPrev);
        nextBtn?.addEventListener('click', goToNext);
        lightboxPreview?.addEventListener('click', goToNext);

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);

        // Touch events for swipe
        lightbox.addEventListener('touchstart', handleTouchStart, { passive: true });
        lightbox.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    // Generate image paths for a project
    function getProjectImages(projectId) {
        const data = projectData[projectId];
        if (!data) return [];

        const images = [];
        const basePath = `images/projects/${projectId}/`;

        for (let i = 1; i <= data.count; i++) {
            const num = i.toString().padStart(2, '0');
            images.push(basePath + num + '.jpg');
        }

        return images;
    }

    // Get project display name
    function getProjectName(projectId) {
        return projectData[projectId]?.name || projectId;
    }

    // Open lightbox for a project
    function openLightbox(e) {
        const card = e.currentTarget;
        currentProject = card.dataset.project;
        currentImages = getProjectImages(currentProject);
        currentIndex = 0;

        if (currentImages.length === 0) {
            return;
        }

        document.body.style.overflow = 'hidden';
        lightbox.classList.add('active');

        // Set title
        if (lightboxTitle) {
            lightboxTitle.textContent = getProjectName(currentProject);
        }

        // Display current image
        updateDisplay();
    }

    // Update the displayed images
    function updateDisplay() {
        if (!lightboxImage) return;

        // Set main image
        lightboxImage.src = currentImages[currentIndex];
        lightboxImage.alt = `${getProjectName(currentProject)} - Imagem ${currentIndex + 1}`;

        // Set preview image (next image)
        const nextIndex = (currentIndex + 1) % currentImages.length;

        if (lightboxNextImage && lightboxPreview) {
            if (currentImages.length > 1) {
                lightboxNextImage.src = currentImages[nextIndex];
                lightboxNextImage.alt = `${getProjectName(currentProject)} - Imagem ${nextIndex + 1}`;
                lightboxPreview.classList.remove('hidden');
            } else {
                lightboxPreview.classList.add('hidden');
            }
        }
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        currentProject = null;
        currentImages = [];
        currentIndex = 0;
    }

    // Go to next image with slide animation
    function goToNext() {
        if (currentImages.length <= 1 || isAnimating) return;

        isAnimating = true;
        const mainDiv = document.querySelector('.lightbox-main');
        const previewDiv = document.querySelector('.lightbox-preview');

        // Get actual main image width for accurate slide distance
        const mainWidth = lightboxImage ? lightboxImage.offsetWidth : 0;
        const slideDistance = mainWidth + 40; // main width + gap

        // Calculate next indices
        const nextIndex = (currentIndex + 1) % currentImages.length;
        const nextNextIndex = (currentIndex + 2) % currentImages.length;

        // Preload the next-next image during animation
        const preloadImg = new Image();
        preloadImg.src = currentImages[nextNextIndex];

        // Apply dynamic slide transforms
        if (mainDiv) {
            mainDiv.style.transform = `translateX(-${mainWidth}px)`;
            mainDiv.style.opacity = '0';
        }
        if (previewDiv) {
            previewDiv.style.transform = `translateX(-${slideDistance}px)`;
            previewDiv.style.opacity = '1';
        }

        // After slide completes
        setTimeout(() => {
            // Update index
            currentIndex = nextIndex;

            // Disable transitions temporarily
            if (mainDiv) {
                mainDiv.style.transition = 'none';
                mainDiv.style.transform = '';
                mainDiv.style.opacity = '';
            }
            if (previewDiv) {
                previewDiv.style.transition = 'none';
                previewDiv.style.transform = '';
                previewDiv.style.opacity = '';
            }

            // Set main image to what preview was showing (already loaded)
            if (lightboxImage && lightboxNextImage) {
                lightboxImage.src = currentImages[currentIndex];
                lightboxImage.alt = `${getProjectName(currentProject)} - Imagem ${currentIndex + 1}`;
                // Set preview to preloaded next-next image
                lightboxNextImage.src = currentImages[nextNextIndex];
                lightboxNextImage.alt = `${getProjectName(currentProject)} - Imagem ${nextNextIndex + 1}`;
            }

            // Re-enable transitions after a frame
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (mainDiv) mainDiv.style.transition = '';
                    if (previewDiv) previewDiv.style.transition = '';
                    isAnimating = false;
                });
            });
        }, 500);
    }

    // Go to previous image with fade animation
    function goToPrev() {
        if (currentImages.length <= 1 || isAnimating) return;

        isAnimating = true;
        const mainDiv = document.querySelector('.lightbox-main');
        const previewDiv = document.querySelector('.lightbox-preview');

        // Fade out
        if (mainDiv) mainDiv.style.opacity = '0';
        if (previewDiv) previewDiv.style.opacity = '0';

        setTimeout(() => {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;

            if (mainDiv) mainDiv.style.transition = 'none';
            if (previewDiv) previewDiv.style.transition = 'none';

            updateDisplay();

            if (mainDiv) mainDiv.style.opacity = '';
            if (previewDiv) previewDiv.style.opacity = '';

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (mainDiv) mainDiv.style.transition = '';
                    if (previewDiv) previewDiv.style.transition = '';
                    isAnimating = false;
                });
            });
        }, 300);
    }

    // Keyboard navigation
    function handleKeyboard(e) {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                goToPrev();
                break;
            case 'ArrowRight':
                goToNext();
                break;
        }
    }

    // Touch handlers for swipe
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }

    function handleSwipe() {
        const threshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                goToNext(); // Swipe left -> next
            } else {
                goToPrev(); // Swipe right -> prev
            }
        }
    }

    // Hero Slideshow
    const HERO_IMAGE_COUNT = 5;
    const HERO_INTERVAL = 5000; // 5 seconds between slides
    let heroIndex = 0;
    let heroInterval = null;

    function initHeroSlideshow() {
        const heroImage = document.querySelector('.hero-image');
        if (!heroImage) return;

        const heroContainer = heroImage.parentElement;

        // Create slider wrapper
        const slider = document.createElement('div');
        slider.className = 'hero-slider';

        // Move current image into slider
        heroContainer.appendChild(slider);
        slider.appendChild(heroImage);

        // Create next image element
        const heroImageNext = document.createElement('div');
        heroImageNext.className = 'hero-image';
        slider.appendChild(heroImageNext);

        // Helper to get image path
        const getHeroPath = (index) => `images/hero/${(index + 1).toString().padStart(2, '0')}.jpg`;

        // Preload image and return promise
        const preloadImage = (src) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(src);
                img.onerror = () => resolve(src);
                img.src = src;
            });
        };

        // Track preloaded images
        const preloaded = new Set();
        let nextNextSrc = null;

        // Preload and set next image immediately
        const nextSrc = getHeroPath(1);
        preloadImage(nextSrc).then(() => {
            heroImageNext.style.backgroundImage = `url('${nextSrc}')`;
            preloaded.add(nextSrc);
        });

        // Preload next-next image immediately too
        nextNextSrc = getHeroPath(2);
        preloadImage(nextNextSrc).then(() => {
            preloaded.add(nextNextSrc);
        });

        // Start slideshow
        heroInterval = setInterval(() => {
            heroIndex = (heroIndex + 1) % HERO_IMAGE_COUNT;
            const upcomingIndex = (heroIndex + 1) % HERO_IMAGE_COUNT;
            const futureIndex = (heroIndex + 2) % HERO_IMAGE_COUNT;
            const upcomingSrc = getHeroPath(upcomingIndex);
            const futureSrc = getHeroPath(futureIndex);

            // Start preloading future image now (2 slides ahead)
            if (!preloaded.has(futureSrc)) {
                preloadImage(futureSrc).then(() => {
                    preloaded.add(futureSrc);
                });
            }

            // Slide left
            slider.classList.add('sliding');

            // After slide transition
            setTimeout(() => {
                // Update current image to what was next
                heroImage.style.backgroundImage = heroImageNext.style.backgroundImage;

                // Reset slider position instantly
                slider.classList.remove('sliding');

                // Set new next image (should be preloaded already)
                heroImageNext.style.backgroundImage = `url('${upcomingSrc}')`;

                // Restart zoom animation on current
                heroImage.style.animation = 'none';
                heroImage.offsetHeight;
                heroImage.style.animation = '';
            }, 1000);
        }, HERO_INTERVAL);
    }

    // Lazy load thumbnails when visible
    function lazyLoadThumbnails() {
        const cards = document.querySelectorAll('.project-card');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const projectId = card.dataset.project;
                    const thumb = card.querySelector('.project-thumb');
                    if (thumb && projectId) {
                        thumb.style.backgroundImage = `url('images/projects/${projectId}/cover.jpg')`;
                    }
                    observer.unobserve(card);
                }
            });
        }, { rootMargin: '200px' });

        cards.forEach(card => observer.observe(card));
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            lazyLoadThumbnails();
            initHeroSlideshow();
        });
    } else {
        init();
        lazyLoadThumbnails();
        initHeroSlideshow();
    }
})();
