import { initPushNotification } from '../../presenters/notification-presenter';

const HomePage = {
  render() {
    return `
      <section class="home">
        <div class="notification-card">
          <h2 class="notif-title">Aktifkan Notifikasi</h2>
          <p class="notif-desc">Klik tombol di bawah untuk mendapatkan notifikasi saat Anda menambahkan story baru.</p>
          <button id="subscribe-btn" class="btn btn-primary">Izinkan Notifikasi</button>
          <p id="notif-status" class="notif-status"></p>
        </div>
      </section>
    `;
  },

  async afterRender() {
    const token = localStorage.getItem('token');
    const btn = document.getElementById('subscribe-btn');
    const status = document.getElementById('notif-status');

    // Pastikan tombol dan elemen status ditemukan
    if (!btn || !status) return;

    const permission = Notification.permission;

    if (permission === 'granted') {
      btn.textContent = 'Notifikasi Aktif ✅';
      btn.disabled = true;
      status.textContent = 'Anda sudah mengaktifkan notifikasi.';
      return;
    }

    if (permission === 'denied') {
      btn.textContent = 'Notifikasi Diblokir 🚫';
      btn.disabled = true;
      status.textContent = 'Silakan aktifkan notifikasi di pengaturan browser.';
      return;
    }

    // Jika default, izinkan user klik
    btn.disabled = false;
    btn.textContent = 'Izinkan Notifikasi';
    status.textContent = '';

    btn.addEventListener('click', async () => {
      try {
        const permissionResult = await Notification.requestPermission();

        if (permissionResult === 'granted') {
          await initPushNotification(token);
          btn.textContent = 'Notifikasi Aktif ✅';
          btn.disabled = true;
          status.textContent = 'Notifikasi berhasil diaktifkan.';
        } else if (permissionResult === 'denied') {
          btn.textContent = 'Notifikasi Diblokir 🚫';
          btn.disabled = true;
          status.textContent = 'Silakan aktifkan notifikasi dari pengaturan browser.';
        }
      } catch (err) {
        console.error('[Notif] Error:', err);
        status.textContent = 'Terjadi kesalahan saat mengaktifkan notifikasi.';
      }
    });
  }
};

export default HomePage;
