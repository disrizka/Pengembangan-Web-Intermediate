export async function getAddress(lat, lon) {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
      const data = await res.json();
      console.log(data);
      return data.display_name || "Alamat tidak ditemukan";
    } catch (error) {
      return "Alamat tidak ditemukan";
    }
  }