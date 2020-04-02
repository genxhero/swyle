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
            </div>
        </div>
    )
}

export default About;