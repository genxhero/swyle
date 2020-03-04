import React from 'react'
import $ from 'jquery';

const FormattingButtons = props => {
    const  textArea = document.getElementById(props.elementId);
    const boldTag = (e) => {
        e.preventDefault();
         let selection = (document.all) ? document.selection.createRange().text : document.getSelection().toString();
        // debugger;
    }

    return (
        <div>
            <button name="B" onClick={boldTag} />
        </div>
    )
}
export default FormattingButtons;