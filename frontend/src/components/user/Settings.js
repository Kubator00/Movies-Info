import React from "react";
import "./Settings.css";
import {useDispatch, useSelector} from "react-redux";
import {Formik, Form, Field, ErrorMessage} from "formik";
import * as yup from "yup";
import {changePassword, changeEmail, logout} from '../../reducers/userReducer'
import {Navigate} from "react-router-dom";

export default function UserSettings() {
    const {
        email,
        login,
        changePasswordMsg,
        changePasswordError,
        changeEmailMsg,
        changeEmailError
    } = useSelector(state => state.user);
    const dispatch = useDispatch();

    if (changePasswordMsg || changeEmailMsg) {
        dispatch(logout());
        return <Navigate to={'/'}/>
    }


    return (
        <div className={'settings'}>
            <h1>Settings</h1>
            <div className={'accountInfo'}>
                <div className={'accountInfo__header'}>
                    <img src={'./icons/portrait-black.svg'} className={'accountInfo__headerImg'}/>
                    <h2>Account Info</h2>
                </div>
                <div className={'accountInfo__elementList'}>
                    <div className={'accountInfo__element'}><h4 className={'accountInfo__elementHeader'}>E-MAIL:</h4>
                        <span className={'accountInfo__elementValue'}>{email}</span>
                    </div>
                    <div className={'accountInfo__element'}><h4 className={'accountInfo__elementHeader'}>LOGIN:</h4>
                        <span
                            className={'accountInfo__elementValue'}>{login}</span>
                    </div>
                </div>
            </div>
            <div className="settings__form">
                <div className={'accountInfo__header'}>
                    <img src={'./icons/lock.svg'} className={'accountInfo__headerImg'}/>      <h2>Change your
                    password</h2>
                </div>
                {changePasswordError && <h3 style={{"color": "red"}}>{changePasswordError}</h3>}
                <Formik
                    initialValues={{
                        newPassword: "",
                        newPasswordConfirmation: "",
                        currentPassword: ""
                    }}
                    onSubmit={(values) => {
                        dispatch(changePassword({
                            currentPassword: values.currentPassword,
                            newPassword: values.newPassword,
                            email: email
                        }));
                    }}
                    validationSchema={validateChangePassword}
                >
                    <Form>
                        <label htmlFor="newPassword">New password</label>
                        <ErrorMessage name='newPassword' component="div" class='errorMsg'/>
                        <Field type="password" name="newPassword" class="settings__formControl" autoComplete='off'/>

                        <label htmlFor="newPasswordConfirmation">Confirm new password</label>
                        <ErrorMessage name='newPasswordConfirmation' component="div" class='errorMsg'/>
                        <Field type="password" name="newPasswordConfirmation" class="settings__formControl" autoComplete = 'off'/>

                        <label htmlFor="currentPassword">Current password</label>
                        <ErrorMessage name='currentPassword' component="div" class='errorMsg'/>
                        <Field type="password" name="currentPassword" class="settings__formControl"/>

                        <button type="submit" className="settings__button">Update password</button>
                    </Form>
                </Formik>
            </div>
            <div className="settings__form">
                <div className={'accountInfo__header'}>
                    <img src={'./icons/lock.svg'} className={'accountInfo__headerImg'}/>
                    <h2>Change your email </h2>
                </div>
                {changeEmailError && <h3 style={{"color": "red"}}>{changeEmailError}</h3>}
                <Formik
                    initialValues={{
                        newEmail: "",
                        password: "",
                    }}
                    onSubmit={(values) => {
                        dispatch(changeEmail({
                            currentEmail: email,
                            newEmail: values.newEmail,
                            password: values.password
                        }))
                    }}
                    validationSchema={validateChangeEmail}
                >
                    <Form>
                        <label htmlFor="newEmail">New e-mail</label>
                        <ErrorMessage name='newEmail' component="div" class='errorMsg'/>
                        <Field type="text" name="newEmail" class="settings__formControl" autoComplete='off'/>

                        <label htmlFor="password">Current password</label>
                        <ErrorMessage name='password' component="div" class='errorMsg'/>
                        <Field type="password" name="password" class="settings__formControl"/>

                        <button type="submit" className="settings__button">Update e-mail</button>
                    </Form>
                </Formik>
            </div>

        </div>
    )
}

const validateChangeEmail = yup.object().shape({
    newEmail: yup.string()
        .email("Email is incorrect")
        .required("Field is required"),
    password: yup.string()
        .min(3, 'Password must contains at least 3 chars')
        .max(22, 'Password must contains maximum 22 chars')
        .required('Field is required'),
})

const validateChangePassword = yup.object().shape({
    newPassword: yup.string()
        .min(3, 'Password must contains at least 3 chars')
        .max(22, 'Password must contains maximum 22 chars')
        .required('Field is required'),
    newPasswordConfirmation: yup.string()
        .oneOf([yup.ref('newPassword')], 'Passwords are different'),
    currentPassword: yup.string()
        .min(3, 'Password must contains at least 3 chars')
        .max(22, 'Password must contains maximum 22 chars')
        .required('Field is required'),
})