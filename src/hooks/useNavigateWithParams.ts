import { useNavigate, useSearchParams } from 'react-router-dom';

export const useNavigateWithParams = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const nav = (newPath: string) => {
        const currentParams = searchParams.toString();
        const navigationPath = currentParams ? `${newPath}?${currentParams}` : newPath;
        navigate(navigationPath);
    };

    return nav;
};
