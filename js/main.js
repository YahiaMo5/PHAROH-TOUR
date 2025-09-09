// Function to toggle fullscreen for virtual tour iframes
function toggleFullscreen(button) {
    const frameWrapper = button.closest('.tour-frame-wrapper');
    const iframe = frameWrapper.querySelector('iframe');
    
    if (!document.fullscreenElement) {
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.webkitRequestFullscreen) { // Safari
            iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) { // IE11
            iframe.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { // Safari
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { // IE11
            document.msExitFullscreen();
        }
    }
}

// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic',
    // disable animations on small screens to avoid layout jumps
    disable: function() {
        return window.innerWidth < 768; // disable on mobile
    }
});


// Trip Planner logic
document.addEventListener('DOMContentLoaded', function() {
    const calcBtn = document.getElementById('planner-calc');
    if (calcBtn && !calcBtn.dataset.plannerBound) {
        calcBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const dest = document.getElementById('planner-destination').value;
            const nights = parseInt(document.getElementById('planner-nights').value, 10) || 1;
            const hotel = document.getElementById('planner-hotel').value;
            const guests = parseInt(document.getElementById('planner-guests').value, 10) || 1;

            // Base prices per night per person by hotel category
            const hotelRates = { standard: 30, deluxe: 60, luxury: 140 };
            // Destination multipliers for excursions/transport
            const destMultiplier = { giza: 1.0, luxor: 1.2, aswan: 1.3, alexandria: 0.9 };

            const baseRate = hotelRates[hotel] || 30;
            const multiplier = destMultiplier[dest] || 1.0;

            // simple formula: (hotelRate * nights * guests) + (300 * multiplier)
            const hotelCost = baseRate * nights * guests;
            const extras = Math.round(300 * multiplier);
            const total = hotelCost + extras;

            const resultEl = document.getElementById('planner-result');
            if (resultEl) {
                const prefix = (translations[currentLang] && translations[currentLang].planner_result) ? translations[currentLang].planner_result : 'التكلفة المقدرة';
                resultEl.textContent = `${prefix}: ${total} $`;
            }
        });
        // mark as bound
        calcBtn.dataset.plannerBound = '1';
    }

    // Initialize swiper after DOM ready
    initializeSwiper();
    initializeLanguage();
    contactHeaderHandler();
    initHeaderState();
});
// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const target = this.getAttribute('href');
        if (target && target.length > 1 && document.querySelector(target)) {
            e.preventDefault();
            // Close Bootstrap navbar collapse if open (mobile)
            const bsCollapseEl = document.getElementById('mainNavbar');
            if (bsCollapseEl && bsCollapseEl.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(bsCollapseEl) || new bootstrap.Collapse(bsCollapseEl, {toggle:false});
                bsCollapse.hide();
            }
            document.querySelector(target).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Auto-hide/show navbar on scroll + white background when not over hero
let lastScrollY = window.scrollY;
const header = document.querySelector('.header');
// pick hero section: #home (index) or .contact-hero (contact page)
const hero = document.getElementById('home') || document.querySelector('.contact-hero');

window.addEventListener('scroll', function() {
    if (!header) return;
    // Auto-hide/show
    if (window.scrollY > lastScrollY && window.scrollY > 80) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    lastScrollY = window.scrollY;

    // Transparent over hero, white background after hero
    if (hero) {
        const headerHeight = header.offsetHeight;
        const heroRect = hero.getBoundingClientRect();
        if (heroRect.bottom > headerHeight) {
            // still over the hero area
            header.classList.add('contact-top');
            header.classList.remove('scrolled');
        } else {
            // scrolled past the hero
            header.classList.remove('contact-top');
            header.classList.add('scrolled');
        }
    }
});

// Language Switch Implementation
const translations = {
    en: {
        // Navigation
        home: 'Home',
        destinations: 'Popular Destinations',
        virtualTour: '360° Virtual Tours',
        packages: 'Tour Packages',
        about: 'About',
        contact: 'Contact',
        language: 'العربية',
        
        // Hero Section
        heroTitle: 'Discover the Magic of Ancient Egypt',
        heroSubtitle: 'Experience thousands of years of history and culture',
        exploreBtn: 'Explore Now',
        
        // Destinations
        pyramids: 'Great Pyramids of Giza',
        pyramidsDesc: 'The last surviving wonder of the ancient world',
    // Select-friendly destination keys (used by planner select)
    dest_giza: 'Great Pyramids of Giza',
    dest_luxor: 'Luxor Temple',
    dest_aswan: 'Aswan / Abu Simbel',
    dest_alex: 'Bibliotheca Alexandrina',
        luxor: 'Luxor Temple',
        luxorDesc: 'Ancient Egyptian temple complex',
        abuSimbel: 'Abu Simbel Temple',
        abuSimbelDesc: 'Architectural masterpiece from the reign of Ramesses II',
        museum: 'Egyptian Museum',
        museumDesc: 'Home of ancient Egyptian artifacts',
        karnak: 'Karnak Temple',
        karnakDesc: 'Largest religious site in the ancient world',
        valley: 'Valley of the Kings',
        valleyDesc: 'Burial ground of Egyptian pharaohs',
        alexandria: 'Alexandria Library',
        alexandriaDesc: 'Beacon of knowledge and culture',
        
        // Virtual Tours
        virtualToursTitle: '360° Virtual Tours',
        pyramidsTour: 'Great Pyramids - Virtual Tour',
        luxorTour: 'Luxor Temple - Virtual Tour',
        karnakTour: 'Karnak Temple - Virtual Tour',
        abuSimbelTour: 'Abu Simbel - Virtual Tour',
        
        // Packages
        packagesTitle: 'Tour Packages',
        classicPackage: 'Classic Egypt',
        classicPrice: '$999',
        classicDuration: '5 Days / 4 Nights',
        classicFeatures: [
            'Pyramids & Sphinx Tour',
            'Egyptian Museum Visit',
            'Nile Dinner Cruise',
            'Luxury Accommodation'
        ],
        
        luxuryPackage: 'Luxury Nile Cruise',
        luxuryPrice: '$1,499',
        luxuryDuration: '8 Days / 7 Nights',
        luxuryFeatures: [
            'Luxor to Aswan Cruise',
            'All Temple Visits',
            'Full Board Meals',
            'Expert Guide'
        ],
        
        adventurePackage: 'Adventure Explorer',
        adventurePrice: '$1,299',
        adventureDuration: '7 Days / 6 Nights',
        adventureFeatures: [
            'Desert Safari',
            'Red Sea Snorkeling',
            'Historical Sites',
            'Bedouin Experience'
        ],
        
        // Contact Form
        contactTitle: 'Contact Us',
    contactInfoTitle: 'Contact Information',
    addressTitle: 'Address',
    phoneTitle: 'Phone',
    emailTitle: 'Email',
    hoursTitle: 'Working Hours',
        nameLabel: 'Your Name',
        emailLabel: 'Your Email',
        selectPackage: 'Select Package',
        messageLabel: 'Your Message',
        sendMessage: 'Send Message',

    // Hotel options for planner
    hotel_standard: 'Comfort',
    hotel_deluxe: 'Comfort Plus',
    hotel_luxury: 'Royal Suite',
        
        // Footer
        footerAbout: 'Your gateway to ancient Egyptian wonders',
        quickLinks: 'Quick Links',
        contactInfo: 'Contact Information',
        email: 'Email: info@pharohtour.com',
        phone: 'Phone: +20 123 456 789',
        followUs: 'Follow Us',
    // FAQ
    faq_q1: 'What is the cancellation policy?',
    faq_a1: 'Bookings can be canceled up to 7 days in advance for a full refund. After that, partial charges may apply.',
    faq_q2: 'Do packages include flights?',
    faq_a2: 'Standard packages do not include flights unless explicitly stated in the package details.',
    faq_q3: 'How can I contact support?',
    faq_a3: 'Use the WhatsApp button at the bottom of the page or the contact form on the Contact page.',
    faq: 'FAQ',
        copyright: '© 2025 PHAROH TOUR. All rights reserved.',
        
        // Buttons
        learnMore: 'Learn More',
        bookNow: 'Book Now',
    // Planner
    planner_title: 'Plan Your Trip',
    planner_destination_label: 'Destination',
    planner_nights_label: 'Nights',
    planner_hotel_label: 'Hotel Type',
    planner_guests_label: 'Guests',
    planner_calc: 'Calculate',
    planner_result: 'Estimated cost',
        
        // Loading Screen
        loadingTitle: 'PHAROH TOUR',
        loadingSubtitle: 'Discover the Magic of Ancient Egypt',
        
        // About Us Section
        aboutTitle: 'About Us',
        aboutSubtitle: 'PHAROH TOUR - Your Gateway to Ancient Egyptian Wonders',
        aboutDesc1: 'We are a leading tourism company specialized in providing unique and distinctive tourism experiences in Egypt. Since our establishment, we have been working to provide the best tourism services to our valued customers.',
        aboutDesc2: 'We are proud to offer professional tours that include the most important historical landmarks in Egypt, from the Great Pyramids to the temples of Luxor and Aswan, through world museums and unique archaeological sites.',
        
        // Features
        feature1Title: '15+ Years Experience',
        feature1Desc: 'Long experience in Egyptian tourism',
        feature2Title: '+50,000 Tourists',
        feature2Desc: 'We served more than 50,000 tourists from around the world',
        feature3Title: '4.9/5 Rating',
        feature3Desc: 'Excellent rating from our customers on all platforms',
        feature4Title: 'Quality Guarantee',
        feature4Desc: 'We guarantee you a safe, comfortable and enjoyable trip',
        
        // Team Section
        teamTitle: 'Our Professional Team',
        team1Name: 'Any Name',
        team1Position: 'Any position',
        team1Desc: '20 years experience in Egyptian tourism',
        team2Name: 'Any Name',
        team2Position: 'Any position',
        team2Desc: 'Specialized in coordinating tourism trips',
        team3Name: 'Any Name',
        team3Position: 'Any position',
        team3Desc: 'Expert in ancient Egyptian history',
    },    
    
    ar: {
        // Navigation
        home: 'الرئيسية',
        destinations: 'الوجهات السياحية الشهيرة',
        virtualTour: 'جولة افتراضية 360 درجة',
        packages: 'الباقات السياحية',
        about: 'عن الشركة',
        contact: 'اتصل بنا',
        language: 'English',
        
        // Hero Section
        heroTitle: 'اكتشف سحر مصر القديمة',
        heroSubtitle: 'عش تجربة آلاف السنين من التاريخ والحضارة',
        exploreBtn: 'اكتشف الآن',
        
        // Destinations
        pyramids: 'أهرامات الجيزة',
        pyramidsDesc: 'آخر عجائب العالم القديم الباقية',
    // keys for planner selects
    dest_giza: 'أهرامات الجيزة',
    dest_luxor: 'معبد الأقصر',
    dest_aswan: 'أسوان / أبو سمبل',
    dest_alex: 'مكتبة الإسكندرية',
        luxor: 'معبد الأقصر',
        luxorDesc: 'مجمع المعابد المصرية القديمة',
        abuSimbel: 'معبد أبو سمبل',
        abuSimbelDesc: 'تحفة معمارية من عصر رمسيس الثاني',
        museum: 'المتحف المصري',
        museumDesc: 'موطن الآثار المصرية القديمة',
        karnak: 'معبد الكرنك',
        karnakDesc: 'أكبر دار عبادة دينية في العالم القديم',
        valley: 'وادي الملوك',
        valleyDesc: 'مقبرة ملوك مصر القديمة',
        alexandria: 'مكتبة الإسكندرية',
        alexandriaDesc: 'منارة المعرفة والثقافة',
        
        // Virtual Tours
        virtualToursTitle: 'جولات افتراضية 360 درجة',
        pyramidsTour: 'أهرامات الجيزة - جولة افتراضية',
        luxorTour: 'معبد الأقصر - جولة افتراضية',
        karnakTour: 'معبد الكرنك - جولة افتراضية',
        abuSimbelTour: 'معبد أبو سمبل - جولة افتراضية',
        
        // Packages
        packagesTitle: 'الباقات السياحية',
        classicPackage: 'مصر الكلاسيكية',
        classicPrice: '999 دولار',
        classicDuration: '5 أيام / 4 ليالي',
        classicFeatures: [
            'جولة الأهرامات وأبو الهول',
            'زيارة المتحف المصري',
            'عشاء نيلي',
            'إقامة فاخرة'
        ],
        
        luxuryPackage: 'رحلة النيل الفاخرة',
        luxuryPrice: '1,499 دولار',
        luxuryDuration: '8 أيام / 7 ليالي',
        luxuryFeatures: [
            'رحلة نيلية من الأقصر إلى أسوان',
            'زيارة جميع المعابد',
            'إقامة كاملة',
            'مرشد سياحي متخصص'
        ],
        
        adventurePackage: 'مغامرة استكشافية',
        adventurePrice: '1,299 دولار',
        adventureDuration: '7 أيام / 6 ليالي',
        adventureFeatures: [
            'سفاري الصحراء',
            'غوص في البحر الأحمر',
            'المواقع التاريخية',
            'تجربة بدوية'
        ],
        
        // Contact Form
        contactTitle: 'اتصل بنا',
    contactInfoTitle: 'معلومات الاتصال',
    addressTitle: 'العنوان',
    phoneTitle: 'الهاتف',
    emailTitle: 'البريد الإلكتروني',
    hoursTitle: 'ساعات العمل',
        nameLabel: 'الاسم',
        emailLabel: 'البريد الإلكتروني',
        selectPackage: 'اختر الباقة',
        messageLabel: 'رسالتك',
        sendMessage: 'إرسال الرسالة',
        
        // Footer
        footerAbout: 'بوابتك إلى عجائب مصر القديمة',
        quickLinks: 'روابط سريعة',
        contactInfo: 'معلومات الاتصال',
        email: 'البريد الإلكتروني: info@pharohtour.com',
        phone: 'الهاتف: ٢٠+ ١٢٣ ٤٥٦ ٧٨٩',
        followUs: 'تابعنا',
    // FAQ
    faq_q1: 'ما هي سياسة الإلغاء؟',
    faq_a1: 'يمكن إلغاء الحجز قبل 7 أيام لاسترداد كامل المبلغ، وبعد ذلك يتم تطبيق رسوم جزئية.',
    faq_q2: 'هل تشمل الباقات تذاكر الطيران؟',
    faq_a2: 'الباقات القياسية لا تشمل تذاكر الطيران ما لم يُذكر خلاف ذلك في تفاصيل الباقة.',
    faq_q3: 'كيف يتم التواصل مع الدعم؟',
    faq_a3: 'يمكنك استخدام زر الواتساب في أسفل الصفحة أو نموذج الاتصال في صفحة "اتصل بنا".',
    faq: 'الأسئلة الشائعة',
        copyright: '© 2025 فرعون تور. جميع الحقوق محفوظة.',
        
        // Buttons
        learnMore: 'اكتشف المزيد',
        bookNow: 'احجز الآن',
    // Planner
    planner_title: 'خطط لرحلتك',
    planner_destination_label: 'الوجهة',
    planner_nights_label: 'عدد الليالي',
    planner_hotel_label: 'نوع الفندق',
    hotel_standard: 'مريح',
    hotel_deluxe: 'مريح بلس',
    hotel_luxury: 'الجناح الملكي',
    planner_guests_label: 'عدد الضيوف',
    planner_calc: 'احسب',
    planner_result: 'التكلفة المقدرة',
        
        // Loading Screen
        loadingTitle: 'فرعون تور',
        loadingSubtitle: 'اكتشف سحر مصر القديمة',
        
        // About Us Section
        aboutTitle: 'عن الشركة',
        aboutSubtitle: 'فرعون تور - بوابتك إلى عجائب مصر القديمة',
        aboutDesc1: 'نحن شركة سياحية رائدة متخصصة في تقديم تجربة سياحية فريدة ومميزة في مصر. منذ تأسيسنا ، نحن نعمل على تقديم أفضل خدمات السياحة لعملائنا المهمين.',
        aboutDesc2: 'نحن سعداء بتقديم جولات سياحية محترفة تشمل أهم المعالم التاريخية في مصر، من أهرامات الجيزة إلى معابد الأقصر وأسوان، من خلال المتاحف العالمية والمواقع الأثرية الفريدة.',
        
        // Features
        feature1Title: 'خبرة 15+ سنة',
        feature1Desc: 'خبرة طويلة في سياحة مصر',
        feature2Title: '+50,000 سائح',
        feature2Desc: 'خدمنا أكثر من 50,000 سائح من جميع أنحاء العالم',
        feature3Title: 'تصنيف 4.9/5',
        feature3Desc: 'تصنيف ممتاز من عملائنا على جميع المنصات',
        feature4Title: 'تأكيد الجودة',
        feature4Desc: 'نحن نضمن لك رحلة آمنة، مريحة، وممتعة',
        
        // Team Section
        teamTitle: 'فريقنا المحترف',
        team1Name: 'اي اسم',
        team1Position: 'اي منصب',
        team1Desc: 'خبرة 20 عاماً في سياحة مصر',
        team2Name: 'اي اسم',
        team2Position: 'اي منصب',
        team2Desc: 'متخصص في تنظيم رحلات سياحية',
        team3Name: 'اي اسم',
        team3Position: 'اي منصب',
        team3Desc: 'خبير في التاريخ المصري القديم',
    }
};

let currentLang = 'ar';

// Swiper Initialization with safe guard and dynamic loader
function loadSwiper() {
    return new Promise((resolve, reject) => {
        if (typeof Swiper !== 'undefined') return resolve();
        // if a script tag for swiper already exists, wait for it
        const existing = document.querySelector('script[src*="swiper-bundle.min.js"]');
        if (existing) {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', () => reject(new Error('Failed to load Swiper')));
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/swiper@9/swiper-bundle.min.js';
        script.async = false; // preserve execution order if appended late
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Swiper'));
        document.head.appendChild(script);
    });
}

function initializeSwiper() {
    if (typeof Swiper === 'undefined') {
        // Try to load Swiper dynamically, then initialize
        loadSwiper().then(() => initializeSwiper()).catch(err => {
            console.warn('Swiper initialization skipped:', err);
        });
        return;
    }

    // destroy previous instance safely
    if (window.swiper && typeof window.swiper.destroy === 'function') {
        try { window.swiper.destroy(true, true); } catch (e) { /* ignore */ }
    }

    window.swiper = new Swiper('.destinationsSwiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            640: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            }
        }
    });
}

