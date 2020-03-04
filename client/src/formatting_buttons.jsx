import React from 'react'
import PropTypes from 'prop-types'

/**
 * 
 * Only finds the first instance. Hm. Gonna need to find the index of the substring I reckon.
 * Also doesn't update state, so need to update state.
 * Also need to get rid of trailing spaces.
 */
const FormattingButtons = props => {

    const tagWrap = (e) => {
        e.preventDefault();
        const input = document.getElementById(props.elementId);
        const text = input.value;
        const start = input.selectionStart;
        const finish = input.selectionEnd;
        const sel = text.substring(start, finish);
        const tag = e.target.getAttribute("name");
        const newText = text.substring(0, start) + tag + sel + tag + text.substring(finish, text.length);
        input.value = newText;
        props.updateState(newText);
    }

    return (
        <div className="formatting-section">
            <button className="formatting-button" value="B" name="**" onClick={tagWrap}>B</button>
            <button className="formatting-button" value="I" name="*" onClick={tagWrap}>I</button>
        </div>
    )
}
export default FormattingButtons;