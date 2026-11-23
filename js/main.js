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

        // Add transition class to main image
        if (lightboxMain) {
            lightboxMain.classList.add('transitioning');
        }

        // After fade out, update images
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateDisplay();

            // Remove transition class after update
            setTimeout(() => {
                if (lightboxMain) {
                    lightboxMain.classList.remove('transitioning');
                }
                isAnimating = false;
            }, 50);
        }, 300);
    }

    // Go to previous image with slide animation
    function goToPrev() {
        if (currentImages.length <= 1 || isAnimating) return;

        isAnimating = true;

        if (lightboxMain) {
            lightboxMain.classList.add('transitioning');
        }

        setTimeout(() => {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateDisplay();

            setTimeout(() => {
                if (lightboxMain) {
                    lightboxMain.classList.remove('transitioning');
                }
                isAnimating = false;
            }, 50);
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

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
