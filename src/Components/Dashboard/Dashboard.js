
import React, { useState, useRef,useEffect } from "react";
import { Table, Button, Dropdown, Space, Layout, Menu, Input, DatePicker } from 'antd';
import { CopyOutlined, DownloadOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useMsal } from "@azure/msal-react";
import appData from './app.json';
import "../../App.css";
import axios from 'axios';

const { Header, Content } = Layout;
const { Search } = Input;

const Dashboard = () => {
  const { instance } = useMsal();
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isCopy, ] = useState(false);
  const htmlContentRef = useRef(null);
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterData,setFilterData] = useState();

  useEffect(() => {
   
    axios.get('http://127.0.0.1:8000/fetch_data')
        .then(response => {
            setData(response.data);
            setFilterData(response.data)
            console.log(response.data)
        })
        .catch(error => {
            console.error('Error fetching data: ', error);
        });
}, []);
 

  const handleClientChange = (clientName) => {
    setSelectedClient(clientName);
    setSelectedVendor("");
  };

  const handleVendorChange = (vendorName) => {
    setSelectedVendor(vendorName);
  };

  const handleLogout = async () => {
    const accounts = instance.getAllAccounts();
    if (accounts.length > 0) {
      accounts.forEach(async (account) => {
        await instance.logoutRedirect({ account: account });
      });
    }
  };

  const handleClick = async () => {
    try {
      const response = await fetch('https://your-api-endpoint.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedClient,
          selectedVendor,
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Submit Button Response:', responseData);
      } else {
        throw new Error('Failed to submit data');
      }
    } catch (error) {
      console.error('Submit Button Error:', error);
    }
  };

  const columns = [ {
    title: "Vendor Name",
    dataIndex: "Vendor_name",
    sorter: (a, b) => a.Vendor_name.localeCompare(b.Vendor_name),
    width: 150,
  },
  {
    title: "Table Name",
    dataIndex: "Table_name",
    sorter: (a, b) => a.Table_name.localeCompare(b.Table_name),
    width: 100,
  },
  {
    title: "Hist Table Count",
    dataIndex: "Hist_tbl_count",
    width: 250,
  },
  {
    title: "Latest Records Count",
    dataIndex: "latest_records_Count",
    width: 350,
  },
  {
    title: "Total Count Source File",
    dataIndex: "Total_Count_Source_file",
    width: 350,
  },
  {
    title: "Total Count Databricks Table",
    dataIndex: "Total_Count_Databricks_tbl",
    width: 400,
  },
  {
    title: "Total Count Snowflake Table",
    dataIndex: "Total_Count_Snowflake_tbl",
    width: 400,
  },
  {
    title: "Matching",
    dataIndex: "Matching",
    render: (text, record) => record.Matching ? "True" : "False",
    width: 100,
  },
  {
    title: "Processed Date",
    dataIndex: "Processed_date",
    render: (text, record) => new Date(record.Processed_date).toLocaleString(),
    width: 200,
  },
];


  const clientMenu = (
    <Menu>
      <Menu.Item onClick={() => handleClientChange("")}>All Clients</Menu.Item>
      {appData.clients.map((option) => (
        <Menu.Item key={option.client_name} onClick={() => handleClientChange(option.client_name)}>
          {option.client_name}
        </Menu.Item>
      ))}
    </Menu>
  );

  const vendorMenu = (
    <Menu>
      <Menu.Item onClick={() => handleVendorChange("")}>All Vendors</Menu.Item>
      {selectedClient &&
        appData.clients
          .filter((client) => client.client_name === selectedClient)
          .map((filteredClient) => appData.vendors[filteredClient.vendor_id])
          .flat()
          .map((vendor) => (
            <Menu.Item key={vendor} onClick={() => handleVendorChange(vendor)}>
              {vendor}
            </Menu.Item>
          ))}
    </Menu>
  );
  const handleCopyClick = async () => {
    const range = document.createRange();
    console.log(htmlContentRef.current)
    range.selectNode(htmlContentRef.current);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    try {
      document.execCommand("copy");
    } catch (error) {
      console.error("Unable to copy to clipboard:", error);
    }
    selection.removeAllRanges();
   };

  const downloadCSV = () => {
    const csvData = [
      Object.keys(filterData[0]).join(','),
      ...filterData.map(item => Object.values(item).map(value => `"${value}"`).join(','))
    ].join('\n');
  
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'table_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const handleDateChange = (date, dateString) =>{
    setSelectedDate(dateString);
    filterTableData(dateString);
  }
  const filterTableData = (dateString,searchText) => {

    let filtered = data;

    if (dateString) {
      filtered = filtered.filter(item => {
        const processedDate = item.Processed_date.split('T')[0];
        return processedDate === dateString;
      });
    }
    if (searchText) {
      filtered = filtered.filter(item =>
        Object.keys(item).some(key =>
          String(item[key]).toLowerCase().includes(searchText.toLowerCase())
        )
      );
    }
    setFilterData(filtered);
  };

  return (
    <Layout>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#001529', padding: '0 20px' }}>
        <h1 style={{ color: 'white', margin: 0 }}>DashBoard Table</h1>
        <Button type="primary" onClick={handleLogout} style={{ borderRadius: "30px" }}>
          Sign Out
        </Button>
      </Header>
      <Content style={{ padding: '20px 10px', marginTop: '0px' }}>
        {/* <Space direction="horizontal" size="middle" style={{ marginBottom: '20px' }}>
          <Dropdown overlay={clientMenu} placement="bottomLeft">
            <Button>{selectedClient ? `Selected Client: ${selectedClient}` : "Select Client"}</Button>
          </Dropdown>
          <Dropdown overlay={vendorMenu} placement="bottomLeft">
            <Button>{selectedVendor ? `Selected Vendor: ${selectedVendor}` : "Select Vendor"}</Button>
          </Dropdown>
          <Button
            type="primary"
            htmlType="submit"
            className="submit-button"
            onClick={handleClick}
            disabled={!selectedVendor}
          >
            Submit
          </Button>
        </Space> */}
        {/* <Search
          placeholder="Search table..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ marginBottom: 20, width: 300 }}
        /> */}
        <DatePicker picker="date" style={{ marginBottom: 20}} onChange={handleDateChange}/>
        <div 
        ref={ htmlContentRef}
        className="here"
        style={{maxHeight:"67vh",overflowX:"auto"}}>
        <Table
          columns={columns}
          dataSource={filterData}
          pagination={{
            position: ["bottomCenter"],
            showSizeChanger: true,
            pageSizeOptions: ["2", "5", "10", "25", "50"],
          }}
          style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}
        />
        </div>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <CopyToClipboard text={JSON.stringify(filterData, null, 2)}>
            <Button type="primary" icon={<CopyOutlined />} onClick={handleCopyClick}>
              {isCopy ? "Copied!" : "Copy Table Data"}
            </Button>
          </CopyToClipboard>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => downloadCSV(JSON.stringify(filterData, null, 2), 'table_data.json')}
            style={{ marginLeft: '10px' }}
          >
            Download Table Data
          </Button>
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;
