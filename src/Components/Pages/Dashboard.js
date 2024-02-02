import React from 'react';
import './Dashboard.css'
import './Monthview'
import month from './Month.png';
import week from './Week.png';

const Dashboard = () => {
    return (
    <div className="dashboard-container">
        <div className="frame">
            <h3><a href="Monthview">Month View</a></h3>
            <img src={month}/>
        </div>
        <div className="frame">
            <h3><a href="Weekview">Week View</a></h3>
            <img src={week} />
        </div>
    </div>

    );
};

export default Dashboard;
