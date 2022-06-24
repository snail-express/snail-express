import { Link, useNavigate } from 'react-router-dom';
import { useClass } from '../contexts/ClassContext';
import NavigationBar from "../components/NavigationBar";
import SideBar from "../components/SideBar"
import FeedbackSettings from './FeedbackSettings';
import { Button } from 'react-bootstrap';

export default function ClassDashBoard() {
    const { currentClass, setCurrentClass } = useClass();
    const navigate = useNavigate()
    const sidebarLinks = [['/class-dashboard', 'Students'],
                        ['/class-dashboard', 'Tutors'],
                        ['/settings-general', 'Settings']];
    function handleClick() {
        setCurrentClass(null);
    }
    
    function navigateFeedbackSettings() {
        navigate("/feedbacksettings");
    }

    return (
        <>
            <NavigationBar />
            <div className='d-flex'>
                <SideBar links={sidebarLinks}/>
            <div className='d-flex justify-content-between p-4 w-100'>
                <span className='fs-1'>{currentClass ? currentClass.className : ''}
                <br></br> 
                <button className='btn btn-primary fs-5' onClick={navigateFeedbackSettings}>Go to Feedback Settings</button>
            </span>
                <span>
                    <Link to='/dashboard'>
                        <button className='btn btn-secondary fs-4' onClick={handleClick}>
                            Back to dashboard
                        </button>
                    </Link>
                </span>
            </div>
            
            </div>
        </>

    );
}