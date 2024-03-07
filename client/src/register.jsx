import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';
import ErrorsModal from './errors_modal';
import InlineError from './inline_error';
import { validateEntry } from './helpers';
import REGISTER_USER from './mutations/register';
import CURRENT_USER from './queries/current_user';


const Register = ({ history }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [usernameValid, setUsernameValid] = useState(null);
  const [emailValid, setEmailValid] = useState(null);
  const [passwordValid, setPasswordValid] = useState(null);
  const [errors, setErrors] = useState(null);

  const [registerUser, { loading }] = useMutation(REGISTER_USER, {
    update(cache, { data: { createUser } }) {
      // Update cache if needed
    },
    onError(error) {
      setErrors(error.graphQLErrors);
    }
  });

  const { data: currentUserData } = useQuery(CURRENT_USER);

  useEffect(() => {
    if (errors) {
      $('body').css('overflow', 'hidden');
    } else {
      $('body').css('overflow', 'auto');
    }
  }, [errors]);

  const passwordIsPassword = password.toLowerCase() === 'password';
  const readyToSubmit =
    passwordValid &&
    usernameValid &&
    emailValid &&
    password === passwordConfirm &&
    !passwordIsPassword;

  const handleFormChange = (field) => (event) => {
    const value = event.currentTarget.value;
    switch (field) {
      case 'username':
        setUsername(value);
        setUsernameValid(validateEntry(field, value));
        break;
      case 'email':
        setEmail(value);
        setEmailValid(validateEntry(field, value));
        break;
      case 'password':
        setPassword(value);
        setPasswordValid(validateEntry(field, value));
        break;
      case 'passwordConfirm':
        setPasswordConfirm(value);
        break;
      default:
        break;
    }
  };

  const clearErrors = () => {
    setErrors(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    registerUser({ variables: { email, username, password } }).then((res) => {
      const { token, errors: registerErrors } = res.data.createUser;
      if (token) {
        localStorage.setItem('mlToken', token);
      }
      if (registerErrors) {
        setErrors(registerErrors);
      } else {
        history.push('/');
      }
    });
  };

  if (loading || !currentUserData) {
    return <p>Loading...</p>;
  }

  if (!currentUserData.currentUser) {
    return (
      <div className="session-page">
        <form onSubmit={handleSubmit} className="session-form">
          <h1>Sign Up</h1>
          <span className="session-form-label">Email</span>
          <div className="session-form-input-wrapper">
            <input
              className={`auth-field ${emailValid === false ? 'invalid' : ''}`}
              type="text"
              value={email}
              onChange={handleFormChange('email')}
            />
            <InlineError message={'Please enter a valid email address.'} visible={emailValid === false} />
          </div>
          <span className="session-form-label">Username</span>
          <div className="session-form-input-wrapper">
            <input className={`auth-field ${usernameValid === false ? 'invalid' : ''}`} type="text" value={username}
              onChange={handleFormChange('username')} />
            <InlineError message={"Letters, numbers, hyphens, and underscores only please"} visible={usernameValid === false} />
          </div>
          <span className="session-form-label">Password</span>
          <div className="session-form-input-wrapper">
            <input className={`auth-field ${passwordValid === false ? 'invalid' : ''}`} type="password" value={password}
              onChange={handleFormChange('password')} />
            <InlineError message={"Password must be six characters or more, non-sequential and with fewer than three repeated characters"} visible={passwordValid === false} />
            <InlineError message={"PASSWORD is not a valid password! Go stand in the corner!"} visible={passwordIsPassword} />
          </div>

          <span className="session-form-label">Confirm Password</span>
          <div className="session-form-input-wrapper">
            <input className={`auth-field ${password !== passwordConfirm ? 'invalid' : ''}`} type="password" value={passwordConfirm}
              onChange={handleFormChange('passwordConfirm')} />
            <InlineError message={"Password confirmation must match password"} visible={password !== passwordConfirm} />
          </div>
          <div className="form-footer">
            <input className={`submit ${readyToSubmit ? '' : 'disabled'}`} type="submit" name="Register" disabled={!readyToSubmit} />
          </div>
        </form>
        {errors && <ErrorsModal errors={errors} clearErrors={clearErrors} />}
      </div>
    );
  }

  return <Redirect to="/" />;
};

export default Register;

/**
import React, {Component} from 'react';
import {Redirect } from 'react-router-dom';
import {Query, Mutation} from 'react-apollo';
import mutation from './mutations/register';
import currentUser from './queries/current_user';
import $ from 'jquery';
import ErrorsModal from './errors_modal';
import {validateEntry} from './helpers';
import InlineError from './inline_error';


//  Form for creating a new user. 

class Register extends Component {
    constructor(props) {
        super(props) 
            this.state = {
                username: "",
                email: "",
                password: "",
                passwordConfirm: "",
                usernameValid: null,
                emailValid: null,
                passwordValid: null
            }
        this.handleFormChange = this.handleFormChange.bind(this);
        this.clearErrors = this.clearErrors.bind(this);
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

    
 //    * Nifty trick for making one's error modals appear to cover the entire page when it's really just covering some visible portion.
    
    allowOrPreventScrolling() {
        if (this.state.errors) {
            $('body').css('overflow', 'hidden');
        } else {
            $('body').css('overflow', 'auto');
        }
    }

    render() {
        this.allowOrPreventScrolling();
        const passwordIsPassword = this.state.password.toLowerCase() === "password";
        const readyToSubmit = (this.state.passwordValid && this.state.usernameValid && this.state.emailValid && this.state.password === this.state.passwordConfirm && !passwordIsPassword)
        return (
            <Query query={currentUser}>
                {({ data, error, loading }) => {
                    if (loading) return "...Loading";
                    if (!data.currentUser) {
                        return (
                            <Mutation
                                mutation={mutation}
                                update={(cache, { data: { createUser } }) => {
                                    cache.writeQuery({
                                        query: currentUser,
                                        data: { currentUser: createUser.user }
                                    });
                                }}
                            >
                                {(createUser, { loading: authenticating }) =>
                                    authenticating ? (
                                        "..."
                                    ) : (
                                            <div className="session-page" >
                                                <form onSubmit={event => {
                                                    event.preventDefault();
                                                    createUser({
                                                        variables: {
                                                            email: this.state.email,
                                                            username: this.state.username,
                                                            password: this.state.password,
                                                        }
                                                    }).then(res => {
                                                        const token = res.data.createUser.token
                                                        const errors = res.data.createUser.errors
                                                    
                                                        if (token) {
                                                            localStorage.setItem("mlToken", token)
                                                        }
                                                        if (errors) {
                                                            this.setState({errors})
                                                        } else {
                                                            this.props.history.push('/')
                                                        }           
                                                    }).catch(res => {
                                                            this.setState({ errors: res.graphQLErrors })
                                                        })
                                                }} className="session-form">
                                                    <h1>Sign Up</h1>
                                                    <span className="session-form-label">Email</span>
                                                    <div className="session-form-input-wrapper">
                                                        <input className={`auth-field ${this.state.emailValid === false ? 'invalid' : ''}`} type="text" value={this.state.email}
                                                            onChange={this.handleFormChange('email')} />
                                                        <InlineError message={"Please enter a valid email address."} visible={this.state.emailValid === false} />
                                                    </div>

                                                    <span className="session-form-label">Username</span>
                                                    <div className="session-form-input-wrapper">
                                                        <input className={`auth-field ${this.state.usernameValid === false ? 'invalid' : ''}`} type="text" value={this.state.username}
                                                            onChange={this.handleFormChange('username')}  />
                                                        <InlineError message={"Letters, numbers, hyphens, and underscores only please"} visible={this.state.usernameValid === false} />
                                                    </div>

                                                    <span className="session-form-label">Password</span>
                                                    <div className="session-form-input-wrapper">
                                                        <input className={`auth-field ${this.state.passwordValid === false ? 'invalid' : ''}`}type="password" value={this.state.password}
                                                            onChange={this.handleFormChange('password')} />
                                                        <InlineError message={"Password must be six characters or more, non-sequential and with fewer than three repeated characters"} visible={this.state.passwordValid === false} />
                                                        <InlineError message={"PASSWORD is not a valid password"} visible={passwordIsPassword} />
                                                    </div>

                                                    <span className="session-form-label">Confirm Password</span>
                                                    <div className="session-form-input-wrapper">
                                                         <input className={`auth-field ${this.state.password !== this.state.passwordConfirm ? 'invalid' : ''}`} type="password" value={this.state.passwordConfirm} 
                                                                onChange={this.handleFormChange('passwordConfirm')}  />
                                                        <InlineError message={"Password confirmation must match password"} visible={this.state.password !== this.state.passwordConfirm} />
                                                    </div>
                                                    <div className="form-footer">
                                                        <input className={`submit ${readyToSubmit ? "" : "disabled"}`} type="submit" name="Register" disabled={!readyToSubmit}/>
                                                    </div>
                                                </form>
                                                {this.state.errors && <ErrorsModal errors={this.state.errors} clearErrors={this.clearErrors} />}
                                            </div>
                                        )

                                }
                            </Mutation>
                        );

                    }
                    return <Redirect to="/" />
                }}
            </Query>
        )
    }
}

export default Register;
*/
