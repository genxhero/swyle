import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import updateImageDescription from './mutations/update_image_description';
import image from './queries/image';

const ImageDescriptionEdit = ({ id, description, finishEdit, cancelEdit }) => {
    const [newDescription, setNewDescription] = useState(description);

    const [updateDescription, { loading }] = useMutation(updateImageDescription, {
        refetchQueries: [{ query: image, variables: { id: id } }],
    });

    const handleFormChange = (event) => {
        setNewDescription(event.currentTarget.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        updateDescription({
            variables: {
                description: newDescription,
                id: id,
            },
        }).then(res => {
            finishEdit("Description");
        });
    };

    return (
        <div className="edit-title">
            <form className="edit-description" onSubmit={handleSubmit}>
                <input
                    className="edit-description-text"
                    type="text"
                    value={newDescription}
                    onChange={handleFormChange}
                />
                <span className="edit-save-or-cancel">
                    <input type="submit" value="Save" className="confirm-btn-yes" name="Save" />
                    <button onClick={cancelEdit} className="confirm-btn-no" name="Description">Cancel</button>
                </span>
            </form>
        </div>
    );
};

export default ImageDescriptionEdit;


//old code below
/**
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import updateImageDescription from './mutations/update_image_description';
import image from './queries/image';


 // Form for editing the description of an image.
 
class ImageDescriptionEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            description: this.props.description,
            id: this.props.id
        }
        this.handleFormChange = this.handleFormChange.bind(this)
    }

    handleFormChange(field) {
        return event => this.setState({
            [field]: event.currentTarget.value,
        });
    }

    render() {
        return (
            <div className="edit-title">
                <Mutation mutation={updateImageDescription}
                    update={(cache, { data: { updateImageDescription } }) => {
                    }}
                    refetchQueries={[{ query: image, variables: { id: this.props.id } }]}

                >{(updateImageDescription, loading) =>
                    !loading ? (
                        "..."
                    ) : (
                            <form className="edit-description" onSubmit={event => {
                                event.preventDefault();
                                    updateImageDescription({
                                    variables: {
                                        description: this.state.description,
                                        id: this.props.id
                                    }
                                }).then(res => {
                                    this.props.finishEdit("Description");
                                })
                            }}>
                                <input className="edit-description-text" type="text" value={this.state.description} onChange={this.handleFormChange("description")}></input>
                                <span className="edit-save-or-cancel">
                                    <input type="submit" value="Save" className="confirm-btn-yes" name="Save" />
                                    <button onClick={this.props.cancelEdit} className="confirm-btn-no" name="Description">Cancel</button>
                                </span>
                            </form>
                        )}
                </Mutation>

            </div>
        )
    }
}

export default ImageDescriptionEdit;
*/
