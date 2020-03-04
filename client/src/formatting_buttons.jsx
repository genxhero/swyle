import React from 'react'
import $ from 'jquery';

const FormattingButtons = props => {
    const boldTag = (e) => {
        e.preventDefault();
         let selection = (document.all) ? document.selection.createRange().text : document.getSelection().toString();
         const text = document.getElementById(props.elementId).value;
         text.value = text.value.replace(selection, `**${selection}**`);

         debugger;
    }

    return (
        <div>
            <button name="B" onClick={boldTag} />
        </div>
    )
}
export default FormattingButtons;