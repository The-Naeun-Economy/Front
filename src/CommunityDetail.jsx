/* eslint-disable */
import {testCommunity} from "./assets/testCommunity.js";
import {testMainCommunity} from "./assets/testMainCommunity.js";
import {useParams} from "react-router-dom";
import {useRecoilValue} from "recoil";

function CommunityDetail() {
    //let community = testCommunity;
    let category = testMainCommunity;
    let {id} = useParams();
    let data = useRecoilValue(testCommunity);
    let selectTitle = data[id];

    return (
        <>
            {selectTitle ?( 
            <div className={"bg-gray-300 rounded-xl font-bold p-10"} style={{margin: "50px 100px -50px 100px"}}>
                <span> {category[0].title}</span> {/* 해당하는 category 뜨게 할 예정 */}
                <div className={"border-amber-100 mb-5"}>
                    <div className={"bg-white mt-5"}>{selectTitle.title}
                        <p className={"mb-5"}>조회 {selectTitle.check}</p>
                        <div>{selectTitle.content}</div>
                        <div>{selectTitle.nickname}</div>
                    </div>
                </div>
                <div className={"bg-amber-800 rounded-l p-5"}>댓글 0
                    <div className={"bg-yellow-500 rounded-l p-5"}>따뜻한 댓글을 남겨주세요 :)
                        <div><input placeholder={"댓글을 입력해주세요 :)"} className={"bg-white rounded-l"}></input></div>
                    </div>
                </div>
            </div>
                ): (
            <p className={"text-center"}>존재 하지 않는 게시글 입니다.</p>
                    )}
        </>
    )
}

export default CommunityDetail;