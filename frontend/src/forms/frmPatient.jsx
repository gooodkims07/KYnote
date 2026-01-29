
import { useState, useRef, useEffect } from 'react';
import { User, Search, Activity } from 'lucide-react';
import DaumPostcode from 'react-daum-postcode';
import Card from '../components/ui/Card';
import SectionHeader from '../components/ui/SectionHeader';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import DepartmentList from '../components/patient/DepartmentList';
import DoctorList from '../components/patient/DoctorList';
import './frmPatient.css';

// Mock Data (Updated with real departments from KYUH)
const DEPARTMENTS = [
    "소화기내과", "심장내과", "호흡기내과", "내분비내과", "신장내과", "혈액종양내과",
    "류마티스내과", "감염내과", "소아청소년과", "신경과", "정신건강의학과", "피부과",
    "외과", "유방·갑상선클리닉", "심장혈관흉부외과", "신경외과", "정형외과", "성형외과",
    "산부인과", "안과", "이비인후과", "비뇨의학과", "재활의학과", "마취통증의학과",
    "통증클리닉", "영상의학과", "방사선종양학과", "진단검사의학과", "병리과", "핵의학과"
];

const DOCTORS = {
    "소화기내과": ["김영석", "이태희", "강상범"],
    "심장내과": ["배장호", "권택근", "김기홍"],
    "호흡기내과": ["손지웅", "나주옥", "정영훈"],
    "내분비내과": ["임동미", "김종대", "박근용"],
    "신장내과": ["황원민", "윤성로", "이윤경"],
    "혈액종양내과": ["최종권", "윤휘중", "조석구"],
    "류마티스내과": ["정강재", "김현정", "이수현"],
    "감염내과": ["오혜영", "김충종", "정혜원"],
    "소아청소년과": ["오준수", "천은정", "고경옥"],
    "신경과": ["김용덕", "나수규", "장상현"],
    "정신건강의학과": ["김승태", "박진경", "임우영"],
    "피부과": ["정한진", "이은미", "조재위"],
    "외과": ["이상억", "최인석", "김명진"],
    "유방·갑상선클리닉": ["정성후", "윤대성", "양승화"],
    "심장혈관흉부외과": ["김재현", "구관우", "조현민"],
    "신경외과": ["김기승", "이병주", "김대현"],
    "정형외과": ["김언섭", "김광균", "이석재"],
    "성형외과": ["김훈", "이용석", "임수환"],
    "산부인과": ["김철중", "이성기", "김태현"],
    "안과": ["이현구", "김만수", "고병이"],
    "이비인후과": ["김기범", "박재용", "이종구"],
    "비뇨의학과": ["김홍욱", "장영섭", "김형준"],
    "재활의학과": ["이영진", "박종태", "복수경"],
    "마취통증의학과": ["조대현", "강정규", "전영대"],
    "통증클리닉": ["조대현", "허윤석", "김동원"],
    "영상의학과": ["조영준", "김동건", "송미나"],
    "방사선종양학과": ["김정수", "박지호", "이형진"],
    "진단검사의학과": ["이종욱", "김지은", "박재현"],
    "병리과": ["김정희", "이혜경", "박수정"],
    "핵의학과": ["김동원", "송재현", "이민하"]
};

