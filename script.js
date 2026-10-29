const initialProjects = [
    {
        id: 1,
        name: "Campus Event Management",
        category: "Web Development",
        description:
            "Platform untuk mengelola acara kampus mulai dari pengajuan, publikasi, pendaftaran, hingga sertifikat peserta.",
        roles: [
            "UI/UX Designer",
            "Frontend Developer",
            "Backend Developer",
            "Project Manager",
        ],
        skills: ["Figma", "HTML/CSS", "JavaScript"],
        creator: "Tim Kampus",
    },
    {
        id: 2,
        name: "EduMate — Teman Belajar",
        category: "Mobile App",
        description:
            "Aplikasi belajar bersama yang membantu mahasiswa menemukan teman diskusi berdasarkan mata kuliah dan minat.",
        roles: ["UI/UX Designer", "Mobile Developer", "Backend Developer"],
        skills: ["Figma", "Flutter", "API"],
        creator: "Tim EduMate",
    },
    {
        id: 3,
        name: "AI Deteksi Penyakit Tanaman",
        category: "Artificial Intelligence",
        description:
            "Sistem berbasis AI untuk mengenali gejala penyakit tanaman dari foto dan memberikan informasi penanganan awal.",
        roles: ["AI/ML Engineer", "Frontend Developer", "Data Analyst"],
        skills: ["Python", "Machine Learning", "Dataset"],
        creator: "Tim AgriTech",
    },
    {
        id: 4,
        name: "Sistem Pelaporan Fasilitas",
        category: "Education",
        description:
            "Website pelaporan kerusakan fasilitas kampus dengan status laporan dan dashboard tindak lanjut.",
        roles: ["UI/UX Designer", "Frontend Developer", "Backend Developer"],
        skills: ["Figma", "PHP", "MySQL"],
        creator: "Tim Solutif",
    },
    {
        id: 5,
        name: "Smart Garden IoT",
        category: "IoT",
        description:
            "Prototipe pemantauan kelembapan tanah dan penyiraman tanaman menggunakan sensor dan dashboard web.",
        roles: ["Frontend Developer", "Backend Developer", "Data Analyst"],
        skills: ["IoT", "Sensor", "Dashboard"],
        creator: "Tim GreenTech",
    },
    {
        id: 6,
        name: "Cyber Awareness Hub",
        category: "Web Development",
        description:
            "Website edukasi keamanan digital untuk membantu mahasiswa memahami keamanan akun dan kebiasaan online yang aman.",
        roles: ["UI/UX Designer", "Frontend Developer", "Cyber Security"],
        skills: ["Security", "HTML/CSS", "Education"],
        creator: "Tim Cyber",
    },
];

const ROLE_OPTIONS = [
    "UI/UX Designer",
    "Frontend Developer",
    "Backend Developer",
    "Mobile Developer",
    "Data Analyst",
    "AI/ML Engineer",
    "Cyber Security",
    "Project Manager",
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

let projects = load("tm_projects", initialProjects);
let profile = load("tm_profile", {
    name: "Raihan Firdaus",
    year: "2025",
    className: "TRPL",
    role: "Frontend Developer",
    skills: "HTML, CSS, JavaScript",
    interests: "Web development, UI/UX, Artificial Intelligence",
    experience:
        "Sedang mengembangkan skill web development dan UI/UX melalui latihan serta project kampus.",
});

let toastTimer;

function load(key, fallback) {
    try {
        const value = localStorage.getItem(key);
        return value
            ? JSON.parse(value)
            : JSON.parse(JSON.stringify(fallback));
    } catch {
        return JSON.parse(JSON.stringify(fallback));
    }
}

function save(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        // Penyimpanan lokal mungkin tidak tersedia.
    }
}

function initials(name) {
    return (name || "TM")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0] || "")
        .join("")
        .toUpperCase();
}

