document.addEventListener('DOMContentLoaded', () => {
    console.log("Script đã tải thành công! (Phiên bản Smart Contact)");

    // ====================================================
    // 1. TOP BAR (DROPDOWN & TÌM KIẾM THÔNG MINH)
    // ====================================================

    // --- 1.1. DROPDOWN LOGIC ---
    const dropdowns = document.querySelectorAll('.top-bar-links .dropdown');

    function closeAllDropdowns(exceptThisOne = null) {
        dropdowns.forEach(dropdown => {
            if (dropdown !== exceptThisOne) {
                const menu = dropdown.querySelector('.dropdown-menu');
                if (menu) menu.classList.remove('show');
            }
        });
    }

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        if (toggle && menu) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                closeAllDropdowns(dropdown);
                menu.classList.toggle('show');
            });
        }
    });

    window.addEventListener('click', () => closeAllDropdowns());

    // --- 1.2. CHỨC NĂNG TÌM KIẾM THÔNG MINH (SMART SEARCH) ---
    const searchInput = document.querySelector('.top-bar-search input');
    const searchBtn = document.querySelector('.top-bar-search button');

    // Dữ liệu tìm kiếm
    const searchData = [
        { keys: ["máy chủ", "server", "vps", "phần cứng", "ảo hóa"], link: "service.html#svc-server" },
        { keys: ["email", "mail", "thư điện tử", "outlook"], link: "service.html#svc-email" },
        { keys: ["bảo mật", "security", "virus", "ransomware", "hacker", "tường lửa", "firewall"], link: "service.html#svc-security" },
        { keys: ["sửa chữa", "máy tính", "laptop", "pc", "cài win", "vệ sinh"], link: "service.html#svc-repair" },
        { keys: ["nas", "lưu trữ", "backup", "dữ liệu", "synology"], link: "service.html#svc-nas" },
        { keys: ["helpdesk", "it", "hỗ trợ", "kỹ thuật", "sự cố"], link: "service.html#svc-helpdesk" },
        { keys: ["camera", "quan sát", "an ninh", "giám sát", "ai"], link: "service.html#svc-camera" },
        { keys: ["web", "website", "thiết kế", "seo", "giao diện"], link: "service.html#svc-web" },
        { keys: ["liên hệ", "sđt", "điện thoại", "địa chỉ", "map", "văn phòng"], link: "#contactDock" },
        { keys: ["giới thiệu", "về kb", "tầm nhìn", "sứ mệnh"], link: "about.html" },
        { keys: ["khách hàng", "đối tác"], link: "clients.html" }
    ];

    function executeSearch() {
        const query = searchInput.value.toLowerCase().trim();
        if (!query) {
            alert("Vui lòng nhập từ khóa để tìm kiếm!");
            return;
        }

        let foundLink = null;
        for (let item of searchData) {
            const isMatch = item.keys.some(key => query.includes(key));
            if (isMatch) {
                foundLink = item.link;
                break;
            }
        }

        if (foundLink) {
            window.location.href = foundLink;
        } else {
            alert("Không tìm thấy nội dung phù hợp! Bạn hãy thử từ khóa khác (ví dụ: server, camera, email...)");
        }
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            executeSearch();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                executeSearch();
            }
        });
    }


    // ====================================================
    // 2. HEADER & NAVIGATION (MENU CHÍNH)
    // ====================================================

    // --- 2.1. SCROLL EFFECT (ẨN TOPBAR / STICKY HEADER) ---
    const topBar = document.getElementById("topBar");
    const mainHeader = document.querySelector(".main-header");
    let lastScrollY = window.scrollY;

    if (topBar && mainHeader) {
        window.addEventListener("scroll", () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 150) {
                topBar.classList.add("hide");
                mainHeader.classList.add("up");
            } else if (currentScrollY < lastScrollY) {
                topBar.classList.remove("hide");
                mainHeader.classList.remove("up");
            }
            lastScrollY = currentScrollY;
        });
    }

    // --- 2.2. MOBILE MENU TOGGLE ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    function checkMobileMenu() {
        if (!menuToggle || !mainNav) return;
        if (window.innerWidth <= 900) {
            menuToggle.style.display = 'block';
            mainNav.classList.remove('open');
        } else {
            menuToggle.style.display = 'none';
            mainNav.classList.remove('open');
        }
    }

    if (menuToggle && mainNav) {
        checkMobileMenu();
        window.addEventListener('resize', checkMobileMenu);
        menuToggle.addEventListener('click', () => mainNav.classList.toggle('open'));
    }


    // ====================================================
    // 3. HERO SECTION (SLIDER CHÍNH)
    // ====================================================
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        const heroImgs = heroSlider.querySelectorAll('img, video');
        const leftBtn = heroSlider.querySelector('.hero-arrow.left');
        const rightBtn = heroSlider.querySelector('.hero-arrow.right');
        
        if(heroImgs.length > 0 && leftBtn && rightBtn) {
            let heroIdx = 0;
            let heroTimer = null;
            let isSliding = false;

            const initialActive = heroSlider.querySelector('img.active');
            if (initialActive) {
                heroIdx = Array.from(heroImgs).indexOf(initialActive);
            } else {
                heroImgs[0].classList.add('active');
                heroIdx = 0;
            }

            function showSlide(newIdx, direction = 1) {
                if (isSliding || newIdx === heroIdx || !heroImgs[newIdx]) return;
                isSliding = true;

                const oldIdx = heroIdx;
                const outClass = direction === 1 ? 'slide-out-left' : 'slide-out-right';
                const inClass = direction === 1 ? 'slide-in-right' : 'slide-in-left';
                const oldSlide = heroImgs[oldIdx];
                const newSlide = heroImgs[newIdx];

                newSlide.classList.add(inClass);
                void newSlide.offsetWidth; // Force reflow

                setTimeout(() => {
                    newSlide.classList.add('active');
                    newSlide.classList.remove(inClass);
                    oldSlide.classList.remove('active');
                    oldSlide.classList.add(outClass);
                }, 10);

                setTimeout(() => {
                    oldSlide.classList.remove(outClass);
                    heroIdx = newIdx;
                    isSliding = false;
                }, 700);
            }

            rightBtn.addEventListener('click', () => showSlide((heroIdx + 1) % heroImgs.length, 1));
            leftBtn.addEventListener('click', () => showSlide((heroIdx - 1 + heroImgs.length) % heroImgs.length, 0));

            function autoSlide() {
                heroTimer = setInterval(() => showSlide((heroIdx + 1) % heroImgs.length, 1), 3500);
            }
            autoSlide();
        }
    }


    // ====================================================
    // 4. LOGIC MODAL TƯ VẤN (FIX LỖI GMAIL)
    // ====================================================
    const consultModal = document.getElementById('consultModal');
    const closeConsultBtn = document.getElementById('closeConsult');
    
    // Các trường Input
    const elService = document.getElementById('serviceType');
    const elOption = document.getElementById('needOption');
    const elName = document.getElementById('custName');
    const elPhone = document.getElementById('custPhone');
    const elNote = document.getElementById('custNote');
    const btnEmail = document.getElementById('btnSmartEmail');

    // Data Dịch vụ
    const serviceData = {
        'server':   { title: 'DỊCH VỤ MÁY CHỦ',       img: 'thumb/sever.jpg', options: ['Mua máy chủ vật lý', 'Thuê Cloud Server/VPS', 'Thuê chỗ đặt (Colocation)', 'Sửa chữa phần cứng', 'Khác'] },
        'email':    { title: 'EMAIL DOANH NGHIỆP',    img: 'thumb/email.jpg', options: ['Email tên miền riêng', 'Google Workspace', 'Microsoft 365', 'Gia hạn Email', 'Khác'] },
        'security': { title: 'BẢO MẬT MẠNG',          img: 'thumb/security.jpg', options: ['Tường lửa (Firewall)', 'Phần mềm diệt Virus', 'Rà soát lỗ hổng', 'Cấu hình VPN', 'Khác'] },
        'repair':   { title: 'SỬA CHỮA MÁY TÍNH',     img: 'thumb/sua may.jpg.jpg', options: ['Sửa phần cứng PC/Laptop', 'Cài Win/Phần mềm', 'Nâng cấp SSD/RAM', 'Vệ sinh máy', 'Khác'] },
        'nas':      { title: 'LƯU TRỮ NAS',           img: 'thumb/nas.jpg', options: ['Mua thiết bị NAS', 'Cấu hình File Server', 'Backup dữ liệu', 'Cứu dữ liệu', 'Khác'] },
        'helpdesk': { title: 'IT HELPDESK',           img: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop', options: ['Thuê IT theo tháng', 'Hỗ trợ theo lượt', 'Thi công mạng LAN', 'Setup văn phòng mới', 'Khác'] },
        'camera':   { title: 'CAMERA AN NINH',        img: 'thumb/camera AI.jpg', options: ['Lắp Camera văn phòng', 'Camera AI thông minh', 'Lắp Camera gia đình', 'Sửa chữa Camera', 'Khác'] },
        'web':      { title: 'THIẾT KẾ WEB',          img: 'thumb/website.jpg', options: ['Web Doanh nghiệp', 'Web Bán hàng', 'SEO từ khóa', 'Chăm sóc Web', 'Khác'] }
    };

    // --- HÀM TẠO NỘI DUNG GMAIL (SỬA LỖI MAILTO) ---
    function updateEmailLink() {
        const sv = elService.value || "Dịch vụ KB";
        const op = elOption.value || "Chưa chọn";
        const nm = elName.value.trim() || "Khách hàng";
        const ph = elPhone.value.trim() || "Chưa nhập SĐT";
        const nt = elNote.value.trim() || "Không";

        const subject = `[YÊU CẦU TƯ VẤN] ${sv} - ${nm}`;
        const body = 
`Xin chào KB Tech,

Tôi cần tư vấn dịch vụ với thông tin sau:
--------------------------------
🔧 Dịch vụ: ${sv}
📌 Nhu cầu: ${op}
👤 Họ tên: ${nm}
📞 SĐT/Zalo: ${ph}
📝 Ghi chú: ${nt}
--------------------------------
Vui lòng báo giá cho tôi sớm nhất. Xin cảm ơn!`;

        // DÙNG LINK GMAIL TRỰC TIẾP (Bỏ mailto cũ đi)
        // Cách này ép trình duyệt mở trang web Gmail, không bao giờ bị lỗi "chọn app"
        const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=chounguyen308@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        if(btnEmail) {
            btnEmail.href = gmailLink;
            btnEmail.target = "_blank"; // Bắt buộc mở tab mới
        }
    }

    if (consultModal) {
        // 1. Mở Modal
        document.body.addEventListener('click', (e) => {
            if (e.target.closest('.btn-consult')) {
                e.preventDefault();
                const btn = e.target.closest('.btn-consult');
                const key = btn.getAttribute('data-service');
                const data = serviceData[key];

                if (data) {
                    document.getElementById('modalTitle').innerText = data.title;
                    document.getElementById('modalImg').src = data.img;
                    elService.value = data.title;

                    // Tạo Options
                    elOption.innerHTML = '';
                    data.options.forEach(opt => {
                        let o = document.createElement('option');
                        o.value = opt; o.innerText = opt;
                        elOption.appendChild(o);
                    });

                    // Reset
                    elName.value = ''; elPhone.value = ''; elNote.value = '';
                    updateEmailLink(); // Cập nhật link ban đầu
                    consultModal.style.display = 'flex';
                }
            }
        });

        // 2. Lắng nghe gõ phím để cập nhật link
        [elOption, elName, elPhone, elNote].forEach(el => {
            if(el) {
                el.addEventListener('input', updateEmailLink);
                el.addEventListener('change', updateEmailLink);
            }
        });

        // 3. Đóng Modal
        const close = () => consultModal.style.display = 'none';
        if(closeConsultBtn) closeConsultBtn.addEventListener('click', close);
        consultModal.addEventListener('click', (e) => { if(e.target === consultModal) close(); });
    }


    // ====================================================
    // 5. COUNTERS SECTION (SỐ LIỆU)
    // ====================================================
    const counters = document.querySelectorAll('.counter');
    const counterSection = document.querySelector('.counters');
    
    if (counterSection && counters.length > 0) {
        let hasAnimated = false;
        const speed = 200;

        const animateCounters = () => {
            counters.forEach(counter => {
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;
                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
        };

        window.addEventListener('scroll', () => {
            const sectionPos = counterSection.getBoundingClientRect().top;
            const screenPos = window.innerHeight / 1.3;
            if (sectionPos < screenPos && !hasAnimated) {
                animateCounters();
                hasAnimated = true;
            }
        });
    }


    // ====================================================
    // 6. CLIENTS SECTION (ĐỐI TÁC)
    // ====================================================
    const customerTrack = document.querySelector('.owl-carousel-clients-carousel');

    if (customerTrack) {
        const slides = Array.from(customerTrack.children);
        slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            clone.setAttribute('aria-hidden', true);
            customerTrack.appendChild(clone);
        });
        if (slides.length < 10) {
             slides.forEach(slide => {
                const clone = slide.cloneNode(true);
                clone.setAttribute('aria-hidden', true);
                customerTrack.appendChild(clone);
            });
        }
    }


    // ====================================================
    // 7. GALLERY SECTION (KHO DỰ ÁN & LOAD MORE)
    // ====================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const btnLoadMore = document.getElementById('btnLoadMore');
    const viewMoreWrap = document.getElementById('viewMoreWrap');
    
    const ITEMS_PER_PAGE = 8; // Mặc định hiện 8 cái

    function renderGallery(filter, isExpanded = false) {
        let count = 0;
        let hasHiddenItems = false;

        galleryItems.forEach(item => {
            const match = filter === 'all' || item.classList.contains(filter);
            
            if (match) {
                if (filter !== 'all' || isExpanded || count < ITEMS_PER_PAGE) {
                    item.classList.remove('hide', 'hidden-item');
                    item.classList.add('show');
                    count++;
                } else {
                    item.classList.remove('show');
                    item.classList.add('hide', 'hidden-item');
                    hasHiddenItems = true;
                }
            } else {
                item.classList.remove('show');
                item.classList.add('hide');
            }
        });

        // Xử lý nút "Xem thêm"
        if (viewMoreWrap) {
            if (filter === 'all' && !isExpanded && hasHiddenItems) {
                viewMoreWrap.classList.remove('hidden-btn');
                viewMoreWrap.style.display = 'block';
            } else {
                viewMoreWrap.classList.add('hidden-btn');
                viewMoreWrap.style.display = 'none';
            }
        }
    }

    if (galleryItems.length > 0) renderGallery('all');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderGallery(btn.getAttribute('data-filter'), false);
        });
    });

    if (btnLoadMore) {
        btnLoadMore.addEventListener('click', (e) => {
            e.preventDefault();
            renderGallery('all', true);
        });
    }


    // ====================================================
    // 8. FOOTER / CONTACT (NÚT LIÊN HỆ NỔI)
    // ====================================================
    const contactDock = document.getElementById('contactDock');
    const floatingGroup = document.getElementById('floatingGroup');

    if (contactDock && floatingGroup) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    floatingGroup.classList.remove('is-floating');
                    floatingGroup.classList.add('is-docked');
                } else {
                    floatingGroup.classList.add('is-floating');
                    floatingGroup.classList.remove('is-docked');
                }
            });
        }, { root: null, threshold: 0.1 });

        observer.observe(contactDock);
    }


    // ====================================================
    // 9. SUPPORT WIDGET (VIDEO/CHAT) & XÁC NHẬN GỌI
    // ====================================================
    const btnCallSupport = document.getElementById('btnCallSupport');
    
    // Elements Video Modal
    const videoModal = document.getElementById('videoModal');
    const btnCloseVideo = document.getElementById('btnCloseVideo');
    const agentVideo = document.getElementById('agentVideo');
    const btnSendChat = document.getElementById('btnSendChat');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');

    // Elements Popup Xác Nhận
    const confirmModal = document.getElementById('confirmModal');
    const btnConfirmYes = document.getElementById('btnConfirmYes');
    const btnConfirmNo = document.getElementById('btnConfirmNo');
    const closeConfirm = document.getElementById('closeConfirm');
    
    // Cấu hình PeerJS
    const STAFF_ID = "kbtech-hotline-vip-1"; 
    let peer = null;
    let conn = null; 

    // --- LOGIC XỬ LÝ XÁC NHẬN ---
    if (btnCallSupport && confirmModal) {
        btnCallSupport.addEventListener('click', () => {
            confirmModal.style.display = 'flex';
        });

        if(btnConfirmNo) btnConfirmNo.addEventListener('click', () => {
            confirmModal.style.display = 'none';
            window.open('https://zalo.me/0933129155', '_blank');
        });

        if(btnConfirmYes) btnConfirmYes.addEventListener('click', () => {
            confirmModal.style.display = 'none';
            videoModal.style.display = 'flex';
            startVideoCall();
        });

        const closeConfirmFunc = () => { confirmModal.style.display = 'none'; };
        if(closeConfirm) closeConfirm.addEventListener('click', closeConfirmFunc);
        confirmModal.addEventListener('click', (e) => { if (e.target === confirmModal) closeConfirmFunc(); });
    }

    // --- HÀM KẾT NỐI VIDEO ---
    function startVideoCall() {
        if(!peer) {
            peer = new Peer(); 
            peer.on('open', (id) => {
                console.log('My ID:', id);
                addLog("Đang kết nối tới tổng đài viên...", 'agent');
                connectToStaff();
            });

            peer.on('call', (call) => {
                call.answer(null); 
                call.on('stream', (remoteStream) => {
                    agentVideo.srcObject = remoteStream;
                    agentVideo.muted = false; 
                    agentVideo.play().catch(e => addLog("⚠️ Hãy chạm vào màn hình video để bật tiếng.", 'agent'));
                    
                    const overlay = document.querySelector('.video-overlay');
                    if(overlay) overlay.style.display = 'none';
                    addLog("Đã kết nối! Bạn có thể nghe và xem nhân viên hỗ trợ.", 'agent');
                });
            });
            
            peer.on('error', (err) => {
                console.error(err);
                if(err.type === 'peer-unavailable') addLog("Hiện Staff đang offline hoặc bận máy.", 'agent');
            });
        } else if (!conn || !conn.open) {
            addLog("Đang kết nối lại...", 'agent');
            connectToStaff();
        }
    }

    // Hàm kết nối Data (Chat)
    function connectToStaff() {
        if(conn) { conn.close(); }
        conn = peer.connect(STAFF_ID);

        conn.on('open', () => { addLog("Đã kết nối máy chủ! Vui lòng đợi nhân viên bắt máy...", 'agent'); });

        conn.on('data', (data) => {
            if (data === 'BUSY_NOW') {
                addLog("⚠️ Staff đang bận. Vui lòng thử lại sau hoặc chat Zalo.", 'agent');
                conn.close();
            } else if (data === 'STAFF_END') {
                addLog("Cuộc gọi đã kết thúc. Cảm ơn bạn!", 'agent');
                agentVideo.srcObject = null;
                conn.close();
            } else {
                addLog(data, 'agent');
            }
        });
        
        conn.on('close', () => { console.log("Connection closed"); });
    }

    // Hàm thêm log chat
    function addLog(text, type) {
        if (!chatMessages) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message ' + (type === 'me' ? 'user-msg' : 'agent-msg');
        if(text.includes('http')) {
            msgDiv.innerHTML = text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color:#00e676;text-decoration:underline;">$1</a>');
        } else {
            msgDiv.innerText = text;
        }
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Đóng Widget Video
    if (btnCloseVideo) {
        btnCloseVideo.addEventListener('click', () => {
            videoModal.style.display = 'none';
            if(conn) { 
                conn.send("USER_DISCONNECT"); 
                setTimeout(() => conn.close(), 100);
            }
            agentVideo.srcObject = null;
            chatMessages.innerHTML = '';
        });
    }

    // --- BẢO MẬT CHAT ---
    let lastMsgTime = 0;
    const SPAM_DELAY = 1500; 

    function sanitizeInput(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }

    if (btnSendChat && chatInput) {
        function sendUserMessage() {
            const now = Date.now();
            if (now - lastMsgTime < SPAM_DELAY) {
                alert("Bạn đang thao tác quá nhanh! Vui lòng đợi vài giây.");
                return;
            }

            let text = chatInput.value.trim();
            text = sanitizeInput(text); 

            if (text !== "") {
                lastMsgTime = now;
                addLog(text, 'me'); 
                if(conn && conn.open) {
                    conn.send(text); 
                } else {
                    addLog("(Chưa kết nối được Staff)", 'agent');
                }
                chatInput.value = "";
            }
        }
        btnSendChat.addEventListener('click', sendUserMessage);
        chatInput.addEventListener('keypress', (e) => { 
            if (e.key === 'Enter') sendUserMessage(); 
        });
    }

});