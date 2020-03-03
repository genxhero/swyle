import React from 'react'

const FormattingButtons = props => {
    const boldTag = (e) => {
        e.preventDefault();
        document.execCommand('bold');
        // let selection = (document.all) ? document.selection.createRange().text : document.getSelection().toString();
        // debugger;
    }

    return (
        <div>
            <button name="Bold" onClick={boldTag} />
        </div>
    )
}
export default FormattingButtons;