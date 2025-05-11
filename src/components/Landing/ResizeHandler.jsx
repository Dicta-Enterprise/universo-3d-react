import { useEffect } from 'react';

const ResizeHandler = ({ setIsMobile }) => {
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setIsMobile]);

    return null;
};

export default ResizeHandler;