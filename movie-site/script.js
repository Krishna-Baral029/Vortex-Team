

document.addEventListener('DOMContentLoaded', () => {

    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    const counters = document.querySelectorAll('.stat-number');
    let counterAnimated = false;

    function animateCounters() {
        if (counterAnimated) return;
        counterAnimated = true;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target.toLocaleString();
                }
            };

            updateCounter();
        });
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    const revealElements = document.querySelectorAll(
        '.movie-card, .feature-card, .testimonial-card, .continue-card, .download-wrapper, .section-header'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {

                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    const posters = [
        'images/shadow_protocol.png',
        'images/neon_horizon.png',
        'images/the_hollow.png',
        'images/last_ember.png'
    ];
    let currentPoster = 0;
    const phonePoster = document.getElementById('phonePoster');

    if (phonePoster) {
        setInterval(() => {
            currentPoster = (currentPoster + 1) % posters.length;
            phonePoster.style.opacity = '0';
            phonePoster.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                phonePoster.src = posters[currentPoster];
                phonePoster.style.opacity = '1';
            }, 500);
        }, 4000);
    }

    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();

            const downloadSection = document.getElementById('download');
            if (downloadSection) {
                const offset = 80;
                const top = downloadSection.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    document.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', () => {
            const downloadSection = document.getElementById('download');
            if (downloadSection) {
                const offset = 80;
                const top = downloadSection.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroVisual && window.innerWidth > 768) {
        window.addEventListener('mousemove', (e) => {
            const x = (e.clientX - window.innerWidth / 2) / 40;
            const y = (e.clientY - window.innerHeight / 2) / 40;
            heroVisual.style.transform = `translate(${x}px, ${y}px)`;
        }, { passive: true });
    }

    document.querySelectorAll('.feature-card, .movie-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(229, 9, 20, 0.06), var(--bg-card))`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.background = '';
        });
    });

    // Download Button Animation
    const downloadBtn = document.getElementById('apkDownloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function(e) {
            // Let the native download happen, but animate the button
            const btn = this;
            if (btn.classList.contains('is-downloading')) return;
            
            btn.classList.add('is-downloading');
            
            const textSpan = btn.querySelector('.btn-text');
            const downIcon = btn.querySelector('.download-icon');
            const spinner = btn.querySelector('.spinner-icon');
            const checkIcon = btn.querySelector('.check-icon');
            
            textSpan.textContent = "Downloading...";
            downIcon.style.display = 'none';
            spinner.style.display = 'block';
            checkIcon.style.display = 'none';
            
            setTimeout(() => {
                textSpan.textContent = "Downloaded!";
                spinner.style.display = 'none';
                checkIcon.style.display = 'block';
                
                setTimeout(() => {
                    btn.classList.remove('is-downloading');
                    textSpan.textContent = "Download Vortex APK";
                    checkIcon.style.display = 'none';
                    downIcon.style.display = 'block';
                }, 3000);
            }, 2000);
        });
    }
});

