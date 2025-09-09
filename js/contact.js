// Contact Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeAOS();
    handleNavbarScroll();
    initializeContactForm();
    initializeLanguageSwitch();
});

// Initialize AOS (Animate on Scroll)
function initializeAOS() {
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });
}

// Handle Navbar Scroll Effects
function handleNavbarScroll() {
    const header = document.querySelector('.header');
    const hero = document.querySelector('.contact-hero');
    let lastScrollY = window.scrollY;

    if (!header || !hero) return;

    // Set initial state
    updateHeaderStyle();

    window.addEventListener('scroll', function() {
        // Auto-hide/show navbar
        if (window.scrollY > lastScrollY && window.scrollY > 80) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastScrollY = window.scrollY;

        // Update header style based on hero position
        updateHeaderStyle();
    });

    function updateHeaderStyle() {
        const headerHeight = header.offsetHeight;
        const heroRect = hero.getBoundingClientRect();
        if (heroRect.bottom > headerHeight) {
            header.classList.add('contact-top');
            header.classList.remove('scrolled');
        } else {
            header.classList.remove('contact-top');
            header.classList.add('scrolled');
        }
    }
}

// Initialize Contact Form
function initializeContactForm() {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        const name = this.querySelector('input[name="name"]').value;
        const email = this.querySelector('input[name="email"]').value;
        const phone = this.querySelector('input[name="phone"]').value;
        const package = this.querySelector('select[name="package"]').value;
        const message = this.querySelector('textarea[name="message"]').value;

        if (!name || !email || !package || !message) {
            showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        // Here you would typically send the form data to a server
        // For now, we'll just show a success message
        showNotification('تم إرسال رسالتك بنجاح!', 'success');
        form.reset();
    });
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Language Switch Implementation
function initializeLanguageSwitch() {
    const translations = {
        en: {
            contactTitle: 'Contact Us',
            contactSubtitle: 'Get in touch with us',
            nameLabel: 'Your Name',
            emailLabel: 'Your Email',
            phoneLabel: 'Phone Number',
            packageLabel: 'Select Package',
            messageLabel: 'Your Message',
            sendMessage: 'Send Message',
            addressTitle: 'Address',
            phoneTitle: 'Phone',
            emailTitle: 'Email',
            hoursTitle: 'Working Hours',
            footerAbout: 'Your gateway to ancient Egyptian wonders',
            quickLinks: 'Quick Links',
            home: 'Home',
            destinations: 'Destinations',
            packages: 'Packages',
            faq: 'FAQ',
            contact: 'Contact',
            contactInfo: 'Contact Information',
            followUs: 'Follow Us',
            copyright: '© 2025 PHAROH TOUR. All rights reserved.'
        },
        ar: {
            contactTitle: 'اتصل بنا',
            contactSubtitle: 'تواصل معنا',
            nameLabel: 'الاسم',
            emailLabel: 'البريد الإلكتروني',
            phoneLabel: 'رقم الهاتف',
            packageLabel: 'الباقة المطلوبة',
            messageLabel: 'رسالتك',
            sendMessage: 'إرسال الرسالة',
            addressTitle: 'العنوان',
            phoneTitle: 'الهاتف',
            emailTitle: 'البريد الإلكتروني',
            hoursTitle: 'ساعات العمل',
            footerAbout: 'بوابتك إلى عجائب مصر القديمة',
            quickLinks: 'روابط سريعة',
            home: 'الرئيسية',
            destinations: 'الوجهات السياحية',
            packages: 'الباقات السياحية',
            faq: 'الأسئلة الشائعة',
            contact: 'اتصل بنا',
            contactInfo: 'معلومات الاتصال',
            followUs: 'تابعنا',
            copyright: '© 2025 فرعون تور. جميع الحقوق محفوظة.'
        }
    };

    let currentLang = document.documentElement.lang || 'ar';
    const langSwitch = document.querySelector('.lang-switch');
    const langText = document.querySelector('.lang-text');

    if (langSwitch && langText) {
        langSwitch.addEventListener('click', function() {
            currentLang = currentLang === 'ar' ? 'en' : 'ar';
            document.documentElement.lang = currentLang;
            document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
            langText.textContent = currentLang === 'ar' ? 'English' : 'العربية';
            updateTranslations();
        });
    }

    function updateTranslations() {
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (translations[currentLang][key]) {
                element.textContent = translations[currentLang][key];
            }
        });
    }
}
