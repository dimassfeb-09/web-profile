# Requirements Document

## Introduction

Fitur ini mengintegrasikan Google Analytics 4 (GA4) ke dalam web profile personal berbasis Next.js 16 + React 19. Integrasi mencakup dua aspek utama: (1) tracking perilaku pengunjung di halaman publik menggunakan GA4 Measurement Protocol via `gtag.js`, dan (2) analytics dashboard di panel admin `/admin/dashboard` yang menampilkan data GA4 secara real-time diambil via Google Analytics Data API v1 (server-side).

Implementasi harus mendukung **graceful degradation**: apabila environment variables GA tidak dikonfigurasi, seluruh fitur tracking dan dashboard analytics dinonaktifkan tanpa menyebabkan error pada aplikasi.

## Glossary

- **GA4_Script**: Komponen React yang memuat `gtag.js` Google Analytics 4 di sisi klien menggunakan `next/script`.
- **GA4_Tracker**: Modul client-side yang menyediakan fungsi untuk mengirim custom events ke GA4 melalui `window.gtag`.
- **Analytics_API_Client**: Modul server-side yang berkomunikasi dengan Google Analytics Data API v1 menggunakan Google Service Account credentials.
- **Analytics_Dashboard**: Seksi di `/admin/dashboard` yang menampilkan widget-widget metrik GA4 berdampingan dengan content stats yang sudah ada.
- **Analytics_API_Route**: Next.js Route Handler (`/api/analytics`) yang mengambil data dari Google Analytics Data API v1 dan mengembalikannya ke klien admin.
- **Measurement_ID**: Google Analytics 4 Measurement ID dengan format `G-XXXXXXXXXX`, dikonfigurasi via environment variable `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- **Service_Account_Credentials**: Google Service Account JSON credentials yang digunakan Analytics_API_Client untuk autentikasi ke Google Analytics Data API v1, dikonfigurasi via environment variable `GA_SERVICE_ACCOUNT_CREDENTIALS`.
- **Property_ID**: Google Analytics 4 Property ID (numerik), dikonfigurasi via environment variable `GA_PROPERTY_ID`.
- **Graceful_Degradation**: Perilaku sistem di mana ketidakhadiran konfigurasi GA tidak menyebabkan error, crash, atau tampilan rusak pada aplikasi.
- **Content_Stats**: Data statistik konten yang sudah ditampilkan di dashboard admin (jumlah projects, blogs, skills, dll.) via `DashboardService.getStats()`.
- **DateRange**: Rentang tanggal untuk query Analytics Data API, default 30 hari terakhir.

---

## Requirements

### Requirement 1: Konfigurasi Environment Variables GA4

**User Story:** As a developer, I want to configure GA4 credentials via environment variables, so that the application can connect to GA4 services without hardcoding sensitive data.

#### Acceptance Criteria

1. THE System SHALL membaca Measurement ID GA4 dari environment variable `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
2. THE System SHALL membaca Google Analytics Property ID dari environment variable `GA_PROPERTY_ID`.
3. THE System SHALL membaca Google Service Account credentials dari environment variable `GA_SERVICE_ACCOUNT_CREDENTIALS` dalam format JSON string yang dapat di-parse menjadi object valid.
4. IF environment variable `NEXT_PUBLIC_GA_MEASUREMENT_ID` tidak diset, bernilai string kosong, atau tidak memenuhi pola format `G-[A-Z0-9]+`, THEN THE GA4_Script SHALL tidak dimuat ke halaman publik dan tidak menghasilkan error di console.
5. IF environment variable `GA_PROPERTY_ID` tidak diset atau bernilai string kosong, THEN THE Analytics_API_Client SHALL mengembalikan error `analytics_not_configured` yang ditangani oleh Analytics_Dashboard tanpa crash.
6. IF environment variable `GA_SERVICE_ACCOUNT_CREDENTIALS` tidak diset, bernilai string kosong, atau tidak dapat di-parse sebagai JSON valid, THEN THE Analytics_API_Client SHALL mengembalikan error `analytics_not_configured` yang ditangani oleh Analytics_Dashboard tanpa crash.