function notify(message) {
    const toast = $("#toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}

function goTo(page) {
    $$(".page").forEach((element) => {
        element.classList.toggle("active", element.id === `page-${page}`);
    });

    $$(".nav-link").forEach((element) => {
        element.classList.toggle("active", element.dataset.page === page);
    });

    const titles = {
        home: "Dashboard",
        recommendations: "Rekomendasi Mahasiswa",
        jelajah: "Jelajah Project",
        profile: "Kelola Profile",
        chat: "Chat Mahasiswa",
    };

    $("#pageTitle").textContent = titles[page] || "Home";
    $("#sidebar").classList.remove("open");
    if (page === "jelajah") renderProjects();
    if (page === "recommendations") renderStudentMatches();



    if (page === "home") {
        renderHome();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}

$$("[data-page]").forEach((element) => {
    element.addEventListener("click", (event) => {
        event.preventDefault();
        goTo(element.dataset.page);
    });
});

$$("[data-goto]").forEach((element) => {
    element.addEventListener("click", () => {
        goTo(element.dataset.goto);
    });
});

const sidebar = $("#sidebar");
const menuToggle = $("#menuToggle");

function closeNavigation() {
    sidebar.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Buka navigasi");
}

menuToggle.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Tutup navigasi" : "Buka navigasi");
});

// Tutup menu setelah pengguna memilih halaman atau mengetuk area di luar menu.
$$(".nav-link").forEach((link) => {
    link.addEventListener("click", closeNavigation);
});

document.addEventListener("click", (event) => {
    if (!sidebar.contains(event.target)) closeNavigation();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
});

function projectCard(project) {
    const symbols = {
        "Web Development": "⌘",
        "Mobile App": "▣",
        "Artificial Intelligence": "✧",
        Education: "▤",
        IoT: "⌁",
    };

    const symbol = symbols[project.category] || "✦";
    const fit = projectMatch(project, profile);

    return `
        <article class="project-card">
            <div class="project-card-top">
                <span class="project-symbol">${symbol}</span>
                <div class="project-card-badges">
                    <span class="category-tag">${esc(project.category)}</span>
                    <span class="saw-score" title="Skor kecocokan dihitung dengan metode SAW">SAW ${fit}%</span>
                </div>
            </div>

            <h3>${esc(project.name)}</h3>
            <p>${esc(project.description)}</p>

            <div class="tag-list">
                ${(project.skills || [])
                    .slice(0, 3)
                    .map((skill) => `<span class="skill-tag">${esc(skill)}</span>`)
                    .join("")}
            </div>

            <div class="project-card-bottom">
                <span class="role-count">
                    ♧ ${(project.roles || []).length} role dibutuhkan
                </span>
                <button class="mini-btn" data-detail="${project.id}">
                    Lihat detail →
                </button>
            </div>
        </article>
    `;
}

function esc(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
    })[character]);
}

function renderHome() {
    $("#homeProjects").innerHTML = projects
        .slice(0, 3)
        .map(projectCard)
        .join("");

    $("#statProjects").textContent = projects.length;
    $("#statRoles").textContent = new Set(
        projects.flatMap((project) => project.roles || [])
    ).size;
    $("#statSkills").textContent = split(profile.skills).length;

    bindDetails();
}

function renderProjects() {
    const query = $("#searchInput").value.trim().toLowerCase();
    const role = $("#roleFilter").value;
    const category = $("#categoryFilter").value;

    const filteredProjects = projects.filter((project) => {
        const matchesQuery =
            !query ||
            [
                project.name,
                project.description,
                project.category,
                ...(project.skills || []),
                ...(project.roles || []),
            ]
                .join(" ")
                .toLowerCase()
                .includes(query);

        const matchesRole =
            !role || (project.roles || []).includes(role);
        const matchesCategory =
            !category || project.category === category;

        return matchesQuery && matchesRole && matchesCategory;
    }).sort((a, b) => projectMatch(b, profile) - projectMatch(a, profile));

    $("#allProjects").innerHTML = filteredProjects
        .map(projectCard)
        .join("");

    $("#resultCount").textContent =
        `${filteredProjects.length} project ditemukan · peringkat SAW diperbarui`;

    $("#emptyState").classList.toggle(
        "hidden",
        filteredProjects.length !== 0
    );
    $("#allProjects").classList.toggle(
        "hidden",
        filteredProjects.length === 0
    );

    bindDetails();
}

