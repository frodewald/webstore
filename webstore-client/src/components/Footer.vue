<template>
  <footer class="bg-success text-white py-3 mt-6">
    <div class="container">
      <div class="row justify-content-between align-items-center">
        <!-- Bagian Atas Footer -->
        <div class="col-12 col-md-6 text-center text-md-start">
          <p class="mb-0">&copy; 2025 Webstore Kami. All Rights Reserved.</p>
        </div>
        <!-- Kolom Ikon Media Sosial dan Link -->
        <div class="col-12 col-md-6 text-center text-md-end">
          <router-link to="/privacy" class="text-white small text-decoration-none">Kebijakan Privasi</router-link>
          <span class="mx-2 text-white">|</span>
          <router-link to="/terms" class="text-white small text-decoration-none">Syarat & Ketentuan</router-link>
          <div class="mt-2">
            <a href="#" class="text-white mx-2" aria-label="Facebook"><i class="fab fa-facebook fa-lg"></i></a>
            <a href="#" class="text-white mx-2" aria-label="Instagram"><i class="fab fa-instagram fa-lg"></i></a>
            <a href="#" class="text-white mx-2" aria-label="Twitter"><i class="fab fa-twitter fa-lg"></i></a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
};
</script>

<style scoped>
/* Styling footer */
footer {
  font-size: 0.875rem; /* Ukuran font kecil */
}

footer a:hover {
  text-decoration: underline; /* Menambahkan underline saat hover */
}

footer .fab {
  font-size: 1.25rem; /* Ukuran ikon sosial lebih besar */
}

/* Spasi antara footer dan konten di atasnya */
.mt-6 {
  margin-top: 100px !important;
}

/* Menambahkan jarak antar elemen pada layar kecil */
@media (max-width: 576px) {
  footer p,
  footer a {
    font-size: 0.75rem; /* Ukuran font lebih kecil pada mobile */
  }
}
</style>