import { useContext, useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Button,
} from "@material-tailwind/react";
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from "yup";
import ClipLoader from "react-spinners/ClipLoader";
import { AuthContext } from "../AppContext/AppContext";
import { auth, onAuthStateChanged } from '../firebase/firebase';

const Login = () => {
    const { signInWithGoogle, loginWithEmailAndPassword } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/");
            }
        });

        return () => unsubscribe(); // Clean up subscription
    }, [navigate]);

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Required"),
            password: Yup.string()
                .required("Required")
                .min(6, "Must be at least 6 characters long")
                .matches(/^[a-zA-Z]+$/, "Password can only contain letters"),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            try {
                await loginWithEmailAndPassword(values.email, values.password);
            } catch (error) {
                alert("Login failed. Please check your credentials.");
            } finally {
                setLoading(false);
            }
        },
    });

    return (
        <>
            {loading ? (
                <div className='grid grid-cols-1 justify-items-center items-center h-screen'>
                    <ClipLoader size={150} speedMultiplier={0.5} />
                </div>
            ) : (
                <div className='grid grid-cols-1 justify-items-center items-center h-screen'>
                    <Card className="w-96 absolute left-[35%] top-[20%]">
                        <CardHeader
                            variant="gradient"
                            color="blue"
                            className="mb-4 grid h-28 place-items-center"
                        >
                            <Typography variant="h3" color="white">
                                LOGIN
                            </Typography>
                        </CardHeader>

                        <CardBody className="flex flex-col gap-4">
                            <form onSubmit={formik.handleSubmit}>
                                <div className='mt-4'>
                                    <Input
                                        name='email'
                                        type='email'
                                        className='mb-3'
                                        label="Email"
                                        size="lg"
                                        {...formik.getFieldProps("email")}
                                    />
                                    {formik.touched.email && formik.errors.email && (
                                        <Typography variant='small' color='red'>{formik.errors.email}</Typography>
                                    )}

                                    <Input
                                        name='password'
                                        type='password'
                                        label="Password"
                                        size="lg"
                                        {...formik.getFieldProps("password")}
                                    />
                                    {formik.touched.password && formik.errors.password && (
                                        <Typography variant='small' color='red'>{formik.errors.password}</Typography>
                                    )}
                                </div>

                                <Button fullWidth className='mt-5 bg-blue-600' type='submit'>
                                    Login
                                </Button>
                            </form>
                        </CardBody>
                        <CardFooter className="pt-0">
                            <Button fullWidth className='mb-4 bg-blue-600' onClick={signInWithGoogle}>
                                Sign in with Google
                            </Button>
                            <Link to="/reset">
                                <p variant="small" className="mt-6 text-sm font-bold font-Merriweather text-blue-500 text-center">
                                    Reset the Password
                                </p>
                            </Link>

                            <div className='flex items-center mt-6 font-Merriweather text-balance justify-center'>
                                Don't have an account?
                                <Link to="/register">
                                    <p className="mt-1 text-sm font-bold font-Merriweather text-blue-500 text-center">Register</p>
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </>
    );
}

export default Login;
