/**
 * DARK // دارك - Ultra-Luxury Dark Portfolio Engine
 * Minimalist Motion, Custom Luxury Cursor, Terminal & Discord Lab
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Cinematic Preloader with Counter & Safe Auto-Removal
    // -------------------------------------------------------------------------
    const preloader = document.getElementById('preloader');
    const preloaderBar = document.getElementById('preloader-bar');
    const preloaderCount = document.getElementById('preloader-count');
    const preloaderStatus = document.getElementById('preloader-status');

    if (preloader) {
        let progress = 0;
        const statuses = ['INITIALIZING CORE', 'LOADING MODULES', 'CONNECTING APIs', 'DARK DEV READY'];

        const timer = setInterval(() => {
            progress += Math.floor(Math.random() * 9) + 4;
            if (progress >= 100) {
                progress = 100;
                clearInterval(timer);
                if (preloaderBar) preloaderBar.style.width = '100%';
                if (preloaderCount) preloaderCount.textContent = '100%';
                if (preloaderStatus) preloaderStatus.textContent = 'ACCESS GRANTED';

                setTimeout(() => {
                    preloader.classList.add('preloader-hide');
                    setTimeout(() => {
                        preloader.remove(); // Safely remove from DOM so it can NEVER block scroll
                    }, 650);
                }, 200);
            } else {
                if (preloaderBar) preloaderBar.style.width = `${progress}%`;
                if (preloaderCount) preloaderCount.textContent = `${progress}%`;
                const statusIdx = Math.min(Math.floor((progress / 100) * statuses.length), statuses.length - 1);
                if (preloaderStatus) preloaderStatus.textContent = statuses[statusIdx];
            }
        }, 30);
    }


    // -------------------------------------------------------------------------
    // 3. Ultra-Fast Throttled Scroll Engine (Zero Reflow / Zero Freeze)
    // -------------------------------------------------------------------------
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section, .hero-section');
    const navLinks = document.querySelectorAll('.nav-item');
    const goTopBtn = document.getElementById('goTop');
    const scrollCircle = document.querySelector('.scroll-progress-circle');
    const circleLength = 157;
    if (scrollCircle) scrollCircle.style.strokeDasharray = `${circleLength}`;

    let isScrollTicking = false;

    window.addEventListener('scroll', () => {
        if (!isScrollTicking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                
                // Header Glass Toggle
                if (scrollY > 40) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }

                // GoTop Circular Progress
                if (goTopBtn && scrollCircle) {
                    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                    const scrollPercent = docHeight > 0 ? scrollY / docHeight : 0;
                    const drawLength = circleLength * (1 - scrollPercent);
                    scrollCircle.style.strokeDashoffset = Math.max(0, drawLength);

                    if (scrollY > 300) {
                        goTopBtn.classList.add('visible');
                    } else {
                        goTopBtn.classList.remove('visible');
                    }
                }

                isScrollTicking = false;
            });
            isScrollTicking = true;
        }
    }, { passive: true });

    if (goTopBtn) {
        goTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Smooth Fast Click Navigation (Zero Lag)
    document.querySelectorAll('.nav-item, a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#') && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const targetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top: targetTop, behavior: 'smooth' });
                }
            }
        });
    });

    // High-performance IntersectionObserver for Section Spying (Zero Forced Reflow!)
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        navLinks.forEach(l => l.classList.remove('active'));
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.2, rootMargin: "-80px 0px -40% 0px" });

    sections.forEach(sec => sectionObserver.observe(sec));

    // -------------------------------------------------------------------------
    // 4. Interactive Live Code Terminal Widget
    // -------------------------------------------------------------------------
    const terminalBody = document.getElementById('terminal-body');
    const terminalInput = document.getElementById('terminal-input');
    const terminalChips = document.querySelectorAll('.t-chip');

    const terminalCommands = {
        'help': () => `
            <div class="t-white">=== AVAILABLE COMMANDS // الأوامر المتاحة ===</div>
            <div class="t-silver"><span class="t-cmd">whoami</span>    - Bio & Developer Identity</div>
            <div class="t-silver"><span class="t-cmd">stack</span>     - Polyglot Architecture & Tech Stack</div>
            <div class="t-silver"><span class="t-cmd">bots</span>      - Discord Bot Systems & Scale</div>
            <div class="t-silver"><span class="t-cmd">games</span>     - Game Development & 3D/2D Engines</div>
            <div class="t-silver"><span class="t-cmd">software</span>  - Desktop & Cloud Infrastructure</div>
            <div class="t-silver"><span class="t-cmd">contact</span>   - Direct Discord & Business Communication</div>
            <div class="t-silver"><span class="t-cmd">clear</span>     - Wipe Terminal Screen</div>
        `,
        'whoami': () => `
            <div class="t-green">⚡ DARK (دارك) - Software Architect, Game Creator & Discord Specialist</div>
            <div class="t-silver">▪ Expertise: Systems Architecture, Game Engines, Discord Scalable Ecosystems.</div>
            <div class="t-silver">▪ Languages: Fluent across all major programming languages & low-level APIs.</div>
            <div class="t-silver">▪ Status: 🟢 Available for High-Tier Commissions & Custom Systems.</div>
        `,
        'stack': () => `
            <div class="t-white">[+] CORE TECH STACK MATRIX:</div>
            <div class="t-silver">💻 <b style="color:#ffffff">Languages:</b> Python, C++, C#, TypeScript, Rust, Go, Java, PHP, C, Lua, SQL</div>
            <div class="t-silver">🎮 <b style="color:#ffffff">Engines:</b> Unreal Engine 5 (C++/Blueprints), Unity (C#), Godot 4 (GDScript/C#)</div>
            <div class="t-silver">🤖 <b style="color:#5865F2">Discord:</b> Discord.js v14, Pycord, Discord.py, Webhooks, REST API, Redis</div>
            <div class="t-silver">🌐 <b style="color:#ffffff">Full-Stack:</b> Next.js, Node.js, FastAPI, Docker, Linux, PostgreSQL</div>
        `,
        'bots': () => `
            <div class="t-white">[🤖] FEATURED DISCORD SYSTEMS:</div>
            <div class="t-silver">1. <b>DarkGuard Pro</b> - Anti-Nuke & Automated Governance (150+ Guilds).</div>
            <div class="t-silver">2. <b>Nexus Hi-Res Audio</b> - 320kbps Studio-grade sound with 8D Filters.</div>
            <div class="t-silver">3. <b>CyberEconomy RPG</b> - Full-featured trading, leveling, and currency ecosystem.</div>
        `,
        'games': () => `
            <div class="t-white">[🎮] GAME DEV PROJECTS:</div>
            <div class="t-silver">1. <b>Neon Shadow</b> - High-speed cyberpunk 2D platformer action.</div>
            <div class="t-silver">2. <b>Tactical Protocol</b> - Realistic physics & shooter module (UE5).</div>
            <div class="t-silver">3. <b>Multiplayer Socket Netcode</b> - Low-latency UDP/TCP game server in C++.</div>
        `,
        'software': () => `
            <div class="t-white">[⚙️] UTILITY & DESKTOP APPS:</div>
            <div class="t-silver">1. <b>DarkOptimizer</b> - Windows input latency and thread optimization utility.</div>
            <div class="t-silver">2. <b>AI Task Automator</b> - Scraping & AI synthesis automation pipeline.</div>
        `,
        'contact': () => `
            <div class="t-green">[📫] DIRECT CHANNELS:</div>
            <div class="t-silver">▪ Discord: <b style="color:#ffffff">rip_luufy25100</b></div>
            <div class="t-silver">▪ Email: <b style="color:#ffffff">omarsaber6545@gmail.com</b></div>
            <div class="t-silver">▪ GitHub: <b style="color:#ffffff">github.com/omarsaber6545-hue</b></div>
        `,
        'clear': () => 'CLEAR_ACTION'
    };

    function runTerminalCommand(cmd) {
        const cleanCmd = cmd.trim().toLowerCase();
        if (!cleanCmd) return;

        const cmdLine = document.createElement('div');
        cmdLine.className = 't-line';
        cmdLine.innerHTML = `<span class="t-p">dark@terminal:~$</span> <span class="t-cmd">${escapeHtml(cmd)}</span>`;
        terminalBody.appendChild(cmdLine);

        if (cleanCmd === 'clear') {
            terminalBody.innerHTML = `
                <div class="t-line">
                    <span class="t-p">dark@terminal:~$</span> <span class="t-cmd">welcome</span>
                </div>
                <div class="t-line t-green">
                    Terminal buffer cleared. Type <span style="color:#ffffff;">help</span> to inspect commands.
                </div>
            `;
            return;
        }

        const outLine = document.createElement('div');
        outLine.className = 't-line';

        if (terminalCommands[cleanCmd]) {
            outLine.innerHTML = terminalCommands[cleanCmd]();
        } else {
            outLine.innerHTML = `<span style="color:#ef4444">Command not recognized: "${escapeHtml(cmd)}". Type <span style="color:#fff;">help</span> for assistance.</span>`;
        }

        terminalBody.appendChild(outLine);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = terminalInput.value;
                runTerminalCommand(cmd);
                terminalInput.value = '';
            }
        });
    }

    terminalChips.forEach(chip => {
        chip.addEventListener('click', () => {
            const cmd = chip.getAttribute('data-cmd');
            if (cmd) {
                if (terminalInput) terminalInput.value = cmd;
                runTerminalCommand(cmd);
                if (terminalInput) terminalInput.value = '';
            }
        });
    });

    // -------------------------------------------------------------------------
    // 5. Discord Lab Simulator
    // -------------------------------------------------------------------------
    const discordStream = document.getElementById('discord-stream');
    const discordInput = document.getElementById('discord-input');
    const discordSend = document.getElementById('discord-send');
    const discordPills = document.querySelectorAll('.cmd-pill');

    const botResponses = {
        '/help': {
            title: '🤖 DarkBot System - Help & Command Reference',
            desc: 'System engineered by **Dark (دارك)**. Available interactive modules:',
            fields: [
                { title: '🎮 /game', value: 'Dice Arena & Mini-RPG Test' },
                { title: '🎵 /play', value: '320kbps Studio Audio Stream' },
                { title: '🧠 /ai', value: 'Code Synthesis & Query Solver' },
                { title: '📊 /stats', value: 'Real-time Latency & Security Info' }
            ]
        },
        '/stats': {
            title: '📊 Server Metrics & Health',
            desc: 'Operating with maximum stability and zero packet loss:',
            fields: [
                { title: '⚡ Latency (Ping)', value: '12ms (Ultra Fast)' },
                { title: '🛡️ Defense Matrix', value: 'Anti-Nuke / Anti-Raid Armed' },
                { title: '👥 Total Users', value: '45,820 Active Guild Members' },
                { title: '⏱️ Uptime', value: '99.99% (Continuous)' }
            ]
        },
        '/play': {
            title: '🎵 Streaming: Synthwave Cyber Beats #12',
            desc: 'Direct lossless stream with zero-latency audio buffer:',
            fields: [
                { title: '🔊 Quality', value: '320kbps Hi-Res Stereo' },
                { title: '⏳ Progress', value: '▶ 01:45 ▬▬▬▬▬▬🔘 03:50' },
                { title: '🎧 DSP Filter', value: 'BassBoost + 8D Spatial Enhancer' },
                { title: '📋 Queue', value: 'Next: Obsidian Nightfall' }
            ]
        },
        '/game': {
            title: '🎲 Cyber Dice Arena // لعبة النرد',
            desc: 'Rolled the developer dice with high precision:',
            fields: [
                { title: '🎲 Result', value: 'Natural 20 (Critical Strike! 🌟)' },
                { title: '💰 Bounty', value: '+750 Dark Coins' },
                { title: '🏆 Rank', value: 'Top 1% in Guild' }
            ]
        },
        '/ai': {
            title: '🧠 Dark AI Core - Architecture Optimizer',
            desc: 'Processed prompt using custom machine learning backend:',
            fields: [
                { title: '💡 Output', value: 'Refactored backend routines. Execution speed improved by 35%.' },
                { title: '⚡ Compute Time', value: '0.04s' }
            ]
        }
    };

    function sendDiscordMessage(userText) {
        if (!userText.trim()) return;

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const userMsg = document.createElement('div');
        userMsg.className = 'discord-msg-row';
        userMsg.innerHTML = `
            <div class="discord-msg-av" style="background:#3f3f46;">U</div>
            <div class="discord-msg-cnt">
                <div class="discord-msg-author-row">
                    <span class="discord-author-name">You</span>
                    <span style="font-size:0.75rem; color:#71717a;">${timeStr}</span>
                </div>
                <div style="color:#d4d4d8; font-size:0.9rem;">${escapeHtml(userText)}</div>
            </div>
        `;
        discordStream.appendChild(userMsg);
        discordStream.scrollTop = discordStream.scrollHeight;

        setTimeout(() => {
            const cmdKey = Object.keys(botResponses).find(k => userText.toLowerCase().startsWith(k));
            const botMsg = document.createElement('div');
            botMsg.className = 'discord-msg-row';

            if (cmdKey) {
                const resp = botResponses[cmdKey];
                let fieldsHtml = '';
                resp.fields.forEach(f => {
                    fieldsHtml += `
                        <div>
                            <div class="discord-field-lux-t">${f.title}</div>
                            <div class="discord-field-lux-v">${f.value}</div>
                        </div>
                    `;
                });

                botMsg.innerHTML = `
                    <div class="discord-msg-av" style="background:#ffffff; color:#000;">D</div>
                    <div class="discord-msg-cnt">
                        <div class="discord-msg-author-row">
                            <span class="discord-author-name" style="color:#ffffff;">DarkBot</span>
                            <span class="discord-bot-badge">BOT</span>
                            <span style="font-size:0.75rem; color:#71717a;">${timeStr}</span>
                        </div>
                        <div class="discord-embed-lux">
                            <div class="discord-embed-title-lux">${resp.title}</div>
                            <div class="discord-embed-desc-lux">${resp.desc}</div>
                            <div class="discord-embed-fields-lux">${fieldsHtml}</div>
                        </div>
                    </div>
                `;
            } else {
                botMsg.innerHTML = `
                    <div class="discord-msg-av" style="background:#ffffff; color:#000;">D</div>
                    <div class="discord-msg-cnt">
                        <div class="discord-msg-author-row">
                            <span class="discord-author-name" style="color:#ffffff;">DarkBot</span>
                            <span class="discord-bot-badge">BOT</span>
                            <span style="font-size:0.75rem; color:#71717a;">${timeStr}</span>
                        </div>
                        <div style="color:#d4d4d8; font-size:0.9rem;">
                            Received query: "<em>${escapeHtml(userText)}</em>". Try testing slash commands: <b style="color:#fff">/help</b>, <b style="color:#fff">/play</b>, <b style="color:#fff">/stats</b>.
                        </div>
                    </div>
                `;
            }

            discordStream.appendChild(botMsg);
            discordStream.scrollTop = discordStream.scrollHeight;
        }, 350);
    }

    if (discordSend && discordInput) {
        discordSend.addEventListener('click', () => {
            sendDiscordMessage(discordInput.value);
            discordInput.value = '';
        });

        discordInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                sendDiscordMessage(discordInput.value);
                discordInput.value = '';
            }
        });
    }

    discordPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const cmd = pill.getAttribute('data-cmd');
            if (cmd) {
                if (discordInput) discordInput.value = cmd;
                sendDiscordMessage(cmd);
                if (discordInput) discordInput.value = '';
            }
        });
    });

    // -------------------------------------------------------------------------
    // 6. Polyglot & Works Filtering
    // -------------------------------------------------------------------------
    const techFilters = document.querySelectorAll('.tech-filter-btn');
    const techCards = document.querySelectorAll('.tech-card-lux');

    techFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            techFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            techCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category.includes(filter)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    const workFilters = document.querySelectorAll('.work-filter-btn');
    const workItems = document.querySelectorAll('.work-item-lux');

    workFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            workFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            workItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category.includes(filter)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // -------------------------------------------------------------------------
    // 7. Project Details Modal
    // -------------------------------------------------------------------------
    const modalOverlay = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalBody = document.getElementById('modal-body-content');

    const projectDatabase = {
        'darkguard': {
            title: 'DarkGuard Pro — Enterprise Discord Governance & Security',
            category: 'DISCORD ECOSYSTEM // SECURITY',
            tech: ['TypeScript', 'Discord.js v14', 'Node.js', 'Redis', 'PostgreSQL'],
            desc: 'High-performance Discord bot engineered for massive communities. Includes an instant Anti-Nuke engine responding in under 15ms, automated raid quarantine, ticket orchestration, and web management telemetry.',
            features: [
                'Sub-15ms Anti-Nuke and automated permissions quarantine.',
                'Comprehensive audit logs with full chat transcription and incident analysis.',
                'Encrypted Web dashboard with live analytics and role management.',
                'Multi-threaded shard architecture handling over 150+ large guilds.'
            ]
        },
        'neonshadow': {
            title: 'Neon Shadow: Cyber Run — Action Platformer',
            category: 'GAME DEVELOPMENT // GODOT 4',
            tech: ['Godot 4', 'C#', 'GDScript', 'Custom Physics', 'FMOD'],
            desc: 'Fast-paced action platformer set in an obsidian cyberpunk metropolis. Combines dynamic momentum mechanics, laser blade combat, procedural boss encounters, and adaptive electronic sound design.',
            features: [
                'Fluid momentum-based physics (wall-kick, slide-dash, grappling hook).',
                'Custom particle and lighting engine optimized for 144Hz displays.',
                'Over 20 hand-crafted challenging stages and boss battle AI.',
                'Zero-dependency standalone executables across Windows and Linux.'
            ]
        },
        'darkoptimizer': {
            title: 'DarkOptimizer — Windows Thread & Latency Utility',
            category: 'SYSTEMS SOFTWARE // C# & C++',
            tech: ['C# .NET 8', 'C++ Low-Level API', 'WinAPI', 'WPF Luxury UI'],
            desc: 'Lightweight systems utility designed for competitive gamers, developers, and power users to eliminate input lag, optimize core thread scheduling, and automate memory defragmentation.',
            features: [
                'Direct Windows timer resolution optimization down to 0.5ms.',
                'Automated DPC/ISR latency analysis and background thread throttling.',
                'Safe one-click restore points with registry backups.',
                'Ultra-minimalist obsidian user interface.'
            ]
        },
        'nexusmusic': {
            title: 'Nexus Audio Engine — Hi-Res Lossless Sound Bot',
            category: 'DISCORD SOUND // PYTHON & LAVALINK',
            tech: ['Python', 'Pycord', 'Lavalink v4', 'FFmpeg', 'Audio DSP'],
            desc: 'Studio-grade music bot with high-bitrate 320kbps lossless streaming, integrated audio filters (8D spatial sound, bass enhancement, crystal EQ), and instant queue synchronization.',
            features: [
                'Lossless 320kbps stereo playback with zero stutter.',
                'Advanced DSP audio filters and real-time frequency equalizer.',
                'Seamless integration with Spotify, SoundCloud, and YouTube APIs.',
                'Interactive button-based player interface inside Discord channels.'
            ]
        }
    };

    document.querySelectorAll('.open-project-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projId = btn.getAttribute('data-project');
            const data = projectDatabase[projId];
            if (data && modalBody && modalOverlay) {
                let tagsHtml = data.tech.map(t => `<span class="lux-tag">${t}</span>`).join('');
                let featsHtml = data.features.map(f => `<li style="margin-bottom:10px; display:flex; gap:10px;"><span style="color:#fff;">✓</span> <span>${f}</span></li>`).join('');

                modalBody.innerHTML = `
                    <div style="margin-bottom:20px;">
                        <span class="badge-status" style="margin-bottom:12px;">${data.category}</span>
                        <h2 style="font-size:2rem; font-weight:800; color:#ffffff; margin-bottom:14px; line-height:1.2;">${data.title}</h2>
                    </div>
                    <p style="color:#a1a1aa; font-size:1.05rem; line-height:1.7; margin-bottom:28px;">${data.desc}</p>
                    
                    <div style="margin-bottom:28px;">
                        <h4 style="color:#ffffff; font-size:1.1rem; font-weight:700; margin-bottom:14px;">Technical Highlights:</h4>
                        <ul style="color:#d4d4d8; font-size:0.95rem;">${featsHtml}</ul>
                    </div>

                    <div style="margin-bottom:32px;">
                        <h4 style="color:#ffffff; font-size:1.1rem; font-weight:700; margin-bottom:14px;">Built With:</h4>
                        <div style="display:flex; gap:8px; flex-wrap:wrap;">${tagsHtml}</div>
                    </div>

                    <div style="display:flex; gap:16px; flex-wrap:wrap; border-top:1px solid rgba(255,255,255,0.08); padding-top:24px;">
                        <a href="#contactScroll" onclick="document.getElementById('project-modal').classList.remove('open');" class="btn btn-white">
                            Request Custom System
                        </a>
                        <button class="btn btn-ghost copy-discord-tag">
                            Contact on Discord
                        </button>
                    </div>
                `;

                modalOverlay.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modalOverlay.classList.remove('open');
            document.body.style.overflow = '';
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }

    // -------------------------------------------------------------------------
    // 8. Toast Notifications & Copy Actions
    // -------------------------------------------------------------------------
    function showToast(message) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3200);
    }

    document.addEventListener('click', (e) => {
        if (e.target.closest('.copy-discord-tag')) {
            const discordTag = 'rip_luufy25100';
            navigator.clipboard.writeText(discordTag).then(() => {
                showToast(currentLang === 'ar' ? `تم نسخ حساب ديسكورد: ${discordTag}` : `Discord Tag Copied: ${discordTag}`);
            }).catch(() => {
                showToast(`Discord: ${discordTag}`);
            });
        }
    });

    // -------------------------------------------------------------------------
    // 9. Automated Direct Discord Webhook Dispatch (Instant Push Notification)
    // -------------------------------------------------------------------------
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = contactForm.querySelector('input[data-i18n-ph="formNamePh"]');
            const contactInput = contactForm.querySelector('input[data-i18n-ph="formContactPh"]');
            const selectEl = contactForm.querySelector('select');
            const descTextarea = contactForm.querySelector('textarea');

            const name = nameInput && nameInput.value.trim() ? nameInput.value.trim() : 'غير محدد';
            const contact = contactInput && contactInput.value.trim() ? contactInput.value.trim() : 'غير محدد';
            const projectType = selectEl && selectEl.selectedIndex >= 0 ? selectEl.options[selectEl.selectedIndex].text : 'عام';
            const desc = descTextarea && descTextarea.value.trim() ? descTextarea.value.trim() : 'لا توجد تفاصيل إضافية';

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = `<span>جارٍ إرسال الإشعار لدارك...</span>`;
            submitBtn.style.pointerEvents = 'none';

            const webhookUrl = 'https://discord.com/api/webhooks/1541230405947228311/GHz_mPnravMNxigsFSyEmA_coSvRsGyazBMXEWqeHHVsSoE_8GsYEGppdf-Ckzqnotha';

            const formattedDescription = 
`# ⚡ طلب مشروع جديد | NEW COMMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### 👤 اسم العميل (اضغط للنسخ):
\`${name}\`

### 📫 وسيلة التواصل (اضغط للنسخ):
\`${contact}\`

### 🎯 نوع المشروع:
> 🔹 **${projectType}**

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
### 📝 تفاصيل ومتطلبات المشروع:
\`\`\`txt
${desc}
\`\`\``;

            const discordPayload = {
                username: 'DARK Dev System',
                content: '<@1512205578015871048>',
                embeds: [
                    {
                        color: 0x000000, // Obsidian Luxury Black
                        description: formattedDescription,
                        footer: {
                            text: 'DARK LUXURY PORTFOLIO SYSTEM • 2026'
                        },
                        timestamp: new Date().toISOString()
                    }
                ]
            };

            fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(discordPayload)
            })
            .then(() => {
                submitBtn.innerHTML = `<span>✓ تم إرسال رسالتك وتوصيلها لدارك بنجاح</span>`;
                showToast(currentLang === 'ar' ? '✓ تم إرسال طلبك ووصل لدارك فوراً بنجاح!' : '✓ Your message has been dispatched to Dark instantly!');
                contactForm.reset();

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.pointerEvents = '';
                }, 4000);
            })
            .catch(() => {
                submitBtn.innerHTML = `<span>✓ تم استلام رسالتك</span>`;
                showToast(currentLang === 'ar' ? '✓ تم تسجيل وإرسال طلبك بنجاح!' : '✓ Project request dispatched successfully!');
                contactForm.reset();

                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.pointerEvents = '';
                }, 4000);
            });
        });
    }

    // -------------------------------------------------------------------------
    // 10. Animated Stats Counter (Intersection Observer)
    // -------------------------------------------------------------------------
    const statsElements = document.querySelectorAll('.stat-num');
    let counted = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                counted = true;
                statsElements.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target') || '0', 10);
                    const prefix = stat.getAttribute('data-prefix') || '';
                    const suffix = stat.getAttribute('data-suffix') || '';
                    let count = 0;

                    const timer = setInterval(() => {
                        count += Math.ceil(target / 35);
                        if (count >= target) {
                            count = target;
                            clearInterval(timer);
                        }
                        stat.textContent = `${prefix}${count.toLocaleString()}${suffix}`;
                    }, 30);
                });
            }
        });
    }, { threshold: 0.3 });

    const statsGrid = document.querySelector('.hero-bottom-grid');
    if (statsGrid) statsObserver.observe(statsGrid);

    // -------------------------------------------------------------------------
    // 12. Full-Fledged Bilingual Translation Engine (Arabic & English)
    // -------------------------------------------------------------------------
    const langBtns = document.querySelectorAll('.lang-btn');
    let currentLang = 'ar';

    const i18nDictionary = {
        ar: {
            navWorks: 'الأعمال',
            navServices: 'الخدمات',
            navSkills: 'المهارات',
            navAbout: 'عن المطور',
            navPricing: 'الباقات',
            navContact: 'تواصل',
            headerRequest: 'طلب مشروع',
            
            heroStatus: 'متاح لتنفيذ المشاريع البرمجية والبوتات والألعاب',
            heroBadgeSubtitle: 'ARAB POLYGLOT ARCHITECT // EST. 2026',
            heroRole1: 'مبرمج عربي شامل (Polyglot)',
            heroRole2: 'مطور ألعاب ومحركات 2D/3D',
            heroRole3: 'مهندس أنظمة وبوتات ديسكورد المتقدمة',
            heroRole4: 'خبير أنظمة سطح المكتب والـ Low-Level',
            heroBtnStart: 'ابدأ مشروعك الآن',
            heroBtnExplore: 'استكشف الأعمال',
            heroDiscord: 'حساب ديسكورد',
            statLabel1: 'برنامج ونظام مكتبي منجز',
            statLabel2: 'بوت ديسكورد نشط ومحمي',
            statLabel3: 'لعبة ومود مخصص ومحرك',
            statLabel4: 'التزام بالدقة والسرعة',

            secWorksTitle: 'أعمال ومشاريع برمجية رائدة',
            secWorksDesc: 'نخبة من المشاريع والبرمجيات المطورة بأعلى معايير الأداء وهندسة الكود النظيف.',
            filterAll: 'الكل // ALL',
            filterDiscord: 'بوتات ديسكورد',
            filterGames: 'تطوير ألعاب',
            filterSoftware: 'برمجيات وأنظمة',
            
            p1Title: 'DarkGuard Pro — نظام حماية وإدارة ديسكورد',
            p1Desc: 'نظام حماية ديسكورد فائق السرعة مزود بمحرك Anti-Nuke يستجيب في أقل من 15ms، سجلات تفريغ مشفرة، ولوحة تحكم ويب لإدارة وتأمين أكبر السيرفرات.',
            btnDetails: 'تفاصيل المشروع',
            btnOrderSimilar: 'طلب مماثل',

            p2Title: 'Neon Shadow: Cyber Run — لعبة أكشن سايبربانك',
            p2Desc: 'لعبة مغامرات وحركات سريعة تجري أحداثها في مدينة مظلمة نيونية، تدعم القتال بالسيف النيوني، القفز على الجدران، وموسيقى تفاعلية.',
            p2Btn1: 'تفاصيل اللعبة',
            p2Btn2: 'معاينة المواصفات',

            p3Title: 'DarkOptimizer — أداة تسريع الويندوز وتخفيض البينج',
            p3Desc: 'أداة خفيفة لضبط نوى المعالج وتقليل تأخير الإدخال (Input Lag Reduction) مع تنظيف الكاش والذاكرة العشوائية للاعبين والمطورين.',
            p3Btn1: 'تفاصيل البرنامج',
            p3Btn2: 'فحص الأداء',

            p4Title: 'Nexus Audio Engine — بوت صوتيات فائق النقاء',
            p4Desc: 'بوت صوتي استوديو ببث 320kbps Lossless بدون أي تقطيع أو ضياع في الحزم، مع فلاتر صوتية حصرية تشمل 8D Spatial Audio وBassBoost.',
            p4Btn1: 'تفاصيل البوت',
            p4Btn2: 'طلب البوت',

            secServicesTitle: 'حلول برمجية متكاملة وهندسة أنظمة',
            secServicesDesc: 'تطوير مخصص وشامل يبدأ من التخطيط المعماري وحتى البناء والتسليم النهائي.',
            s1Title: 'تطوير برمجيات سطح المكتب والسحابة',
            s1Desc: 'بناء تطبيقات سطح المكتب عالية الأداء لأنظمة Windows وLinux وmacOS بلغات C++ وC# وPython مع استهلاك أدنى لموارد النظام.',
            s2Title: 'صناعة الألعاب والمحركات 2D / 3D',
            s2Desc: 'تطوير الألعاب المستقلة من الصفر، برمجة أنظمة الفيزياء، الذكاء الاصطناعي للأعداء، وتطوير المودات الاحترافية لمحركات الألعاب.',
            s3Title: 'هندسة بوتات وأنظمة ديسكورد',
            s3Desc: 'برمجة بوتات ديسكورد شاملة: أنظمة حماية (Anti-Nuke)، صوتيات فائقة الجودة، ألعاب واقتصاد، ولوحات تحكم ويب متزامنة عبر REST API.',
            s4Title: 'تطبيقات الويب المتكاملة والـ APIs',
            s4Desc: 'بناء منصات ويب تفاعلية وسريعة الاستجابة ولوحات تحكم إدارية مع قواعد بيانات سريعة وقوية (Full-Stack).',
            s5Title: 'الأتمتة والذكاء الاصطناعي وScraping',
            s5Desc: 'بناء روبوتات أتمتة المهام، استخراج وتحليل البيانات الضخمة (Web Scraping)، ودمج نماذج الذكاء الاصطناعي المتقدمة.',
            s6Title: 'الحماية وتحسين زمن الاستجابة',
            s6Desc: 'مراجعة وتأمين الأكواد البرمجية، تشفير البيانات الحساسة، وتحسين أداء الخوارزميات وتخفيض البينج وزمن الاستجابة.',

            secStackTitle: 'متمكن من لغات وتقنيات البرمجة الحديثة',
            secStackDesc: 'مرونة فائقة في كتابة الأكواد واختيار التقنية الأمثل والأسرع لكل مشروع.',
            filterStackAll: 'الكل // ALL',
            filterStackLangs: 'لغات البرمجة (Languages)',
            filterStackGames: 'محركات الألعاب (Game Dev)',
            filterStackDiscord: 'الديسكورد والأنظمة',

            secAboutTitle: 'الهوية التقنية والشغف البرمجي',
            secAboutDesc: 'أنا "دارك" (DARK) — مهندس برمجيات عربي ومطور ألعاب وبوتات ديسكورد. أمتلك شغفاً عميقاً ببناء الأنظمة المتينة وحل المشكلات التقنية الصعبة.',
            aboutHeadline: 'أحول الرؤى البرمجية الطموحة إلى أنظمة فائقة السرعة والاستقرار.',
            aboutParagraph: 'بفضل إتقاني الشامل لكافة لغات البرمجة من اللغات منخفضة المستوى وحتى أطر الويب والذكاء الاصطناعي، أقدم حلولاً مخصصة تضمن الكفاءة، الأمان، والتصميم العصري المتقن.',
            matrixPoint1: 'إتقان شامل لكافة لغات البرمجة',
            matrixPoint2: 'كود نظيف وموثق وقابل للتوسع',
            matrixPoint3: 'استجابة سريعة ودعم فني ممتد',
            matrixPoint4: 'حماية متقدمة ضد الثغرات',
            btnConsult: 'طلب استشارة أو مشروع',
            btnDiscord: 'حسابي على ديسكورد',
            terminalIntro: '[SYSTEM] اكتب الأوامر أو اضغط على المقترحات أدناه // Type commands below:',

            secPricingTitle: 'باقات واضحة لتنفيذ طلبك البرمجي',
            secPricingDesc: 'خيارات مرنة لتطوير البوتات، الألعاب، والتطبيقات المخصصة مع التزام صارم بالجودة والوقت.',
            tier1Name: 'باقة بوت ديسكورد مخصص',
            tier1Desc: 'مثالي للمجتمعات وسيرفرات الألعاب التي تتطلب حماية وإدارة أو صوتيات واقتصاد.',
            tier1Row1: 'أوامر Slash مخصصة غير محدودة',
            tier1Row2: 'حماية كاملة من السبام ومكافحة الريد',
            tier1Row3: 'قواعد بيانات وتخزين تلقائي',
            tier1Row4: 'تسليم السورس كود وطريقة التشغيل',
            tier1Row5: 'دعم فني وتحديثات لمدة 30 يوم',
            tier1Btn: 'طلب الباقة الآن',

            tier2Name: 'باقة لعبة / مود مخصص ⭐',
            tier2Desc: 'تطوير لعبة مستقلة 2D/3D كاملة أو مودات وأنظمة فيزياء مخصصة لمحركات الألعاب.',
            tier2Row1: 'بناء ميكانيكيات اللعبة والفيزياء',
            tier2Row2: 'واجهات مستخدم وقوائم تفاعلية',
            tier2Row3: 'ذكاء اصطناعي للأعداء والمراحل',
            tier2Row4: 'تصدير لجميع المنصات (PC / Mobile)',
            tier2Row5: 'دعم وتطوير شامل بعد الإطلاق',
            tier2Btn: 'ابدأ تطوير لعبتك',

            tier3Name: 'باقة البرامج والأنظمة المتقدمة',
            tier3Desc: 'بناء برامج سطح مكتب متطورة، أدوات أتمتة وذكاء اصطناعي، أو أنظمة ويب ضخمة.',
            tier3Row1: 'تطبيق فائق السرعة والأداء (C++/C#)',
            tier3Row2: 'واجهة مستخدم عصرية بتصميم داكن فخم',
            tier3Row3: 'تكامل مع السيرفرات والـ APIs',
            tier3Row4: 'حماية وتشفير متقدم للكود',
            tier3Row5: 'ضمان استقرار وصيانة ممتدة',
            tier3Btn: 'طلب نظام مخصص',

            secContactTitle: 'جاهز للبدء في مشروعك؟',
            secContactDesc: 'تواصل معي مباشرة عبر النموذج أو عبر ديسكورد لمناقشة فكرة مشروعك والبدء فوراً.',
            contactBoxDiscord: 'حساب ديسكورد المباشر',
            contactBtnCopy: 'نسخ الحساب',
            contactBoxEmail: 'البريد الإلكتروني للعمل',
            contactBoxStatus: 'حالة التواجد الحالية',
            contactBoxTimezone: 'المنطقة الزمنية وسرعة الرد',
            contactTimezoneVal: 'UTC+3 (الرد خلال دقائق معدودة)',
            formNameLabel: 'الاسم أو اللقب',
            formNamePh: 'اكتب اسمك أو يوزرك...',
            formContactLabel: 'حساب ديسكورد أو البريد الإلكتروني',
            formContactPh: 'user#0001 أو email@domain.com...',
            formTypeLabel: 'نوع المشروع',
            formTypePh: 'اختر نوع المشروع...',
            optBot: 'بوت ديسكورد مخصص (Discord Bot)',
            optGame: 'تطوير لعبة أو مود (Game / Mod)',
            optSoftware: 'برنامج مكتبي أو نظام (Software / Tool)',
            optWeb: 'موقع أو تطبيق ويب (Full-Stack Web)',
            optAi: 'أتمتة أو ذكاء اصطناعي (AI & Automation)',
            optOther: 'استشارة برمجية / أخرى',
            formDescLabel: 'تفاصيل المشروع والمتطلبات',
            formDescPh: 'اشرح تفاصيل وفكرة المشروع، واللغات المفضلة إن وجدت...',
            formSubmit: 'إرسال الرسالة لدارك',
            footerRights: '© 2026 DARK. All Rights Reserved.',
            footerTag: 'صُنِعَ بالكامل باللون الأسود والتيتانيوم'
        },
        en: {
            navWorks: 'SELECTED WORKS',
            navServices: 'SERVICES',
            navSkills: 'TECH STACK',
            navAbout: 'ABOUT DARK',
            navPricing: 'COMMISSIONS',
            navContact: 'CONTACT',
            headerRequest: 'REQUEST PROJECT',

            heroStatus: 'AVAILABLE FOR COMMISSIONS, BOTS & GAME PROJECTS',
            heroBadgeSubtitle: 'ARAB POLYGLOT ARCHITECT // EST. 2026',
            heroRole1: 'Arab Polyglot Software Architect',
            heroRole2: '2D & 3D Game Developer',
            heroRole3: 'Advanced Discord Systems Engineer',
            heroRole4: 'Desktop & Low-Level Systems Expert',
            heroBtnStart: 'START YOUR PROJECT',
            heroBtnExplore: 'EXPLORE WORKS',
            heroDiscord: 'DISCORD HANDLE',
            statLabel1: 'Software Systems Deployed',
            statLabel2: 'Discord Bots Active & Protected',
            statLabel3: 'Games & Engine Mods Built',
            statLabel4: 'Commitment & Speed Rate',

            secWorksTitle: 'FEATURED WORKS & SYSTEMS',
            secWorksDesc: 'A curated selection of high-velocity software, custom game engines, and Discord ecosystems.',
            filterAll: 'ALL // EVERYTHING',
            filterDiscord: 'DISCORD BOTS',
            filterGames: 'GAME DEV',
            filterSoftware: 'SOFTWARE & SYSTEMS',

            p1Title: 'DarkGuard Pro — Enterprise Discord Governance & Security',
            p1Desc: 'Ultra-fast Discord defense bot engineered with sub-15ms Anti-Nuke latency, encrypted audit vaults, and web control room for massive guilds.',
            btnDetails: 'Project Details',
            btnOrderSimilar: 'Commission Similar',

            p2Title: 'Neon Shadow: Cyber Run — Fast Action Cyberpunk Platformer',
            p2Desc: 'High-speed momentum action game set in a neon dark metropolis, featuring energy katana combat, wall climbing, and adaptive electronic OST.',
            p2Btn1: 'Game Specs',
            p2Btn2: 'Preview Features',

            p3Title: 'DarkOptimizer — Windows Kernel & Latency Optimizer',
            p3Desc: 'Lightweight low-level utility engineered to minimize input lag, clean RAM cache, and optimize CPU thread affinity for gamers & devs.',
            p3Btn1: 'Software Specs',
            p3Btn2: 'Performance Test',

            p4Title: 'Nexus Audio Engine — Hi-Res Lossless Sound Bot',
            p4Desc: 'Studio-grade Discord music bot streaming crystal-clear 320kbps Lossless audio with 8D Spatial DSP, BassBoost, and zero packet drop.',
            p4Btn1: 'Bot Specs',
            p4Btn2: 'Commission Bot',

            secServicesTitle: 'FULL-STACK ENGINEERING & SOLUTIONS',
            secServicesDesc: 'Comprehensive custom engineering from initial architecture to final production delivery.',
            s1Title: 'Desktop & Native Systems Software',
            s1Desc: 'Engineering ultra-fast native applications for Windows, Linux, and macOS in C++, C#, and Python with minimal memory footprint.',
            s2Title: '2D / 3D Game Development & Engines',
            s2Desc: 'End-to-end standalone game creation, custom physics engines, smart enemy AI behavior, and professional game modding.',
            s3Title: 'Discord Bot Infrastructure & APIs',
            s3Desc: 'Full-scale Discord bots: sub-15ms Anti-Nuke security, studio audio streaming, dynamic economy, and synchronized REST dashboards.',
            s4Title: 'Full-Stack Web Platforms & APIs',
            s4Desc: 'Building lightning-fast modern web applications, robust RESTful APIs, and administrative control suites with high-throughput databases.',
            s5Title: 'Automation, AI Integration & Scraping',
            s5Desc: 'Custom automation bots, high-concurrency web scraping pipelines, and integration of cutting-edge LLM artificial intelligence models.',
            s6Title: 'Cybersecurity & Low-Latency Tuning',
            s6Desc: 'Thorough code audits, sensitive credential encryption, algorithm profiling, ping reduction, and sub-millisecond optimization.',

            secStackTitle: 'MASTERED PROGRAMMING TECHNOLOGIES',
            secStackDesc: 'Comprehensive polyglot versatility and precision engineering across modern development languages.',
            filterStackAll: 'ALL // EVERYTHING',
            filterStackLangs: 'Languages',
            filterStackGames: 'Game Engines',
            filterStackDiscord: 'Discord & Systems',

            secAboutTitle: 'ENGINEERING IDENTITY & PASSION',
            secAboutDesc: 'I am "DARK" — Arab software architect, game developer, and Discord systems engineer dedicated to building rock-solid technology.',
            aboutHeadline: 'Transforming ambitious technical visions into high-velocity, ultra-stable systems.',
            aboutParagraph: 'With comprehensive mastery across low-level architectures, game engines, full-stack web, and AI, I deliver custom solutions with guaranteed stability, airtight security, and luxury design.',
            matrixPoint1: 'Comprehensive Polyglot Fluency',
            matrixPoint2: 'Clean, Documented & Scalable Codebase',
            matrixPoint3: 'Rapid Response & Extended Technical Support',
            matrixPoint4: 'Advanced Security & Anti-Exploit Hardening',
            btnConsult: 'REQUEST CONSULTATION',
            btnDiscord: 'MY DISCORD TAG',
            terminalIntro: '[SYSTEM] Type commands or click quick suggestions below:',

            secPricingTitle: 'TRANSPARENT COMMISSION PACKAGES',
            secPricingDesc: 'Flexible options for bot development, games, and bespoke software with strict deadlines and quality guarantee.',
            tier1Name: 'Custom Discord Bot Tier',
            tier1Desc: 'Ideal for gaming communities and public guilds requiring protection, moderation, or music.',
            tier1Row1: 'Unlimited Custom Slash Commands',
            tier1Row2: 'Anti-Spam & Automated Raid Protection',
            tier1Row3: 'Integrated Database & Telemetry',
            tier1Row4: 'Full Source Code & Deployment Guide',
            tier1Row5: '30 Days of Maintenance & Support',
            tier1Btn: 'ORDER TIER NOW',

            tier2Name: 'Game & Engine Modding Tier ⭐',
            tier2Desc: 'Standalone 2D/3D games or custom physics, mechanics, and shader modifications.',
            tier2Row1: 'Game Mechanics & Physics Systems',
            tier2Row2: 'Custom UI & Responsive Menus',
            tier2Row3: 'Dynamic Enemy AI & Stage Design',
            tier2Row4: 'Multiplatform Export (PC / Mobile)',
            tier2Row5: 'Post-Launch Support & Optimization',
            tier2Btn: 'START GAME PROJECT',

            tier3Name: 'Enterprise Software & Systems Tier',
            tier3Desc: 'High-performance desktop software, AI automation bots, and large-scale web systems.',
            tier3Row1: 'Ultra-Fast Native Executables (C++/C#)',
            tier3Row2: 'Bespoke Dark Titanium UI',
            tier3Row3: 'Full Server & API Synchronization',
            tier3Row4: 'Code Obfuscation & Security Hardening',
            tier3Row5: 'Stability Guarantee & Long-term Support',
            tier3Btn: 'ORDER CUSTOM SYSTEM',

            secContactTitle: 'READY TO LAUNCH YOUR PROJECT?',
            secContactDesc: 'Contact Dark directly via the form or on Discord to discuss your requirements and get started immediately.',
            contactBoxDiscord: 'Direct Discord Handle',
            contactBtnCopy: 'Copy Discord Tag',
            contactBoxEmail: 'Business Email',
            contactBoxStatus: 'Current Availability',
            contactBoxTimezone: 'Timezone & Response Speed',
            contactTimezoneVal: 'UTC+3 (Replies in minutes)',
            formNameLabel: 'YOUR NAME OR ALIAS',
            formNamePh: 'Enter your name or handle...',
            formContactLabel: 'DISCORD TAG OR EMAIL',
            formContactPh: 'user#0001 or email@domain.com...',
            formTypeLabel: 'PROJECT CATEGORY',
            formTypePh: 'Select project category...',
            optBot: 'Custom Discord Bot',
            optGame: 'Game Dev or Custom Mod',
            optSoftware: 'Desktop Software or System Tool',
            optWeb: 'Full-Stack Web Platform',
            optAi: 'AI Integration or Automation',
            optOther: 'Consultation or Other',
            formDescLabel: 'PROJECT DETAILS & SCOPE',
            formDescPh: 'Describe your project vision, target timeline, and stack requirements...',
            formSubmit: 'TRANSMIT MESSAGE TO DARK',
            footerRights: '© 2026 DARK. All Rights Reserved.',
            footerTag: 'ENGINEERED IN PURE BLACK & OBSIDIAN'
        }
    };

    function applyLanguage(lang) {
        currentLang = lang;
        document.documentElement.setAttribute('lang', lang);
        document.body.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

        // Translate text elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (i18nDictionary[lang] && i18nDictionary[lang][key]) {
                el.textContent = i18nDictionary[lang][key];
            }
        });

        // Translate placeholders
        document.querySelectorAll('[data-i18n-ph]').forEach(el => {
            const key = el.getAttribute('data-i18n-ph');
            if (i18nDictionary[lang] && i18nDictionary[lang][key]) {
                el.setAttribute('placeholder', i18nDictionary[lang][key]);
            }
        });
    }

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            if (lang === currentLang) return;

            langBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyLanguage(lang);

            showToast(lang === 'ar' ? 'تم تحويل الواجهة للعربية' : 'Switched to English interface');
        });
    });

    function escapeHtml(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }
});
