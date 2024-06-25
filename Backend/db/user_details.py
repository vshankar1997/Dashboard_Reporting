import sqlite3


def create_table():
    conn = sqlite3.connect('user_details.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY, username TEXT, email TEXT)''')
    conn.commit()
    conn.close()


def insert_user(username, email):
    conn = sqlite3.connect('user_details.db')
    c = conn.cursor()
    c.execute('''INSERT INTO users (username, email) VALUES (?, ?)''', (username, email))
    conn.commit()
    conn.close()


def get_users():
    conn = sqlite3.connect('user_details.db')
    c = conn.cursor()
    c.execute('''SELECT * FROM users''')
    rows = c.fetchall()
    conn.close()
    return rows


create_table()


insert_user('john_doe', 'john@example.com')


users = get_users()
for user in users:
    print(user)