---

### Requirement 2: Pemuatan Script GA4 di Halaman Publik

**User Story:** As a site owner, I want GA4 tracking script loaded on all public pages, so that visitor behavior is tracked automatically.

#### Acceptance Criteria

1. WHEN `NEXT_PUBLIC_GA_MEASUREMENT_ID` diset dengan nilai yang diawali `G-` diikuti minimal satu karakter alfanumerik, THE GA4_Script SHALL dimuat di semua route dalam `app/(public)/layout.tsx` menggunakan komponen `next/script` dengan strategy `afterInteractive`.
2. THE GA4_Script SHALL memuat `https://www.googletagmanager.com/gtag/js?id={MEASUREMENT_ID}` sebagai external script.
3. THE GA4_Script SHALL menginisialisasi `window.dataLayer` dan memanggil `window.gtag('config', MEASUREMENT_ID)` via inline script dengan atribut `id` bernilai `ga4-inline-init`.
4. WHEN GA4_Script dimuat, THE GA4_Script SHALL mengkonfigurasi `send_page_view: false` pada inisialisasi awal untuk mencegah duplikasi pageview.
5. IF `NEXT_PUBLIC_GA_MEASUREMENT_ID` tidak dikonfigurasi atau tidak memenuhi format yang valid, THEN THE GA4_Script SHALL tidak dirender ke DOM dan tidak menampilkan error di console.
6. THE GA4_Script SHALL diimplementasikan sebagai komponen tersendiri sehingga hanya GA4_Script yang menjadi client component; `app/(public)/layout.tsx` tetap menjadi server component.

---

### Requirement 3: Tracking Pageview Otomatis di Halaman Publik

**User Story:** As a site owner, I want page views tracked automatically on every navigation, so that I can see which pages visitors browse.

#### Acceptance Criteria

1. WHEN halaman publik pertama kali dimuat atau WHEN pengguna berpindah antar route di halaman publik, THE GA4_Tracker SHALL mengirim tepat satu event `page_view` ke GA4 dengan parameter `page_path` berisi URL pathname saat ini (contoh: `/blog/my-post`, tanpa query string atau fragment).
2. THE GA4_Tracker SHALL mengirim tepat satu event `page_view` per perubahan pathname, termasuk pada saat halaman pertama kali dibuka.
3. WHEN event `page_view` dikirim, nilai `page_path` SHALL sama persis dengan pathname URL saat itu, tidak menyertakan query string (`?`) atau fragment (`#`).
4. IF `window.gtag` tidak tersedia (karena GA4_Script tidak dimuat), THEN THE GA4_Tracker SHALL tidak melempar error dan tidak melakukan tracking.
5. THE GA4_Tracker SHALL hanya aktif pada route di bawah public layout (`app/(public)/`), tidak pada route admin.

---

### Requirement 4: Tracking Custom Events — Blog Read

**User Story:** As a site owner, I want to track when visitors read a blog post, so that I can identify which content is most popular.

#### Acceptance Criteria

1. WHEN client component pada halaman detail blog di-mount di browser, THE GA4_Tracker SHALL mengirim custom event `blog_read` ke GA4.
2. THE GA4_Tracker SHALL menyertakan parameter `blog_title` (string judul blog) dan `blog_slug` (string slug) pada event `blog_read`; nilai-nilai ini diterima sebagai props dari Server Component halaman blog.
3. THE GA4_Tracker SHALL menyediakan fungsi `trackBlogRead(title: string, slug: string)` yang dapat dipanggil dari komponen client-side.
4. IF `window.gtag` tidak tersedia, THEN fungsi `trackBlogRead` SHALL tidak melempar error.

---

### Requirement 5: Tracking Custom Events — Project View

**User Story:** As a site owner, I want to track when visitors view a project detail, so that I can see which projects attract the most interest.

