// ============================================================
//  EDIT THIS FILE to change text, projects, links and CV.
//  Then run:  node build.mjs   (regenerates all pages)
// ============================================================

export const site = {
  name: 'Sampada Poudel',
  title: 'UI/UX Designer',
  // Set this to your live domain (no trailing slash) once you have it,
  // e.g. 'https://sampadapoudel.com'. It enables social-share images,
  // canonical links, sitemap.xml and robots.txt.
  siteUrl: '',
  email: 'sampadapoudel15@gmail.com',
  location: 'Ratnachowk, Pokhara, Kaski, Nepal',
  phone: '',                 // e.g. '+977-9846040200' (left empty so it is not shown publicly)
  linkedin: 'https://www.linkedin.com/in/sampada-poudel-a734762ab',
  instagram: 'https://www.instagram.com/sampada_poudel22',
  youtube: '',               // optional
  cv: '/assets/Sampada-Poudel-CV.pdf',
  description:
    'Sampada Poudel is a UI/UX designer in Pokhara, Nepal, designing mobile apps, websites and dashboards.',
  eyebrow: 'UI/UX Designer · Pokhara, Nepal',
  headline: 'Designing digital experiences that feel simple, intuitive, and meaningful.',
  // Optional: the part of the headline shown in a softer grey. Must match the end of `headline` exactly.
  headlineSoft: 'simple, intuitive, and meaningful.',
  // Your name inside the intro is shown in bold automatically.
  intro:
    'Hi, I’m Sampada Poudel, a UI/UX designer passionate about creating thoughtful digital experiences through user-centered design, intuitive interfaces, and attention to detail.',
  photo: '/assets/img/sampada.webp',
  photoAlt: 'Portrait of Sampada Poudel',
};

// Scrolling company strip under the hero ("Experience & collaborations").
// logo: file name inside assets/logos/ (e.g. 'black-tech.png'). If the file is missing, the company name
// is shown as plain text instead. invert: true turns a white/light logo dark so it shows on the light page.
export const companies = [
  { name: 'Everacy', url: 'https://www.everacy.com/', logo: 'everacy.png' },
  { name: 'Black Tech', url: 'https://www.blacktech.com.np/', logo: 'black-tech.png' },
  { name: 'XAV Technology', url: 'https://www.xavtechnology.com.np/', logo: 'xav-technology.png' },
  { name: 'Urja Tech', url: 'https://www.facebook.com/urjatechacademy/', logo: 'urja-tech.png' },
];

export const about = [
  'I’m a UI/UX designer and an undergraduate student of B.Sc. CSIT at Mount Annapurna Campus, affiliated to Tribhuvan University in Pokhara. I started with coding and data analysis, then moved into designing mobile apps and websites.',
  'I’ve worked as a UI/UX designer on site and remotely, and as an intern at Urja Lab. I’m also an executive member of Code for Change Pokhara.',
  'Away from the screen I make content for Instagram and YouTube, mostly video editing, and I follow dance.',
];

export const skills = [
  { group: 'Design', items: ['UI design', 'Mobile app design', 'Web and dashboard design', 'Design thinking', 'Prototyping', 'Research'] },
  { group: 'Tools', items: ['Figma', 'HTML', 'CSS'] },
  { group: 'Content', items: ['Content creation', 'Video editing'] },
  { group: 'Working style', items: ['Communication', 'Leadership'] },
];

// Newest first. Dates are exactly as written on the CV.
// ongoing: true shows an "Ongoing" tag instead of dates (for work without a fixed start/end).
export const experience = [
  { role: 'Content Creator', org: 'Freelance', type: '', ongoing: true },
  { role: 'UI/UX Designer', org: 'Everacy', type: 'Remote, contract', dates: 'Mar 2026 – May 2026' },
  { role: 'UI/UX Designer', org: 'Black Tech', type: 'Onsite, full time', dates: 'Aug 2025 – Oct' },
  { role: 'UI/UX Designer', org: 'XAV Technology', type: 'Onsite, full time', dates: 'Mar 2025 – Aug' },
  { role: 'Executive Member', org: 'Code for Change Pokhara', type: 'Volunteer', dates: 'Jan 2025 – Dec 2025' },
  { role: 'UI/UX Designer (Intern)', org: 'Urja Lab, Pokhara', type: '', dates: 'May 2024 – Aug 2024' },
  { role: 'Content Creator', org: 'Urja Tech, Pokhara', type: '', dates: 'May 2024 – Aug 2024' },
];

export const education = [
  { what: 'B.Sc. CSIT', where: 'Mount Annapurna Campus, Pokhara (Tribhuvan University)', dates: 'Nov 2023 – present' },
  { what: 'Grade 12', where: 'Gandaki Boarding School', dates: '2021 – 2023' },
];

