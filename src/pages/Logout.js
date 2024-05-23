import { useEffect } from 'react';
import { useAuth } from '../firebase/auth';
import { useNavigate } from 'react-router-dom';

import CircularProgress from '@mui/joy/CircularProgress';

export default function Logout(){
    const { logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        logout();
        navigate('/login');
    }, [logout, navigate])

    return(
        <CircularProgress />
    );
}