// تحديد اللغة الافتراضية وإعداد الصفحة
function initializeLanguage() {
    // التحقق من وجود لغة محفوظة
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
        currentLang = savedLanguage;
    } else {
        // التحقق من لغة المتصفح
        const browserLang = navigator.language || navigator.userLanguage;
        currentLang = browserLang.startsWith('ar') ? 'ar' : 'en';
        localStorage.setItem('preferredLanguage', currentLang);
    }

    // تطبيق اللغة
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    updateLanguage();
}

// Special handling for Contact page header background when at top
function contactHeaderHandler() {
    try {
        const isContactPage = window.location.pathname.endsWith('contact.html') || window.location.href.indexOf('contact.html') !== -1;
        const headerEl = document.querySelector('.header');
        const heroEl = document.querySelector('.contact-hero');
        if (!isContactPage || !headerEl || !heroEl) return;

        // set initial state based on current scroll (global scroll handler will keep it updated)
        const headerHeight = headerEl.offsetHeight;
        const heroRect = heroEl.getBoundingClientRect();
        if (heroRect.bottom > headerHeight) {
            headerEl.classList.add('contact-top');
            headerEl.classList.remove('scrolled');
        } else {
            headerEl.classList.remove('contact-top');
            headerEl.classList.add('scrolled');
        }
    } catch (e) {
        // ignore
    }
}