function bindDetails() {
    $$("[data-detail]").forEach((button) => {
        button.addEventListener("click", () => {
            showDetail(Number(button.dataset.detail));
        });
    });
}

function showDetail(id) {
    const project = projects.find((item) => item.id === id);

    if (!project) {
        return;
    }

    $("#detailContent").innerHTML = `
        <span class="category-tag">${esc(project.category)}</span>
        <h2>${esc(project.name)}</h2>
        <p>${esc(project.description)}</p>

        <h4>Skill yang digunakan</h4>
        <div class="tag-list">
            ${(project.skills || [])
                .map((skill) => `<span class="skill-tag">${esc(skill)}</span>`)
                .join("") || "Belum ditentukan"}
        </div>

        <h4>Role yang dibutuhkan</h4>
        <div class="tag-list">
            ${(project.roles || [])
                .map((role) => `<span class="category-tag">${esc(role)}</span>`)
                .join("") || "Belum ditentukan"}
        </div>

        <p>
            <b>Pembuat:</b>
            ${esc(project.creator || "Mahasiswa Team Match")}
        </p>

        <button class="btn btn-primary" id="interestBtn">
            Saya tertarik dengan project ini
        </button>
    `;

    $("#detailDialog").showModal();

    $("#interestBtn").addEventListener("click", () => {
        notify(
            "Ketertarikan dicatat untuk demo. Hubungi pembuat project untuk bergabung."
        );
        $("#detailDialog").close();
    });
}

$("#closeDialog").addEventListener("click", () => {
    $("#detailDialog").close();
});

$("#searchInput").addEventListener("input", renderProjects);
$("#roleFilter").addEventListener("change", renderProjects);
$("#categoryFilter").addEventListener("change", renderProjects);

function resetFilters() {
    $("#searchInput").value = "";
    $("#roleFilter").value = "";
    $("#categoryFilter").value = "";

    renderProjects();
}

$("#resetFilters").addEventListener("click", resetFilters);
$("#emptyReset").addEventListener("click", resetFilters);

function split(value) {
    return String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
}

function readImageAsDataURL(file) {
    return new Promise((resolve, reject) => {
        if (!file || !file.size) return resolve("");
        if (!file.type.startsWith("image/")) return reject(new Error("Pilih file gambar."));
        if (file.size > 2 * 1024 * 1024) return reject(new Error("Ukuran gambar maksimal 2 MB."));
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error("Gambar gagal dibaca."));
        reader.readAsDataURL(file);
    });
}

$("#projectForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const roles = form.getAll("roles");
    if (!roles.length) {
        notify("Pilih minimal satu role yang dibutuhkan.");
        return;
    }
    try {
        const poster = await readImageAsDataURL(form.get("poster"));
        const project = {
            id: Date.now(),
            name: String(form.get("name") || "").trim(),
            category: form.get("category"),
            description: String(form.get("description") || "").trim(),
            roles,
            skills: split(form.get("skills")),
            creator: String(form.get("creator") || "").trim() || profile.name,
            members: form.get("members"),
            poster,
        };
        projects.unshift(project);
        save("tm_projects", projects);
        event.currentTarget.reset();
        $("#createProjectPanel").classList.add("hidden");
        renderHome();
        renderProjects();
        renderStudentProjectOptions();
        notify("Project berhasil dibuat dan ditambahkan!");
        goTo("home");
    } catch (error) {
        notify(error.message || "Gagal menyimpan project.");
    }
});