#### Acceptance Criteria

1. WHEN client component pada halaman detail project di-mount di browser, THE GA4_Tracker SHALL mengirim custom event `project_view` ke GA4.
2. THE GA4_Tracker SHALL menyertakan parameter `project_title` (string judul project) dan `project_slug` (string slug) pada event `project_view`; nilai-nilai ini diterima sebagai props dari Server Component halaman project.
3. THE GA4_Tracker SHALL menyediakan fungsi `trackProjectView(title: string, slug: string)` yang dapat dipanggil dari komponen client-side.
4. IF `window.gtag` tidak tersedia, THEN fungsi `trackProjectView` SHALL tidak melempar error.

---

### Requirement 6: Tracking Custom Events — Contact Form Submission

**User Story:** As a site owner, I want to track contact form submissions, so that I can measure how many visitors reach out.

#### Acceptance Criteria

1. WHEN contact form API call mengembalikan respons sukses di halaman publik, THE GA4_Tracker SHALL mengirim custom event `contact_submit` ke GA4.
2. THE GA4_Tracker SHALL menyertakan parameter `form_location` (string, nilai `'contact_page'`) pada event `contact_submit`.
3. THE GA4_Tracker SHALL menyediakan fungsi `trackContactSubmit()` yang dipanggil segera setelah API call mengembalikan respons sukses.
4. IF `window.gtag` tidak tersedia, THEN fungsi `trackContactSubmit` SHALL tidak melempar error.

---

### Requirement 7: Analytics API Route — Pengambilan Data GA4 Server-Side

**User Story:** As an admin, I want the server to fetch GA4 metrics securely, so that Service Account credentials are never exposed to the browser.

#### Acceptance Criteria

1. THE Analytics_API_Route SHALL diimplementasikan sebagai Next.js Route Handler di path `/api/analytics` dengan method `GET`.
2. WHEN Analytics_API_Route menerima request, THE Analytics_API_Client SHALL mengautentikasi ke Google Analytics Data API v1 menggunakan `GA_SERVICE_ACCOUNT_CREDENTIALS` dari server-side environment variable.
3. THE Analytics_API_Client SHALL mem-query Google Analytics Data API v1 dengan `GA_PROPERTY_ID` untuk DateRange 30 hari terakhir.
4. THE Analytics_API_Route SHALL mengembalikan data dalam format JSON yang mencakup: total page views, total unique visitors (active users), array top 5 pages (path dan page views), array traffic sources (source/medium dan sessions), dan device category breakdown (desktop, mobile, tablet).
5. IF `GA_PROPERTY_ID` atau `GA_SERVICE_ACCOUNT_CREDENTIALS` tidak dikonfigurasi, THEN THE Analytics_API_Route SHALL mengembalikan HTTP 503 dengan body `{ "error": "analytics_not_configured" }`.
6. IF Google Analytics Data API v1 mengembalikan error, THEN THE Analytics_API_Route SHALL mengembalikan HTTP 502 dengan body `{ "error": "analytics_api_error", "message": string }`.
7. THE Analytics_API_Route SHALL hanya dapat diakses dari request yang terautentikasi sebagai admin (memverifikasi session cookie yang sama dengan proteksi admin panel lainnya).
8. THE Analytics_API_Route SHALL mengimplementasikan response caching dengan max-age 300 detik (`Cache-Control: private, max-age=300`) untuk mengurangi kuota API.

---

### Requirement 8: Analytics Dashboard — Tampilan Metrik di Admin

**User Story:** As an admin, I want to see GA4 metrics on the dashboard, so that I can monitor site traffic without leaving the admin panel.

#### Acceptance Criteria

