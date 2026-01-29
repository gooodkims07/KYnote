import React from 'react';
import './DoctorList.css';

const DoctorList = ({ doctors, selectedDept, selectedDoctor, onSelect }) => {
    return (
        <div className="doctor-list">
            <label className="list-label">담당 의사</label>
            <div className="list-container">
                {selectedDept ? (
                    doctors.map(doctor => (
                        <button
                            key={doctor}
                            className={`doctor-card ${selectedDoctor === doctor ? 'active' : ''}`}
                            onClick={() => onSelect(doctor)}
                        >
                            <div className="doc-avatar">{doctor[0]}</div>
                            <div className="doc-info">
                                <span className="doc-name">{doctor} 교수</span>
                                <span className="doc-dept">{selectedDept}</span>
                            </div>
                        </button>
                    ))
                ) : (
                    <div className="empty-state">진료과를<br />선택하세요</div>
                )}
            </div>
        </div>
    );
};

export default DoctorList;
