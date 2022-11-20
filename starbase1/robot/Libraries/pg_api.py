import os
import psycopg2
from . import env

SEED_TEST_USERS_b = '''
INSERT INTO auth.users (instance_id,id,aud,"role",email,encrypted_password,email_confirmed_at,last_sign_in_at,raw_app_meta_data,raw_user_meta_data,is_super_admin,created_at,updated_at,phone,phone_confirmed_at,confirmation_token,email_change,email_change_token_new,recovery_token) VALUES
 ('00000000-0000-0000-0000-000000000000'::uuid,'f76629c5-a070-4bbc-9918-64beaea48848'::uuid,'authenticated','authenticated','test@example.com','$2a$10$PznXR5VSgzjnAp7T/X7PCu6vtlgzdFt1zIr41IqP0CmVHQtShiXxS','2022-02-11 21:02:04.547','2022-02-11 22:53:12.520','{"provider": "email", "providers": ["email"]}','{}',FALSE,'2022-02-11 21:02:04.542','2022-02-11 21:02:04.542',NULL,NULL,'','','',''),
 ('00000000-0000-0000-0000-000000000000'::uuid,'d9064bb5-1501-4ec9-bfee-21ab74d645b8'::uuid,'authenticated','authenticated','dawn@supamail.com','$2a$10$1tUsMovgRSJgare6OR4n7ez8cbi1o94D5DR1wjbk6pOVWrZpi6F3a','2022-02-12 07:40:23.616','2022-02-12 07:40:23.621','{"provider": "email", "providers": ["email"]}','{}',FALSE,'2022-02-12 07:40:23.612','2022-02-12 07:40:23.613',NULL,NULL,'','','','')
ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id,user_id,identity_data,provider,last_sign_in_at,created_at,updated_at) VALUES
 ('f76629c5-a070-4bbc-9918-64beaea48848','f76629c5-a070-4bbc-9918-64beaea48848'::uuid,'{"sub": "f76629c5-a070-4bbc-9918-64beaea48848"}','email','2022-02-11 21:02:04.545','2022-02-11 21:02:04.545','2022-02-11 21:02:04.545'),
 ('d9064bb5-1501-4ec9-bfee-21ab74d645b8','d9064bb5-1501-4ec9-bfee-21ab74d645b8'::uuid,'{"sub": "d9064bb5-1501-4ec9-bfee-21ab74d645b8"}','email','2022-02-12 07:40:23.615','2022-02-12 07:40:23.615','2022-02-12 07:40:23.615')
ON CONFLICT (id, provider) DO NOTHING;
'''

SEED_TEST_USERS = '''
--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '3ac94c5b-cbe7-4d69-b267-331d2a0d7e68', '{"action":"user_signedup","actor_id":"b432fea4-d7bc-43d1-ae92-6763ff7ce367","actor_username":"dawn@supamail.com","log_type":"team","traits":{"provider":"email"}}', '2022-11-09 03:33:06.600003+00', '');
INSERT INTO auth.audit_log_entries (instance_id, id, payload, created_at, ip_address) VALUES ('00000000-0000-0000-0000-000000000000', '18dbf64e-c6c2-49ee-84d1-24dc1754c643', '{"action":"login","actor_id":"b432fea4-d7bc-43d1-ae92-6763ff7ce367","actor_username":"dawn@supamail.com","log_type":"account","traits":{"provider":"email"}}', '2022-11-09 03:33:06.602045+00', '');


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, recovery_token, recovery_sent_at, email_change_token_new, email_change, email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, created_at, updated_at, phone, phone_confirmed_at, phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at) VALUES ('00000000-0000-0000-0000-000000000000', 'b432fea4-d7bc-43d1-ae92-6763ff7ce367', 'authenticated', 'authenticated', 'dawn@supamail.com', '$2a$10$.v5KrDiw68nlxhDXzfwYnOGdT3VjvgaPyWpWYTQW0IX9kdhz2vkj2', '2022-11-09 03:33:06.600538+00', NULL, '', NULL, '', NULL, '', '', NULL, '2022-11-09 03:33:06.602524+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2022-11-09 03:33:06.597278+00', '2022-11-09 03:33:06.604533+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at) VALUES ('b432fea4-d7bc-43d1-ae92-6763ff7ce367', 'b432fea4-d7bc-43d1-ae92-6763ff7ce367', '{"sub": "b432fea4-d7bc-43d1-ae92-6763ff7ce367"}', 'email', '2022-11-09 03:33:06.599257+00', '2022-11-09 03:33:06.599304+00', '2022-11-09 03:33:06.599307+00');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.sessions (id, user_id, created_at, updated_at) VALUES ('9d1a2f96-e3a8-453b-a73f-fd06c760c892', 'b432fea4-d7bc-43d1-ae92-6763ff7ce367', '2022-11-09 03:33:06.602543+00', '2022-11-09 03:33:06.602544+00');


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO auth.refresh_tokens (instance_id, id, token, user_id, revoked, created_at, updated_at, parent, session_id) VALUES ('00000000-0000-0000-0000-000000000000', 1, 'F3-yJG5froy_3pxkm7AaAQ', 'b432fea4-d7bc-43d1-ae92-6763ff7ce367', false, '2022-11-09 03:33:06.60347+00', '2022-11-09 03:33:06.603471+00', NULL, '9d1a2f96-e3a8-453b-a73f-fd06c760c892');

'''

class PgApi:
  def __init__(self):
    env.load()
    db = os.environ.get('PSYCOPG2_CONNECT_LOCAL')
    self.conn = psycopg2.connect(db)
    print('# database connected')
  
  def read_users(self):
    with self.conn.cursor() as cur:
      cur.execute('select * from auth.users;')
      return cur.fetchall()
  
  def seed_test_users(self):
    with self.conn.cursor() as cur:
      cur.execute(SEED_TEST_USERS)
