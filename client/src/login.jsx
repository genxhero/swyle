/* eslint-disable */


/* eslint-disable */
import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import signInUserMutation from './mutations/sign_in_user';
import currentUserQuery from './queries/current_user';
import $ from 'jquery';
import ErrorsModal from './errors_modal';
import { Redirect } from 'react-router-dom';
import { validateEntry } from './helpers';
import InlineError from './inline_error';

/**
 * User log in form
 */
const Login = (props) => {
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [passwordValid, setPasswordValid] = useState(null);
    const [emailValid, setEmailValid] = useState(null);
    const [errors, setErrors] = useState(null);

    const demoLogin = (event) => {
        event.preventDefault();
        setEmail("demo@demo.com");
        setPassword("demodemo");
        setPasswordValid(true);
        setEmailValid(true);
        const submit = document.getElementById("form-submit");
        submit.click();
    }

    const clearErrors = () => {
        setErrors(null);
    }

    const handleFormChange = (field) => {
        return (event) => {
            if (field === 'email') {
                setEmail(event.currentTarget.value);
                setEmailValid(validateEntry(field, event.currentTarget.value));
            } else {
                setPassword(event.currentTarget.value);
                setPasswordValid(validateEntry(field, event.currentTarget.value));
            }
        }
    }

    const allowOrPreventScrolling = () => {
        if (errors) {
            $('body').css('overflow', 'hidden');
        } else {
            $('body').css('overflow', 'auto');
        }
    }

    allowOrPreventScrolling();

    const readyToSubmit = (passwordValid && emailValid);

    const { loading, data } = useQuery(currentUserQuery);

    if (loading) return "...Loading";

    if (!data.currentUser) {
        const [signInUser, { loading: authenticating }] = useMutation(signInUserMutation, {
            update(cache, { data: { signInUser } }) {
                cache.writeQuery({
                    query: currentUserQuery,
                    data: { currentUser: signInUser.user }
                });
            }
        });

        return (
            authenticating ? "..." :
                <div className="session-page">
                    <form onSubmit={(event) => {
                        event.preventDefault();
                        signInUser({
                            variables: {
                                email: email,
                                password: password
                            }
                        }).then(res => {
                            const token = res.data.signInUser.token
                            if (token) {
                                localStorage.setItem("mlToken", token)
                            }
                        }).then(() => {
                            props.history.push('/dashboard')
                        })
                            .catch(res => {
                                setErrors(res.graphQLErrors);
                            })
                    }} className="session-form">
                        <h1>Log In</h1>
                        <span className="session-form-label">Email</span>
                        <div className="session-form-input-wrapper">
                            <input className={`auth-field ${emailValid === false ? 'invalid' : ''}`} type="text" value={email}
                                onChange={handleFormChange('email')} />
                            <InlineError message={"Please enter a valid email address."} visible={emailValid === false} />
                        </div>

                        <span className="session-form-label">Password</span>
                        <div className="session-form-input-wrapper">
                            <input className={`auth-field ${passwordValid === false ? 'invalid' : ''}`} type="password" value={password}
                                onChange={handleFormChange('password')} />
                            <InlineError message={"Password must be six characters or more, non-sequential and with fewer than three repeated characters"} visible={passwordValid === false} />
                        </div>
                        <div className="form-footer">
                            <input id="form-submit" className={`submit ${readyToSubmit ? "" : "disabled"}`} type="submit" name="Register" disabled={!readyToSubmit} />
                            <button className="demo-login" onClick={demoLogin}>DEMO!</button>
                        </div>
                    </form>
                    {errors && <ErrorsModal errors={errors} clearErrors={clearErrors} />}
                </div>
        );
    }
    return <Redirect to="/" />;
}

export default Login;

