from Libraries import pg_api

pg = pg_api.PgApi()

pg.seed_test_users()
print('# created test users')

users = pg.read_users()
print('# users')
print(users)

