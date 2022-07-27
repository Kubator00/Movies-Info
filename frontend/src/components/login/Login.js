import React, {useState} from "react";
import './Login.css'
import {useDispatch, useSelector} from "react-redux";
import {setLoginPopUp} from "../../reducers/styleReducer";
import * as yup from 'yup';
import {Formik, Form, Field, ErrorMessage} from "formik";
import {fetchLogin, fetchRegister} from "../../reducers/userReducer";
import Loading from "../Lodaing";
import { Navigate } from "react-router-dom";

const validateLogin = yup.object().shape({
    email: yup.string()
        .email('Email is incorrect')
        .required('Field is required'),
    password: yup.string()
        .min(3, 'Password must contains at least 3 chars')
        .max(22, 'Password must contains maximum 22 chars')
        .required('Field is required'),
})

const validateRegister = yup.object().shape({
    email: yup.string()
        .email("Email is incorrect")
        .required("Field is required"),
    login: yup.string()
        .min(5, "Login must contains at least 5 chars")
        .max(20, 'Login must contains maximum 20 chars')
        .matches(/^[\w'\-,.][^_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/, "Login contains invalid characters")
        .required('Field is required'),
    password: yup.string()
        .min(3, 'Password must contains at least 3 chars')
        .max(22, 'Password must contains maximum 22 chars')
        .required('Field is required'),
    passwordConfirmation: yup.string()
        .oneOf([yup.ref('password')], 'Passwords are different')
})


const Register = (props) => {
    const dispatch = useDispatch();
    const {error, registerMsg, setIsRegister} = props;

    return (
        <div className={'signUpContainer'}>
            <div className={'signUp'}>
                <div className={'signUp_cross'}>
                    <h1>Sign In</h1>
                    <img src={'./icons/cross.svg'} onClick={() => {
                        dispatch(setLoginPopUp(false))
                    }} alt={'cross'}/>
                </div>
                {error && <label style={{"color": "red"}}>{error}</label>}
                {registerMsg && <label style={{"color": "green"}}>{registerMsg}</label>}
                <Formik
                    initialValues={{
                        email: "",
                        login: "",
                        password: "",
                        passwordConfirmation: ""
                    }}
                    onSubmit={(values) => {
                        dispatch(fetchRegister(values))
                    }}
                    validationSchema={validateRegister}
                >
                    <Form class="login__form">
                        <label htmlFor="email">Email address</label>
                        <ErrorMessage name='email' component="div" class='login__errorMsg'/>
                        <Field name="email" class="login__formControl" autoComplete='off'/>

                        <label htmlFor="login">Login</label>
                        <ErrorMessage name='login' component="div" class='login__errorMsg'/>
                        <Field name="login" class="login__formControl" autoComplete='off'/>

                        <label htmlFor="password">Password</label>
                        <ErrorMessage name='password' component="div" class='login__errorMsg'/>
                        <Field type='password' name="password" class="login__formControl" autoComplete='off'/>

                        <label htmlFor="passwordConfirmation">Confirm password</label>
                        <ErrorMessage name='passwordConfirmation' component="div" class='login__errorMsg'/>
                        <Field type='password' name="passwordConfirmation" class="login__formControl"
                               autoComplete='off'/>

                        <button type="submit" class="login__button">Sing In</button>
                    </Form>
                </Formik>
                <div>
                    Already have an account? <label style={{color: 'blue', cursor: 'pointer'}} onClick={() => {
                    setIsRegister(false)
                }}>Sing up</label>
                </div>
            </div>
        </div>
    )
}

const LogIn = (props) => {
    const dispatch = useDispatch();
    const {error, setIsRegister} = props;

    return (
        <div className={'signUpContainer'}>
            <div className={'signUp'}>
                <div className={'signUp_cross'}>
                    <h1>Sign In</h1>
                    <img src={'./icons/cross.svg'} onClick={() => {
                        dispatch(setLoginPopUp(false))
                    }} alt={'cross'}/>
                </div>
                {error && <label style={{color: "red"}}>{error}</label>}
                <Formik
                    initialValues={{
                        email: '',
                        password: ''
                    }}
                    onSubmit={(values) => {
                        dispatch(fetchLogin(values));
                    }}
                    validationSchema={validateLogin}
                >
                    <Form className="login__form">
                        <label htmlFor="email">Email</label>
                        <ErrorMessage name='email' component="div" className='login__errorMsg'/>
                        <Field name="email" className="login__formControl"/>
                        <label htmlFor="username">Password</label>
                        <ErrorMessage name='password' component="div" className='login__errorMsg'/>
                        <Field type="password" name="password" className="login__formControl"/>
                        <button type="submit" className="login__button">Sign up</button>
                    </Form>
                </Formik>
                <div>
                    Not a member yet? <label style={{color: 'blue', cursor: 'pointer'}} onClick={() => {
                    setIsRegister(true)
                }}>Sing In</label>
                </div>
            </div>
        </div>
    );
}

export default function Login() {
    const [isRegister, setIsRegister] = useState(false);
    const {isLogin, registerMsg, error, inProgress} = useSelector(state => state.user);
    const dispatch = useDispatch();

    if (inProgress)
        return (<div className={'signUpContainer'}>
            <div className={'signUp'}>
                <Loading/>
            </div>
        </div>)

    if (isLogin) {
        dispatch(setLoginPopUp(false))
        window.location.reload();
    }
    if (isRegister)
        return <Register error={error} setIsRegister={setIsRegister} registerMsg={registerMsg}/>;

    return <LogIn error={error} setIsRegister={setIsRegister}/>
}