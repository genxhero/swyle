import React from 'react';

/**
 * Expected Props:
 *    message: String, text to be displayed.
 *    visibility: Boolean, whether the component can be seen.
 */

const Tooltip = props => {
    const {message, visibility} = props;
    console.log(message, visibility)
    return (
        <span className={`tooltip ${visibility === true ? 'visible' : 'hidden'}`}>
            <div className="tooltip-arrow" /><span>{message}</span>
        </span>
    )
}

export default Tooltip;