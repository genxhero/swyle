/**
 * The app's main header.  Contains session (login, logout, register) buttons and search bar.
 * Expected Props
 *      currentUser: Object - the user currently in session.
 */

import React, { useState, useEffect} from 'react';
import NavBar from './navbar';
import logout from './mutations/logout';
import { useQuery, useMutation } from '@apollo/client';
import currentUserQuery from './queries/current_user';
import HeaderSearch from './header_search';
import { Link } from 'react-router-dom';
import { FaRegNewspaper, FaImage } from 'react-icons/fa';

const Header = (props) => {
    const [currentUser, setCurrentUser] = useState(props.currentUser);
    const colorScheme = props.colorScheme;
    const { data } = useQuery(currentUserQuery);
    const [logoutMutation] = useMutation(logout);

    // Update currentUser state when data changes
    useEffect(() => {
        if (data && data.currentUser) {
            setCurrentUser(data.currentUser);
        } else {
            setCurrentUser(null);
        }
    }, [data]);

    const handleLogout = async () => {
        try {
            await logoutMutation({
                refetchQueries: [{ query: currentUserQuery }]
            });
            setCurrentUser(null);
            localStorage.removeItem("mlToken");
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <div className={`header header-${colorScheme}`}>
            <div className="header-top">
                <div className="header-site-name" />
                <HeaderSearch colorScheme={colorScheme} />
                {!currentUser ? (
                    <div className="header-session-buttons">
                        <Link to="/login" className="header-login">Login</Link>
                        <Link to="/register" className="header-register">Register</Link>
                    </div>
                ) : (
                    <div className="header-personal-greeting">
                        <h3>Hello, {currentUser.username || "nobody"} </h3>
                        <button className={`header-login ${colorScheme}`} onClick={handleLogout}>Logout</button>
                    </div>
                )}
                <div className="new-post-buttons">
                    <Link className={`new-post-btn new-post-btn-${colorScheme}`} to="/images/new" style={{ "right": "0" }}><FaImage /></Link>
                    <Link className={`new-post-btn new-post-btn-${colorScheme}`} to="/articles/new"><FaRegNewspaper /></Link>
                </div>
            </div>
            <NavBar colorScheme={colorScheme} />
        </div>
    );
};

export default Header;

/**
import React, {Component} from 'react';
import NavBar from './navbar';
import logout from './mutations/logout';
import {Link} from 'react-router-dom'
import {graphql} from 'react-apollo';
import currentUser from './queries/current_user';
import HeaderSearch from './header_search';
import { FaRegNewspaper, FaImage}from 'react-icons/fa';

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shutUpLint: true,
            currentUser: this.props.currentUser
        }
        this.logout = this.logout.bind(this)
    }

    componentWillReceiveProps(newProps) {
        if (this.props.currentUser !== newProps.currentUser) {
            this.setState({ currentUser: newProps.currentUser})
        }
    }

//Logs the user out, then resets the store.
//* TODO: Figure out what is causing the invariant violation.
     
    logout () {
        this.props.mutate({ 
            refetchQueries: [{ query: currentUser }],
            // update: (cache) => cache.writeQuery({
            //     query: currentUser,
            //     data: { currentUser: null },
            // })
            // update: cache => cache.reset()
        })
            .then( res => {
                this.props.client.resetStore();
                localStorage.setItem("mlToken", res.data.logout.email);
                this.setState({ currentUser: null })
        })
    }

    render() {
        const colorScheme = this.props.colorScheme;
        return (
            <div className={`header header-${colorScheme}`}>
                <div className="header-top" >
                    <div className="header-site-name" />
                    <HeaderSearch colorScheme={colorScheme}/>
                    {
                        !this.state.currentUser ?
                                                
                    <div className="header-session-buttons">
                        <Link to="/login" className="header-login">Login</Link>
                        <Link to="/register" className="header-register">Register</Link>
                    </div>
                    :
                    <div className="header-personal-greeting">
                        <h3>Hello, {this.state.currentUser.username || "nobody"} </h3>
                        <button className={`header-login ${colorScheme}`} onClick={this.logout}>Logout</button>
                    </div>
                    }
                    <div className="new-post-buttons">
                        <Link className={`new-post-btn new-post-btn-${colorScheme}`} to="/images/new" style={{"right":"0"}}><FaImage /></Link>/>
                        <Link className={`new-post-btn new-post-btn-${colorScheme}`} to="/articles/new"><FaRegNewspaper /></Link>
                    </div>
                </div>
                <NavBar colorScheme={colorScheme}/>
            </div>
        )

    }
}

export default graphql(logout)(Header);
*/
