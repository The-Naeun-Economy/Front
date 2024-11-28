//import { useState } from 'react'
import './App.css'
import './css/sidebar.css'
import SideBar from "./layouts/SideBar.jsx";
import MainScreen from "./page/MainScreen.jsx";
import Header from "./layouts/Header.jsx";
import {Route, Routes} from "react-router-dom";
import Community from "./page/Community.jsx";
import CommunityDetail from "./page/CommunityDetail.jsx";
import {RecoilRoot} from "recoil";
import MyPage from "./page/MyPage.jsx";
import ReportPage from "./page/ReportPage.jsx";
import CompleteProfile from "./layouts/CompleteProfile.jsx";
import {ChatRoom} from "./page/ChatRoom.jsx";
import {ChatRoomList} from "./page/ChatRoomList.jsx";
import CreatePost from "./page/CreatePost.jsx";
import {PaymentCheckoutPage} from "./page/tosspayment/PaymentCheckout.jsx";
import {PaymentSuccessPage} from "./page/tosspayment/PaymentSuccess.jsx";
import {PaymentFailPage} from "./page/tosspayment/PaymentFail.jsx";

//import {testCommunity} from "./assets/testCommunity.js";

function App() {

    return (<RecoilRoot>
        <div className="App w-full">
            <Header></Header>
            <SideBar></SideBar>
            {/*<<MainScreen></MainScreen>> */}

            <Routes>
                <Route path="/*" element={<CompleteProfile/>}/>
                <Route path="/" element={<MainScreen/>}/>
                <Route path="/community" element={<Community/>}/>
                <Route path="/CreatePost" element={<CreatePost/>}/>
                <Route path="/posts/:id" element={<CommunityDetail/>}/>
                <Route path="/ReportPage" element={<ReportPage/>}/>
                <Route path="/myPage" element={<MyPage/>}/>
                <Route path="/chatRoom/" element={<ChatRoomList/>}/>
                <Route path="/chatRoom/:id" element={<ChatRoom/>}/>
                <Route path="/tosspayment" element={<PaymentCheckoutPage/>}/>
                <Route path="/tosspayment/success" element={<PaymentSuccessPage/>}/>
                <Route path="/tosspayment/fail" element={<PaymentFailPage/>}/>
            </Routes>
        </div>
    </RecoilRoot>);
}

export default App
