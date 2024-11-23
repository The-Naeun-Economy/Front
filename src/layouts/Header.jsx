/* eslint-disable */
import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom'; // React Router
import axios from 'axios';
import '../css/header.css';


function Header() {
    const navigate = useNavigate(); // 리다이렉트를 위한 navigate 함수
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부 상태
    const [isSignInOpen, setIsSignInOpen] = useState(false);
    const [isSignUpOpen, setIsSignUpOpen] = useState(false);


    // 로그아웃
    const handleLogout = () => {
        const refreshToken = localStorage.getItem('refreshToken');
        console.log(refreshToken);

        // 로컬 스토리지에서 토큰 삭제
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');

        // 로그아웃 API 호출
        axios.get('http://localhost:8080/api/v1/users/logout', {
            headers: {
                Authorization: `Bearer ${refreshToken}`, // Refresh Token 추가
            },
        })
            .then(response => {
                console.log("로그아웃 성공:", response.data);
                window.location.reload(); // 새로고침
            })
            .catch(error => {
                console.error("로그아웃 실패:", error.response || error.message);
                window.location.reload(); // 실패해도 새로고침
            });
    };

    //로그인 연장
    const handleExtendLogin = () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            alert('리프레시 토큰이 없습니다. 다시 로그인하세요.');
            return;
        }

        axios.post('http://localhost:8080/api/v1/users/refresh-token', {}, {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        })
            .then((response) => {
                // 응답 형태에 따라 토큰 값 추출
                const accessToken = response.data.accessToken?.token || response.data.accessToken;
                if (accessToken) {
                    localStorage.setItem('accessToken', accessToken);
                    alert('로그인 세션이 연장되었습니다!');
                } else {
                    throw new Error('유효한 액세스 토큰이 응답되지 않았습니다.');
                }
            })
            .catch((error) => {
                console.error('로그인 연장 실패:', error);
                alert('로그인 연장에 실패했습니다. 다시 로그인하세요.');
                handleLogout(); // 실패 시 로그아웃 처리
            });
    };


    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const accessToken = params.get('accessToken');
        const refreshToken = params.get('refreshToken');

        if (accessToken && refreshToken) {
            // 로컬 스토리지에 토큰 저장
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            // 로그인 상태 업데이트
            setIsLoggedIn(true);

            // 쿼리 파라미터 제거 (URL 깔끔하게)
            window.history.replaceState({}, document.title, '/');
        } else {
            // 로컬 스토리지 확인
            const storedAccessToken = localStorage.getItem('accessToken');
            if (storedAccessToken) {
                setIsLoggedIn(true);
            }
        }
    }, []);

    return (<div className={"w-full flex justify-end"}>
        <header className="header">
            <div className="header-content">
                <div className="auth-buttons">
                    {isLoggedIn ? (
                        <>
                            <button onClick={handleLogout}>로그아웃</button>
                            <button onClick={handleExtendLogin}>로그인 연장</button> {/* 로그인 연장 버튼 */}
                        </>
                    ) : (
                        <>
                            <button onClick={() => setIsSignInOpen(true)}>로그인</button>
                            <button onClick={() => setIsSignUpOpen(true)}>회원가입</button>
                        </>
                    )}
                </div>
            </div>
        </header>
        {isSignInOpen && <SignIn setIsSignInOpen={setIsSignInOpen} setIsLoggedIn={setIsLoggedIn}/>}
        {isSignUpOpen && <SignUp setIsSignUpOpen={setIsSignUpOpen} setIsLoggedIn={setIsLoggedIn}/>}
    </div>);
}

