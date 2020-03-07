import React from 'react';

/**
 * A space for commercials where sponsors can roam free.
 * Ads should be amusing, never annoying.
 * Ads can be liked and commented on the same as articles.
 * 
 * TODO: Get adverts from the database using the useQuery Hook
 * @param {} props 
 */

const Adverts = (props) => {
    return (
        <div className="adverts-page">
            <div className="adverts-greeting">             
               <h2>Swyle is brought to you by the following sponsors</h2>
                <h2>Swyle wa goran no suponsaa no teikyou de okurishimasu</h2>
            </div>
            <div className="adverts-index">
                <div className="ad">
                    <h3 className="ad-title">Your Ad Here</h3>
                    <p className="ad-body">Advertise on Swyle! Thanks to the lack of analytics, your company's name will never be hidden!</p>
                </div>
            </div>
        </div>
    )
}

export default Adverts;