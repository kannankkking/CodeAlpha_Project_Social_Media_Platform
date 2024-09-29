import { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Button,
} from "@material-tailwind/react";
import { useFormik } from 'formik';
import * as Yup from "yup";
import ClipLoader from "react-spinners/ClipLoader";
import { AuthContext } from '../AppContext/AppContext';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const { registerWithEmailAndPassword } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/");
                setLoading(false);
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe(); // Clean up subscription
    }, [navigate]);

    const initialValues = {
        name: "",
        email: "",
        password: "",
    };

    const validationSchema = Yup.object({
        name: Yup.string()
            .required("Required")
            .min(4, 'Must be at least 4 characters long')
            .matches(/^[a-zA-Z]+$/, "Name can only contain letters"),
        email: Yup.string()
            .email("Invalid email address")
            .required("Required"),
        password: Yup.string()
            .required("Required")
            .min(6, "Must be at least 6 characters long")
            .matches(/^[a-zA-Z0-9!@#$%^&*]+$/, "Password can only contain letters, numbers, and special characters"),
    });

    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: (values) => {
            const { name, email, password } = values;
            registerWithEmailAndPassword(name, email, password);
            setLoading(true);
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
                    <Card className="w-96">
                        <CardHeader
                            color="gray"
                            className="mb-4 grid h-28 place-items-center bg-blue-600"
                        >
                            <Typography variant="h3" color="white">
                                REGISTER
                            </Typography>
                        </CardHeader>
                        <CardBody className="flex flex-col gap-4">
                            <form onSubmit={formik.handleSubmit}>
                                <div className='mb-2'>
                                    <Input name='name' type='text' label="Name" size="lg" {...formik.getFieldProps("name")} />
                                </div>
                                {formik.touched.name && formik.errors.name && (
                                    <Typography variant='small' color='red'>
                                        {formik.errors.name}
                                    </Typography>
                                )}
                                <div className='mt-4 mb-2'>
                                    <Input name='email' type='email' label="Email" size="lg" {...formik.getFieldProps("email")} />
                                </div>
                                {formik.touched.email && formik.errors.email && (
                                    <Typography variant='small' color='red'>
                                        {formik.errors.email}
                                    </Typography>
                                )}
                                <div className='mt-4 mb-2'>
                                    <Input name='password' type='password' label="Password" size="lg" {...formik.getFieldProps("password")} />
                                </div>
                                {formik.touched.password && formik.errors.password && (
                                    <Typography variant='small' color='red'>
                                        {formik.errors.password}
                                    </Typography>
                                )}
                                <Button fullWidth type='submit' className='mb-4 bg-blue-600'>
                                    Register
                                </Button>
                            </form>
                        </CardBody>
                        <CardFooter className="pt-0">
                            <div className="mt-6 flex font-Merriweather text-base justify-center">
                                Already have an account?
                                <Link to='/login'>
                                    <p className='ml-1 font-bold font-Merriweather text-base text-blue-500'>Login</p>
                                </Link>
                            </div>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </>
    );
}

export default Register;
