
"use strict";

/* ==========================================
   LOVE STORY — DINH HUYNH NGOC PHUNG
   FULL JAVASCRIPT
========================================== */

/*
   CHỈNH NGÀY BẮT ĐẦU YÊU NHAU TẠI ĐÂY
   month: từ 1 đến 12
*/

const LOVE_DATE = {
    year: 2026,
    month: 10,
    day: 1
};

/* ==========================================
   SINH NHẬT NGỌC PHỤNG
========================================== */

const BIRTHDAY = {
    month: 1,
    day: 6
};

document.addEventListener("DOMContentLoaded", () => {

    /* ======================================
       ELEMENTS
    ====================================== */

    const slides = [
        ...document.querySelectorAll(".slide")
    ];

    const dotsContainer = document.getElementById("dots");

    const prevBtn = document.getElementById("prevSlide");
    const nextBtn = document.getElementById("nextSlide");

    const letterModal = document.getElementById("letterModal");
    const envelope = document.getElementById("envelope");

    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightboxImg");
    const photoCounter = document.getElementById("photoCounter");

    const heartsContainer = document.getElementById("hearts");

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    let currentSlide = 0;
    let currentPhoto = 0;

    let touchStartX = 0;
    let touchStartY = 0;

    let photoTouchX = 0;
    let photoTouchY = 0;

    let letterTimeout = null;

    /* ======================================
       6 WEBP IMAGES
    ====================================== */

    const photos = [
        "img/anh1.webp",
        "img/anh2.webp",
        "img/anh3.webp",
        "img/anh4.webp",
        "img/anh5.webp",
        "img/anh6.webp"
    ];

    /* ======================================
       CREATE NAVIGATION DOTS
    ====================================== */

    slides.forEach((slide, index) => {

        const dot = document.createElement("button");

        dot.type = "button";
        dot.className = "dot";

        dot.setAttribute(
            "aria-label",
            `Đến trang ${index + 1}`
        );

        dot.addEventListener("click", () => {
            showSlide(index);
        });

        dotsContainer.appendChild(dot);
    });

    const dots = [...dotsContainer.children];

    /* ======================================
       SHOW SLIDE
    ====================================== */

    function showSlide(index) {

        if (
            index < 0 ||
            index >= slides.length ||
            index === currentSlide &&
            slides[index].getAttribute("aria-hidden") === "false"
        ) {
            return;
        }

        slides.forEach((slide, i) => {

            const active = i === index;

            slide.classList.toggle("active", active);

            slide.setAttribute(
                "aria-hidden",
                String(!active)
            );

            slide.inert = !active;
        });

        currentSlide = index;

        slides[currentSlide].scrollTop = 0;

        dots.forEach((dot, i) => {

            const active = i === currentSlide;

            dot.classList.toggle("active", active);

            dot.setAttribute(
                "aria-current",
                active ? "step" : "false"
            );
        });

        prevBtn.disabled = currentSlide === 0;

        nextBtn.disabled =
            currentSlide === slides.length - 1;
    }

    /* ======================================
       BUTTON NAVIGATION
    ====================================== */

    prevBtn.addEventListener("click", () => {
        showSlide(currentSlide - 1);
    });

    nextBtn.addEventListener("click", () => {
        showSlide(currentSlide + 1);
    });

    document.querySelectorAll(".next-btn").forEach(btn => {

        btn.addEventListener("click", () => {
            showSlide(currentSlide + 1);
        });
    });

    /* ======================================
       OVERLAY STATUS
    ====================================== */

    function isOverlayOpen() {
        return !letterModal.hidden || !lightbox.hidden;
    }

    /* ======================================
       KEYBOARD NAVIGATION
    ====================================== */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {
            closeLetter();
            closeLightbox();
            return;
        }

        if (
            event.key !== "ArrowRight" &&
            event.key !== "ArrowLeft"
        ) {
            return;
        }

        if (!lightbox.hidden) {

            if (event.key === "ArrowRight") {
                changePhoto(1);
            } else {
                changePhoto(-1);
            }

            event.preventDefault();
            return;
        }

        if (isOverlayOpen()) return;

        if (event.key === "ArrowRight") {
            showSlide(currentSlide + 1);
        } else {
            showSlide(currentSlide - 1);
        }
    });

    /* ======================================
       MOBILE SLIDE SWIPE
    ====================================== */

    document.addEventListener("touchstart", event => {

        if (isOverlayOpen()) return;

        const touch = event.changedTouches[0];

        touchStartX = touch.screenX;
        touchStartY = touch.screenY;

    }, { passive: true });

    document.addEventListener("touchend", event => {

        if (isOverlayOpen()) return;

        const touch = event.changedTouches[0];

        const deltaX = touch.screenX - touchStartX;
        const deltaY = touch.screenY - touchStartY;

        const horizontalSwipe =
            Math.abs(deltaX) > 65 &&
            Math.abs(deltaX) > Math.abs(deltaY) * 1.3;

        if (!horizontalSwipe) return;

        if (deltaX < 0) {
            showSlide(currentSlide + 1);
        } else {
            showSlide(currentSlide - 1);
        }

    }, { passive: true });

    /* ======================================
       OPEN LOVE LETTER
    ====================================== */

    envelope.addEventListener("click", () => {

        if (letterTimeout !== null) {
            clearTimeout(letterTimeout);
        }

        envelope.classList.add("open");

        letterTimeout = setTimeout(() => {

            letterModal.hidden = false;
            letterTimeout = null;

        }, reduceMotion.matches ? 0 : 550);
    });

    /* ======================================
       CLOSE LOVE LETTER
    ====================================== */

    function closeLetter() {

        if (letterTimeout !== null) {
            clearTimeout(letterTimeout);
            letterTimeout = null;
        }

        letterModal.hidden = true;

        envelope.classList.remove("open");
    }

    document.getElementById("closeLetter")
        .addEventListener("click", closeLetter);

    letterModal.addEventListener("click", event => {

        if (event.target === letterModal) {
            closeLetter();
        }
    });

    /* ======================================
       PHOTO ALBUM
    ====================================== */

    document.querySelectorAll(".photo-card").forEach(card => {

        card.addEventListener("click", () => {

            const index = Number(card.dataset.photo);

            if (Number.isInteger(index)) {
                openPhoto(index);
            }
        });
    });

    /* ======================================
       OPEN FULLSCREEN PHOTO
    ====================================== */

    function openPhoto(index) {

        if (index < 0 || index >= photos.length) {
            return;
        }

        currentPhoto = index;

        updatePhoto();

        lightbox.hidden = false;
    }

    /* ======================================
       UPDATE PHOTO
    ====================================== */

    function updatePhoto() {

        lightboxImg.src = photos[currentPhoto];

        lightboxImg.alt =
            `Ảnh kỷ niệm ${currentPhoto + 1}`;

        photoCounter.textContent =
            `${currentPhoto + 1} / ${photos.length}`;
    }

    /* ======================================
       NEXT / PREVIOUS PHOTO
    ====================================== */

    function changePhoto(direction) {

        currentPhoto = (
            currentPhoto + direction + photos.length
        ) % photos.length;

        updatePhoto();
    }

    /* ======================================
       CLOSE LIGHTBOX
    ====================================== */

    function closeLightbox() {
        lightbox.hidden = true;
    }

    document.getElementById("closeLightbox")
        .addEventListener("click", closeLightbox);

    document.getElementById("prevPhoto")
        .addEventListener("click", () => {
            changePhoto(-1);
        });

    document.getElementById("nextPhoto")
        .addEventListener("click", () => {
            changePhoto(1);
        });

    lightbox.addEventListener("click", event => {

        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    /* ======================================
       MOBILE PHOTO SWIPE
    ====================================== */

    lightbox.addEventListener("touchstart", event => {

        const touch = event.changedTouches[0];

        photoTouchX = touch.screenX;
        photoTouchY = touch.screenY;

    }, { passive: true });

    lightbox.addEventListener("touchend", event => {

        const touch = event.changedTouches[0];

        const deltaX = touch.screenX - photoTouchX;
        const deltaY = touch.screenY - photoTouchY;

        const horizontalSwipe =
            Math.abs(deltaX) > 50 &&
            Math.abs(deltaX) > Math.abs(deltaY) * 1.3;

        if (!horizontalSwipe) return;

        if (deltaX < 0) {
            changePhoto(1);
        } else {
            changePhoto(-1);
        }

    }, { passive: true });

    /* ======================================
       PRELOAD NEARBY PHOTOS
    ====================================== */

    const preloadImages = new Set();

    function preloadPhoto(index) {

        const normalizedIndex =
            (index + photos.length) % photos.length;

        const source = photos[normalizedIndex];

        if (preloadImages.has(source)) return;

        const image = new Image();

        image.src = source;

        preloadImages.add(source);
    }

    lightboxImg.addEventListener("load", () => {

        preloadPhoto(currentPhoto + 1);
        preloadPhoto(currentPhoto - 1);
    });

    /* ======================================
       LOVE TIMER
    ====================================== */

    const startDate = new Date(
        LOVE_DATE.year,
        LOVE_DATE.month - 1,
        LOVE_DATE.day,
        0, 0, 0
    );

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    const dateText = document.getElementById("dateText");

    const pad = number =>
        String(number).padStart(2, "0");

    dateText.textContent =
        `Kể từ ngày ${pad(LOVE_DATE.day)}/${pad(LOVE_DATE.month)}/${LOVE_DATE.year}`;

    function updateLoveTime() {

        const now = Date.now();

        const difference = Math.max(
            0,
            now - startDate.getTime()
        );

        const totalSeconds =
            Math.floor(difference / 1000);

        const days =
            Math.floor(totalSeconds / 86400);

        const hours =
            Math.floor((totalSeconds % 86400) / 3600);

        const minutes =
            Math.floor((totalSeconds % 3600) / 60);

        const seconds =
            totalSeconds % 60;

        daysEl.textContent = days;
        hoursEl.textContent = pad(hours);
        minutesEl.textContent = pad(minutes);
        secondsEl.textContent = pad(seconds);
    }

    updateLoveTime();

    setInterval(() => {
        if (!document.hidden) {
            updateLoveTime();
        }
    }, 1000);

    document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
            updateLoveTime();
        }
    });

    /* ======================================
       FLOATING HEART EFFECT
    ====================================== */

    const heartSymbols = [
        "♥",
        "♡",
        "💕",
        "💗",
        "🌸"
    ];

    function createHeart(x = null, y = null, burst = false) {

        if (reduceMotion.matches) return;

        const heart = document.createElement("span");

        heart.className = "floating-heart";

        heart.textContent = heartSymbols[
            Math.floor(
                Math.random() * heartSymbols.length
            )
        ];

        heart.style.left =
            x === null
                ? `${Math.random() * 100}%`
                : `${x}px`;

        heart.style.fontSize =
            `${12 + Math.random() * 20}px`;

        heart.style.animationDuration =
            burst
                ? `${2 + Math.random() * 2}s`
                : `${5 + Math.random() * 4}s`;

        if (y !== null) {
            heart.style.bottom =
                `${window.innerHeight - y}px`;
        }

        heartsContainer.appendChild(heart);

        heart.addEventListener("animationend", () => {
            heart.remove();
        }, { once: true });
    }

    /* ======================================
       OPTIMIZED HEART SPAWNING
    ====================================== */

    const isMobile = window.matchMedia(
        "(max-width: 600px)"
    );

    setInterval(() => {

        if (
            document.hidden ||
            reduceMotion.matches ||
            isOverlayOpen()
        ) {
            return;
        }

        const maxHearts = isMobile.matches ? 8 : 15;

        if (
            heartsContainer.childElementCount >= maxHearts
        ) {
            return;
        }

        createHeart();

    }, 1200);

    /* ======================================
       FINAL SURPRISE
    ====================================== */

    const surpriseBtn =
        document.getElementById("surpriseBtn");

    const surpriseMessage =
        document.getElementById("surpriseMessage");

    surpriseBtn.addEventListener("click", () => {

        surpriseMessage.hidden = false;
        surpriseBtn.hidden = true;

        if (reduceMotion.matches) return;

        const heartCount = isMobile.matches ? 18 : 35;

        for (let i = 0; i < heartCount; i++) {

            setTimeout(() => {

                if (document.hidden) return;

                createHeart(
                    Math.random() * window.innerWidth,
                    window.innerHeight *
                        (.5 + Math.random() * .5),
                    true
                );

            }, i * 65);
        }
    });

    /* ======================================
       INITIALIZE
    ====================================== */

    showSlide(0);

});
