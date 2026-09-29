const lesson = (id, title, subtitle, unit, icon, color, vocab, meaning, example, choice, options, words, answer, translation, fill, fillOptions, fillAnswer) => {
  // Listening questions appear from Unit 2 onward, after vocabulary foundation is built
  const listen = unit >= 2 && [2, 4, 7].includes(unit)
  const translate = unit >= 2 && [2, 5, 8].includes(unit)
  // Build 4 unique listening options: correct answer (meaning) first, then distractors
  const listenOpts = [meaning]
  if (choice !== meaning) listenOpts.push(choice)
  const distractorPool = ['Sampai jumpa', 'Di mana?', 'Selamat pagi', 'Terima kasih', 'Maaf', 'Ya', 'Tidak', 'Silakan']
  for (const d of distractorPool) {
    if (listenOpts.length >= 4) break
    if (!listenOpts.includes(d)) listenOpts.push(d)
  }
  while (listenOpts.length < 4) {
    const c = `Opsi ${listenOpts.length}`
    if (!listenOpts.includes(c)) listenOpts.push(c)
  }
  return { id, title, subtitle, unit, icon, color, questions: [
    { id: `${id}-vocab`, type: 'vocab', prompt: 'Kata baru', tagalog: vocab, meaning, note: `Contoh: ${example}`, word: vocab },
    listen
      ? { id: `${id}-listen`, type: 'listen', word: vocab, prompt: 'Dengarkan dan pilih artinya', tagalog: vocab, options: listenOpts, answer: meaning }
      : translate
        ? { id: `${id}-translation`, type: 'translation', word: vocab, prompt: 'Terjemahkan kalimat ini', tagalog: example, options: [translation, choice, 'Saya tidak tahu.', 'Selamat malam.'], answer: translation }
        : { id: `${id}-choice`, type: 'choice', word: vocab, prompt: 'Apa arti dari:', tagalog: vocab, options, answer: choice },
    { id: `${id}-words`, type: 'words', word: vocab, prompt: 'Susun kalimat ini', words, answer, translation },
    { id: `${id}-fill`, type: 'fill', word: vocab, prompt: 'Lengkapi kalimat', sentence: fill, options: fillOptions, answer: fillAnswer },
  ] }
}

const review = (id, unit, title, items) => ({
  id, title, subtitle: `Uji kembali materi Unit ${unit}`, unit, icon: '⭐', color: 'purple', review: true,
  questions: items.map((item, index) => ({ id: `${id}-${index}`, ...item })),
})