1. THE Analytics_Dashboard SHALL ditampilkan di halaman `/admin/dashboard` berdampingan dengan Content_Stats yang sudah ada, di bawah grid Content_Stats.
2. WHEN Analytics_Dashboard pertama kali dimuat, THE Analytics_Dashboard SHALL mengambil data dari Analytics_API_Route via `fetch('/api/analytics')` di sisi klien.
3. WHILE data GA4 sedang dimuat, THE Analytics_Dashboard SHALL menampilkan skeleton loading state berupa placeholder blocks yang terlihat oleh pengguna tanpa menampilkan nilai metrik apapun.
4. WHEN data GA4 berhasil dimuat, THE Analytics_Dashboard SHALL menampilkan widget-widget berikut: (a) total page views 30 hari terakhir, (b) total unique visitors 30 hari terakhir, (c) tabel top 5 pages, (d) breakdown traffic sources (maksimum 10 entries), (e) breakdown device category (maksimum 10 entries).
5. IF Analytics_API_Route mengembalikan `{ "error": "analytics_not_configured" }`, THEN THE Analytics_Dashboard SHALL menampilkan pesan informatif "Analytics belum dikonfigurasi. Tambahkan GA credentials ke environment variables." tanpa menampilkan widget metrik.
6. IF Analytics_API_Route mengembalikan error selain `analytics_not_configured`, THEN THE Analytics_Dashboard SHALL menampilkan pesan error "Gagal memuat data analytics." dengan tombol retry; WHEN tombol retry diklik, THE Analytics_Dashboard SHALL menampilkan skeleton loading state dan melakukan satu kali re-fetch.
7. THE Analytics_Dashboard SHALL menampilkan icons dari Material Symbols dan typography dari design system yang sama dengan DashboardClient.
8. WHEN tombol "Refresh" di `DashboardClient` diklik, THE Analytics_Dashboard SHALL menampilkan skeleton loading state dan melakukan fetch ulang data dari Analytics_API_Route.

---

### Requirement 9: Validasi dan Format Data Analytics

**User Story:** As a developer, I want analytics data to be validated before display, so that malformed API responses don't break the dashboard UI.

#### Acceptance Criteria

1. THE Analytics_API_Route SHALL memvalidasi respons dari Google Analytics Data API v1 sebelum mengembalikannya ke klien; IF struktur respons tidak sesuai skema yang diharapkan, THEN Analytics_API_Route SHALL mengembalikan HTTP 502.
2. THE Analytics_Dashboard SHALL menampilkan angka page views dan unique visitors diformat dengan `Intl.NumberFormat` locale `'id-ID'` (contoh: `1.234`).
3. THE Analytics_Dashboard SHALL menampilkan persentase pada device breakdown diformat dengan satu angka desimal (contoh: `67.3%`).
4. WHEN data top pages diterima, THE Analytics_Dashboard SHALL memotong path yang lebih dari 40 karakter dengan ellipsis (`…`) untuk menjaga keterbacaan tabel.
5. FOR ALL nilai numerik yang diterima dari Analytics_API_Route, THE Analytics_Dashboard SHALL memperlakukan nilai `null` atau `undefined` sebagai `0` tanpa menampilkan error.

---

### Requirement 10: Keamanan Credentials Service Account

**User Story:** As a developer, I want Service Account credentials to stay server-side only, so that sensitive credentials are never exposed to the browser.

#### Acceptance Criteria

1. THE System SHALL tidak pernah menyertakan nilai `GA_SERVICE_ACCOUNT_CREDENTIALS` dalam JavaScript bundle yang dikirim ke browser.
2. THE Analytics_API_Client SHALL hanya diinstansiasi dalam konteks server-side (Route Handler atau Server Component), bukan dalam komponen yang menggunakan `'use client'` directive.
3. THE System SHALL tidak menyertakan `GA_SERVICE_ACCOUNT_CREDENTIALS` dalam response body apapun yang dikembalikan ke klien.
4. WHERE `GA_SERVICE_ACCOUNT_CREDENTIALS` berisi JSON dengan private key, THE Analytics_API_Client SHALL mem-parse credentials tersebut hanya di server-side sebelum digunakan untuk autentikasi.