// Initialize header classes based on presence of a hero section (#home or .contact-hero)
function initHeaderState() {
    try {
        const headerEl = document.querySelector('.header');
        const heroEl = document.getElementById('home') || document.querySelector('.contact-hero');
        if (!headerEl || !heroEl) return;
        const headerHeight = headerEl.offsetHeight;
        const heroRect = heroEl.getBoundingClientRect();
        if (heroRect.bottom > headerHeight) {
            headerEl.classList.add('contact-top');
            headerEl.classList.remove('scrolled');
        } else {
            headerEl.classList.remove('contact-top');
            headerEl.classList.add('scrolled');
        }
    } catch (e) {
        // ignore
    }
}

// تحديث محتوى الصفحة حسب اللغة (يدعم القوائم)
function updateLanguage() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.dataset.translate;
        // دعم عناصر القوائم مثل classicFeatures.0
        if (key.includes('.')) {
            const [mainKey, index] = key.split('.');
            if (translations[currentLang][mainKey] && Array.isArray(translations[currentLang][mainKey])) {
                element.textContent = translations[currentLang][mainKey][parseInt(index)];
            }
        } else if (translations[currentLang][key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[currentLang][key];
            } else {
                element.textContent = translations[currentLang][key];
            }
        }
    });

    // تحديث عنوان الصفحة
    document.title = currentLang === 'ar' ? 'PHAROH TOUR - اكتشف مصر القديمة' : 'PHAROH TOUR - Discover Ancient Egypt';
    
    // تحديث زر تغيير اللغة
    const langButton = document.querySelector('.lang-switch .lang-text');
    if (langButton) {
        langButton.textContent = translations[currentLang].language;
    }

    // تحديث اتجاه عناصر Swiper
    if (window.swiper) {
        window.swiper.destroy();
        initializeSwiper();
    }
}

