document.addEventListener('DOMContentLoaded', () => {
    console.log("Script đã tải thành công!");

    // ====================================================
    // 1. TOP BAR DROPDOWN LOGIC
    // ====================================================
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


    // ====================================================
    // 2. SCROLL EFFECT (ẨN TOPBAR / STICKY HEADER)
    // ====================================================
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


    // ====================================================
    // 3. MOBILE MENU TOGGLE
    // ====================================================
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
    // 4. HERO SLIDER
    // ====================================================
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        const heroImgs = heroSlider.querySelectorAll('img');
        const leftBtn = heroSlider.querySelector('.hero-arrow.left');
        const rightBtn = heroSlider.querySelector('.hero-arrow.right');
        
        if(heroImgs.length > 0 && leftBtn && rightBtn) {
            let heroIdx = 0;
            let heroTimer = null;
            let isSliding = false;

            // Setup active ban đầu
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

                // Force reflow (optional hack if animation stuck)
                void newSlide.offsetWidth;

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
    // 5. COUNTERS ANIMATION
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
    // 6. CLIENTS SLIDER (LOGIC NHÂN BẢN ĐƠN GIẢN)
    // ====================================================
    const customerTrack = document.querySelector('.owl-carousel-clients-carousel');

    if (customerTrack) {
        const slides = Array.from(customerTrack.children);
        
        // Nhân bản danh sách logo để tạo vòng lặp
        slides.forEach(slide => {
            const clone = slide.cloneNode(true);
            clone.setAttribute('aria-hidden', true);
            customerTrack.appendChild(clone);
        });
        
        // Mẹo nhỏ: Nếu màn hình quá to mà ít logo, nhân bản thêm lần nữa cho chắc
        // (Với 21 logo thì không cần, nhưng cứ để code dự phòng)
        if (slides.length < 10) {
             slides.forEach(slide => {
                const clone = slide.cloneNode(true);
                clone.setAttribute('aria-hidden', true);
                customerTrack.appendChild(clone);
            });
        }
    }


    // ====================================================
    // 7. HỆ THỐNG GỌI HỖ TRỢ TRỰC TUYẾN (KHÁCH HÀNG)
    // ====================================================
    const btnCallSupport = document.getElementById('btnCallSupport');
    const videoModal = document.getElementById('videoModal');
    const btnCloseVideo = document.getElementById('btnCloseVideo');
    const btnSendChat = document.getElementById('btnSendChat');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    const agentVideo = document.getElementById('agentVideo');
    
    // Cấu hình
    const STAFF_ID = "kbtech-hotline-vip-1"; // Phải trùng với bên staff.html
    let peer = null;
    let conn = null; 

    // Hàm tiện ích: Thêm tin nhắn vào khung chat
    function addLog(text, type) {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'message ' + (type === 'me' ? 'user-msg' : 'agent-msg');
        
        // Link clickable
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
            // Kiểm tra giờ làm việc (Optional: Check ở client cho nhanh)
            const now = new Date();
            const h = now.getHours();
            // Nếu muốn chặn khách gọi ngoài giờ thì mở comment dòng dưới:
            // if(h < 8 || h >= 17) { alert("Tổng đài chỉ hoạt động từ 8h - 17h."); return; }

            videoModal.style.display = 'flex';
            
            // Nếu chưa có Peer ID thì tạo mới (Mỗi lần F5 là 1 ID khác nhau -> Khách khác nhau)
            if(!peer) {
                peer = new Peer(); // ID ngẫu nhiên
                
                peer.on('open', (id) => {
                    console.log('My ID:', id);
                    addLog("Đang kết nối tới nhân viên...", 'agent');
                    connectToStaff();
                });

                peer.on('call', (call) => {
                    // Khi Staff gọi video tới -> Trả lời (Answer)
                    // Quan trọng: Trả lời nhưng KHÔNG gửi stream của mình (null) 
                    // => Khách không bật mic/cam
                    call.answer(null); 
                    
                    call.on('stream', (remoteStream) => {
                        // Nhận hình ảnh/âm thanh từ Staff
                        agentVideo.srcObject = remoteStream;
                        
                        // --- FIX LỖI MẤT TIẾNG ---
                        agentVideo.muted = false; // <--- Dòng quan trọng: Ép mở tiếng
                        // --------------------------

                        // Chạy video
                        agentVideo.play().catch(e => {
                            console.log("Trình duyệt chặn Autoplay âm thanh, cần tương tác.");
                            // Nếu vẫn bị chặn, hiện nút cho khách bấm để nghe
                            addLog("⚠️ Nếu không nghe thấy tiếng, hãy chạm vào màn hình video.", 'agent');
                        });
                        
                        // Ẩn lớp phủ, hiện video
                        const overlay = document.querySelector('.video-overlay');
                        if(overlay) overlay.style.display = 'none';
                        
                        addLog("Nhân viên đã tham gia. Bạn có thể nghe và xem nhân viên hỗ trợ.", 'agent');
                    });
                });
                
                peer.on('error', (err) => {
                    console.error(err);
                    if(err.type === 'peer-unavailable') {
                        addLog("Hiện Staff đang offline. Vui lòng thử lại sau.", 'agent');
                    }
                });
            } else if (!conn || !conn.open) {
                // Nếu peer đã có nhưng mất kết nối chat -> kết nối lại
                addLog("Đang kết nối lại...", 'agent');
                connectToStaff();
            }
        });

        function connectToStaff() {
            if(conn) { conn.close(); }
            
            conn = peer.connect(STAFF_ID);

            conn.on('open', () => {
                addLog("Đã kết nối máy chủ! Đang chờ xếp hàng...", 'agent');
            });

            conn.on('data', (data) => {
                // Xử lý các tín hiệu đặc biệt từ Staff
                if (data === 'BUSY_NOW') {
                    addLog("⚠️ Staff đang hỗ trợ khách hàng khác. Vui lòng đợi trong giây lát...", 'agent');
                    conn.close(); // Ngắt để không spam
                } 
                else if (data === 'STAFF_END') {
                    addLog("Staff đã kết thúc phiên hỗ trợ. Cảm ơn bạn!", 'agent');
                    agentVideo.srcObject = null;
                    conn.close();
                }
                else {
                    addLog(data, 'agent'); // Tin nhắn thường
                }
            });
            
            conn.on('close', () => {
                console.log("Connection closed");
            });
        }

        // Nút Đóng Modal
        if (btnCloseVideo) {
            btnCloseVideo.addEventListener('click', () => {
                videoModal.style.display = 'none';
                if(conn) { 
                    conn.send("USER_DISCONNECT"); 
                    setTimeout(() => conn.close(), 100);
                }
                agentVideo.srcObject = null; // Tắt video
                chatMessages.innerHTML = ''; // Xóa log chat cũ cho sạch
            });
        }
    }

    // Gửi tin nhắn (Khách -> Staff)
    if (btnSendChat && chatInput) {
        function sendUserMessage() {
            const text = chatInput.value.trim();
            if (text !== "") {
                addLog(text, 'me'); // Hiện bên mình
                if(conn && conn.open) {
                    conn.send(text); // Gửi sang Staff
                } else {
                    addLog("(Chưa kết nối được Staff, tin nhắn chưa gửi đi)", 'agent');
                }
                chatInput.value = "";
            }
        }
        btnSendChat.addEventListener('click', sendUserMessage);
        chatInput.addEventListener('keypress', (e) => { 
            if (e.key === 'Enter') sendUserMessage(); 
        });
    }

    // ====================================================
    // 8. LOGIC NÚT LIÊN HỆ THÔNG MINH (SMART DOCK - FIX SMOOTH)
    // ====================================================
    const contactDock = document.getElementById('contactDock');
    const floatingGroup = document.getElementById('floatingGroup');

    if (contactDock && floatingGroup) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // KHI THẤY CHÂN TRANG (HẠ CÁNH)
                    // 1. Gỡ chế độ bay
                    floatingGroup.classList.remove('is-floating');
                    // 2. Thêm chế độ hạ cánh (để kích hoạt animation CSS softLanding)
                    floatingGroup.classList.add('is-docked');
                } else {
                    // KHI CUỘN LÊN (BAY)
                    // 1. Thêm chế độ bay
                    floatingGroup.classList.add('is-floating');
                    // 2. Gỡ chế độ hạ cánh
                    floatingGroup.classList.remove('is-docked');
                }
            });
        }, {
            root: null,
            threshold: 0.1 // Giữ nguyên độ nhạy
        });

        observer.observe(contactDock);
    } else {
        console.warn("Chưa thấy ID trong HTML footer.");
    }
});

