/**
 * FURKAN SAYYED - CYBERSECURITY PORTFOLIO JAVASCRIPT
 * Interactive Canvas, Terminal Emulator, Typing Hero, Project Filter, Cert Modal & Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    initCyberCanvas();
    initTypewriter();
    initTerminal();
    initProjectFilters();
    initNavbar();
    initScrollSpy();
});

/* ==========================================================================
   1. CYBER PARTICLES CANVAS
   ========================================================================== */
function initCyberCanvas() {
    const canvas = document.getElementById('cyberCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 18), 75);

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 0.8;
            this.radius = Math.random() * 2 + 1;
            this.color = Math.random() > 0.4 ? 'rgba(0, 255, 136, ' : 'rgba(0, 204, 255, ';
            this.alpha = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.alpha + ')';
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    // Connect nearby particles with subtle cyber grid lines
    function render() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    const opacity = (1 - dist / 120) * 0.18;
                    ctx.strokeStyle = `rgba(0, 255, 136, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(render);
    }
    render();
}

/* ==========================================================================
   2. TYPEWRITER HERO ANIMATION
   ========================================================================== */
function initTypewriter() {
    const typingElement = document.getElementById('typingText');
    if (!typingElement) return;

    const phrases = [
        'Offensive Security Specialist',
        'Top 1% TryHackMe CTF Player',
        'Penetration Tester & VAPT Consultant',
        'Published Quantum Security Researcher',
        'OSCP Candidate & Exploit Analyst'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function typeLoop() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 90;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2200; // Pause at end of text
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before next text
        }

        setTimeout(typeLoop, typingSpeed);
    }

    typeLoop();
}

/* ==========================================================================
   3. INTERACTIVE TERMINAL EMULATOR
   ========================================================================== */
function initTerminal() {
    const terminalOutput = document.getElementById('terminalOutput');
    const terminalInput = document.getElementById('terminalInput');
    if (!terminalOutput || !terminalInput) return;

    // Initial automated boot lines
    const bootSequence = [
        { cmd: 'whoami', out: 'Furkan Sayyed · Offensive Security & VAPT Specialist', delay: 400 },
        { cmd: 'cat metrics.txt', out: 'Rank: Top 1% TryHackMe · Education: MS Cybersecurity 8.5 CGPI · Labs: 9+ Compromised Targets', delay: 1100, highlight: true },
        { cmd: 'publications --recent', out: '3 Peer-Reviewed Quantum Authentication & Entanglement Papers (IJESE, IJIRT, IJCA)', delay: 1900, badge: true },
        { cmd: 'oscp --status', out: 'Preparing intensively for Offensive Security Certified Professional (OSCP)', delay: 2700 }
    ];

    bootSequence.forEach(item => {
        setTimeout(() => {
            appendCommandLine(item.cmd);
            setTimeout(() => {
                appendOutputLine(item.out, item.highlight, item.badge);
            }, 300);
        }, item.delay);
    });

    function appendCommandLine(command) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span class="terminal-user">furkan@kali-sec</span><span class="terminal-sep">:</span><span class="terminal-path">~</span><span class="terminal-symbol">$</span> <span class="terminal-command">${escapeHtml(command)}</span>`;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function appendOutputLine(output, highlight = false, isBadge = false) {
        const line = document.createElement('div');
        line.className = 'terminal-output' + (highlight ? ' highlight' : '') + (isBadge ? ' badge' : '');
        line.innerHTML = output;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Command processor for user typed commands
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawVal = terminalInput.value.trim();
            if (!rawVal) return;

            appendCommandLine(rawVal);
            const lowerCmd = rawVal.toLowerCase();

            switch (lowerCmd) {
                case 'help':
                    appendOutputLine(`Available Commands:
  • <strong style="color:#00ff88;">whoami</strong>        - Display personal profile & bio
  • <strong style="color:#00ff88;">skills</strong>        - List technical tools & offensive proficiencies
  • <strong style="color:#00ff88;">projects</strong>      - Overview of featured pentest labs & CTFs
  • <strong style="color:#00ff88;">papers</strong>        - View published Quantum Authentication research
  • <strong style="color:#00ff88;">stats</strong>         - Show TryHackMe standing & academic scores
  • <strong style="color:#00ff88;">contact</strong>       - Display email, phone & location
  • <strong style="color:#00ff88;">socials</strong>       - Quick links to GitHub & LinkedIn
  • <strong style="color:#00ff88;">clear</strong>         - Clear the terminal console
  • <strong style="color:#00ff88;">sudo</strong>          - Attempt administrative override`);
                    break;

                case 'whoami':
                    appendOutputLine("Furkan Sayyed — MS Cybersecurity graduate (University of Mumbai, 8.5 CGPI), top 1% TryHackMe CTF player, and offensive security researcher specializing in VAPT and Quantum Authentication.");
                    break;

                case 'skills':
                    appendOutputLine(`Offensive Tools: Kali Linux, Burp Suite, Nmap, Gobuster, Metasploit, Nikto, Netcat, Nessus, Wireshark, ADB
Core Skills: Web Pentesting (OWASP), Linux Privilege Escalation, Android Security, OSINT, Qiskit Simulation`);
                    break;

                case 'projects':
                    appendOutputLine(`Featured Labs & Exploits:
  1. Quantum Authentication via Qiskit Simulation (GitHub)
  2. Android 4.1 Pentest & IPC Privilege Escalation
  3. SickOS 1.2 Web & Chkrootkit Root Compromise
  4. Mr. Robot CTF 3-Flag WordPress & SUID Compromise
  5. PortSwigger Academy Offensive Labs Documentation`);
                    break;

                case 'papers':
                case 'research':
                    appendOutputLine(`Peer-Reviewed Publications:
  [1] IJESE Apr 2025: Entanglement for Next-Gen Authentication (DOI: 10.35940/ijrte.A8345.14060326)
  [2] IJIRT Jan 2026: Entangled Qubits and PQC Performance Simulation
  [3] IJCA May 2026: Zero-Trust Quantum Authentication using Device-Independent Protocols`);
                    break;

                case 'stats':
                    appendOutputLine(`🏆 TryHackMe: Top 1% Worldwide Rank
🎓 MS Cybersecurity: 8.5 CGPI (University of Mumbai)
📜 B.Sc Computer Science: 8.83 CGPA (Distinction)
🎯 OSCP: Active In-Progress Candidate`);
                    break;

                case 'contact':
                    appendOutputLine(`Direct Contact:
  Email: sayyedfurkan115@gmail.com
  Phone: +91 7738885888
  Location: Mumbai, Maharashtra, India`);
                    break;

                case 'socials':
                case 'github':
                case 'linkedin':
                    appendOutputLine(`Profiles:
  GitHub: <a href="https://github.com/Furkansayyed" target="_blank" style="color:#00ccff;">github.com/Furkansayyed</a>
  LinkedIn: <a href="https://linkedin.com/in/furkansayyed19" target="_blank" style="color:#00ccff;">linkedin.com/in/furkansayyed19</a>`);
                    break;

                case 'clear':
                    terminalOutput.innerHTML = '';
                    break;

                case 'sudo':
                case 'sudo su':
                case 'su root':
                    appendOutputLine("<span style='color:#ff2a6d;'>Permission denied: User 'furkan' is already UID 0 (root). Stay ethical! ;)</span>");
                    break;

                default:
                    appendOutputLine(`<span style='color:#ff5f56;'>Command not found: '${escapeHtml(rawVal)}'. Type <strong style='color:#00ff88;'>'help'</strong> for available commands.</span>`);
                    break;
            }

            terminalInput.value = '';
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });
}