/**
import React, { Component, useRef } from 'react'
import { graphql } from 'react-apollo';
import { Query, Mutation } from "react-apollo";
import mutation from './mutations/sign_in_user';
import currentUser from './queries/current_user';
import $ from 'jquery';
import ErrorsModal from './errors_modal';
import {Redirect} from 'react-router-dom';
import { validateEntry } from './helpers';
import InlineError from './inline_error';



class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            password: "",
            email: "",
            passwordValid: null,
            emailValid: null,
            errors: null
        }
        this.handleFormChange = this.handleFormChange.bind(this);
        this.clearErrors = this.clearErrors.bind(this);
        this.demoLogin = this.demoLogin.bind(this);
    }

     demoLogin(event) {
        event.preventDefault(); 
        this.setState({ email: "demo@demo.com", password: "demodemo", passwordValid:true, emailValid: true}, () => {
           const submit = document.getElementById("form-submit");
           submit.click();
        });
    }



    clearErrors() {
        this.setState({ errors: null })
    }

    handleFormChange(field) {
        return event => this.setState({
            [field]: event.currentTarget.value,
            [`${field}Valid`]: validateEntry(field, event.currentTarget.value)
        });
    }

    allowOrPreventScrolling() {
        if (this.state.errors) {
            $('body').css('overflow', 'hidden');
        } else {
            $('body').css('overflow', 'auto');
        }
    }

    render() {
        this.allowOrPreventScrolling();
        const readyToSubmit = (this.state.passwordValid &&  this.state.emailValid )

        return (
            <Query query={currentUser}>
                {({ data, loading }) => {
                if (loading) return "...Loading";
                if (!data.currentUser) {
                    return (
                    <Mutation
                        mutation={mutation}
                            update={(cache, { data: { signInUser } }) => {
                            cache.writeQuery({
                                query: currentUser,
                                data: { currentUser: signInUser.user }
                                    });
                                }}
                        >
                            {(signInUser, { loading: authenticating }) =>
                            authenticating ? (
                                "..."
                            ) :  (
                                <div className="session-page" >
                                    <form onSubmit={event => {
                                                event.preventDefault();
                                                signInUser({
                                                    variables: {
                                                        email: this.state.email,
                                                        password: this.state.password
                                                    }
                                                }).then(res => {
                                                    const token = res.data.signInUser.token
                                                    if (token) {
                                                        localStorage.setItem("mlToken", token)
                                                    }

                                                }).then(() => {
                                                    this.props.history.push('/dashboard')
                                                })
                                                    .catch(res => {
                                                        this.setState({ errors: res.graphQLErrors })
                                                    })
                                    }} className="session-form">
                                        <h1>Log In</h1>
                                        <span className="session-form-label">Email</span>
                                        <div className="session-form-input-wrapper">
                                            <input className={`auth-field ${this.state.emailValid === false ? 'invalid' : ''}`} type="text" value={this.state.email}
                                                   onChange={this.handleFormChange('email')} />
                                            <InlineError message={"Please enter a valid email address."} visible={this.state.emailValid === false} />
                                        </div>

                                        <span className="session-form-label">Password</span>
                                        <div className="session-form-input-wrapper">
                                            <input className={`auth-field ${this.state.passwordValid === false ? 'invalid' : ''}`} type="password" value={this.state.password}
                                                    onChange={this.handleFormChange('password')} />
                                            <InlineError message={"Password must be six characters or more, non-sequential and with fewer than three repeated characters"} visible={this.state.passwordValid === false} />
                                            </div>
                                        <div className="form-footer">
                                            <input id="form-submit" className={`submit ${readyToSubmit ? "" : "disabled"}`} type="submit" name="Register" disabled={!readyToSubmit} />
                                            <button className="demo-login" onClick={this.demoLogin}>DEMO!</button>
                                        </div>
                                    </form>
                                    { this.state.errors && <ErrorsModal errors={this.state.errors} clearErrors={this.clearErrors} /> }
                                </div>
                                )

                }
                </Mutation>
                );
            }
            return <Redirect to="/" />
            }}
            </Query>
         );
      }
}


export default(Login);
*/
