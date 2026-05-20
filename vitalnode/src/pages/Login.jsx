import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';

// Login page component that renders the authentication layout and login form
const Login = () => {
    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Sign in to access your healthcare dashboard"
        >
            <LoginForm />
        </AuthLayout>
    );
};

export default Login;
