from fastapi import FastAPI, HTTPException
import sqlite3
import os
from user_models import  UserInput
import requests
import os
from fastapi import FastAPI
from databricks import sql
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
db_file_path = os.path.join(parent_dir, 'db', 'user_details.db')

def insert_user(username, email):
    conn = sqlite3.connect(db_file_path)
    c = conn.cursor()
    c.execute('''INSERT INTO users (username, email) VALUES (?, ?)''', (username, email))
    conn.commit()
    conn.close()

def get_all_users():
    conn = sqlite3.connect(db_file_path)
    c = conn.cursor()
    c.execute('''SELECT * FROM users''')
    rows = c.fetchall()
    conn.close()
    return rows    

@app.get("/")
def read_root():
    return {"working": "---"}

@app.post("/user/")
def create_user(user_input: UserInput):
    try:
        insert_user(user_input.username, user_input.email)
        return {"message": "User created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    
    
@app.get("/users/")
def read_users():
    try:
        users = get_all_users()
        user_details = [{"id": row[0], "username": row[1], "email": row[2]} for row in users]
        return user_details
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))    


@app.post("/databricks/run_notebook/")
def run_databricks_notebook():
    api_url = "https://adb-5196752782233882.2.azuredatabricks.net/api/2.0"
    token = "dapi43939d908bc861d240d7d38ee7f944c1-3"
    notebook_path = "/Workspace/Users/sarawat@trinitypartners.com/DAILY RUN REPORT (Cardinal)"
    cluster_id = "0830-124307-gldiy7zr"
    payload = {
        "run_name": "Notebook Run",
        "existing_cluster_id": cluster_id,
        "notebook_task": {"notebook_path": notebook_path}
    }
    headers = {
        "Authorization": f"Bearer {token}"
    }
    try:
        response = requests.post(f"{api_url}/jobs/runs/submit", json=payload, headers=headers, verify=False)
        response_data1 = response.json()
        run_id = response_data1["run_id"]
        status = 'PENDING'
        response_data = None
        while status == "RUNNING" or status == 'PENDING':
            response = requests.get(f"{api_url}/jobs/runs/get?run_id={run_id}", headers=headers, verify=False)
            response_data = response.json()
            status = response_data["state"]["life_cycle_state"]
        return {"status": "Notebook execution completed", "response_data": response_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# CORS configuration
origins = [
    "http://localhost",
    "http://localhost:3000",  
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

HOSTNAME = 'adb-5196752782233882.2.azuredatabricks.net'
HTTP_PATH = 'sql/protocolv1/o/5196752782233882/0830-124307-gldiy7zr'
PERSONAL_ACCESS_TOKEN = 'dapi43939d908bc861d240d7d38ee7f944c1-3'

@app.get("/fetch_data")
async def fetch_data():    
       with sql.connect(server_hostname=HOSTNAME,
                 http_path=HTTP_PATH,
                 access_token=PERSONAL_ACCESS_TOKEN) as connection:
                
            with connection.cursor() as cursor: 
                cursor.execute("SELECT * FROM db_cardinal_raw.cardinal_run_report LIMIT 10")        
                result = cursor.fetchall()
                # print(f"Fetched {len(result)} rows")
                formatted_data = []
                for row in result:                    
                    formatted_row = {
                        "Vendor_name": row[0],
                        "Table_name": row[1],
                        "Hist_tbl_count": row[2],
                        "latest_records_Count": row[3],
                        "Total_Count_Source_file": row[4],
                        "Total_Count_Databricks_tbl": row[5],
                        "Total_Count_Snowflake_tbl": row[6],
                        "Matching": row[7],
                        "Processed_date": row[8].isoformat()  
                    }
                        
                    formatted_data.append(formatted_row)
            return formatted_data          