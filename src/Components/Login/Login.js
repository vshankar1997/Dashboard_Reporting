import { useMsal } from "@azure/msal-react";
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import "../Login/Login.css";
import { Button, Col, Row ,} from "antd";
import "../../App.css";


const Login = () => {
  const { instance } = useMsal();
  // const [username, setUsername] = useState("");
  // const [password, setPassword] = useState("");


  const handleLogin = async () => {
    const accounts = instance.getAllAccounts();
    console.log(accounts);
    if (accounts.length === 0) {
      await instance.loginRedirect();
    }
  };

  // const handleLogout = async () => {
  //   const accounts = instance.getAllAccounts();
  //   if (accounts.length > 0) {
  //     accounts.forEach(async (account) => {
  //       await instance.logoutRedirect({
  //         account: account,
  //       });
  //     });
  //   }
  // };

  return (
    <Row style={{ height: '100vh' }}>
        <Col span={12} style={{ height: '100%', backgroundImage: 'url("https://png.pngtree.com/thumb_back/fh260/background/20190421/pngtree-business-intelligence-technology-background-image_107832.jpg', backgroundSize: 'cover', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '20px' }}>
      Dashboard
      </div>
    </Col>
    <Col span={12} style={{ height: '100%', backgroundColor: '#d9d9d9', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' , fontSize: "24" , width: "10rem", padding: '10px'}}>
      <Button onClick={handleLogin} style={{ borderRadius: "50px", margin: "0 auto", backgroundColor: 'blue', padding: '10px 20px', textAlign: 'center',fontSize: '18px',color: 'white',border: 'none',display: 'flex',alignItems: 'center',justifyContent: 'center'}}> Sign In
      </Button> 
    </Col>
  </Row>
);
}

export default Login;