// SAW (Simple Additive Weighting): seluruh bobot berjumlah 1,00.
const SAW_WEIGHTS = { role: 0.30, skills: 0.30, interests: 0.15, experience: 0.15, category: 0.10 };
const normalizeText = value => String(value || "").toLowerCase().replace(/[^a-z0-9+#./ -]/g, " ");
const tokens = value => normalizeText(Array.isArray(value) ? value.join(" ") : value).split(/[,;| ]+/).map(x=>x.trim()).filter(x=>x.length>1);
function overlapScore(a, b) {
    const aa = [...new Set(tokens(a))], bb = [...new Set(tokens(b))];
    if (!aa.length || !bb.length) return 0;
    const matched = aa.filter(x => bb.some(y => y === x || y.includes(x) || x.includes(y))).length;
    return matched / Math.max(aa.length, 1);
}
function projectMatch(project, person) {
    const role = (project.roles || []).some(r => normalizeText(r) === normalizeText(person.role)) ? 1 : overlapScore(project.roles || [], person.role);
    const skills = overlapScore(project.skills || [], person.skills || "");
    const interests = overlapScore(project.category || "", person.interests || "");
    const expText = person.experience || "";
    const expKeywords = (project.skills || []).concat(project.roles || [], [project.category || ""]);
    const experience = overlapScore(expKeywords, expText);
    const category = overlapScore(project.category || "", (person.interests || "") + " " + (person.skills || ""));
    const score = role*SAW_WEIGHTS.role + skills*SAW_WEIGHTS.skills + interests*SAW_WEIGHTS.interests + experience*SAW_WEIGHTS.experience + category*SAW_WEIGHTS.category;
    return Math.round(Math.max(0, Math.min(1, score))*100);
}
const demoStudents = [
 {name:"Nadia Putri",role:"UI/UX Designer",skills:"Figma, UI Design, User Research, Prototyping",interests:"UI/UX, Web Development, Education",experience:"Membuat prototype aplikasi kampus dengan Figma dan melakukan user research."},
 {name:"Dimas Pratama",role:"Backend Developer",skills:"PHP, MySQL, API, Database",interests:"Web Development, Backend, Database",experience:"Pernah membuat REST API dan database MySQL untuk project perkuliahan."},
 {name:"Raka Aditya",role:"Project Manager",skills:"Planning, Communication, Documentation",interests:"Manajemen Proyek, Education, Web Development",experience:"Mengatur pembagian tugas dan dokumentasi tim pada project kampus."},
 {name:"Salsa Maharani",role:"Frontend Developer",skills:"HTML, CSS, JavaScript, React, Figma",interests:"Web Development, UI/UX, Mobile App",experience:"Mengembangkan beberapa halaman web responsif dan integrasi API sederhana."},
 {name:"Fajar Ramadhan",role:"AI/ML Engineer",skills:"Python, Machine Learning, Dataset, Data Analysis",interests:"Artificial Intelligence, IoT, Agriculture",experience:"Melatih model klasifikasi sederhana menggunakan dataset gambar."},
 {name:"Alya Safitri",role:"Data Analyst",skills:"Python, Excel, SQL, Dashboard",interests:"Data Analysis, IoT, Education",experience:"Mengolah data dan membuat dashboard ringkasan untuk tugas kelompok."},
 {name:"Bima Saputra",role:"Mobile Developer",skills:"Flutter, Dart, API, Firebase",interests:"Mobile App, Education, UI/UX",experience:"Membuat prototype aplikasi mobile Flutter dan menghubungkannya dengan API."},
 {name:"Kevin Maulana",role:"Cyber Security",skills:"Network Security, Security, Linux, Awareness",interests:"Cyber Security, Web Development, Digital Safety",experience:"Mempelajari keamanan jaringan dan membuat materi edukasi keamanan digital."}
];
function studentMatch(project, student) {
    const role = (project.roles || []).some(r => normalizeText(r) === normalizeText(student.role)) ? 1 : overlapScore(project.roles || [], student.role);
    const skills = overlapScore(project.skills || [], student.skills);
    const interests = overlapScore(project.category || "", student.interests);
    const experience = overlapScore([...(project.skills||[]), ...(project.roles||[])], student.experience);
    const category = overlapScore(project.category || "", student.interests + " " + student.skills);
    return Math.round((role*SAW_WEIGHTS.role + skills*SAW_WEIGHTS.skills + interests*SAW_WEIGHTS.interests + experience*SAW_WEIGHTS.experience + category*SAW_WEIGHTS.category)*100);
}
function renderStudentProjectOptions() {
    const select = $("#studentProjectFilter");
    if (!select) return;
    const previous = select.value;
    select.innerHTML = '<option value="">Pilih project</option>' + projects.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join("");
    if (projects.some(p=>String(p.id)===previous)) select.value=previous;
    renderStudentMatches();
}
function renderStudentMatches() {
    const select = $("#studentProjectFilter"), host = $("#studentMatches");
    if (!select || !host) return;
    const project = projects.find(p=>String(p.id)===select.value);
    if (!project) {
        host.innerHTML = '<div class="empty-state"><h3>Pilih project terlebih dahulu</h3><p>Kandidat akan diurutkan dari persentase SAW tertinggi.</p></div>';
        $("#studentResultCount").textContent = "Pilih project untuk melihat kandidat";
        return;
    }
    const ranked = demoStudents.map(s=>({...s, score:studentMatch(project,s)})).sort((a,b)=>b.score-a.score);
    $("#studentResultCount").textContent = `${ranked.length} kandidat mahasiswa · diurutkan berdasarkan kecocokan SAW`;
    host.innerHTML = ranked.map(s=>`<article class="project-card student-card"><div class="student-card-head"><div class="avatar">${esc(initials(s.name))}</div><div><h3>${esc(s.name)}</h3><span class="category-tag">${esc(s.role)}</span></div></div><div class="match-score"><span>Kecocokan untuk ${esc(project.name)}</span><strong>${s.score}%</strong></div><p><b>Skill:</b> ${esc(s.skills)}</p><p><b>Minat:</b> ${esc(s.interests)}</p><p><b>Pengalaman:</b> ${esc(s.experience)}</p><button class="mini-btn" data-invite-student="${esc(s.name)}">Undang ke project</button></article>`).join("");
    $$("[data-invite-student]").forEach(btn=>btn.addEventListener("click",()=>{goTo("chat");const target=chatData.find(c=>c.name===btn.dataset.inviteStudent);if(target)openChat(target.id);else notify("Kandidat demo ini belum memiliki percakapan. Fitur undangan lintas pengguna membutuhkan backend.");}));
}
$("#studentProjectFilter")?.addEventListener("change", renderStudentMatches);
$("#toggleCreateProject")?.addEventListener("click", () => {
    const panel=$("#createProjectPanel");
    panel.classList.toggle("hidden");
    if (!panel.classList.contains("hidden")) panel.scrollIntoView({behavior:"smooth",block:"start"});
});

function applyProfile() {
    const name = profile.name || "Pengguna Team Match";

    $("#welcomeText").textContent =
        `Halo, ${name}! Selamat datang di website Team Match. ` +
        "Temukan project dan teman satu tim yang sesuai dengan skill kamu.";

    $("#sideName").textContent = name;
    $("#manageProfileBtn").textContent = name.toLowerCase().replace(/\s+/g, "");
    $("#sideAvatar").textContent = initials(name);
    $("#topAvatar").textContent = initials(name);
    $("#profileAvatar").textContent = initials(name);
    $("#profileDisplayName").textContent = name;

    $("#profileDisplayRole").textContent =
        `${profile.className || "Mahasiswa"} · ` +
        `${profile.role || "Anggota Team Match"}`;

    $("#profileName").value = profile.name || "";
    $("#profileYear").value = profile.year || "";
    $("#profileClass").value = profile.className || "";
    $("#profileRole").value = profile.role || ROLE_OPTIONS[1];
    $("#profileSkills").value = profile.skills || "";
    $("#profileInterests").value = profile.interests || "";
    $("#profileExperience").value = profile.experience || "";
    $("#creatorInput").value = profile.name || "";
}

$("#profileForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);

    profile = {
        name: form.get("name").trim(),
        year: form.get("year").trim(),
        className: form.get("className").trim(),
        role: form.get("role"),
        skills: form.get("skills").trim(),
        interests: form.get("interests").trim(),
        experience: form.get("experience").trim(),
    };

    save("tm_profile", profile);
    applyProfile();
    renderHome();
    renderProjects();
    renderStudentMatches();
    notify("Profil berhasil disimpan.");
});

$("#editProfileBtn").addEventListener("click", () => {
    $("#profileName").focus();
    $("#profileName").scrollIntoView({
        behavior: "smooth",
        block: "center",
    });
});

// Inisialisasi tampilan saat halaman pertama kali dibuka.
applyProfile();
renderHome();
renderProjects();
renderStudentProjectOptions();


// ---------------- CHAT MAHASISWA (DEMO LOKAL) ----------------
const defaultChats = [
    { id:"nadia", name:"Nadia Putri", role:"UI/UX Designer · Online", initials:"NP", color:"lavender", unread:2, preview:"Aku mengundang kamu ke Campus Connect!", time:"10:24", invite:true,
      messages:[{from:"them",text:"Hai! Aku sedang mengembangkan project Campus Connect.",time:"10:20"},{from:"them",text:"Aku mengundang kamu ke Campus Connect! Mau bergabung sebagai Frontend Developer?",time:"10:24"}]},
    { id:"dimas", name:"Dimas Pratama", role:"Backend Developer · Online", initials:"DP", color:"mint", unread:0, preview:"API-nya sudah siap untuk dites.", time:"09:45",
      messages:[{from:"them",text:"Halo! API-nya sudah siap untuk dites.",time:"09:45"}]},
    { id:"raka", name:"Raka Aditya", role:"Project Manager · Terakhir aktif 1 jam lalu", initials:"RA", color:"peach", unread:1, preview:"Kita diskusi jam berapa hari ini?", time:"Kemarin",
      messages:[{from:"them",text:"Kita diskusi jam berapa hari ini?",time:"Kemarin"}]},
    { id:"salsa", name:"Salsa Maharani", role:"UI/UX Designer · Online", initials:"SM", color:"blue", unread:0, preview:"Terima kasih, sampai ketemu!", time:"Senin",
      messages:[{from:"them",text:"Terima kasih, sampai ketemu!",time:"Senin"}]}
];
let chatData = load("tm_chats", defaultChats);
let activeChatId = null;
let chatFilter = "all";

function persistChats(){ save("tm_chats", chatData); }
function safeText(value){ return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch])); }