// kind: 'mobile' = phone frames, 'web' = scrollable browser frames
// shots: [file in assets/img/<folder>/, caption, optional {web:true} for full-page scroll]
export const projects = [
  {
    slug: 'yummy-pos',
    folder: 'yummy-pos',
    title: 'Yummy POS',
    type: 'Mobile app · Restaurant management',
    platform: 'Mobile app (dark UI)',
    summary: 'A staff app for running a restaurant: taking orders by table, managing the menu, checking out bills and managing staff.',
    description: [
      'Yummy is an order and operations app for restaurant staff. This showcase covers the home screen with live order status, the order list, a table order, the dish picker, bill and payment checkout, menu management and the staff list.',
      'It uses a dark interface with a single orange accent, so status and primary actions stand out on a busy floor.',
    ],
    kind: 'mobile',
    shots: [
      ['home.webp', 'Home: today’s orders and quick insight'],
      ['orders.webp', 'Orders: active, KOT and history'],
      ['order.webp', 'Table order with ordered items'],
      ['dishes.webp', 'Dishes: browse and add to an order'],
      ['checkout.webp', 'Bill and payment checkout'],
      ['menu-management.webp', 'Menu management'],
      ['staff-list.webp', 'Staff management'],
    ],
  },
  {
    slug: 'tripmate',
    folder: 'tripmate',
    title: 'TripMate',
    type: 'Mobile app · Travel booking',
    platform: 'Mobile app',
    summary: 'A travel app for booking hotels and flights, with room selection, hotel details and a traveller form.',
    description: [
      'TripMate lets people search for hotels and flights from one home screen, with tabs for hotel, car, flight, taxi and activities.',
      'The designs cover splash and sign in, search, room selection, a hotel detail page with facilities and location, and the traveller details step before checkout.',
    ],
    kind: 'mobile',
    shots: [
      ['home-1.webp', 'Splash screen'],
      ['home.webp', 'Sign in'],
      ['iphone-13-14-20.webp', 'Hotel search and top destinations'],
      ['iphone-13-14-21.webp', 'Flight search'],
      ['iphone-13-14-19.webp', 'Room selection'],
      ['iphone-13-14-23.webp', 'Hotel detail and facilities'],
      ['iphone-13-14-26.webp', 'Traveller details'],
    ],
  },
  {
    slug: 'beauticaa',
    folder: 'beauticaa',
    title: 'Beauticaa',
    type: 'Mobile app · Beauty shopping',
    platform: 'Mobile app',
    summary: 'A beauty shopping app with brands, categories, product pages and order history.',
    description: [
      'Beauticaa is a shopping app for beauty and skin care products. The screens cover a splash screen, create account, a home page with brands and categories, a product listing with filters, a product page and the order history.',
      'A deep plum gradient and a light, airy layout keep the product photos in focus.',
    ],
    kind: 'mobile',
    shots: [
      ['iphone-13-14-5.webp', 'Splash screen'],
      ['iphone-13-14-18.webp', 'Create account'],
      ['home-page.webp', 'Home: brands and categories'],
      ['foundation.webp', 'Product listing with filters'],
      ['iphone-13-14-31.webp', 'Product detail'],
      ['profile-page.webp', 'My orders'],
    ],
  },
  {
    slug: 'fashion-icon',
    folder: 'fashion-icon',
    title: 'Fashion Icon',
    type: 'Website · Fashion e-commerce',
    platform: 'Website (desktop)',
    summary: 'A dark fashion store website with a collection home page, product page and cart.',
    description: [
      'Fashion Icon is an online fashion store designed for desktop. The pages cover the home page with collections, a product page with sizes, colours, features and ratings, and a cart with a bill summary.',
      'A black layout with a serif logo lets the fashion photography carry the page.',
    ],
    kind: 'web',
    shots: [
      ['desktop-5.webp', 'Home page (scroll to see the full page)', { tall: true }],
      ['desktop-4.webp', 'Product page', { tall: true }],
      ['desktop-7.webp', 'Cart and bill summary', { tall: true }],
    ],
  },
  {
    slug: 'drum-dashboard',
    folder: 'some-sample-design',
    title: 'Drum Dashboard',
    type: 'Web app · Admin dashboard',
    platform: 'Web dashboard',
    summary: 'An admin dashboard for sales and orders, with summary cards, charts and reports.',
    description: [
      'Drum is a dashboard for managing a store. The design shows today’s summary, a sales overview chart, an order summary, earning reports and a recent orders table, with a sidebar for customers, stores, orders, categories and reports.',
    ],
    kind: 'web',
    shots: [
      ['macbook-pro-16-10.webp', 'Dashboard on a 16-inch laptop'],
      ['body.webp', 'Full dashboard page (scroll to see all)', { tall: true }],
    ],
  },
  {
    slug: 'food-delivery-app',
    folder: 'food-delivery-app',
    title: 'Food Delivery App',
    type: 'Mobile app · Food ordering',
    platform: 'Mobile app',
    summary: 'A food ordering app with restaurant pages, cart, map view and live order tracking.',
    description: [
      'This food delivery app covers the home page with cuisines and offers, a restaurant page with delivery, pickup and table booking, a cart with coupon and delivery instructions, a map view of nearby restaurants and an order tracking page with progress steps.',
    ],
    kind: 'mobile',
    shots: [
      ['home-page.webp', 'Home: cuisines and offers'],
      ['frame-1984079406.webp', 'Restaurant page'],
      ['frame-1984079468.webp', 'Cart, coupon and delivery notes'],
      ['read.webp', 'Map and restaurant list'],
      ['tracking-page.webp', 'Order tracking'],
    ],
  },
  {
    slug: 'medical-reminder-app',
    folder: 'medical-reminder-app',
    title: 'Medical Reminder App',
    type: 'Mobile app · Health',
    platform: 'Mobile app',
    summary: 'A medication reminder app with a daily dose schedule, notifications and a profile.',
    description: [
      'A mobile app that helps people remember to take their medicine. The screens cover sign up and sign in, a daily schedule grouped by time, medication notifications including missed-dose alerts, and a profile with medical details and settings.',
      'Light blue and plenty of white space keep it calm and readable.',
    ],
    kind: 'mobile',
    shots: [
      ['sign-up-with-email.webp', 'Sign up'],
      ['sign-in-with-email.webp', 'Sign in'],
      ['home.webp', 'Daily medication schedule'],
      ['all.webp', 'Notifications'],
      ['profile.webp', 'Profile'],
    ],
  },
];
