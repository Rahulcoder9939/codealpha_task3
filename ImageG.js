const images = [
	{src: 'images/nature-1.jpg', caption:'Nature photo 1', category: 'nature'},
	{src: 'images/nature-2.jpg', caption:'Nature photo 2', category: 'nature'},
	{src: 'images/nature-3.jpg', caption:'Nature photo 3', category: 'nature'},
	{src: 'images/nature-4.jpg', caption:'Nature photo 4', category: 'nature'},
	{src: 'images/nature-5.jpg', caption:'Nature photo 5', category: 'nature'},
	{src: 'images/nature-6.jpg', caption:'Nature photo 6', category: 'nature'},
	{src: 'images/nature-7.jpg', caption:'Nature photo 7', category: 'nature'},
	{src: 'images/landscape-1.jpg', caption:'Landscape photo 1', category: 'landscape'},
	{src: 'images/landscape-2.jpg', caption:'Landscape photo 2', category: 'landscape'},
	{src: 'images/landscape-3.jpg', caption:'Landscape photo 3', category: 'landscape'},
	{src: 'images/landscape-4.jpg', caption:'Landscape photo 4', category: 'landscape'},
	{src: 'images/landscape-5.jpg', caption:'Landscape photo 5', category: 'landscape'},
	{src: 'images/landscape-6.jpg', caption:'Landscape photo 6', category: 'landscape'},
	{src: 'images/landscape-7.jpg', caption:'Landscape photo 7', category: 'landscape'},
	{src: 'images/urban-1.jpg', caption:'Urban photo 1', category: 'urban'},
	{src: 'images/urban-2.jpg', caption:'Urban photo 2', category: 'urban'},
	{src: 'images/urban-3.jpg', caption:'Urban photo 3', category: 'urban'},
	{src: 'images/urban-4.jpg', caption:'Urban photo 4', category: 'urban'},
	{src: 'images/urban-5.jpg', caption:'Urban photo 5', category: 'urban'},
	{src: 'images/urban-6.jpg', caption:'Urban photo 6', category: 'urban'}
];

const categories = ['all', 'nature', 'landscape', 'urban'];
let activeFilter = 'all';

const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lightboxImage');
const caption = document.getElementById('caption');
const lbPrev = document.getElementById('lbPrev');
const lbNext = document.getElementById('lbNext');
const lbClose = document.getElementById('lbClose');
const lbBackdrop = document.getElementById('lbBackdrop');
const themeToggle = document.getElementById('themeToggle');
const searchInput = document.getElementById('searchInput');

let currentIndex = 0;
let searchTerm = '';

function setTheme(theme) {
	document.documentElement.setAttribute('data-theme', theme);
	localStorage.setItem('gallery-theme', theme);
	if (themeToggle) {
		const nextTheme = theme === 'dark' ? 'light' : 'dark';
		themeToggle.setAttribute('aria-checked', String(theme === 'dark'));
		themeToggle.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
	}
}

function setupTheme() {
	const savedTheme = localStorage.getItem('gallery-theme');
	const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
	setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
	if (themeToggle) {
		themeToggle.addEventListener('click', () => {
			const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
			setTheme(currentTheme === 'dark' ? 'light' : 'dark');
		});
	}
}

function getFilteredImages() {
	return images.filter(img => {
		const matchesCategory = activeFilter === 'all' || img.category === activeFilter;
		const searchableText = `${img.caption} ${img.category}`.toLowerCase();
		const matchesSearch = !searchTerm || searchableText.includes(searchTerm);
		return matchesCategory && matchesSearch;
	});
}

function buildGallery() {
	gallery.innerHTML = '';
	const filtered = getFilteredImages();
	filtered.forEach((img, i) => {
		const originalIndex = images.indexOf(img);
		const btn = document.createElement('button');
		btn.className = 'thumb';
		btn.setAttribute('aria-label', img.caption || `Image ${i+1}`);
		// For remote images we appended sizing params; for local files use the path as-is
		const thumbSrc = img.src.startsWith('http') ? `${img.src}&w=600&h=400&fit=crop` : img.src;
		btn.innerHTML = `<img src="${thumbSrc}" alt="${img.caption || ''}">`;
		btn.addEventListener('click', () => openLightbox(originalIndex));
		gallery.appendChild(btn);
	});
}

function filterGallery(category) {
	activeFilter = category;
	buildGallery();
}

function openLightbox(index) {
	currentIndex = index;
	const item = images[index];
	// For remote images add format/quality params; for local files use raw path
	lbImage.src = item.src.startsWith('http') ? `${item.src}&w=1600&q=80&auto=format&fit=crop` : item.src;
	lbImage.alt = item.caption || '';
	caption.textContent = item.caption || '';
	lightbox.classList.remove('hidden');
	lightbox.setAttribute('aria-hidden','false');
	document.body.style.overflow = 'hidden';
}

function closeLightbox() {
	lightbox.classList.add('hidden');
	lightbox.setAttribute('aria-hidden','true');
	lbImage.src = '';
	document.body.style.overflow = '';
}

function showPrev(){
	currentIndex = (currentIndex - 1 + images.length) % images.length;
	openLightbox(currentIndex);
}
function showNext(){
	currentIndex = (currentIndex + 1) % images.length;
	openLightbox(currentIndex);
}

// Events
lbPrev.addEventListener('click', showPrev);
lbNext.addEventListener('click', showNext);
lbClose.addEventListener('click', closeLightbox);
lbBackdrop.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => {
	if (lightbox.classList.contains('hidden')) return;
	if (e.key === 'Escape') closeLightbox();
	if (e.key === 'ArrowLeft') showPrev();
	if (e.key === 'ArrowRight') showNext();
});

// Setup filter buttons
function setupFilters() {
	const filterContainer = document.getElementById('filters');
	if (!filterContainer) return;
	categories.forEach(cat => {
		const btn = document.createElement('button');
		btn.className = 'filter-btn' + (cat === 'all' ? ' active' : '');
		btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
		btn.addEventListener('click', () => {
			document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
			btn.classList.add('active');
			filterGallery(cat);
		});
		filterContainer.appendChild(btn);
	});
}

function setupSearch() {
	if (!searchInput) return;
	searchInput.addEventListener('input', () => {
		searchTerm = searchInput.value.trim().toLowerCase();
		buildGallery();
	});
}

setupTheme();
setupFilters();
setupSearch();
buildGallery();