export default function FrmPatient() {
    // Patient State
    const [patientName, setPatientName] = useState("");
    const [rrnFront, setRrnFront] = useState("");
    const [rrnBack, setRrnBack] = useState("");
    const [rrnError, setRrnError] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [gender, setGender] = useState("");
    const [age, setAge] = useState("");
    const [zonecode, setZonecode] = useState("");
    const [roadAddress, setRoadAddress] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);

    // Booking State
    const [selectedDept, setSelectedDept] = useState(null);
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    // Refs
    const rrnBackRef = useRef(null);
    const detailAddrRef = useRef(null);

    // RRN Validation & Calculation Logic
    const calculateRRN = (front, back) => {
        const rrn = front + back;

        if (rrn.length !== 13) {
            setRrnError("주민등록번호 13자리를 모두 입력해주세요.");
            resetCalculatedFields();
            return;
        }

        // 1. Checksum Logic (Standard Korean Algorithm)
        let sum = 0;
        const multipliers = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
        for (let i = 0; i < 12; i++) {
            sum += parseInt(rrn[i]) * multipliers[i];
        }

        const remainder = sum % 11;
        const checkDigit = (11 - remainder) % 10;

        if (checkDigit !== parseInt(rrn[12])) {
            setRrnError("유효하지 않은 주민등록번호입니다 (Checksum 불일치).");
        } else {
            setRrnError("");
        }

        // 2. Info Extraction
        const genderCode = parseInt(back[0]);
        let yearPrefix = "";

        switch (genderCode) {
            case 1:
            case 2:
            case 5:
            case 6:
                yearPrefix = "19";
                break;
            case 3:
            case 4:
            case 7:
            case 8:
                yearPrefix = "20";
                break;
            case 9:
            case 0:
                yearPrefix = "18"; break;
            default:
                setRrnError("유효하지 않은 성별 코드입니다.");
                resetCalculatedFields();
                return;
        }

        const genderStr = (genderCode % 2 !== 0) ? "남성" : "여성";

        const year = yearPrefix + front.substring(0, 2);
        const month = front.substring(2, 4);
        const day = front.substring(4, 6);

        const dateObj = new Date(`${year}-${month}-${day}`);
        if (isNaN(dateObj.getTime()) || dateObj.getMonth() + 1 !== parseInt(month) || dateObj.getDate() !== parseInt(day)) {
            setRrnError("유효하지 않은 생년월일 날짜입니다.");
            resetCalculatedFields();
            return;
        }

        const fullDate = `${year}-${month}-${day}`;
        const today = new Date();
        let calculatedAge = today.getFullYear() - dateObj.getFullYear();
        const m = today.getMonth() - dateObj.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dateObj.getDate())) {
            calculatedAge--;
        }

        setBirthDate(fullDate);
        setGender(genderStr);
        setAge(calculatedAge);
    };

    const resetCalculatedFields = () => {
        setBirthDate("");
        setGender("");
        setAge("");
    };

    const handleRrnFrontChange = (e) => {
        const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
        setRrnFront(val);
        if (val.length === 6 && rrnBackRef.current) {
            rrnBackRef.current.focus();
        }
        if (val.length < 6) resetCalculatedFields();
    };

    const handleRrnBackChange = (e) => {
        const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 7);
        setRrnBack(val);
        if (val.length < 7) resetCalculatedFields();
    };

    useEffect(() => {
        if (rrnFront.length === 6 && rrnBack.length === 7) {
            calculateRRN(rrnFront, rrnBack);
        } else {
            // Optional: reset error if incomplete
        }
    }, [rrnFront, rrnBack]);


    const handleCompletePostcode = (data) => {
        let fullAddress = data.address;
        let extraAddress = '';

        if (data.addressType === 'R') {
            if (data.bname !== '') {
                extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
                extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
        }

        setZonecode(data.zonecode);
        setRoadAddress(fullAddress);
        setIsPostcodeOpen(false);
        if (detailAddrRef.current) detailAddrRef.current.focus();
    };

    const handleOpenPostcode = () => {
        setIsPostcodeOpen(true);
    };

    // Resizer Logic
    const [leftPanelWidth, setLeftPanelWidth] = useState(50); // percentage
    const isDragging = useRef(false);
    const containerRef = useRef(null);

    const startResizing = (e) => {
        isDragging.current = true;
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none'; // Prevent text selection
    };

    const stopResizing = () => {
        isDragging.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
    };

    const resize = (e) => {
        if (!isDragging.current || !containerRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;

        // Clamp between 30% and 70%
        if (newLeftWidth >= 30 && newLeftWidth <= 70) {
            setLeftPanelWidth(newLeftWidth);
        }
    };

    useEffect(() => {
        window.addEventListener('mousemove', resize);
        window.addEventListener('mouseup', stopResizing);
        return () => {
            window.removeEventListener('mousemove', resize);
            window.removeEventListener('mouseup', stopResizing);
        };
    }, []);

    return (
        <Card className="frmPatient-container" ref={containerRef}>
            {/* Split Layout */}
            <div className="section-patient" style={{ width: `${leftPanelWidth}%` }}>
                <SectionHeader
                    title="환자 정보 등록"
                    subtitle="기본 인적사항"
                    className="frmPatient-header"
                />

                <div className="form-grid">
                    <Input
                        label="환자 성명"
                        icon={User}
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="이름 입력"
                        containerClassName="form-group"
                    />

                    <div className="form-group full-width">
                        <label className="input-label">주민등록번호</label>
                        <div className="rrn-wrapper">
                            <input
                                type="text"
                                value={rrnFront}
                                onChange={handleRrnFrontChange}
                                placeholder="앞자리 (6)"
                                className="modern-input rrn-input"
                                maxLength={6}
                            />
                            <span className="separator">-</span>
                            <input
                                type="password"
                                value={rrnBack}
                                onChange={handleRrnBackChange}
                                placeholder="뒷자리 (7)"
                                className="modern-input rrn-input"
                                maxLength={7}
                                ref={rrnBackRef}
                            />
                        </div>
                        {rrnError && <div className="error-text">{rrnError}</div>}
                        {!rrnError && birthDate && <div className="success-text">유효한 주민등록번호입니다.</div>}
                    </div>

                    {/* Auto-calc Row */}
                    <div className="form-row-3">
                        <Input label="생년월일" value={birthDate} readOnly className="readonly" placeholder="자동" />
                        <Input label="성별" value={gender} readOnly className="readonly" placeholder="자동" />
                        <Input label="나이" value={age} readOnly className="readonly" placeholder="자동" />
                    </div>

                    <div className="form-group full-width">
                        <label className="input-label">주소</label>
                        <div className="address-group">
                            <input
                                type="text"
                                value={zonecode}
                                readOnly
                                placeholder="우편번호"
                                className="modern-input zonecode"
                            />
                            <Button variant="secondary" onClick={handleOpenPostcode} icon={Search} className="btn-search">
                                찾기
                            </Button>
                        </div>
                        <div className="address-row" style={{ marginTop: '0.5rem' }}>
                            <input
                                type="text"
                                value={roadAddress}
                                readOnly
                                placeholder="기본 주소 (도로명)"
                                className="modern-input"
                            />
                        </div>
                        <div className="address-row" style={{ marginTop: '0.5rem' }}>
                            <input
                                type="text"
                                value={detailAddress}
                                onChange={(e) => setDetailAddress(e.target.value)}
                                ref={detailAddrRef}
                                placeholder="상세 주소를 입력하세요"
                                className="modern-input"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Resizer Handle */}
            <div className="resizer" onMouseDown={startResizing}>
                <div className="resizer-knob"></div>
            </div>

            {/* Right Section: Booking */}
            <div className="section-booking" style={{ width: `${100 - leftPanelWidth}%` }}>
                <SectionHeader
                    title="진료 예약"
                    subtitle="진료과 및 의사 선택"
                    className="frmPatient-header"
                />

                <div className="booking-layout">
                    <DepartmentList
                        departments={DEPARTMENTS}
                        selectedDept={selectedDept}
                        onSelect={(dept) => { setSelectedDept(dept); setSelectedDoctor(null); }}
                    />

                    <DoctorList
                        doctors={DOCTORS[selectedDept] || []}
                        selectedDept={selectedDept}
                        selectedDoctor={selectedDoctor}
                        onSelect={setSelectedDoctor}
                    />
                </div>

                <div className="booking-summary">
                    <div className="summary-row">
                        <span>선택된 진료:</span>
                        <strong>{selectedDept || '-'} / {selectedDoctor || '-'}</strong>
                    </div>
                    <Button
                        variant="primary"
                        className="full-btn mt-4"
                        disabled={!selectedDoctor}
                        icon={Activity}
                    >
                        예약 및 저장
                    </Button>
                </div>
            </div>

            {/* Postcode Modal */}
            {isPostcodeOpen && (
                <div className="modal-overlay" onClick={() => setIsPostcodeOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <DaumPostcode onComplete={handleCompletePostcode} />
                        <button className="close-modal" onClick={() => setIsPostcodeOpen(false)}>닫기</button>
                    </div>
                </div>
            )}

        </Card>
    );
}