// ====================================================
    // 9. CHỨC NĂNG TÌM KIẾM THÔNG MINH (SMART SEARCH)
    // ====================================================
    
    // Danh sách từ khóa và địa chỉ đích đến
    const searchData = [
        {
            keys: ["máy chủ", "server", "vps", "phần cứng", "ảo hóa"],
            link: "service.html#svc-server"
        },
        {
            keys: ["email", "mail", "thư điện tử", "outlook"],
            link: "service.html#svc-email"
        },
        {
            keys: ["bảo mật", "security", "virus", "ransomware", "hacker", "tường lửa", "firewall"],
            link: "service.html#svc-security"
        },
        {
            keys: ["sửa chữa", "máy tính", "laptop", "pc", "cài win", "vệ sinh"],
            link: "service.html#svc-repair"
        },
        {
            keys: ["nas", "lưu trữ", "backup", "dữ liệu", "synology"],
            link: "service.html#svc-nas"
        },
        {
            keys: ["helpdesk", "it", "hỗ trợ", "kỹ thuật", "sự cố"],
            link: "service.html#svc-helpdesk"
        },
        {
            keys: ["camera", "quan sát", "an ninh", "giám sát", "ai"],
            link: "service.html#svc-camera"
        },
        {
            keys: ["web", "website", "thiết kế", "seo", "giao diện"],
            link: "service.html#svc-web"
        },
        {
            keys: ["liên hệ", "sđt", "điện thoại", "địa chỉ", "map", "văn phòng"],
            link: "#contactDock" // Nhảy xuống chân trang hiện tại
        },
        {
            keys: ["giới thiệu", "về kb", "tầm nhìn", "sứ mệnh"],
            link: "about.html"
        },
        {
            keys: ["khách hàng", "đối tác"],
            link: "clients.html"
        }
    ];

    const searchInput = document.querySelector('.top-bar-search input');
    const searchBtn = document.querySelector('.top-bar-search button');

    function executeSearch() {
        // Lấy từ khóa, chuyển về chữ thường và xóa khoảng trắng thừa
        const query = searchInput.value.toLowerCase().trim();
        
        if (!query) {
            alert("Vui lòng nhập từ khóa để tìm kiếm!");
            return;
        }

        let foundLink = null;

        // Vòng lặp tìm kiếm: Duyệt qua từng nhóm dữ liệu
        for (let item of searchData) {
            // Kiểm tra xem từ khóa nhập vào có chứa bất kỳ từ khóa nào trong danh sách không
            const isMatch = item.keys.some(key => query.includes(key));
            
            if (isMatch) {
                foundLink = item.link;
                break; // Tìm thấy thì dừng ngay
            }
        }

        if (foundLink) {
            // Chuyển hướng
            window.location.href = foundLink;
        } else {
            alert("Không tìm thấy nội dung phù hợp! Bạn hãy thử từ khóa khác (ví dụ: server, camera, email...)");
        }
    }

    // Sự kiện Click nút kính lúp
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Chặn load lại trang nếu nằm trong form
            executeSearch();
        });
    }

    // Sự kiện Nhấn phím Enter trong ô nhập liệu
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                executeSearch();
            }
        });
    }

// ====================================================
    // SLIDER ẢNH DỊCH VỤ (Cột phải - Fix Loop)
    // ====================================================
    const marqueeTrack = document.querySelector('.marquee-track');

    if (marqueeTrack) {
        // Lấy danh sách ảnh gốc
        const images = Array.from(marqueeTrack.children);
        
        // Nhân đôi để tạo vòng lặp vô tận
        images.forEach(img => {
            const clone = img.cloneNode(true);
            marqueeTrack.appendChild(clone);
        });
    }

    // ====================================================
    // FILTER GALLERY (LỌC DỰ ÁN)
    // ====================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterBtns.length > 0 && galleryItems.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 1. Xóa active cũ, thêm active mới cho nút bấm
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // 2. Lấy giá trị filter (camera, web, it...)
                const filterValue = btn.getAttribute('data-filter');

                // 3. Duyệt qua từng ảnh để ẩn/hiện
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