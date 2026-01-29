import React from 'react';
import { Stethoscope, ChevronRight } from 'lucide-react';
import './DepartmentList.css';

const DepartmentList = ({ departments, selectedDept, onSelect }) => {
    return (
        <div className="dept-list">
            <label className="list-label">진료과</label>
            <div className="list-container">
                {departments.map(dept => (
                    <button
                        key={dept}
                        className={`list-item ${selectedDept === dept ? 'active' : ''}`}
                        onClick={() => onSelect(dept)}
                    >
                        <div className="row-center">
                            <Stethoscope size={16} />
                            <span>{dept}</span>
                        </div>
                        <ChevronRight size={14} className="arrow" />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DepartmentList;
