import React from 'react'

const FormattingButtons = props => {
    const boldTag = (e) => {
        e.preventDefault();
        let t = (document.all) ? document.selection.createRange().text : document.getSelection();
        debugger;
    }

    return (
        <div>
            <button name="Bold" onClick={boldTag} />
        </div>
    )
}
export default FormattingButtons;