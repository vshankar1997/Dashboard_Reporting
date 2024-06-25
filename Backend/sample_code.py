import requests

# import requests 
# # Path to the CA certificates file
# ca_cert_path = "/usr/lib/ssl/cert.pem" 
# response = requests.get("https://your-databricks-url", verify=ca_cert_path)
# Databricks API URL
api_url = "https://adb-5196752782233882.2.azuredatabricks.net/api/2.0"

# Access Token for authentication
token = "dapi43939d908bc861d240d7d38ee7f944c1-3"

# Notebook link
notebook_path  = "/Workspace/Users/sarawat@trinitypartners.com/DAILY RUN REPORT (Cardinal)"

# Databricks Cluster ID
cluster_id = "0830-124307-gldiy7zr"

# Endpoint to execute a notebook
# endpoint = f"{api_url}/workspace/import"

# Parameters for notebook execution
payload  = {
    "run_name": "Notebook Run",
    "existing_cluster_id": cluster_id,
    "notebook_task": {"notebook_path": notebook_path}
}

# Headers for authentication
headers = {
    "Authorization": f"Bearer {token}",
    # "Content-Type": "application/json"
}

# Execute notebook
response = requests.post(f"{api_url}/jobs/runs/submit", json=payload, headers=headers,verify=False)
response_data1 = response.json()
run_id = response_data1["run_id"]
print(response_data1)

# Wait for run to complete
# status = response_data1["state"]["life_cycle_state"]
status = 'PENDING'
response_data = None
while status == "RUNNING" or status =='PENDING':
    response = requests.get(f"{api_url}/jobs/runs/get?run_id={run_id}", headers=headers,verify=False)
    response_data = response.json()
    status = response_data["state"]["life_cycle_state"]
    print(response_data)
    
print('-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=')
print('response_data->',response_data)