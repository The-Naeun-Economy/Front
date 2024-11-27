import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import ChatComponentmk2 from "./ChatComponentmk2.jsx";

export const ChatRoom = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [isJoin, setIsJoin] = useState(true)
    const [selectChatRoom, setSelectChatRoom] = useState({
        uuid: "454ccca4-c2d0-4cf3-b46b-086fae57226a",
        chatRoomName: "testChatRoom 1494",
        ownerName: "가나다",
        UserNumber: 1,
        hashTags: [],
        createdAt: "2024-11-26T20:49:23.173148"
    })

    useEffect(() => {
        ChatRoomLoad()
    }, []);

    const handleJoin = () => {
        setIsJoin(!isJoin);
    }

    const ChatRoomLoad = async () => {
        const {data: chatRoom} = await axios.get(`http://localhost:8081/api/v1/chatroom/${id}`)
        setSelectChatRoom(chatRoom);
    }


    return (
        <div className={"ml-[50px] flex justify-center p-5 gap-5"}>
            <div className={"w-full max-w-[400px] border"}
                 style={{height: `calc(100vh - 94px)`}}>
                {isJoin ? <div className={"w-full h-full flex items-end"}
                               style={{backgroundColor: `rgba(150, 150, 150, 0.7)`}}>
                    <div className={"w-full"}>
                        <button className={"w-50 h-12 bg-amber-300 active:bg-amber-400 p-1"}
                                onClick={() => navigate("/chatRoom")}>돌아기기
                        </button>
                        <div className={"px-5 py-1 text-white"}>
                            <div className={"font-bold"}>{selectChatRoom.chatRoomName}</div>
                            <div>참여자 : {selectChatRoom.UserNumber}/1500</div>
                            <div>개설일 : {selectChatRoom.createdAt}</div>
                        </div>
                        <div className={"p-5 rounded-t bg-white w-full"}>
                            <div>{selectChatRoom.ownerName}</div>
                            <div className={"w-full flex flex-wrap gap-2"}>{
                                selectChatRoom.hashTags.map((tag, index) => {
                                    return (
                                        <p key={index}>{tag.tag}</p>
                                    )
                                })}</div>
                            <div className={"mt-10 flex justify-center"}>
                                <button className={"w-full h-12 bg-amber-300 active:bg-amber-400"}
                                        onClick={handleJoin}>채팅방 입장하기
                                </button>
                            </div>
                        </div>
                    </div>
                </div> : <ChatComponentmk2/>}
            </div>
        </div>
    );
}