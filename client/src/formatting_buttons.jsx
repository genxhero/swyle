import React from 'react'
import $ from 'jquery';

/**
 * 
 * Only finds the first instance. Hm. Gonna need to find the index of the substring I reckon.
 * Also doesn't update state, so need to update state.
 */
const FormattingButtons = props => {

    const boldTag = (e) => {
         e.preventDefault();
         let selection = (document.all) ? document.selection.createRange().text : document.getSelection().toString();
         const input = document.getElementById(props.elementId);
         const text = input.value;
         input.value = text.replace(selection, `**${selection}**`);
    }

    return (
        <div>
            <button name="B" onClick={boldTag} />
        </div>
    )
}
export default FormattingButtons;