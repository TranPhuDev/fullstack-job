import { Button, Result } from "antd";
import { useCurrentApp } from "../context/app.context"
import { Link, useLocation } from "react-router-dom";

interface IProps {
    children: React.ReactNode
}


const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated, user } = useCurrentApp();
    const location = useLocation();

    if (isAuthenticated === false) {
        return (<Result
            status="404"
            title="Not login"
            subTitle="Bạn vui lòng đăng nhập để sử dụng tính năng này."
            extra={<Button type="primary"><Link style={{textDecoration : "none"}} to="/login">Đăng nhập</Link></Button>}
        />)
    }

    const isAdminRoute = location.pathname.includes("admin");
    if (isAuthenticated === true && isAdminRoute === true) {
        const role = user?.role;
        if (role === null) {
            return (<Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={<Button type="primary">


                    <Link style={{textDecoration : "none"}} to={"/"}>Back Home</Link>
                </Button>}
            />)
        }
    }
    return (
        <>
            {props.children}
        </>
    )
}

export default ProtectedRoute