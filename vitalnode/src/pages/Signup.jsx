import AuthLayout from '../components/auth/AuthLayout';
import SignupForm from '../components/auth/SignupForm';

// Signup page component that renders the authentication layout and registration form
const Signup = () => {
    return (
        <AuthLayout
            title="Create Account"
            subtitle="Join VitalNode for professional online consultation"
        >
            <SignupForm />
        </AuthLayout>
    );
};

export default Signup;