function renderConversationList(){
    const host = $("#conversationList");
    if (!host) return;
    const q = ($("#chatSearch").value || "").toLowerCase().trim();
    const list = chatData.filter(c => {
        const matches = (c.name + " " + c.preview).toLowerCase().includes(q);
        return matches && (chatFilter === "all" || (chatFilter === "unread" && c.unread > 0) || (chatFilter === "invites" && c.invite));
    });
    host.innerHTML = list.map(c => `
      <button class="conversation-item ${c.id===activeChatId?"selected":""}" data-conversation="${c.id}">
        <span class="chat-avatar ${c.color}">${safeText(c.initials)}<i></i></span>
        <span class="conversation-summary"><strong>${safeText(c.name)}</strong><span>${safeText(c.preview)}</span></span>
        <span class="conversation-meta"><small>${safeText(c.time)}</small>${c.unread?`<b class="unread-count">${c.unread}</b>`:""}</span>
      </button>`).join("") || '<div class="chat-empty-list">Tidak ada percakapan ditemukan.</div>';
    host.querySelectorAll("[data-conversation]").forEach(btn => btn.addEventListener("click",()=>openChat(btn.dataset.conversation)));
    const unreadTotal = chatData.reduce((sum,c)=>sum+c.unread,0);
    $("#chatNavBadge").textContent = unreadTotal || "";
    $("#chatNavBadge").classList.toggle("hidden", unreadTotal === 0);
}
function openChat(id){
    const c = chatData.find(item=>item.id===id);
    if(!c) return;
    activeChatId=id; c.unread=0; persistChats();
    $("#chatWelcome").classList.add("hidden");
    $("#chatConversation").classList.remove("hidden");
    $("#activeChatAvatar").textContent=c.initials;
    $("#activeChatAvatar").className="avatar chat-person-avatar "+c.color;
    $("#activeChatName").textContent=c.name;
    $("#activeChatStatus").textContent=c.role;
    $("#inviteBanner").classList.toggle("hidden",!c.invite);
    $("#inviteText").textContent=`${c.name} mengundang kamu untuk berkolaborasi dalam project Campus Connect.`;
    renderMessages(); renderConversationList();
}
function renderMessages(){
    const c=chatData.find(item=>item.id===activeChatId);
    if(!c)return;
    $("#messageList").innerHTML = `<div class="message-day">Hari ini</div>` + c.messages.map(m=>`
      <div class="message-row ${m.from==="me"?"mine":"theirs"}"><div class="message-bubble">${safeText(m.text)}<small>${safeText(m.time)} ${m.from==="me"?"✓✓":""}</small></div></div>`).join("");
    $("#messageList").scrollTop=$("#messageList").scrollHeight;
}
function sendChatMessage(text){
    const c=chatData.find(item=>item.id===activeChatId);
    if(!c)return;
    const now=new Date();
    const time=now.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"});
    c.messages.push({from:"me",text,time}); c.preview=text; c.time=time;
    persistChats(); renderMessages(); renderConversationList();
}
$("#chatForm").addEventListener("submit",event=>{
    event.preventDefault();
    const input=$("#chatMessageInput"), value=input.value.trim();
    if(!value || !activeChatId)return;
    sendChatMessage(value); input.value=""; input.focus();
});
$("#chatSearch").addEventListener("input",renderConversationList);
$$("[data-chat-filter]").forEach(btn=>btn.addEventListener("click",()=>{
    chatFilter=btn.dataset.chatFilter;
    $$("[data-chat-filter]").forEach(b=>b.classList.toggle("active",b===btn));
    renderConversationList();
}));
$$("[data-open-chat]").forEach(btn=>btn.addEventListener("click",()=>{
    goTo("chat"); openChat(btn.dataset.openChat);
}));
$("#chatInviteBtn").addEventListener("click",()=>{
    if(!activeChatId)return;
    const c=chatData.find(item=>item.id===activeChatId);
    sendChatMessage(`Hai ${c.name.split(" ")[0]}, aku ingin mengundangmu berkolaborasi di project-ku. Tertarik?`);
    notify("Undangan project dikirim di percakapan demo.");
});
$("#quickInvite").addEventListener("click",()=>$("#chatInviteBtn").click());
$("#acceptInvite").addEventListener("click",()=>{
    const c=chatData.find(item=>item.id===activeChatId); if(!c)return;
    c.invite=false; sendChatMessage("Aku menerima undangan kolaborasi. Terima kasih!"); openChat(activeChatId); notify("Undangan diterima (demo).");
});
$("#declineInvite").addEventListener("click",()=>{
    const c=chatData.find(item=>item.id===activeChatId); if(!c)return;
    c.invite=false; sendChatMessage("Terima kasih atas undangannya, tetapi aku belum bisa bergabung."); openChat(activeChatId); notify("Undangan ditolak (demo).");
});
$("#markNotificationsRead").addEventListener("click",()=>{
    chatData.forEach(c=>c.unread=0); persistChats(); renderConversationList(); notify("Notifikasi ditandai sudah dibaca.");
});
renderConversationList();
