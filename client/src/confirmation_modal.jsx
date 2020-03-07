import React from 'react';
import {MdCheck, MdClose} from 'react-icons/md';

/**
 * Modal which displays upon an attempt to delete an article or image post.
 * 
 * Expected Props
 *      title: String - the name of the thing to be deleted
 *      confirm: Function - should make a DELETE request to one's backend; or it could even be used 
 *                          to just remove something from the DOM which only exists in state.
 *      cancel: Function - sets the document's scroll to "auto" and calls a callback
 *      callback: Function - function that is bound to the parent component and sets state through 
 *                           either class setState or hooks
 */

const ConfirmationModal = (props) => {
    return (
        <div className="confirmation-modal">
            <div className="confirmation-dialog">
                <h4>Are you sure you want to delete <span>"{props.title}"</span>?</h4>
                <div className="confirmation-icons" style={{"display": "flex"}}>     
                <MdCheck className="confirmation-yes" onClick={props.confirm} />
                <MdClose className="confirmation-no" onClick={() => props.cancel(props.callback)} />

                </div>
           
            </div>
        </div>
    );
}

export default ConfirmationModal;