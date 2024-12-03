import LoginFormComponent from "./Components/User/LoginFormComponent";
import CreateUserComponent from "./Components/User/Create/CreateUserComponent";
import ListProductsComponent from "./Components/Products/ListProductsComponent";
import DetailsProductComponent from "./Components/Products/DetailsProductComponent";
import CreateProductComponent from "./Components/Products/CreateProductComponent";
import ListMyProductsComponent from "./Components/Products/ListMyProductsComponent";
import HomePageComponent from "./Components/Index/HomePageComponent";
import {Route, Routes, Link, useNavigate, useLocation } from "react-router-dom";
import {Layout, Menu, Avatar, Typography, Col, Row, notification} from 'antd';
import {
    CloudUploadOutlined,
    LoginOutlined,
    LogoutOutlined,
    ShopOutlined,
    ShoppingOutlined, TransactionOutlined,
    UserAddOutlined
} from '@ant-design/icons';
import {Fragment, useEffect, useState} from "react";
import ListTransactionsComponent from "./Components/Transactions/ListTransactionsComponent";
import UserProfileComponent from "./Components/User/Profile/UserProfileComponent";
import CreateTransactionComponent from "./Components/Transactions/CreateTransactionComponent";

let App = () => {
    const [api, contextHolder] = notification.useNotification();

    let navigate = useNavigate();
    let location = useLocation();
    let [login, setLogin] = useState(false);
    let {Header, Content, Footer} = Layout;

    useEffect(() => {
        checkAll();
    }, []);

    let checkAll = async () => {
        let isActive = await checkLoginIsActive();
        checkUserAccess(isActive);
    };

    const openNotification = (placement, text, type) => {
        api[type]({
            message: 'Notification',
            description: text,
            placement,
        });
    };

    let checkLoginIsActive = async () => {
        if (localStorage.getItem("apiKey") == null) {
            setLogin(false);
            return;
        }

        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/users/isActiveApiKey",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                }
            });

        if (response.ok) {
            let jsonData = await response.json();
            setLogin(jsonData.activeApiKey);

            if (!jsonData.activeApiKey){
                navigate("/login");
            }
            return(jsonData.activeApiKey);
        } else {
            setLogin(false);
            navigate("/login");
            return (false);
        }
    };

    let checkUserAccess= async (isActive) => {
        let href = location.pathname;
        if (!isActive && !["/","/login","/register"].includes(href) ){
            navigate("/login");
        }
    };

    let disconnect = async () => {
        let response = await fetch(
            process.env.REACT_APP_BACKEND_BASE_URL + "/users/disconnect",
            {
                method: "GET",
                headers: {
                    "apikey": localStorage.getItem("apiKey")
                }
            });

        localStorage.removeItem("apiKey");
        localStorage.removeItem("userId");
        setLogin(false);
        navigate("/login");
    };

    const {Text} = Typography;
    return (
        <Layout className="layout" style={{minHeight: "100vh"}}>
            {contextHolder}
            <Header>
                <Row>
                    <Col xs= {18} sm={19} md={20} lg={21} xl = {22}>
                        {!login &&
                            <Menu theme="dark" mode="horizontal" items={[
                                {key: "logo", label: <Link to={"/"}><img alt={"home"} src="/pages/welcome.png" width="60" height="60"/></Link>},
                                {key: "menuLogin", icon: <LoginOutlined/>, label: <Link to="/login">Login</Link>},
                                {key: "menuRegister", icon:<UserAddOutlined />, label: <Link to="/register">Register</Link>},
                            ]}>
                            </Menu>
                        }

                        {login &&
                            <Menu theme="dark" mode="horizontal" items={[
                                {key: "logo", label: <Link to={"/"}><img alt={"home"} src="/pages/welcome.png" width="60" height="60"/></Link>},
                                {key: "menuProducts", icon: <ShopOutlined />, label: <Link to="/products">Products</Link>},
                                {key: "menuMyProduct", icon:<ShoppingOutlined />, label: <Link to="/products/own">My Products</Link> },
                                {key: "menuCreateProduct", icon: <CloudUploadOutlined />, label: <Link to="/products/create">Sell</Link> },
                                {key: 'showTransactions', label: <Link to="/transactions/own">My Transactions</Link>,  icon: <TransactionOutlined />},
                                {key: 'disconnect', label: <Link onClick={disconnect} to="/index">Disconnect</Link>,  icon: <LogoutOutlined />},
                                {key: 'disconnect', label: <Link onClick={disconnect} to="/index">Disconnect</Link>,  icon: <LogoutOutlined />},
                            ]}>
                            </Menu>
                        }
                    </Col>
                    <Col xs= {6} sm={5} md = {4}  lg = {3} xl = {2}
                         style={{display: 'flex', flexDirection: 'row-reverse' }} >
                        { login ? (
                                <Avatar size="large"
                                        style={{ backgroundColor: "rgba(255,24,236,0.7)", verticalAlign: 'middle', marginTop: 12  }}>
                                    { localStorage.getItem("email").charAt(0) }
                                </Avatar>

                        ) : (
                            <Link to="/login"> <Text style={{ color:"#ffffff" }}>Login</Text></Link>
                        )}
                    </Col>
                </Row>
            </Header>
            <Content style={{padding: "20px 50px"}}>
                <div className="site-layout-content">
                    <Routes>
                        <Route path="/" element={
                            <HomePageComponent openNotification={openNotification}/>
                        }/>
                        <Route path="/register" element={
                            <CreateUserComponent openNotification={openNotification}/>
                        }/>
                        <Route path="/login"  element={
                            <LoginFormComponent setLogin={setLogin} openNotification={openNotification}/>
                        }/>
                        <Route path="/products" element={
                            <ListProductsComponent/>
                        }/>
                        <Route path="/products/:id" element={
                            <DetailsProductComponent openNotification={openNotification}/>
                        }/>
                        <Route path="/products/create" element={
                            <CreateProductComponent openNotification={openNotification}/>
                        }></Route>
                        <Route path="/products/own" element={
                            <ListMyProductsComponent />
                        }></Route>
                        <Route path="/transactions/own" element={
                            <ListTransactionsComponent  openNotification={openNotification} />
                        }></Route>
                        <Route path="/users/:id" element={
                            <UserProfileComponent  openNotification={openNotification} />
                        }></Route>
                        <Route path="/checkout/:id" element={
                            <CreateTransactionComponent  openNotification={openNotification} />
                        }></Route>
                    </Routes>
                </div>
            </Content>

            <Footer style={{textAlign: "center"}}> Wallapep </Footer>
        </Layout>
    )
}

export default App;
