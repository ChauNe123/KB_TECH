document.addEventListener('DOMContentLoaded', () => {
    console.log("Script đã tải thành công!");

    // ====================================================
    // 1. TOP BAR (THANH TRÊN CÙNG)
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
        const heroImgs = heroSlider.querySelectorAll('video');
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
    // 4. LOGIC MODAL TƯ VẤN SẢN PHẨM (FULL 8 DỊCH VỤ)
    // ====================================================
    const consultModal = document.getElementById('consultModal');
    const closeConsultBtn = document.getElementById('closeConsult');
    const consultForm = document.getElementById('consultForm');
    
    // Nút mở modal (Lấy tất cả nút có class .btn-consult)
    // Lưu ý: Bạn cần thêm class này vào file HTML theo hướng dẫn Bước 2
    const consultBtns = document.querySelectorAll('.btn-consult');

    // Dữ liệu chi tiết cho từng dịch vụ
    const serviceData = {
        'server': {
            title: 'DỊCH VỤ MÁY CHỦ (SERVER)',
            img: 'thumb/sever.jpg',
            options: [
                'Mua máy chủ vật lý (Dell/HP/Lenovo)',
                'Thuê Cloud Server / VPS',
                'Thuê chỗ đặt máy chủ (Colocation)',
                'Cài đặt & Cấu hình hệ thống Server',
                'Sửa chữa / Nâng cấp phần cứng Server',
                'Khác'
            ]
        },
        'email': {
            title: 'EMAIL DOANH NGHIỆP',
            img: 'thumb/email.jpg',
            options: [
                'Đăng ký Email theo tên miền riêng',
                'Mua Google Workspace (Gmail doanh nghiệp)',
                'Mua Microsoft 365 (Outlook)',
                'Chuyển dữ liệu từ Email cũ sang mới',
                'Gia hạn dịch vụ Email',
                'Khác'
            ]
        },
        'security': {
            title: 'BẢO MẬT & AN NINH MẠNG',
            img: 'thumb/security.jpg',
            options: [
                'Tư vấn Firewall (Tường lửa) phần cứng',
                'Cài phần mềm diệt Virus/Ransomware bản quyền',
                'Rà soát lỗ hổng bảo mật hệ thống',
                'Cấu hình VPN cho nhân viên làm từ xa',
                'Xử lý sự cố khi bị tấn công mạng',
                'Khác'
            ]
        },
        'repair': {
            title: 'SỬA CHỮA MÁY TÍNH & LAPTOP',
            img: 'thumb/sua may.jpg.jpg',
            options: [
                'Sửa chữa phần cứng PC/Laptop',
                'Cài đặt Windows, Office, Phần mềm đồ họa',
                'Nâng cấp SSD / RAM tăng tốc máy',
                'Vệ sinh máy tính văn phòng',
                'Máy tính bị treo / Màn hình xanh',
                'Khác'
            ]
        },
        'nas': {
            title: 'LƯU TRỮ & BACKUP (NAS)',
            img: 'thumb/nas.jpg',
            options: [
                'Tư vấn mua thiết bị NAS Synology',
                'Cấu hình File Server (Phân quyền truy cập)',
                'Cài đặt Backup dữ liệu tự động',
                'Cứu dữ liệu ổ cứng / NAS bị lỗi',
                'Nâng cấp dung lượng lưu trữ',
                'Khác'
            ]
        },
        'helpdesk': {
            title: 'DỊCH VỤ IT HELPDESK',
            img: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop',
            options: [
                'Thuê IT Support trọn gói (Theo tháng)',
                'Hỗ trợ sự cố tính theo lượt (On-demand)',
                'Bảo trì hệ thống máy tính định kỳ',
                'Thi công mạng LAN / Wifi văn phòng',
                'Setup hệ thống văn phòng mới',
                'Khác'
            ]
        },
        'camera': {
            title: 'CAMERA AN NINH & AI',
            img: 'thumb/camera AI.jpg',
            options: [
                'Lắp đặt Camera văn phòng / Nhà xưởng',
                'Giải pháp Camera AI (Đếm người, nhận diện)',
                'Lắp đặt Camera gia đình',
                'Bảo trì / Sửa chữa hệ thống Camera cũ',
                'Gia hạn tên miền / Cloud Camera',
                'Khác'
            ]
        },
        'web': {
            title: 'THIẾT KẾ WEBSITE & APP',
            img: 'https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop',
            options: [
                'Thiết kế Website Doanh nghiệp',
                'Thiết kế Web Bán hàng (E-commerce)',
                'SEO từ khóa lên Top Google',
                'Chăm sóc / Quản trị nội dung Website',
                'Nâng cấp / Chỉnh sửa Web cũ',
                'Khác'
            ]
        }
    };

    if (consultModal) {
        // 1. Click nút mở Modal
        // Sử dụng Event Delegation để bắt sự kiện cho cả các nút được sinh ra sau này (nếu có)
        document.body.addEventListener('click', (e) => {
            // Kiểm tra xem cái được click có phải là nút tư vấn không
            if (e.target.closest('.btn-consult')) {
                e.preventDefault();
                const btn = e.target.closest('.btn-consult');
                const type = btn.getAttribute('data-service'); // Lấy loại dịch vụ (vd: email, server)
                const data = serviceData[type];

                if (data) {
                    // Cập nhật nội dung Modal
                    document.getElementById('modalTitle').innerText = data.title;
                    const imgElem = document.getElementById('modalImg');
                    if(imgElem) imgElem.src = data.img;
                    
                    const inputType = document.getElementById('serviceType');
                    if(inputType) inputType.value = type;

                    // Cập nhật Dropdown nhu cầu
                    const select = document.getElementById('needOption');
                    if (select) {
                        select.innerHTML = ''; // Xóa cũ
                        data.options.forEach(opt => {
                            const option = document.createElement('option');
                            option.value = opt;
                            option.innerText = opt;
                            select.appendChild(option);
                        });
                    }

                    // Hiện Modal
                    consultModal.style.display = 'flex';
                } else {
                    console.warn("Chưa có dữ liệu cho dịch vụ: " + type);
                }
            }
        });

        // 2. Đóng Modal
        const closeModal = () => {
            consultModal.style.display = 'none';
        };
        
        if(closeConsultBtn) closeConsultBtn.addEventListener('click', closeModal);
        
        consultModal.addEventListener('click', (e) => {
            if (e.target === consultModal) closeModal();
        });

        // 3. Xử lý Gửi Form (Kèm Rate Limit & Validation)
        let isSubmitting = false;

        if(consultForm) {
            consultForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (isSubmitting) return; // Chặn spam click
                isSubmitting = true;

                const btnSubmit = consultForm.querySelector('.btn-submit-consult');
                const originalText = btnSubmit.innerHTML;
                
                const phoneInput = consultForm.querySelector('input[type="tel"]');
                
                // Validate SĐT cơ bản
                if(phoneInput.value.length < 10 || isNaN(phoneInput.value)) {
                    alert("Vui lòng nhập số điện thoại hợp lệ!");
                    isSubmitting = false;
                    return;
                }

                btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
                btnSubmit.disabled = true;

                // Giả lập gửi (Sau này có Backend thì gọi API ở đây)
                setTimeout(() => {
                    alert("✅ Yêu cầu của bạn đã được gửi thành công!\nChuyên gia KB Tech sẽ liên hệ lại trong vòng 15 phút.");
                    consultForm.reset();
                    closeModal();
                    btnSubmit.innerHTML = originalText;
                    btnSubmit.disabled = false;
                    isSubmitting = false; 
                }, 1500);
            });
        }
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
        // Nhân bản logo
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
    // 7. GALLERY SECTION (KHO DỰ ÁN)
    // ====================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length > 0 && galleryItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                galleryItems.forEach(item => {
                    if (filterValue === 'all' || item.classList.contains(filterValue)) {
                        item.classList.remove('hide');
                        item.classList.add('show');
                    } else {
                        item.classList.remove('show');
                        item.classList.add('hide');
                    }
                });
            });
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
                    // Khi thấy chân trang -> Hạ cánh
                    floatingGroup.classList.remove('is-floating');
                    floatingGroup.classList.add('is-docked');
                } else {
                    // Khi cuộn lên -> Bay nổi
                    floatingGroup.classList.add('is-floating');
                    floatingGroup.classList.remove('is-docked');
                }
            });
        }, { root: null, threshold: 0.1 });

        observer.observe(contactDock);
    } else {
        console.warn("Chưa thấy ID trong HTML footer.");
    }


    // ====================================================
    // 9. SUPPORT WIDGET (VIDEO/CHAT) & SECURITY
    // ====================================================
    const btnCallSupport = document.getElementById('btnCallSupport');
    const videoModal = document.getElementById('videoModal');
    const btnCloseVideo = document.getElementById('btnCloseVideo');
    const btnSendChat = document.getElementById('btnSendChat');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const agentVideo = document.getElementById('agentVideo');
    
    // Cấu hình PeerJS
    const STAFF_ID = "kbtech-hotline-vip-1"; 
    let peer = null;
    let conn = null; 

    // Hàm thêm log chat (Utility)
    function addLog(text, type) {
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

    if (btnCallSupport && videoModal) {
        btnCallSupport.addEventListener('click', () => {
            const now = new Date();
            const h = now.getHours();
            // if(h < 8 || h >= 17) { alert("Tổng đài chỉ hoạt động từ 8h - 17h."); return; }

            videoModal.style.display = 'flex';
            
            if(!peer) {
                peer = new Peer(); 
                peer.on('open', (id) => {
                    console.log('My ID:', id);
                    addLog("Đang kết nối tới nhân viên...", 'agent');
                    connectToStaff();
                });

                peer.on('call', (call) => {
                    call.answer(null); 
                    call.on('stream', (remoteStream) => {
                        agentVideo.srcObject = remoteStream;
                        agentVideo.muted = false; // Mở tiếng
                        
                        agentVideo.play().catch(e => {
                            console.log("Autoplay bị chặn.");
                            addLog("⚠️ Nếu không nghe thấy tiếng, hãy chạm vào màn hình video.", 'agent');
                        });
                        
                        const overlay = document.querySelector('.video-overlay');
                        if(overlay) overlay.style.display = 'none';
                        addLog("Nhân viên đã tham gia.", 'agent');
                    });
                });
                
                peer.on('error', (err) => {
                    console.error(err);
                    if(err.type === 'peer-unavailable') {
                        addLog("Hiện Staff đang offline.", 'agent');
                    }
                });
            } else if (!conn || !conn.open) {
                addLog("Đang kết nối lại...", 'agent');
                connectToStaff();
            }
        });

        function connectToStaff() {
            if(conn) { conn.close(); }
            conn = peer.connect(STAFF_ID);

            conn.on('open', () => { addLog("Đã kết nối máy chủ! Đang chờ...", 'agent'); });

            conn.on('data', (data) => {
                if (data === 'BUSY_NOW') {
                    addLog("⚠️ Staff đang bận. Vui lòng đợi...", 'agent');
                    conn.close();
                } else if (data === 'STAFF_END') {
                    addLog("Staff đã kết thúc phiên hỗ trợ.", 'agent');
                    agentVideo.srcObject = null;
                    conn.close();
                } else {
                    addLog(data, 'agent');
                }
            });
            
            conn.on('close', () => { console.log("Connection closed"); });
        }

        // Đóng Widget
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
    }

    // 10. Xử lý Gửi Form (Tích hợp FormSubmit.co)
        let isSubmitting = false;

        if(consultForm) {
            consultForm.addEventListener('submit', (e) => {
                e.preventDefault(); // Chặn load lại trang
                
                if (isSubmitting) return; 
                isSubmitting = true;

                const btnSubmit = consultForm.querySelector('.btn-submit-consult');
                const originalText = btnSubmit.innerHTML;
                const phoneInput = consultForm.querySelector('input[type="tel"]');
                
                // Validate SĐT
                if(phoneInput.value.length < 10 || isNaN(phoneInput.value)) {
                    alert("Vui lòng nhập số điện thoại hợp lệ!");
                    isSubmitting = false;
                    return;
                }

                // Hiệu ứng đang gửi
                btnSubmit.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang gửi...';
                btnSubmit.disabled = true;

                // --- GỬI DỮ LIỆU ĐI ---
                // Thay EMAIL_CUA_BAN@GMAIL.COM bằng email thực tế nhận tin
                const EMAIL_NHAN_TIN = "chounguyen308@gmail.com"; // Ví dụ, hãy đổi lại email của bạn
                
                const formData = new FormData(consultForm);

                fetch(`https://formsubmit.co/ajax/${EMAIL_NHAN_TIN}`, {
                    method: "POST",
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    // Gửi thành công
                    alert("✅ Đã gửi thành công!\nCảm ơn bạn, KB Tech sẽ liên hệ lại ngay.");
                    consultForm.reset(); // Xóa trắng form
                    closeModal();        // Đóng modal
                })
                .catch(error => {
                    // Gửi thất bại
                    console.error('Error:', error);
                    alert("❌ Có lỗi xảy ra. Vui lòng thử lại hoặc gọi hotline trực tiếp!");
                })
                .finally(() => {
                    // Dù thành công hay thất bại cũng trả lại trạng thái nút
                    btnSubmit.innerHTML = originalText;
                    btnSubmit.disabled = false;
                    isSubmitting = false; 
                });
            });
        }

    // --- BẢO MẬT: CHỐNG SPAM CHAT & XSS ---
    let lastMsgTime = 0;
    const SPAM_DELAY = 1500; // 1.5 giây giữa các lần chat

    // Hàm lọc mã độc XSS
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
            text = sanitizeInput(text); // Lọc XSS

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