// تبديل اللغة
function toggleLanguage() {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('preferredLanguage', currentLang);
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    updateLanguage();
}

// تهيئة اللغة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    initializeLanguage();
    initializeSwiper();
    contactHeaderHandler();
    initHeaderState();
});

// Virtual Tour Lazy Loading
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const tourObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const iframe = entry.target.querySelector('iframe');
            if (iframe.dataset.src) {
                iframe.src = iframe.dataset.src;
                iframe.removeAttribute('data-src');
            }
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.tour-item').forEach(item => {
    tourObserver.observe(item);
});

// Contact Form Validation and Submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        const name = this.querySelector('input[name="name"]').value;
        const email = this.querySelector('input[name="email"]').value;
        const message = this.querySelector('textarea[name="message"]').value;
        
        if (!name || !email || !message) {
            showNotification('الرجاء ملء جميع الحقول المطلوبة', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('الرجاء إدخال بريد إلكتروني صحيح', 'error');
            return;
        }
        
        // Simulate form submission
        showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً', 'success');
        this.reset();
    });
}

// Email validation helper
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Image Lazy Loading
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});

// Image Error Handling
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
            this.alt = 'صورة غير متوفرة';
        });
    });
});

// Packages Hover Effect
const packageCards = document.querySelectorAll('.package-card');

packageCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

// Initialize all tooltips
const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
const tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
});

// Iframe Error Handling
document.addEventListener('DOMContentLoaded', () => {
    const iframes = document.querySelectorAll('iframe');
    
    iframes.forEach(iframe => {
        iframe.addEventListener('error', function() {
            this.style.display = 'none';
            const errorDiv = document.createElement('div');
            errorDiv.style.cssText = 'width: 100%; height: 400px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; border-radius: 10px;';
            errorDiv.innerHTML = '<p style="color: #666; text-align: center;">عذراً، الجولة الافتراضية غير متوفرة حالياً</p>';
            this.parentNode.insertBefore(errorDiv, this);
        });
    });
});

// Loading Screen Management
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingProgress = document.querySelector('.loading-progress');
    
    // Only proceed if loading elements exist
    if (loadingScreen && loadingProgress) {
        // Simulate loading progress
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(progressInterval);
                
                // Hide loading screen after a short delay
                setTimeout(() => {
                    loadingScreen.classList.add('hidden');
                    
                    // Remove loading screen from DOM after animation
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }, 500);
            }
            
            // Update progress bar width
            loadingProgress.style.width = progress + '%';
        }, 100);
        
        // Fallback: Hide loading screen after 5 seconds maximum
        setTimeout(() => {
            if (!loadingScreen.classList.contains('hidden')) {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 1000);
            }
        }, 5000);
    }
});