export const lessons = [
  // Unit 1 — Greetings & Introductions
  lesson('sapaan', 'Sapaan', 'Mulai ngobrol dengan percaya diri', 1, '👋', 'coral', 'Kumusta?', 'Apa kabar?', 'Kumusta ka, Ana?', 'Apa kabar?', ['Terima kasih', 'Apa kabar?', 'Selamat malam', 'Sampai jumpa'], ['Kumusta', 'ka'], ['Kumusta', 'ka'], 'Apa kabarmu?', '_____ ka?', ['Kumusta', 'Salamat', 'Paalam', 'Hindi'], 'Kumusta'),
  lesson('perkenalan', 'Perkenalan diri', 'Ceritakan sedikit tentangmu', 1, '🙋', 'sky', 'Ako si Ana.', 'Saya Ana.', 'Ako si Budi.', 'Saya Ana.', ['Saya Ana.', 'Kamu Ana.', 'Dia Ana.', 'Ini Ana.'], ['Ako', 'ay', 'estudyante'], ['Ako', 'ay', 'estudyante'], 'Saya adalah pelajar.', '_____ si Ana.', ['Ako', 'Ikaw', 'Siya', 'Kami'], 'Ako'),
  lesson('salam-pamitan', 'Salam dan pamitan', 'Sapa dan ucapkan sampai jumpa', 1, '💬', 'mint', 'Magandang umaga', 'Selamat pagi', 'Magandang umaga, kaibigan.', 'Selamat pagi', ['Selamat pagi', 'Selamat malam', 'Terima kasih', 'Sampai jumpa'], ['Magandang', 'umaga'], ['Magandang', 'umaga'], 'Selamat pagi.', '_____! Ingat ka.', ['Paalam', 'Salamat', 'Kumusta', 'Oo'], 'Paalam'),
  review('review-1', 1, 'Review Unit 1', [
    { type: 'choice', prompt: 'Apa arti “Salamat”?', options: ['Maaf', 'Terima kasih', 'Selamat pagi', 'Tidak'], answer: 'Terima kasih' },
    { type: 'choice', prompt: 'Apa arti “Paalam”?', options: ['Sampai jumpa', 'Apa kabar?', 'Tolong', 'Ya'], answer: 'Sampai jumpa' },
    { type: 'words', prompt: 'Susun kalimat ini', words: ['Ako', 'si', 'Mira'], answer: ['Ako', 'si', 'Mira'], translation: 'Saya Mira.' },
  ]),

  // Unit 2 — Numbers & Basic Questions
  lesson('angka', 'Angka 1–10', 'Hitung dari isa sampai sampu', 2, '🔢', 'yellow', 'Isa, dalawa, tatlo', 'Satu, dua, tiga', 'May tatlong libro ako.', 'Dua', ['Satu', 'Dua', 'Tiga', 'Empat'], ['Isa', 'at', 'dalawa'], ['Isa', 'at', 'dalawa'], 'Satu dan dua.', 'May _____ ka.', ['isa', 'dalawa', 'pito', 'sampu'], 'dalawa'),
  lesson('pertanyaan-dasar', 'Pertanyaan dasar', 'Tanyakan siapa, apa, dan di mana', 2, '❓', 'sky', 'Sino?', 'Siapa?', 'Sino siya?', 'Siapa?', ['Siapa?', 'Apa?', 'Di mana?', 'Kapan?'], ['Sino', 'si', 'Lina'], ['Sino', 'si', 'Lina'], 'Siapa Lina?', '_____ ito?', ['Ano', 'Sino', 'Saan', 'Kumusta'], 'Ano'),
  lesson('jawaban-dasar', 'Jawaban dasar', 'Jawab pertanyaan dengan jelas', 2, '✅', 'mint', 'Oo / Hindi', 'Ya / Tidak', 'Oo, gusto ko.', 'Tidak', ['Ya', 'Tidak', 'Mungkin', 'Terima kasih'], ['Hindi', 'ako', 'gutom'], ['Hindi', 'ako', 'gutom'], 'Saya tidak lapar.', '_____ ako gutom.', ['Hindi', 'Oo', 'Sige', 'Paalam'], 'Hindi'),
  review('review-2', 2, 'Review Unit 2', [
    { type: 'choice', prompt: 'Apa arti “sampu”?', options: ['Lima', 'Tujuh', 'Sepuluh', 'Seratus'], answer: 'Sepuluh' },
    { type: 'choice', prompt: 'Bagaimana mengatakan “di mana”?', options: ['Sino?', 'Ano?', 'Saan?', 'Bakit?'], answer: 'Saan?' },
    { type: 'words', prompt: 'Susun kalimat ini', words: ['Saan', 'ka'], answer: ['Saan', 'ka'], translation: 'Di mana kamu?' },
  ]),

  // Unit 3 — Family
  lesson('keluarga', 'Keluarga inti', 'Kenalkan orang-orang terdekat', 3, '🏠', 'coral', 'Pamilya', 'Keluarga', 'Malaki ang pamilya ko.', 'Keluarga', ['Teman', 'Keluarga', 'Tetangga', 'Guru'], ['Ang', 'pamilya', 'ko'], ['Ang', 'pamilya', 'ko'], 'Keluargaku.', 'Ito ang _____ ko.', ['pamilya', 'kaibigan', 'bahay', 'guro'], 'pamilya'),
  lesson('anggota-keluarga', 'Anggota keluarga', 'Sebutkan orang di rumah', 3, '👪', 'sky', 'Nanay at Tatay', 'Ibu dan Ayah', 'Mahal ko si Nanay.', 'Ibu dan Ayah', ['Ibu dan Ayah', 'Kakak dan adik', 'Teman-teman', 'Guru'], ['Si', 'Nanay', 'ko'], ['Si', 'Nanay', 'ko'], 'Ibuku.', 'Si _____ ko.', ['Nanay', 'Bahay', 'Pamilya', 'Bata'], 'Nanay'),
  lesson('keluarga-besar', 'Keluarga besar', 'Bicarakan kerabat dan teman', 3, '🤝', 'yellow', 'Kaibigan', 'Teman', 'Siya ang kaibigan ko.', 'Teman', ['Keluarga', 'Teman', 'Anak', 'Nenek'], ['Siya', 'ang', 'kaibigan', 'ko'], ['Siya', 'ang', 'kaibigan', 'ko'], 'Dia temanku.', 'Siya ang _____ ko.', ['kaibigan', 'nanay', 'kuya', 'lola'], 'kaibigan'),
  review('review-3', 3, 'Review Unit 3', [
    { type: 'choice', prompt: 'Apa arti “Tatay”?', options: ['Ibu', 'Ayah', 'Kakak', 'Anak'], answer: 'Ayah' },
    { type: 'choice', prompt: 'Apa arti “Lola”?', options: ['Nenek', 'Kakek', 'Teman', 'Bayi'], answer: 'Nenek' },
    { type: 'words', prompt: 'Susun kalimat ini', words: ['Mahal', 'ko', 'ang', 'pamilya'], answer: ['Mahal', 'ko', 'ang', 'pamilya'], translation: 'Saya mencintai keluarga.' },
  ]),

  // Unit 4 — Food & Drinks
  lesson('makanan', 'Makanan', 'Pesan makanan dengan lancar', 4, '🍜', 'sky', 'Masarap!', 'Enak!', 'Masarap ang pagkain.', 'Enak!', ['Enak!', 'Panas!', 'Dingin!', 'Besar!'], ['Masarap', 'ang', 'kanin'], ['Masarap', 'ang', 'kanin'], 'Nasinya enak.', 'Gusto ko ng _____.', ['kanin', 'tubig', 'kape', 'bahay'], 'kanin'),
  lesson('minuman', 'Makanan dan minuman', 'Pesan air, kopi, dan lainnya', 4, '🥤', 'mint', 'Tubig', 'Air', 'Gusto ko ng tubig.', 'Air', ['Nasi', 'Air', 'Kopi', 'Roti'], ['Gusto', 'ko', 'ng', 'tubig'], ['Gusto', 'ko', 'ng', 'tubig'], 'Saya ingin air.', 'Uhaw ako, gusto ko ng _____.', ['tubig', 'kanin', 'tinapay', 'sopas'], 'tubig'),
  lesson('di-restoran', 'Di restoran', 'Gunakan kalimat saat memesan', 4, '🍽️', 'yellow', 'Pakiusap', 'Tolong / silakan', 'Pakiusap, isang kape.', 'Tolong / silakan', ['Tolong / silakan', 'Terima kasih', 'Permisi', 'Sampai jumpa'], ['Isang', 'kape', 'pakiusap'], ['Isang', 'kape', 'pakiusap'], 'Satu kopi, tolong.', '_____ ng tubig.', ['Gusto', 'Paalam', 'Sino', 'Dito'], 'Gusto'),
  review('review-4', 4, 'Review Unit 4', [
    { type: 'choice', prompt: 'Apa arti “gutom”?', options: ['Kenyang', 'Lapar', 'Haus', 'Enak'], answer: 'Lapar' },
    { type: 'choice', prompt: 'Apa arti “Kape”?', options: ['Teh', 'Air', 'Kopi', 'Susu'], answer: 'Kopi' },
    { type: 'words', prompt: 'Susun kalimat ini', words: ['Gusto', 'ko', 'ng', 'tubig'], answer: ['Gusto', 'ko', 'ng', 'tubig'], translation: 'Saya ingin air.' },
  ]),

  // Unit 5 — Daily Activities
  lesson('rutinitas-pagi', 'Rutinitas pagi', 'Ceritakan awal harimu', 5, '🌅', 'yellow', 'Gumigising ako.', 'Saya bangun.', 'Gumigising ako sa umaga.', 'Saya bangun.', ['Saya bangun.', 'Saya tidur.', 'Saya makan.', 'Saya pergi.'], ['Gumigising', 'ako', 'sa', 'umaga'], ['Gumigising', 'ako', 'sa', 'umaga'], 'Saya bangun di pagi hari.', '_____ ako ng almusal.', ['Kumakain', 'Natutulog', 'Pumupunta', 'Nagsasalita'], 'Kumakain'),
  lesson('aktivitas', 'Aktivitas sehari-hari', 'Bicarakan kegiatanmu', 5, '☀️', 'mint', 'Kumakain ako.', 'Saya sedang makan.', 'Kumakain ako ng kanin.', 'Saya sedang makan.', ['Saya sedang makan.', 'Saya sedang tidur.', 'Saya sedang membaca.', 'Saya sedang bekerja.'], ['Nag-aaral', 'ako', 'ng', 'Tagalog'], ['Nag-aaral', 'ako', 'ng', 'Tagalog'], 'Saya belajar Tagalog.', '_____ ako ng libro.', ['Nagbabasa', 'Kumakain', 'Natutulog', 'Tumatakbo'], 'Nagbabasa'),
  lesson('waktu-istirahat', 'Waktu dan istirahat', 'Bicarakan waktu tidur dan pulang', 5, '🌙', 'sky', 'Natutulog ako.', 'Saya sedang tidur.', 'Natutulog ako sa gabi.', 'Saya sedang tidur.', ['Saya sedang tidur.', 'Saya sedang bangun.', 'Saya sedang makan.', 'Saya sedang mandi.'], ['Natutulog', 'ako', 'sa', 'gabi'], ['Natutulog', 'ako', 'sa', 'gabi'], 'Saya tidur di malam hari.', 'Umuwi ako _____.', ['ngayon', 'bukas', 'kahapon', 'sino'], 'ngayon'),
  review('review-5', 5, 'Review Unit 5', [
    { type: 'choice', prompt: 'Apa arti “Nag-aaral ako”?', options: ['Saya makan', 'Saya belajar', 'Saya tidur', 'Saya pergi'], answer: 'Saya belajar' },
    { type: 'choice', prompt: 'Apa arti “gabi”?', options: ['Pagi', 'Siang', 'Malam', 'Besok'], answer: 'Malam' },
    { type: 'words', prompt: 'Susun kalimat ini', words: ['Nagtatrabaho', 'ako', 'ngayon'], answer: ['Nagtatrabaho', 'ako', 'ngayon'], translation: 'Saya bekerja hari ini.' },
  ]),

  // Unit 6 — Places & Directions
  lesson('tempat', 'Tempat penting', 'Kenali tempat di sekitarmu', 6, '📍', 'coral', 'Paaralan', 'Sekolah', 'Malapit ang paaralan.', 'Sekolah', ['Sekolah', 'Toko', 'Rumah', 'Restoran'], ['Malapit', 'ang', 'paaralan'], ['Malapit', 'ang', 'paaralan'], 'Sekolahnya dekat.', 'Nasa _____ ako.', ['paaralan', 'bahay', 'daan', 'kaliwa'], 'paaralan'),
  lesson('arah', 'Arah', 'Tanyakan dan beri petunjuk arah', 6, '🧭', 'sky', 'Kaliwa / kanan', 'Kiri / kanan', 'Kumanan ka sa kanan.', 'Kiri / kanan', ['Kiri / kanan', 'Atas / bawah', 'Depan / belakang', 'Dekat / jauh'], ['Kumanan', 'ka', 'dito'], ['Kumanan', 'ka', 'dito'], 'Belok kanan di sini.', 'Lumiko sa _____.', ['kaliwa', 'tubig', 'bahay', 'gabi'], 'kaliwa'),
  lesson('lokasi', 'Lokasi dan jarak', 'Jelaskan letak suatu tempat', 6, '🗺️', 'mint', 'Dito / doon', 'Di sini / di sana', 'Nandito ang tindahan.', 'Di sini / di sana', ['Di sini / di sana', 'Kapan / sekarang', 'Siapa / apa', 'Ya / tidak'], ['Nasa', 'doon', 'ang', 'restawran'], ['Nasa', 'doon', 'ang', 'restawran'], 'Restoran ada di sana.', '_____ ang banyo.', ['Dito', 'Sino', 'Bakit', 'Oo'], 'Dito'),
  review('review-6', 6, 'Review Unit 6', [
    { type: 'choice', prompt: 'Apa arti “Daan”?', options: ['Jalan', 'Kota', 'Taman', 'Sekolah'], answer: 'Jalan' },
    { type: 'choice', prompt: 'Apa arti “malapit”?', options: ['Jauh', 'Dekat', 'Kanan', 'Kiri'], answer: 'Dekat' },
    { type: 'words', prompt: 'Susun kalimat ini', words: ['Nasaan', 'ang', 'paaralan'], answer: ['Nasaan', 'ang', 'paaralan'], translation: 'Di mana sekolahnya?' },
  ]),

  // Unit 7 — Adjectives & Descriptions
  lesson('sifat-dasar', 'Sifat dasar', 'Deskripsikan benda dan orang', 7, '🎨', 'yellow', 'Maganda', 'Indah / bagus', 'Maganda ang bahay.', 'Indah / bagus', ['Indah / bagus', 'Besar', 'Kecil', 'Lapar'], ['Maganda', 'ang', 'araw'], ['Maganda', 'ang', 'araw'], 'Hari ini indah.', '_____ ang bata.', ['Masaya', 'Dito', 'Saan', 'Tubig'], 'Masaya'),
  lesson('ukuran-perasaan', 'Ukuran dan perasaan', 'Buat deskripsi yang lebih lengkap', 7, '😊', 'coral', 'Malaki / maliit', 'Besar / kecil', 'Malaki ang bahay nila.', 'Besar / kecil', ['Besar / kecil', 'Baik / buruk', 'Cepat / lambat', 'Panas / dingin'], ['Maliit', 'ang', 'kuwarto'], ['Maliit', 'ang', 'kuwarto'], 'Kamarnya kecil.', '_____ ang aso.', ['Malaki', 'Sino', 'Paalam', 'Bakit'], 'Malaki'),
  lesson('pendapat', 'Pendapat sederhana', 'Ungkapkan kesukaan dan keadaan', 7, '💡', 'sky', 'Mabuti', 'Baik', 'Mabuti ang kalagayan ko.', 'Baik', ['Baik', 'Buruk', 'Sedih', 'Kenyang'], ['Mabuti', 'ang', 'araw'], ['Mabuti', 'ang', 'araw'], 'Harininya baik.', '_____ ako ngayon.', ['Masaya', 'Pamilya', 'Doon', 'Kanan'], 'Masaya'),
  review('review-7', 7, 'Review Unit 7', [
    { type: 'choice', prompt: 'Apa arti “masaya”?', options: ['Sedih', 'Senang', 'Lapar', 'Kecil'], answer: 'Senang' },
    { type: 'choice', prompt: 'Apa arti “malaki”?', options: ['Kecil', 'Besar', 'Baik', 'Jauh'], answer: 'Besar' },
    { type: 'words', prompt: 'Susun kalimat ini', words: ['Mabuti', 'ang', 'buhay'], answer: ['Mabuti', 'ang', 'buhay'], translation: 'Hidup itu baik.' },
  ]),

  // Unit 8 — Basic Grammar
  lesson('ako-ay', 'Pola Ako ay', 'Buat kalimat identitas sederhana', 8, '🧩', 'coral', 'Ako ay estudyante.', 'Saya adalah pelajar.', 'Ako ay Pilipino.', 'Saya adalah pelajar.', ['Saya adalah pelajar.', 'Kamu adalah pelajar.', 'Dia adalah pelajar.', 'Saya sedang makan.'], ['Ako', 'ay', 'masaya'], ['Ako', 'ay', 'masaya'], 'Saya senang.', 'Ako _____ estudyante.', ['ay', 'ng', 'sa', 'ang'], 'ay'),
  lesson('gusto-ko', 'Pola Gusto ko', 'Katakan apa yang kamu inginkan', 8, '💭', 'mint', 'Gusto ko ng tubig.', 'Saya ingin air.', 'Gusto ko ng kape.', 'Saya ingin air.', ['Saya ingin air.', 'Saya minum air.', 'Saya punya air.', 'Airnya enak.'], ['Gusto', 'ko', 'ng', 'kanin'], ['Gusto', 'ko', 'ng', 'kanin'], 'Saya ingin nasi.', '_____ ko ng pagkain.', ['Gusto', 'Sino', 'Hindi', 'Doon'], 'Gusto'),
  lesson('partikel-dasar', 'Kata penghubung dasar', 'Gunakan ang, ng, dan sa', 8, '🔗', 'sky', 'Ang bahay ko', 'Rumah saya', 'Malaki ang bahay ko.', 'Rumah saya', ['Rumah saya', 'Keluarga saya', 'Teman saya', 'Sekolah saya'], ['Malaki', 'ang', 'bahay', 'ko'], ['Malaki', 'ang', 'bahay', 'ko'], 'Rumah saya besar.', 'Pumunta ako _____ bahay.', ['sa', 'ang', 'ng', 'ay'], 'sa'),
  review('review-8', 8, 'Review Unit 8', [
    { type: 'choice', prompt: 'Pilih arti “Gusto ko ng kape.”', options: ['Saya ingin kopi.', 'Saya membuat kopi.', 'Kopi saya dingin.', 'Saya tidak suka kopi.'], answer: 'Saya ingin kopi.' },
    { type: 'choice', prompt: 'Lengkapi: Ako ___ masaya.', options: ['ng', 'ay', 'sa', 'ang'], answer: 'ay' },
    { type: 'words', prompt: 'Susun kalimat ini', words: ['Ang', 'bahay', 'ko', 'ay', 'malaki'], answer: ['Ang', 'bahay', 'ko', 'ay', 'malaki'], translation: 'Rumah saya besar.' },
  ]),

  // Unit 9 — Past/Future & Useful Expressions
  lesson('waktu', 'Kemarin, hari ini, besok', 'Bicarakan waktu dan rencana', 9, '📅', 'yellow', 'Ngayon / bukas', 'Hari ini / besok', 'Bukas ako pupunta.', 'Hari ini / besok', ['Hari ini / besok', 'Kemarin / malam', 'Pagi / siang', 'Minggu / bulan'], ['Pupunta', 'ako', 'bukas'], ['Pupunta', 'ako', 'bukas'], 'Saya akan pergi besok.', '_____ ako pumunta.', ['Bukas', 'Kahapon', 'Dito', 'Sino'], 'Bukas'),
  lesson('masa-lalu', 'Masa lalu sederhana', 'Ceritakan sesuatu yang sudah terjadi', 9, '⏮️', 'sky', 'Kahapon', 'Kemarin', 'Kumain ako kahapon.', 'Kemarin', ['Kemarin', 'Besok', 'Sekarang', 'Nanti'], ['Kumain', 'ako', 'kahapon'], ['Kumain', 'ako', 'kahapon'], 'Saya makan kemarin.', '_____ ako nag-aral.', ['Kahapon', 'Bukas', 'Ngayon', 'Doon'], 'Kahapon'),
  lesson('ungkapan', 'Ungkapan berguna', 'Hadapi percakapan sehari-hari', 9, '✨', 'mint', 'Ingat ka!', 'Hati-hati!', 'Ingat ka sa daan!', 'Hati-hati!', ['Hati-hati!', 'Sampai jumpa!', 'Selamat pagi!', 'Tolong!'], ['Ingat', 'ka', 'lagi'], ['Ingat', 'ka', 'lagi'], 'Hati-hati selalu.', '_____! Salamat.', ['Sige', 'Kumusta', 'Bahay', 'Saan'], 'Sige'),
  review('review-9', 9, 'Review Unit 9', [
    { type: 'choice', prompt: 'Apa arti “bukas”?', options: ['Kemarin', 'Hari ini', 'Besok', 'Malam'], answer: 'Besok' },
    { type: 'choice', prompt: 'Apa arti “Ingat ka”?', options: ['Hati-hati', 'Saya lapar', 'Di mana kamu?', 'Saya senang'], answer: 'Hati-hati' },
    { type: 'words', prompt: 'Susun kalimat ini', words: ['Pupunta', 'ako', 'bukas'], answer: ['Pupunta', 'ako', 'bukas'], translation: 'Saya akan pergi besok.' },
  ]),

  // Unit 10 — Review / Final Challenge
  lesson('percakapan-final', 'Percakapan final', 'Gabungkan semua yang sudah dipelajari', 10, '🏆', 'coral', 'Kumusta, kaibigan!', 'Apa kabar, teman!', 'Kumusta, kaibigan! Kumain ka na?', 'Apa kabar, teman!', ['Apa kabar, teman!', 'Selamat malam, keluarga!', 'Saya ingin rumah!', 'Di mana sekolah?'], ['Kumusta', 'ka', 'ibigan'], ['Kumusta', 'ka', 'ibigan'], 'Apa kabar, teman?', '_____ ka ba?', ['Masaya', 'Kumusta', 'Bukas', 'Pamilya'], 'Kumusta'),
  lesson('tantangan-final', 'Tantangan akhir', 'Uji pemahamanmu dalam situasi nyata', 10, '🚀', 'purple', 'Paano pumunta sa palengke?', 'Bagaimana pergi ke pasar?', 'Paano pumunta sa palengke?', 'Bagaimana pergi ke pasar?', ['Bagaimana pergi ke pasar?', 'Apa makananmu?', 'Siapa keluargamu?', 'Saya pergi kemarin.'], ['Pumunta', 'tayo', 'sa', 'palengke'], ['Pumunta', 'tayo', 'sa', 'palengke'], 'Mari pergi ke pasar.', '_____ tayo!', ['Sige', 'Hindi', 'Kahapon', 'Sino'], 'Sige'),
  review('review-final', 10, 'Final Challenge', [
    { type: 'choice', prompt: 'Apa arti “Paano pumunta sa palengke?”', options: ['Bagaimana pergi ke pasar?', 'Apa kabar?', 'Saya ingin makanan.', 'Di mana rumahmu?'], answer: 'Bagaimana pergi ke pasar?' },
    { type: 'choice', prompt: 'Pilih terjemahan yang tepat: “Gusto ko ng tubig.”', options: ['Saya ingin air.', 'Saya minum air.', 'Airnya di sana.', 'Saya tidak haus.'], answer: 'Saya ingin air.' },
    { type: 'words', prompt: 'Susun kalimat ini', words: ['Masaya', 'ako', 'ngayon'], answer: ['Masaya', 'ako', 'ngayon'], translation: 'Saya senang hari ini.' },
  ]),
]

export const units = [
  { id: 1, title: 'SAPAAN & PERKENALAN', sub: 'Mulai percakapan dengan percaya diri' },
  { id: 2, title: 'ANGKA & PERTANYAAN DASAR', sub: 'Hitung dan tanyakan hal penting' },
  { id: 3, title: 'KELUARGA', sub: 'Kenalkan orang-orang terdekat' },
  { id: 4, title: 'MAKANAN & MINUMAN', sub: 'Pesan makanan dan minuman' },
  { id: 5, title: 'AKTIVITAS SEHARI-HARI', sub: 'Ceritakan rutinitasmu' },
  { id: 6, title: 'TEMPAT & ARAH', sub: 'Jelajahi lingkungan sekitar' },
  { id: 7, title: 'SIFAT & DESKRIPSI', sub: 'Gambarkan dunia di sekitarmu' },
  { id: 8, title: 'GRAMMAR DASAR', sub: 'Rangkai kalimat dengan pola penting' },
  { id: 9, title: 'WAKTU & UNGKAPAN', sub: 'Bicarakan masa lalu dan rencana' },
  { id: 10, title: 'REVIEW & TANTANGAN AKHIR', sub: 'Tunjukkan semua kemampuanmu' },
]
