// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { usersApi } from "../../../api/api.js";

export const DefaultInfo = () => {
    // 상태 관리
    const [userInfo, setUserInfo] = useState({
        name: "",
        nickname: "",
        gender: "",
        birthDate: "",
        email: "",
    });

    const [editUserInfo, setEditUserInfo] = useState({
        name: "",
        nickname: "",
        gender: "",
        birthDate: "",
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 수정 모달 상태
    const [errors, setErrors] = useState({}); // 에러 상태 추가

    // 유효성 검사
    const validateForm = () => {
        const newErrors = {};

        if (!editUserInfo.name) newErrors.name = "이름은 필수 항목입니다.";
        else if (!/^[가-힣]+$/.test(editUserInfo.name)) newErrors.name = "이름은 한글만 입력 가능합니다.";

        if (editUserInfo.nickname && !/^[가-힣\s]+$/.test(editUserInfo.nickname))
            newErrors.nickname = "닉네임은 한글과 띄어쓰기만 입력 가능합니다.";

        if (!editUserInfo.gender) newErrors.gender = "성별을 선택해주세요.";

        if (!editUserInfo.birthDate) newErrors.birthDate = "생년월일은 필수 항목입니다.";
        else {
            const today = new Date();
            const birthDate = new Date(editUserInfo.birthDate);
            if (birthDate >= today) newErrors.birthDate = "생년월일은 과거 날짜여야 합니다.";
        }

        return newErrors;
    };

    // 데이터 호출
    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        usersApi
            .get("/users/mypage", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => {
                const { name, email, nickname, gender, birthDay } = response.data;
                setUserInfo({
                    name: name || "",
                    nickname: nickname || "",
                    gender: gender || "",
                    birthDate: birthDay || "",
                    email: email || "",
                });
            })
            .catch((error) => console.error("데이터 불러오기 실패:", error));
    }, []);

    // 수정 모달 열기
    const handleEditClick = () => {
        setEditUserInfo(userInfo); // 수정용 상태에 기존 정보 복사
        setIsEditModalOpen(true);
        setErrors({});
    };

    // 사용자 정보 수정 요청
    const handleSaveChanges = () => {
        const validationErrors = validateForm(); // 유효성 검사 실행
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const token = localStorage.getItem("accessToken");

        usersApi
            .put(
                "/users/update",
                {
                    name: editUserInfo.name,
                    nickname: editUserInfo.nickname,
                    gender: editUserInfo.gender,
                    birthDate: editUserInfo.birthDate,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(() => {
                alert("사용자 정보가 성공적으로 수정되었습니다.");
                setUserInfo(editUserInfo); // 화면에 표시할 정보 업데이트
                setIsEditModalOpen(false);
                setErrors({});
                window.location.reload();
            })
            .catch((error) => {
                console.error("정보 수정 실패:", error);
                alert("정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.");
            });
    };

    // 회원 탈퇴 처리
    const handleDeleteAccount = () => {
        const token = localStorage.getItem("accessToken");
        if (window.confirm("탈퇴 시 되돌릴 수 없습니다.")) {
            usersApi
                .delete("/users/delete", {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then(() => {
                    alert("회원 탈퇴가 완료되었습니다.");
                    localStorage.clear();
                    window.location.href = "/";
                })
                .catch((error) => {
                    console.error("회원 탈퇴 실패:", error);
                    alert("탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.");
                });
        }
    };

    return (
        <div>
            <div className={"flex flex-row mb-5"}>
                <div className={"font-bold text-2xl mb-2 mt-5 "}>기본정보</div>
                <button
                    onClick={handleEditClick}
                    className="border px-3 text-white py-2 rounded bg-gray-500 ml-3 mt-2"
                >
                    수정
                </button>
                <button
                    onClick={handleDeleteAccount}
                    className="bg-[#2c3e50] text-white px-3 py-2 rounded ml-3 mt-2"
                >
                    회원 탈퇴
                </button>
            </div>
            <hr />

            {/* 사용자 정보 표시 */}
            {["name", "nickname", "gender", "birthDate", "email"].map((field) => (
                <React.Fragment key={field}>
                    <div className="w-full h-16 flex items-center px-2 justify-between">
                        <div className="w-48">{field === "name" ? "이름" :
                            field === "nickname" ? "닉네임" :
                                field === "gender" ? "성별" :
                                    field === "birthDate" ? "생년월일" : "이메일"}</div>
                        <div className="w-64">
                            {field === "gender"
                                ? userInfo.gender === "MALE"
                                    ? "남성"
                                    : userInfo.gender === "FEMALE"
                                        ? "여성"
                                        : ""
                                : userInfo[field]}
                        </div>
                    </div>
                    <hr />
                </React.Fragment>
            ))}

            {isEditModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="font-bold mb-4">정보 수정</h2>

                        {/* 이름 */}
                        <div className="mb-4">
                            <label>이름</label>
                            <input
                                type="text"
                                value={editUserInfo.name}
                                onChange={(e) => setEditUserInfo({ ...editUserInfo, name: e.target.value })}
                                className="border px-2 py-1 w-full"
                            />
                            {errors.name && <p className="text-red-500">{errors.name}</p>}
                        </div>

                        {/* 닉네임 */}
                        <div className="mb-4">
                            <label>닉네임</label>
                            <input
                                type="text"
                                value={editUserInfo.nickname}
                                onChange={(e) => setEditUserInfo({ ...editUserInfo, nickname: e.target.value })}
                                className="border px-2 py-1 w-full"
                            />
                            {errors.nickname && <p className="text-red-500">{errors.nickname}</p>}
                        </div>

                        {/* 성별 */}
                        <div className="mb-4">
                            <label>성별</label>
                            <select
                                value={editUserInfo.gender}
                                onChange={(e) => setEditUserInfo({ ...editUserInfo, gender: e.target.value })}
                                className="border px-2 py-1 w-full"
                            >
                                <option value="MALE">남성</option>
                                <option value="FEMALE">여성</option>
                            </select>
                            {errors.gender && <p className="text-red-500">{errors.gender}</p>}
                        </div>

                        {/* 생년월일 */}
                        <div className="mb-4">
                            <label>생년월일</label>
                            <input
                                type="date"
                                value={editUserInfo.birthDate}
                                onChange={(e) => setEditUserInfo({ ...editUserInfo, birthDate: e.target.value })}
                                max="2024-12-18"
                                className="border px-2 py-1 w-full"
                            />
                            {errors.birthDate && <p className="text-red-500">{errors.birthDate}</p>}
                        </div>

                        {/* 버튼 */}
                        <div className="flex justify-end">
                            <button
                                onClick={handleSaveChanges}
                                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                            >
                                저장
                            </button>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="bg-gray-400 px-4 py-2 rounded"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};