/* ==========================================================================
   4. PROJECTS FILTER SYSTEM
   ========================================================================== */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-tab');
    const projectCards = document.querySelectorAll('.project-card');

    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category') || '';
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });
}

/* ==========================================================================
   5. CERTIFICATION MODAL LOGIC
   ========================================================================== */
function openCertModal(title, issuer, desc, iconClass, color, filePath = null) {
    const modal = document.getElementById('certModal');
    if (!modal) return;

    const modalTitle = document.getElementById('modalTitle');
    const modalIssuer = document.getElementById('modalIssuer');
    const modalDesc = document.getElementById('modalDesc');
    const modalIcon = document.getElementById('modalIcon');
    const modalPreviewContainer = document.getElementById('modalPreviewContainer');
    const modalPreviewEmbed = document.getElementById('modalPreviewEmbed');
    const modalPreviewFallback = document.getElementById('modalPreviewFallback');

    if (modalTitle) modalTitle.textContent = title;
    if (modalIssuer) modalIssuer.innerHTML = `<i class="fas fa-award"></i> Issued by ${issuer}`;
    
    if (filePath) {
        if (modalDesc) modalDesc.style.display = 'none';
        if (modalPreviewContainer) {
            modalPreviewContainer.style.display = 'block';
            if (modalPreviewEmbed) modalPreviewEmbed.src = filePath;
            if (modalPreviewFallback) modalPreviewFallback.href = filePath;
        }
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) modalContent.style.maxWidth = '800px';
    } else {
        if (modalDesc) {
            modalDesc.textContent = desc;
            modalDesc.style.display = 'block';
        }
        if (modalPreviewContainer) modalPreviewContainer.style.display = 'none';
        const modalContent = modal.querySelector('.modal-content');
        if (modalContent) modalContent.style.maxWidth = '540px';
    }

    if (modalIcon) {
        modalIcon.innerHTML = `<i class="${iconClass}"></i>`;
        modalIcon.style.color = color || '#00ff88';
        modalIcon.style.borderColor = color || '#00ff88';
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}

function closeCertModal() {
    const modal = document.getElementById('certModal');
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    
    const modalPreviewEmbed = document.getElementById('modalPreviewEmbed');
    if (modalPreviewEmbed) {
        setTimeout(() => {
            modalPreviewEmbed.src = '';
        }, 300);
    }
}

// Close modal on Escape key press
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCertModal();
    }
});

/* ==========================================================================
   6. NAVBAR & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scrolled header state
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navbar.classList.toggle('active');
        });

        // Close when clicking nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navbar.classList.remove('active');
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && !menuToggle.contains(e.target) && navbar.classList.contains('active')) {
                menuToggle.classList.remove('active');
                navbar.classList.remove('active');
            }
        });
    }
}

/* ==========================================================================
   7. SCROLL SPY (ACTIVE NAV LINK HIGHLIGHT)
   ========================================================================== */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/* ==========================================================================
   8. CONTACT FORM HANDLER
   ========================================================================== */
function handleFormSubmit(e) {
    e.preventDefault();
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const feedback = document.getElementById('formFeedback');

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Encrypting & Transmitting...';

    // Simulated transmission followed by client mailto invocation
    setTimeout(() => {
        feedback.className = 'form-feedback success';
        feedback.innerHTML = `<i class="fas fa-check-circle"></i> Message prepared! Opening your mail client to send directly to <strong>sayyedfurkan115@gmail.com</strong>...`;

        // Direct mailto launcher
        const mailtoLink = `mailto:sayyedfurkan115@gmail.com?subject=${encodeURIComponent('[Portfolio Inquiry] ' + subject)}&body=${encodeURIComponent(`Sender: ${name} (${email})\n\nMessage:\n${message}`)}`;
        window.location.href = mailtoLink;

        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Transmit Message';
        form.reset();
    }, 1000);
}
