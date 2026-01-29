
import { useState, useEffect, useRef } from 'react';
import { User, Lock, LogIn, X } from 'lucide-react';
import Card from '../components/ui/Card';
import SectionHeader from '../components/ui/SectionHeader';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import './frmLogin.css';

export default function FrmLogin({ onLoginSuccess }) {
    const [txtID, setTxtID] = useState("");
    const [txtPassword, setTxtPassword] = useState("");
    const [errorID, setErrorID] = useState(false);
    const [errorPass, setErrorPass] = useState(false);

    const txtIDRef = useRef(null);
    const txtPasswordRef = useRef(null);

    useEffect(() => {
        setTxtID("");
        setTxtPassword("");
        if (txtIDRef.current) txtIDRef.current.focus();
    }, []);

    const handleConfirmClick = () => {
        setErrorID(false);
        setErrorPass(false);

        if (txtID.trim() === "") {
            setErrorID(true);
            if (txtIDRef.current) txtIDRef.current.focus();
            return;
        }

        if (txtPassword.trim() === "") {
            setErrorPass(true);
            if (txtPasswordRef.current) txtPasswordRef.current.focus();
            return;
        }

        if (txtID === "admin" && txtPassword === "1234") {
            onLoginSuccess();
        } else {
            alert("아이디 또는 패스워드가 틀립니다.");
            setTxtID("");
            setTxtPassword("");
            if (txtIDRef.current) txtIDRef.current.focus();
        }
    };

    const handleExitClick = () => {
        if (confirm("프로그램을 종료하시겠습니까?")) {
            window.close();
        }
    };

    return (
        <Card className="frmLogin-container">
            <SectionHeader
                title="환영합니다."
                subtitle="KYcare 로그인하세요"
                className="frmLogin-header"
            />

            <Input
                label="아이디"
                icon={User}
                placeholder="Enter your ID"
                value={txtID}
                onChange={(e) => { setTxtID(e.target.value); setErrorID(false); }}
                ref={txtIDRef}
                error={errorID}
                autoComplete="off"
            />

            <Input
                label="암호"
                type="password"
                icon={Lock}
                placeholder="Enter your password"
                value={txtPassword}
                onChange={(e) => { setTxtPassword(e.target.value); setErrorPass(false); }}
                ref={txtPasswordRef}
                error={errorPass}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleConfirmClick();
                }}
            />

            <div className="button-group">
                <Button
                    variant="primary"
                    onClick={handleConfirmClick}
                    icon={LogIn}
                >
                    로그인
                </Button>

                <Button
                    variant="secondary"
                    onClick={handleExitClick}
                    icon={X}
                >
                    종료
                </Button>
            </div>
        </Card>
    );
}
