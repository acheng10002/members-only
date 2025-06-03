--
-- PostgreSQL database dump
--

-- Dumped from database version 14.17 (Homebrew)
-- Dumped by pg_dump version 14.18 (Homebrew)

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

ALTER TABLE IF EXISTS ONLY public.messages DROP CONSTRAINT IF EXISTS messages_mem_id_fkey;
DROP INDEX IF EXISTS public."IDX_session_expire";
ALTER TABLE IF EXISTS ONLY public.sessions DROP CONSTRAINT IF EXISTS session_pkey;
ALTER TABLE IF EXISTS ONLY public.messages DROP CONSTRAINT IF EXISTS messages_pkey;
ALTER TABLE IF EXISTS ONLY public.members DROP CONSTRAINT IF EXISTS members_username_key;
ALTER TABLE IF EXISTS ONLY public.members DROP CONSTRAINT IF EXISTS members_pkey;
DROP TABLE IF EXISTS public.sessions;
DROP TABLE IF EXISTS public.messages;
DROP TABLE IF EXISTS public.members;
SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.members (
    id integer NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(100) NOT NULL,
    username character varying(255) NOT NULL,
    hash text NOT NULL,
    mem_status boolean DEFAULT false,
    admin_status boolean DEFAULT false
);


--
-- Name: members_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.members ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.members_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    text text NOT NULL,
    added timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    mem_id integer NOT NULL
);


--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.messages ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.messages_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


--
-- Data for Name: members; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.members (id, first_name, last_name, username, hash, mem_status, admin_status) FROM stdin;
2	Sally	Lin	sallylin@gmail.com	$2b$10$e/9nTzdLCDm/sk9XLhwKtOQUm2Pr334Kus6zELlHnYyTOCB7NmWK2	t	t
7	Frida	De Santis	fridadesantis@gmail.com	$2b$10$d2x/EXpw0T7YNjYmDdMPz.F.PYdgkMOomtM9djokXjao/MuvbJZ2O	t	t
3	Fritz	Lin	fritzlin@gmail.com	$2b$10$M.QXHYotjBKXeCGGrXhmYeFtZ1L467LuvG.v5ko5fpfSi//DDyy/6	t	f
4	Morgan	Coal	morgancoal@gmail.com	$2b$10$9jF8m/gsJqTHiLHvgZs6Le9FbstzWSUrs1Ggc5L6c20lu0H1jmpUu	t	f
6	Biscuit	Stover	biscuitstover@gmail.com	$2b$10$XkebieoNcTG9RRX8xo92XOd6B3N53mmxWzNY0nHAcfkfrMM.zLk9y	t	f
5	Shelly	Coal	shellycoal@gmail.com	$2b$10$2GKNtzfNZmsvuW4xt9JO0.tdXsPg8m5Mx5QwLrOuFwfJ.YbN6Vh5y	t	t
8	Captain	Kaplan	captainkaplan@gmail.com	$2b$10$lGqB14p8Aat/qf7L/73gB.8WnuFiTdsxAMW5cFyU9okD30ttMgIa2	t	t
1	Kai	Ludlow	kailudlow@gmail.com	$2b$10$TNYE3vdbbggfwOrnZhMqzu4huU2hnsIwbkARIkYOVqCzSCU7mF.sC	t	t
10	Indie	Ludlow	indie.ludlow@gmail.com	$2b$10$G8/foK7vmT1FkhF6KTJ6COP7LuEhvLqIiHXMw47fEsvPkCZvNQhGy	t	t
13	Ragnar	Vicencio	ragnar.vicencio@gmail.com	$2b$10$JULgpYdIPWJWQDt7xLXrfuMfmMfL3A8zQXVmNowFR2OakBn2p3u76	t	t
15	Joey	Baxter	joeybaxter@gmail.com	$2b$10$VNvaT7gatPgE.c1Alva9rekxF6sCs2W7oazDtpotAOMBYHnh9iUQ6	t	t
14	Willie	Ludlow	willie.ludlow@gmail.com	$2b$10$dS3O.ITStpKZvIAwbMm/IepuPs2OA2Tu5M8vYo7.oy5ub4W./WqDS	t	t
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.messages (id, title, text, added, mem_id) FROM stdin;
1	Greeting 1	Bonjour	2025-03-13 20:47:22.672	1
2	Greeting 2	Hello	2025-03-17 15:40:00.675	2
3	Greeting 3	Hola	2025-03-17 15:41:37.426	3
4	Greeting 4	Hallo	2025-03-17 15:42:18.438	4
6	Greeting 6	Ola	2025-03-17 15:43:25.275	6
7	Greeting 7	Hej	2025-03-17 15:44:04.761	7
8	Greeting 8	Hei	2025-03-17 15:44:51.508	8
9	Greeting 9	Salut	2025-03-17 15:47:53.84	10
10	Greeting 10	Ahoj	2025-03-17 16:54:58.011	13
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.sessions (sid, sess, expire) FROM stdin;
WF1m5brA_IITE22c-UwG6NIEsKk5mPGw	{"cookie":{"originalMaxAge":86400000,"expires":"2025-03-19T00:35:26.931Z","httpOnly":true,"path":"/"},"passport":{"user":"willie.ludlow@gmail.com"}}	2025-03-18 20:36:01
\.


--
-- Name: members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.members_id_seq', 15, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.messages_id_seq', 12, true);


--
-- Name: members members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_pkey PRIMARY KEY (id);


--
-- Name: members members_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_username_key UNIQUE (username);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: sessions session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_session_expire" ON public.sessions USING btree (expire);


--
-- Name: messages messages_mem_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_mem_id_fkey FOREIGN KEY (mem_id) REFERENCES public.members(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