// 로그인 모달 컴포넌트
function SignIn({setIsSignInOpen, setIsLoggedIn}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (!email || !password) {
            alert("이메일과 비밀번호를 입력해주세요.");
            return;
        }

        axios.post('http://localhost:8080/api/v1/login', {email, password})
            .then(response => {
                if (response.status === 200) {
                    const {accessToken, refreshToken} = response.data;

                    if (accessToken && refreshToken) {
                        localStorage.setItem('accessToken', accessToken.token);
                        localStorage.setItem('refreshToken', refreshToken.token);

                        setIsSignInOpen(false);
                        setIsLoggedIn(true);
                    } else {
                        alert("토큰을 받지 못했습니다.");
                    }
                }
            })
            .catch(error => {
                console.error('Login error', error);
                alert(error.response?.data?.message || '로그인 실패. 다시 시도해주세요.');
            });
    };

    return (<div className="modal-overlay" onClick={() => setIsSignInOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>로그인
                <button
                    className="absolute w-20 h-5 top-5 left-50 text-center p-0 flex justify-center items-center"
                    onClick={(() => {
                        setEmail('example2@gmail.com')
                        setPassword('password123')
                    })}>테스트</button>
            </h2>

            <button className="close-modal" onClick={() => setIsSignInOpen(false)}>⊗</button>
            <div className="input-container">
                <label>Email</label>
                <input
                    type="text"
                    placeholder="abc123@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="input-container" style={{paddingBottom: "20px"}}>
                <label>Password</label>
                <input
                    type="password"
                    placeholder="*********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <h6>소셜 미디어 로그인</h6>
            <h6 className="hr" style={{paddingBottom: "20px"}}>SNS LOGIN</h6>
            <div className="oauth-buttons" style={{marginBottom: "20px"}}>
                <button className="oauth-button kakao" onClick={() => handleKakaoLogin()}>
                </button>
            </div>
            <button onClick={handleLogin}>로그인</button>
        </div>
    </div>)
}


// 카카오 로그인
const handleKakaoLogin = () => {
    const kakaoAuthUrl = 'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=425177266f9081ed665e51bd34048cc9&redirect_uri=http://localhost:8080/api/oauth/kakao/callback';
    window.location.href = kakaoAuthUrl;
};


// 회원가입 모달 컴포넌트
function SignUp({setIsSignUpOpen, setIsLoggedIn}) {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', confirmPassword: '', gender: '', birthDate: '', nickname: '',
    });

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSignUp = () => {
        if (formData.password !== formData.confirmPassword) {
            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
        }

        axios.post('http://localhost:8080/api/v1/signup', formData)
            .then(response => {
                if (response.status === 200) {
                    alert('회원가입 성공!');

                    setTimeout(() => {
                        axios.post('http://localhost:8080/api/v1/login', {
                            email: formData.email, password: formData.password,
                        })
                            .then(loginResponse => {
                                const {accessToken, refreshToken} = loginResponse.data;

                                if (accessToken && refreshToken) {
                                    localStorage.setItem('accessToken', accessToken.token);
                                    localStorage.setItem('refreshToken', refreshToken.token);

                                    setIsLoggedIn(true); // 로그인 상태 업데이트
                                    setIsSignUpOpen(false); // 회원가입 모달 닫기
                                } else {
                                    alert("로그인 토큰을 받을 수 없습니다. 다시 로그인하세요.");
                                }
                            })
                            .catch(loginError => {
                                console.error("자동 로그인 실패:", loginError);
                                alert("회원가입은 성공했지만 자동 로그인에 실패했습니다. 로그인 화면으로 이동해주세요.");
                            });
                    }, 400);
                }
            })
            .catch(error => {
                console.error('회원가입 실패:', error);
                alert(error.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해주세요.');
            });
    };

    return (<div className="modal-overlay" onClick={() => setIsSignUpOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>회원가입</h2>
            <button className="close-modal" onClick={() => setIsSignUpOpen(false)}>⊗</button>
            <div className="input-container">
                <label>이름*</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange}
                       placeholder="이름"/>
            </div>
            <div className="input-container">
                <label>Email*</label>
                <input type="text" name="email" value={formData.email} onChange={handleChange}
                       placeholder="abc123@gmail.com"/>
            </div>
            <div className="input-container">
                <label>Password*</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange}
                       placeholder="*********"/>
            </div>
            <div className="input-container">
                <label>Password 재확인*</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword}
                       onChange={handleChange} placeholder="*********"/>
            </div>
            <div className="input-container">
                <label>성별*</label>
                <div className="gender-buttons">
                    <button className={`gender-button ${formData.gender === 'MALE' ? 'active' : ''}`}
                            onClick={() => setFormData({...formData, gender: 'MALE'})}>남성
                    </button>
                    <button className={`gender-button ${formData.gender === 'FEMALE' ? 'active' : ''}`}
                            onClick={() => setFormData({...formData, gender: 'FEMALE'})}>여성
                    </button>
                </div>
            </div>
            <div className="input-container">
                <label>생년월일*</label>
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange}
                       max="2024-12-18"/>
            </div>
            <div className="input-container">
                <label>닉네임(선택)</label>
                <input type="text" name="nickname" value={formData.nickname} onChange={handleChange}
                       placeholder="근면한 복어"/>
            </div>
            <button onClick={handleSignUp}>회원가입</button>
        </div>
    </div>);
}

export default Header;