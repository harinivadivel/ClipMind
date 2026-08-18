--
-- PostgreSQL database dump
--

\restrict Vp2avYO71f2Jj3KaN1wb9HT1xJUisc3otDaafPk8N3S0gmjkiHdOjnVC023csEP

-- Dumped from database version 17.11
-- Dumped by pg_dump version 17.11

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
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
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_logs (
    id integer NOT NULL,
    user_id integer NOT NULL,
    action character varying(100) NOT NULL,
    resource_type character varying(50),
    resource_id integer,
    description text,
    ip_address character varying(45),
    user_agent text,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.activity_logs_id_seq OWNED BY public.activity_logs.id;


--
-- Name: analytics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.analytics (
    id integer NOT NULL,
    video_id integer NOT NULL,
    views integer NOT NULL,
    watch_time double precision NOT NULL,
    unique_viewers integer NOT NULL,
    total_watch_time double precision NOT NULL,
    completion_rate double precision NOT NULL,
    avg_watch_duration double precision NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: analytics_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.analytics_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: analytics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.analytics_id_seq OWNED BY public.analytics.id;


--
-- Name: bookmark_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookmark_items (
    id integer NOT NULL,
    user_id integer NOT NULL,
    item_type character varying(50) NOT NULL,
    item_id integer NOT NULL,
    label character varying(500),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: bookmark_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bookmark_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bookmark_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bookmark_items_id_seq OWNED BY public.bookmark_items.id;


--
-- Name: bookmarks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookmarks (
    id integer NOT NULL,
    user_id integer NOT NULL,
    video_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: bookmarks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bookmarks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bookmarks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bookmarks_id_seq OWNED BY public.bookmarks.id;


--
-- Name: key_moments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.key_moments (
    id integer NOT NULL,
    video_id integer NOT NULL,
    start_time double precision NOT NULL,
    end_time double precision,
    title character varying(255),
    description text,
    importance character varying(20),
    confidence double precision,
    created_at timestamp without time zone
);


--
-- Name: COLUMN key_moments.importance; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.key_moments.importance IS 'Importance level: Low, Medium, High, Very High';


--
-- Name: key_moments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.key_moments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: key_moments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.key_moments_id_seq OWNED BY public.key_moments.id;


--
-- Name: keywords; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.keywords (
    id integer NOT NULL,
    video_id integer NOT NULL,
    keyword character varying(255) NOT NULL,
    count integer NOT NULL,
    created_at timestamp without time zone
);


--
-- Name: keywords_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.keywords_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: keywords_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.keywords_id_seq OWNED BY public.keywords.id;


--
-- Name: learning_material_shares; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.learning_material_shares (
    id integer NOT NULL,
    material_id integer NOT NULL,
    token character varying(128) NOT NULL,
    created_by integer NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: learning_material_shares_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.learning_material_shares_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: learning_material_shares_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.learning_material_shares_id_seq OWNED BY public.learning_material_shares.id;


--
-- Name: learning_materials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.learning_materials (
    id integer NOT NULL,
    video_id integer NOT NULL,
    title character varying(255) NOT NULL,
    content json NOT NULL,
    created_by integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: learning_materials_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.learning_materials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: learning_materials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.learning_materials_id_seq OWNED BY public.learning_materials.id;


--
-- Name: platform_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.platform_settings (
    id integer NOT NULL,
    key character varying(100) NOT NULL,
    value text,
    value_type character varying(20) NOT NULL,
    description text,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: platform_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.platform_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: platform_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.platform_settings_id_seq OWNED BY public.platform_settings.id;


--
-- Name: processing_jobs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.processing_jobs (
    id integer NOT NULL,
    video_id integer NOT NULL,
    job_type character varying(50) NOT NULL,
    status character varying(50) NOT NULL,
    progress integer NOT NULL,
    result text,
    error_message text,
    created_at timestamp without time zone NOT NULL,
    started_at timestamp without time zone,
    completed_at timestamp without time zone
);


--
-- Name: processing_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.processing_jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: processing_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.processing_jobs_id_seq OWNED BY public.processing_jobs.id;


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    description text,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: roles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.roles_id_seq OWNED BY public.roles.id;


--
-- Name: summaries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.summaries (
    id integer NOT NULL,
    video_id integer NOT NULL,
    short_summary text NOT NULL,
    detailed_summary text NOT NULL,
    model_used character varying(100),
    bullet_points json,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: summaries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.summaries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: summaries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.summaries_id_seq OWNED BY public.summaries.id;


--
-- Name: summary_shares; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.summary_shares (
    id integer NOT NULL,
    video_id integer NOT NULL,
    token character varying(128) NOT NULL,
    created_by integer NOT NULL,
    is_active boolean NOT NULL,
    created_at timestamp without time zone NOT NULL
);


--
-- Name: summary_shares_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.summary_shares_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: summary_shares_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.summary_shares_id_seq OWNED BY public.summary_shares.id;


--
-- Name: transcripts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.transcripts (
    id integer NOT NULL,
    video_id integer NOT NULL,
    transcript text NOT NULL,
    language character varying(20) NOT NULL,
    confidence integer,
    segments json,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: transcripts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.transcripts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: transcripts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.transcripts_id_seq OWNED BY public.transcripts.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    username character varying(100) NOT NULL,
    hashed_password character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    is_active boolean NOT NULL,
    is_verified boolean NOT NULL,
    role_id integer NOT NULL,
    role character varying(50) NOT NULL,
    avatar_url character varying(500),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: videos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.videos (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    filename character varying(255) NOT NULL,
    file_path character varying(500) NOT NULL,
    file_size integer,
    duration double precision,
    thumbnail_url character varying(500),
    thumbnail_path character varying(500),
    audio_path character varying(500),
    video_url character varying(500),
    status character varying(50) NOT NULL,
    is_published boolean NOT NULL,
    user_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


--
-- Name: videos_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.videos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: videos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.videos_id_seq OWNED BY public.videos.id;


--
-- Name: watch_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.watch_history (
    id integer NOT NULL,
    user_id integer NOT NULL,
    video_id integer NOT NULL,
    watch_duration double precision NOT NULL,
    completion_rate double precision NOT NULL,
    last_watched_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: watch_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.watch_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: watch_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.watch_history_id_seq OWNED BY public.watch_history.id;


--
-- Name: activity_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN id SET DEFAULT nextval('public.activity_logs_id_seq'::regclass);


--
-- Name: analytics id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics ALTER COLUMN id SET DEFAULT nextval('public.analytics_id_seq'::regclass);


--
-- Name: bookmark_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmark_items ALTER COLUMN id SET DEFAULT nextval('public.bookmark_items_id_seq'::regclass);


--
-- Name: bookmarks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks ALTER COLUMN id SET DEFAULT nextval('public.bookmarks_id_seq'::regclass);


--
-- Name: key_moments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.key_moments ALTER COLUMN id SET DEFAULT nextval('public.key_moments_id_seq'::regclass);


--
-- Name: keywords id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.keywords ALTER COLUMN id SET DEFAULT nextval('public.keywords_id_seq'::regclass);


--
-- Name: learning_material_shares id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_material_shares ALTER COLUMN id SET DEFAULT nextval('public.learning_material_shares_id_seq'::regclass);


--
-- Name: learning_materials id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_materials ALTER COLUMN id SET DEFAULT nextval('public.learning_materials_id_seq'::regclass);


--
-- Name: platform_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_settings ALTER COLUMN id SET DEFAULT nextval('public.platform_settings_id_seq'::regclass);


--
-- Name: processing_jobs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.processing_jobs ALTER COLUMN id SET DEFAULT nextval('public.processing_jobs_id_seq'::regclass);


--
-- Name: roles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles ALTER COLUMN id SET DEFAULT nextval('public.roles_id_seq'::regclass);


--
-- Name: summaries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.summaries ALTER COLUMN id SET DEFAULT nextval('public.summaries_id_seq'::regclass);


--
-- Name: summary_shares id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.summary_shares ALTER COLUMN id SET DEFAULT nextval('public.summary_shares_id_seq'::regclass);


--
-- Name: transcripts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transcripts ALTER COLUMN id SET DEFAULT nextval('public.transcripts_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: videos id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.videos ALTER COLUMN id SET DEFAULT nextval('public.videos_id_seq'::regclass);


--
-- Name: watch_history id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.watch_history ALTER COLUMN id SET DEFAULT nextval('public.watch_history_id_seq'::regclass);


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.activity_logs (id, user_id, action, resource_type, resource_id, description, ip_address, user_agent, created_at) FROM stdin;
\.


--
-- Data for Name: analytics; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.analytics (id, video_id, views, watch_time, unique_viewers, total_watch_time, completion_rate, avg_watch_duration, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: bookmark_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.bookmark_items (id, user_id, item_type, item_id, label, created_at) FROM stdin;
\.


--
-- Data for Name: bookmarks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.bookmarks (id, user_id, video_id, created_at) FROM stdin;
\.


--
-- Data for Name: key_moments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.key_moments (id, video_id, start_time, end_time, title, description, importance, confidence, created_at) FROM stdin;
\.


--
-- Data for Name: keywords; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.keywords (id, video_id, keyword, count, created_at) FROM stdin;
\.


--
-- Data for Name: learning_material_shares; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.learning_material_shares (id, material_id, token, created_by, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: learning_materials; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.learning_materials (id, video_id, title, content, created_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: platform_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.platform_settings (id, key, value, value_type, description, updated_at) FROM stdin;
\.


--
-- Data for Name: processing_jobs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.processing_jobs (id, video_id, job_type, status, progress, result, error_message, created_at, started_at, completed_at) FROM stdin;
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, name, description, created_at) FROM stdin;
1	Administrator	Full system access and management	2026-08-18 14:03:10.094213
2	Content Creator	Can upload and manage video content	2026-08-18 14:03:10.094213
3	Educator	Can access transcripts and summaries	2026-08-18 14:03:10.094213
4	Learner	Can view and interact with content	2026-08-18 14:03:10.094213
\.


--
-- Data for Name: summaries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.summaries (id, video_id, short_summary, detailed_summary, model_used, bullet_points, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: summary_shares; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.summary_shares (id, video_id, token, created_by, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: transcripts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.transcripts (id, video_id, transcript, language, confidence, segments, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, username, hashed_password, full_name, is_active, is_verified, role_id, role, avatar_url, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: videos; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.videos (id, title, description, filename, file_path, file_size, duration, thumbnail_url, thumbnail_path, audio_path, video_url, status, is_published, user_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: watch_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.watch_history (id, user_id, video_id, watch_duration, completion_rate, last_watched_at, created_at) FROM stdin;
\.


--
-- Name: activity_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.activity_logs_id_seq', 1, false);


--
-- Name: analytics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.analytics_id_seq', 1, false);


--
-- Name: bookmark_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bookmark_items_id_seq', 1, false);


--
-- Name: bookmarks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bookmarks_id_seq', 1, false);


--
-- Name: key_moments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.key_moments_id_seq', 1, false);


--
-- Name: keywords_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.keywords_id_seq', 1, false);


--
-- Name: learning_material_shares_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.learning_material_shares_id_seq', 1, false);


--
-- Name: learning_materials_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.learning_materials_id_seq', 1, false);


--
-- Name: platform_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.platform_settings_id_seq', 1, false);


--
-- Name: processing_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.processing_jobs_id_seq', 1, false);


--
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.roles_id_seq', 4, true);


--
-- Name: summaries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.summaries_id_seq', 1, false);


--
-- Name: summary_shares_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.summary_shares_id_seq', 1, false);


--
-- Name: transcripts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.transcripts_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: videos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.videos_id_seq', 1, false);


--
-- Name: watch_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.watch_history_id_seq', 1, false);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: analytics analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics
    ADD CONSTRAINT analytics_pkey PRIMARY KEY (id);


--
-- Name: analytics analytics_video_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics
    ADD CONSTRAINT analytics_video_id_key UNIQUE (video_id);


--
-- Name: bookmark_items bookmark_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmark_items
    ADD CONSTRAINT bookmark_items_pkey PRIMARY KEY (id);


--
-- Name: bookmarks bookmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_pkey PRIMARY KEY (id);


--
-- Name: key_moments key_moments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.key_moments
    ADD CONSTRAINT key_moments_pkey PRIMARY KEY (id);


--
-- Name: keywords keywords_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.keywords
    ADD CONSTRAINT keywords_pkey PRIMARY KEY (id);


--
-- Name: learning_material_shares learning_material_shares_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_material_shares
    ADD CONSTRAINT learning_material_shares_pkey PRIMARY KEY (id);


--
-- Name: learning_materials learning_materials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_materials
    ADD CONSTRAINT learning_materials_pkey PRIMARY KEY (id);


--
-- Name: platform_settings platform_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.platform_settings
    ADD CONSTRAINT platform_settings_pkey PRIMARY KEY (id);


--
-- Name: processing_jobs processing_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.processing_jobs
    ADD CONSTRAINT processing_jobs_pkey PRIMARY KEY (id);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: summaries summaries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.summaries
    ADD CONSTRAINT summaries_pkey PRIMARY KEY (id);


--
-- Name: summaries summaries_video_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.summaries
    ADD CONSTRAINT summaries_video_id_key UNIQUE (video_id);


--
-- Name: summary_shares summary_shares_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.summary_shares
    ADD CONSTRAINT summary_shares_pkey PRIMARY KEY (id);


--
-- Name: transcripts transcripts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transcripts
    ADD CONSTRAINT transcripts_pkey PRIMARY KEY (id);


--
-- Name: transcripts transcripts_video_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transcripts
    ADD CONSTRAINT transcripts_video_id_key UNIQUE (video_id);


--
-- Name: bookmark_items uq_bookmark_item_user_type_ref; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmark_items
    ADD CONSTRAINT uq_bookmark_item_user_type_ref UNIQUE (user_id, item_type, item_id);


--
-- Name: bookmarks uq_bookmark_user_video; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT uq_bookmark_user_video UNIQUE (user_id, video_id);


--
-- Name: watch_history uq_watch_history_user_video; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.watch_history
    ADD CONSTRAINT uq_watch_history_user_video UNIQUE (user_id, video_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: videos videos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_pkey PRIMARY KEY (id);


--
-- Name: watch_history watch_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.watch_history
    ADD CONSTRAINT watch_history_pkey PRIMARY KEY (id);


--
-- Name: ix_activity_logs_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_activity_logs_id ON public.activity_logs USING btree (id);


--
-- Name: ix_analytics_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_analytics_id ON public.analytics USING btree (id);


--
-- Name: ix_bookmark_items_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_bookmark_items_id ON public.bookmark_items USING btree (id);


--
-- Name: ix_bookmark_items_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_bookmark_items_user_id ON public.bookmark_items USING btree (user_id);


--
-- Name: ix_bookmarks_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_bookmarks_id ON public.bookmarks USING btree (id);


--
-- Name: ix_keywords_keyword; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_keywords_keyword ON public.keywords USING btree (keyword);


--
-- Name: ix_learning_material_shares_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_learning_material_shares_id ON public.learning_material_shares USING btree (id);


--
-- Name: ix_learning_material_shares_material_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_learning_material_shares_material_id ON public.learning_material_shares USING btree (material_id);


--
-- Name: ix_learning_material_shares_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_learning_material_shares_token ON public.learning_material_shares USING btree (token);


--
-- Name: ix_learning_materials_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_learning_materials_id ON public.learning_materials USING btree (id);


--
-- Name: ix_learning_materials_video_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_learning_materials_video_id ON public.learning_materials USING btree (video_id);


--
-- Name: ix_platform_settings_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_platform_settings_id ON public.platform_settings USING btree (id);


--
-- Name: ix_platform_settings_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_platform_settings_key ON public.platform_settings USING btree (key);


--
-- Name: ix_processing_jobs_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_processing_jobs_id ON public.processing_jobs USING btree (id);


--
-- Name: ix_roles_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_roles_id ON public.roles USING btree (id);


--
-- Name: ix_roles_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_roles_name ON public.roles USING btree (name);


--
-- Name: ix_summaries_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_summaries_id ON public.summaries USING btree (id);


--
-- Name: ix_summary_shares_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_summary_shares_id ON public.summary_shares USING btree (id);


--
-- Name: ix_summary_shares_token; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_summary_shares_token ON public.summary_shares USING btree (token);


--
-- Name: ix_summary_shares_video_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_summary_shares_video_id ON public.summary_shares USING btree (video_id);


--
-- Name: ix_transcripts_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_transcripts_id ON public.transcripts USING btree (id);


--
-- Name: ix_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_users_email ON public.users USING btree (email);


--
-- Name: ix_users_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_users_id ON public.users USING btree (id);


--
-- Name: ix_users_role; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_users_role ON public.users USING btree (role);


--
-- Name: ix_users_username; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX ix_users_username ON public.users USING btree (username);


--
-- Name: ix_videos_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_videos_id ON public.videos USING btree (id);


--
-- Name: ix_watch_history_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_watch_history_id ON public.watch_history USING btree (id);


--
-- Name: ix_watch_history_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_watch_history_user_id ON public.watch_history USING btree (user_id);


--
-- Name: ix_watch_history_video_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_watch_history_video_id ON public.watch_history USING btree (video_id);


--
-- Name: activity_logs activity_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: analytics analytics_video_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.analytics
    ADD CONSTRAINT analytics_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.videos(id);


--
-- Name: bookmark_items bookmark_items_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmark_items
    ADD CONSTRAINT bookmark_items_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: bookmarks bookmarks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: bookmarks bookmarks_video_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE CASCADE;


--
-- Name: key_moments key_moments_video_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.key_moments
    ADD CONSTRAINT key_moments_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE CASCADE;


--
-- Name: keywords keywords_video_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.keywords
    ADD CONSTRAINT keywords_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE CASCADE;


--
-- Name: learning_material_shares learning_material_shares_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_material_shares
    ADD CONSTRAINT learning_material_shares_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: learning_material_shares learning_material_shares_material_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_material_shares
    ADD CONSTRAINT learning_material_shares_material_id_fkey FOREIGN KEY (material_id) REFERENCES public.learning_materials(id) ON DELETE CASCADE;


--
-- Name: learning_materials learning_materials_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_materials
    ADD CONSTRAINT learning_materials_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: learning_materials learning_materials_video_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_materials
    ADD CONSTRAINT learning_materials_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE CASCADE;


--
-- Name: processing_jobs processing_jobs_video_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.processing_jobs
    ADD CONSTRAINT processing_jobs_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.videos(id);


--
-- Name: summaries summaries_video_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.summaries
    ADD CONSTRAINT summaries_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.videos(id);


--
-- Name: summary_shares summary_shares_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.summary_shares
    ADD CONSTRAINT summary_shares_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: summary_shares summary_shares_video_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.summary_shares
    ADD CONSTRAINT summary_shares_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE CASCADE;


--
-- Name: transcripts transcripts_video_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.transcripts
    ADD CONSTRAINT transcripts_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.videos(id);


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id);


--
-- Name: videos videos_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.videos
    ADD CONSTRAINT videos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: watch_history watch_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.watch_history
    ADD CONSTRAINT watch_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: watch_history watch_history_video_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.watch_history
    ADD CONSTRAINT watch_history_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.videos(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict Vp2avYO71f2Jj3KaN1wb9HT1xJUisc3otDaafPk8N3S0gmjkiHdOjnVC023csEP

