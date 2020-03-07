import React from 'react'
/**
 * Information about the website, the project, the app.
 * Props
 * 
 * colorScheme: String
 */
const About = (props) => {
    return (
        <div className={`about-page about-page-${props.colorScheme}`}>
            <h1>About Swyle</h1>
            <div className="about-section">
                <h2>Mission</h2>
                <p>To create a better blogging experience.  Swyle is a platform with a devil-may-care attitude regarding content.</p>
                <h3>Core Principles</h3>
                <ul>
                    <li>Users have a right to free speech - the only content prohibited on Swyle are threats, solicitation, and the depiction of minors</li>
                    <li>Users have a right to not have their posts hidden by algorithms - no shadow banning, and no treating any post as "irrelevant".</li>
                    <li>Users have a right to not be spied on</li>
                    <li>Users have a right to non-obtrusive advertising - adverts will be placed in a manner that they do not interfere in browsing, reading, posting, or editing</li>
                    <li>Users come before advertisers.</li>
                </ul>
            </div>
        </div>
    )
}

export default About;