import React from 'react';
import {MdCheck, MdClose} from 'react-icons/md';

/**
 * Modal which displays upon an attempt to delete an article or image post.
 * 
 * TODO: Figure out whether tis better to import the newCloseModal directly into this component and ONLY pass the callback.
 * Expected Props
 *      title: String - the name of the thing to be deleted
 *      confirm: Function - should make a DELETE request to one's backend; or it could even be used 
 *                          to just remove something from the DOM which only exists in state.
 *      cancel: Function - sets the document's scroll to "auto" and calls a callback
 *      callback: Function - function that is bound to the parent component and sets state through 
 *                           either class setState or hooks
 */

const ConfirmationModal = (props) => {
    const callback = props.callback ? props.callback :  () => {  return 0 }
    return (
        <div className="confirmation-modal">
            <div className="confirmation-dialog">
                <h4>Are you sure you want to delete <span>"{props.title}"</span>?</h4>
                <div className="confirmation-icons" style={{"display": "flex"}}>     
                <MdCheck className="confirmation-yes" onClick={props.confirm} />
                <MdClose className="confirmation-no" onClick={() => props.cancel(callback)} />

                </div>
           
            </div>
        </div>
    );
}

export default ConfirmationModal;