--
-- PostgreSQL database dump
--

\restrict QLqeNlHLVWyloFIYpwH70d9ykmEz8thDzrjctlXvbJxlTsAL7qqiiIMvDUU4q7P

-- Dumped from database version 16.10
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- Name: amenities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.amenities (
    id integer NOT NULL,
    name text NOT NULL,
    icon text NOT NULL,
    description text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: amenities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.amenities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: amenities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.amenities_id_seq OWNED BY public.amenities.id;


--
-- Name: attractions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attractions (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    distance text NOT NULL,
    travel_time text NOT NULL,
    image_url text,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: attractions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.attractions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: attractions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.attractions_id_seq OWNED BY public.attractions.id;


--
-- Name: bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    guest_name text NOT NULL,
    guest_email text NOT NULL,
    guest_phone text NOT NULL,
    check_in text NOT NULL,
    check_out text NOT NULL,
    guests integer NOT NULL,
    room_id integer,
    room_type text NOT NULL,
    special_requests text,
    status text DEFAULT 'pending'::text NOT NULL,
    total_amount real DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    adults integer DEFAULT 1 NOT NULL,
    children integer DEFAULT 0 NOT NULL,
    coupon_code text,
    discount_amount real DEFAULT 0 NOT NULL
);


--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: coupons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coupons (
    id integer NOT NULL,
    code text NOT NULL,
    discount_type text DEFAULT 'percentage'::text NOT NULL,
    discount_value real NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    max_uses integer,
    used_count integer DEFAULT 0 NOT NULL,
    expires_at text,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: coupons_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coupons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: coupons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.coupons_id_seq OWNED BY public.coupons.id;


--
-- Name: floors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.floors (
    id integer NOT NULL,
    name text NOT NULL,
    floor_number integer NOT NULL,
    description text NOT NULL,
    image_url text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    gallery_images text[] DEFAULT '{}'::text[] NOT NULL,
    is_available boolean DEFAULT true NOT NULL,
    has_kitchen boolean DEFAULT true NOT NULL
);


--
-- Name: floors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.floors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: floors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.floors_id_seq OWNED BY public.floors.id;


--
-- Name: gallery; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.gallery (
    id integer NOT NULL,
    image_url text NOT NULL,
    category text NOT NULL,
    title text NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: gallery_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.gallery_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: gallery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.gallery_id_seq OWNED BY public.gallery.id;


--
-- Name: images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.images (
    id integer NOT NULL,
    data bytea NOT NULL,
    mime_type text DEFAULT 'image/jpeg'::text NOT NULL,
    filename text,
    size integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.images_id_seq OWNED BY public.images.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    guest_name text NOT NULL,
    guest_location text,
    guest_photo text,
    rating integer NOT NULL,
    review_text text NOT NULL,
    is_approved boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: rooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rooms (
    id integer NOT NULL,
    name text NOT NULL,
    floor_id integer NOT NULL,
    room_type text NOT NULL,
    feature_image_url text,
    gallery_images text[] DEFAULT '{}'::text[] NOT NULL,
    price_per_night real NOT NULL,
    capacity integer NOT NULL,
    amenities text[] DEFAULT '{}'::text[] NOT NULL,
    description text NOT NULL,
    is_available boolean DEFAULT true NOT NULL,
    is_published boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    adult_capacity integer DEFAULT 2 NOT NULL,
    child_capacity integer DEFAULT 0 NOT NULL
);


--
-- Name: rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rooms_id_seq OWNED BY public.rooms.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.settings (
    id integer NOT NULL,
    property_name text DEFAULT 'The Bialto by Asemont Estate'::text NOT NULL,
    tagline text DEFAULT 'Experience Luxury in the Hills of Kasauli'::text NOT NULL,
    address text DEFAULT 'Dochi Road, Kasauli, Himachal Pradesh, India'::text NOT NULL,
    phone text DEFAULT '+91 77176 02625'::text NOT NULL,
    email text DEFAULT 'TheBialto@gmail.com'::text NOT NULL,
    whatsapp text DEFAULT '+91 77176 02625'::text NOT NULL,
    logo_url text,
    hero_images text[] DEFAULT '{}'::text[] NOT NULL,
    facebook text,
    instagram text,
    twitter text,
    google_maps_embed text,
    meta_title text,
    meta_description text,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    primary_color text,
    secondary_color text,
    accent_color text,
    dark_mode boolean DEFAULT true NOT NULL,
    hero_tagline text,
    hero_title text,
    hero_description text,
    hero_cta_text text,
    about_label text,
    about_title text,
    about_description text,
    about_image text,
    about_cta_text text,
    floors_section_label text,
    floors_section_title text,
    footer_tagline text
);


--
-- Name: settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.settings_id_seq OWNED BY public.settings.id;


--
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- Name: amenities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.amenities ALTER COLUMN id SET DEFAULT nextval('public.amenities_id_seq'::regclass);


--
-- Name: attractions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attractions ALTER COLUMN id SET DEFAULT nextval('public.attractions_id_seq'::regclass);


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: coupons id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupons ALTER COLUMN id SET DEFAULT nextval('public.coupons_id_seq'::regclass);


--
-- Name: floors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.floors ALTER COLUMN id SET DEFAULT nextval('public.floors_id_seq'::regclass);


--
-- Name: gallery id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery ALTER COLUMN id SET DEFAULT nextval('public.gallery_id_seq'::regclass);


--
-- Name: images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images ALTER COLUMN id SET DEFAULT nextval('public.images_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: rooms id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms ALTER COLUMN id SET DEFAULT nextval('public.rooms_id_seq'::regclass);


--
-- Name: settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings ALTER COLUMN id SET DEFAULT nextval('public.settings_id_seq'::regclass);


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admins (id, email, name, password_hash, created_at) FROM stdin;
1	admin@bialto.com	Bialto Admin	59c0e8c234de3f31fdacd52dffaf30905d7b497a7274bc2147e9fc97b5ae039f	2026-05-31 18:38:33.255503
\.


--
-- Data for Name: amenities; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.amenities (id, name, icon, description, sort_order, created_at) FROM stdin;
1	Free Wi-Fi	wifi	High-speed wireless internet throughout the estate	1	2026-05-31 18:39:54.369935
2	In-House Dining	utensils	Gourmet Himachali and Continental cuisine served fresh	2	2026-05-31 18:39:56.052431
3	Bonfire Area	flame	Scenic outdoor bonfire area with mountain views	3	2026-05-31 18:39:57.850193
4	Parking Space	car	Secure covered parking for all guests	4	2026-05-31 18:39:59.346916
5	Power Backup	zap	Uninterrupted 24/7 generator backup	5	2026-05-31 18:40:00.964401
6	CCTV Security	shield	24-hour CCTV surveillance throughout the estate	6	2026-05-31 18:40:02.428645
7	Room Service	bell	24-hour in-room dining and housekeeping	7	2026-05-31 18:40:04.119898
8	Balcony Views	mountain	Private balconies with panoramic mountain vistas	8	2026-05-31 18:40:05.953385
9	Hot Water	droplets	Round-the-clock hot water supply	9	2026-05-31 18:40:07.57093
10	Smart TV	tv	LED Smart TVs with streaming services in every room	10	2026-05-31 18:40:10.423935
11	Housekeeping	sparkles	Daily housekeeping and turndown service	11	2026-05-31 18:40:12.177834
\.


--
-- Data for Name: attractions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.attractions (id, name, description, distance, travel_time, image_url, sort_order, created_at) FROM stdin;
1	Kasauli Mall Road	The charming colonial-era promenade lined with shops, cafes, and Victorian architecture — the social heart of Kasauli.	2 km	5 mins drive	\N	1	2026-05-31 18:40:14.172943
2	Sunset Point	A breathtaking viewpoint offering panoramic views of the Sutlej plains at dusk — nature's most spectacular show.	4 km	10 mins drive	\N	2	2026-05-31 18:40:15.729293
3	Monkey Point	The highest point in Kasauli, sacred to devotees and offering unmatched views of the Himalayas and Chandigarh.	6 km	15 mins drive	\N	3	2026-05-31 18:40:17.223646
4	Christ Church	A magnificent Gothic church built in 1853 by the British, featuring stunning stained glass windows and serene surroundings.	3 km	8 mins drive	\N	4	2026-05-31 18:40:18.780588
5	Gilbert Trail	A serene 3-km forest trail perfect for morning walks through deodar cedar and oak forests with bird-watching opportunities.	1.5 km	5 mins drive	\N	5	2026-05-31 18:40:20.489879
6	Timber Trail Resort	A cable car ride offering spectacular aerial views over the Himalayan foothills and dense pine forests below.	12 km	25 mins drive	\N	6	2026-05-31 18:40:22.205289
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.bookings (id, guest_name, guest_email, guest_phone, check_in, check_out, guests, room_id, room_type, special_requests, status, total_amount, created_at, adults, children, coupon_code, discount_amount) FROM stdin;
1	Priya Sharma	priya@example.com	+91 9876543210	2026-06-05	2026-06-08	2	\N	Deluxe	\N	confirmed	18000	2026-05-31 18:41:33.216135	1	0	\N	0
2	Rahul Gupta	rahul@example.com	+91 9988776655	2026-06-10	2026-06-13	4	\N	Family Suite	\N	pending	28500	2026-05-31 18:41:34.789319	1	0	\N	0
3	Test	t@t.com	9999	2026-07-01	2026-07-03	3	\N	Deluxe	\N	pending	10000	2026-06-01 20:15:14.657057	2	1	\N	0
\.


--
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.coupons (id, code, discount_type, discount_value, is_active, max_uses, used_count, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: floors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.floors (id, name, floor_number, description, image_url, created_at, gallery_images, is_available, has_kitchen) FROM stdin;
1	The Heritage Lounge	1	A grand common area with classic colonial décor, reading nooks, and a warm fireplace — the heart of the estate where guests gather.	\N	2026-05-31 18:39:26.413065	{}	t	t
2	Premium Rooms	2	Spacious rooms with private balconies overlooking the pine-clad hillsides, furnished with hand-picked antiques and modern comforts.	\N	2026-05-31 18:39:28.270389	{}	t	t
3	Deluxe Rooms	3	Elegantly appointed interiors with panoramic valley views, rich wooden floors, and curated artwork from local Himachali artisans.	\N	2026-05-31 18:39:29.999026	{}	t	t
4	Family Suites	4	Generously sized suites designed for families seeking extra comfort — separate living areas, mountain-facing windows, and thoughtful amenities.	\N	2026-05-31 18:39:31.775264	{}	t	t
5	Sky Lounge & Dining	5	Rooftop dining with breathtaking 360-degree views of the Kasauli hills — perfect for sunsets, morning tea, and private dinners under the stars.	\N	2026-05-31 18:39:33.470352	{}	t	t
\.


--
-- Data for Name: gallery; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.gallery (id, image_url, category, title, sort_order, created_at) FROM stdin;
\.


--
-- Data for Name: images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.images (id, data, mime_type, filename, size, created_at) FROM stdin;
1	\\x	image/png	test.png	0	2026-06-01 20:53:04.996864
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reviews (id, guest_name, guest_location, guest_photo, rating, review_text, is_approved, created_at) FROM stdin;
1	Ananya Sharma	New Delhi	\N	5	Our stay at The Bialto was absolutely wonderful! The views, the hospitality, and the ambiance — everything was perfect. We watched the snow fall from our balcony with morning chai. Will return every winter.	t	2026-05-31 18:40:24.309382
2	Rajesh Mehra	Mumbai	\N	5	A hidden gem in the hills. The rooms are immaculately maintained and the dining is superb — the Himachali dham was a revelation. The staff made us feel like family, not guests.	t	2026-05-31 18:40:25.977369
3	Priya Iyer	Bangalore	\N	5	We celebrated our anniversary here and it was magical. The bonfire under the stars, the mountain silence at night, the delicious food. The Bialto sets a standard that other hill stations can only dream of matching.	t	2026-05-31 18:40:27.745446
4	Vikram Singh	Chandigarh	\N	4	Stunning property with incredible mountain views. The rooms are spacious and thoughtfully designed. The only suggestion — an outdoor yoga deck would complete the experience. Otherwise, near-perfect.	t	2026-05-31 18:40:29.349741
5	Neha Kapoor	Pune	\N	5	From the moment we arrived, we knew this was different. The old-world charm combined with modern comforts is rare. The staff remembered our names and preferences throughout. Exceptional hospitality.	t	2026-05-31 18:40:31.234966
\.


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.rooms (id, name, floor_id, room_type, feature_image_url, gallery_images, price_per_night, capacity, amenities, description, is_available, is_published, is_featured, created_at, adult_capacity, child_capacity) FROM stdin;
1	Mountain Retreat	2	Premium	\N	{}	4500	2	{"Free Wi-Fi","Balcony Views","Smart TV","Hot Water","Room Service",Housekeeping}	A serene premium room with a private balcony overlooking the pine-covered Kasauli hillside. Furnished with hand-carved wooden furniture and crisp mountain linens.	t	t	t	2026-05-31 18:41:07.337325	2	0
2	Colonial Suite	2	Premium	\N	{}	5000	2	{"Free Wi-Fi","Balcony Views","Smart TV","Hot Water","Room Service",Housekeeping}	Evoking the grandeur of a British-era colonial estate, this room features antique furnishings, original hardwood floors, and a writing desk by the window.	t	t	t	2026-05-31 18:41:08.923589	2	0
3	Valley View Deluxe	3	Deluxe	\N	{}	6000	2	{"Free Wi-Fi","Balcony Views","Smart TV","Hot Water","Room Service",Housekeeping,"In-House Dining"}	Panoramic valley views frame every moment in this deluxe room. Floor-to-ceiling windows, locally sourced stone accents, and a deep-soaking bathtub complete the experience.	t	t	t	2026-05-31 18:41:10.648443	2	0
4	Forest Haven	3	Deluxe	\N	{}	5500	2	{"Free Wi-Fi","Balcony Views","Smart TV","Hot Water","Room Service",Housekeeping}	Wake up to birdsong and the scent of deodar cedar forests. This immersive deluxe room brings the outdoors in with botanical prints, wooden beam ceilings, and a forest-facing balcony.	t	t	f	2026-05-31 18:41:12.146249	2	0
5	Himalayan Family Suite	4	Family Suite	\N	{}	9500	4	{"Free Wi-Fi","Balcony Views","Smart TV","Hot Water","Room Service",Housekeeping,"In-House Dining","Parking Space"}	Our most spacious accommodation — a 2-bedroom suite with a private sitting area, twin mountain-view balconies, and a dedicated family dining space. Perfect for families of up to 4.	t	t	t	2026-05-31 18:41:13.778873	4	0
6	Kasauli Grand Suite	4	Family Suite	\N	{}	11000	6	{"Free Wi-Fi","Balcony Views","Smart TV","Hot Water","Room Service",Housekeeping,"In-House Dining","Parking Space","CCTV Security"}	The crown jewel of The Bialto — a sprawling 3-bedroom suite with a private drawing room, dedicated butler service, and unobstructed 270-degree views of the Kasauli hills.	t	t	t	2026-05-31 18:41:15.38559	6	0
7	Heritage Classic Room	1	Classic	\N	{}	3200	2	{"Free Wi-Fi","Smart TV","Hot Water","Room Service",Housekeeping}	A charming classic room on the ground floor connected directly to the Heritage Lounge. Ideal for guests who cherish the social heart of the estate — morning reading and evening conversations by the fireplace.	t	t	f	2026-05-31 18:41:17.020254	2	0
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.settings (id, property_name, tagline, address, phone, email, whatsapp, logo_url, hero_images, facebook, instagram, twitter, google_maps_embed, meta_title, meta_description, updated_at, primary_color, secondary_color, accent_color, dark_mode, hero_tagline, hero_title, hero_description, hero_cta_text, about_label, about_title, about_description, about_image, about_cta_text, floors_section_label, floors_section_title, footer_tagline) FROM stdin;
1	The Bialto by Asemont Estate	Experience Luxury in the Hills of Kasauli	Dochi Road, Kasauli, Himachal Pradesh, India	+91 77176 02625	TheBialto@gmail.com	+91 77176 02625	\N	{}	\N	\N	\N	\N	\N	\N	2026-06-01 20:44:43.065	#c47c2b	#03163f	#090e1a	t	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admins_id_seq', 1, true);


--
-- Name: amenities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.amenities_id_seq', 11, true);


--
-- Name: attractions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.attractions_id_seq', 6, true);


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bookings_id_seq', 3, true);


--
-- Name: coupons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.coupons_id_seq', 1, false);


--
-- Name: floors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.floors_id_seq', 5, true);


--
-- Name: gallery_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.gallery_id_seq', 1, false);


--
-- Name: images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.images_id_seq', 1, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reviews_id_seq', 5, true);


--
-- Name: rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rooms_id_seq', 7, true);


--
-- Name: settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.settings_id_seq', 1, true);


--
-- Name: admins admins_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_unique UNIQUE (email);


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- Name: amenities amenities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.amenities
    ADD CONSTRAINT amenities_pkey PRIMARY KEY (id);


--
-- Name: attractions attractions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attractions
    ADD CONSTRAINT attractions_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: coupons coupons_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_code_key UNIQUE (code);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- Name: floors floors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.floors
    ADD CONSTRAINT floors_pkey PRIMARY KEY (id);


--
-- Name: gallery gallery_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.gallery
    ADD CONSTRAINT gallery_pkey PRIMARY KEY (id);


--
-- Name: images images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.images
    ADD CONSTRAINT images_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (id);


--
-- Name: rooms rooms_floor_id_floors_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rooms
    ADD CONSTRAINT rooms_floor_id_floors_id_fk FOREIGN KEY (floor_id) REFERENCES public.floors(id);


--
-- PostgreSQL database dump complete
--

\unrestrict QLqeNlHLVWyloFIYpwH70d9ykmEz8thDzrjctlXvbJxlTsAL7qqiiIMvDUU4q7P

