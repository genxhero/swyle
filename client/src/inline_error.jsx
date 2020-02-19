import React from 'react';

/**
 * Floating error tooltip for auth forms. 
 */

const InlineError = props => {
    const {message, visible} = props;
    return (
        <span className="errors-inline" style={{"visibility":`${visible ? 'visible' : 'hidden'}`}}>
            <div className="error-tooltip-arrow"/><span className="error-message-inline">{message}</span>
        </span>
    )
}

export default InlineError;