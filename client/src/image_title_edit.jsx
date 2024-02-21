import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import updateImageTitle from './mutations/update_image_title';
import image from './queries/image';

const ImageTitleEdit = (props) => {
    const [title, setTitle] = useState(props.title);

    const [updateImageTitleMutation, { loading }] = useMutation(updateImageTitle, {
        refetchQueries: [{ query: image, variables: { id: props.id } }]
    });

    const handleFormChange = (field) => {
        return event => setTitle(event.currentTarget.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        updateImageTitleMutation({
            variables: {
                title: title,
                id: props.id
            }
        }).then(res => {
            props.finishEdit("Title");
        });
    };

    return (
        <div className="edit-title">
            <form className="edit-title" onSubmit={handleSubmit}>
                <input className="edit-title-text" type="text" value={title} onChange={handleFormChange("title")}></input>
                <span className="edit-save-or-cancel">
                    <input type="submit" value="Save" className="confirm-btn-yes" name="Save" />
                    <button onClick={props.cancelEdit} className="confirm-btn-no" name="Title">Cancel</button>
                </span>
            </form>
        </div>
    );
};

export default ImageTitleEdit;

/**
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import updateImageTitle from './mutations/update_image_title'
import image from './queries/image';

class ImageTitleEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: this.props.title,
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
                <Mutation mutation={updateImageTitle}
                    update={(cache, { data: { updateImageTitle } }) => {
                    }}
                    refetchQueries={[{ query: image, variables: { id: this.props.id } }]}

                >{(updateImageTitle, loading) =>
                    !loading ? (
                        "..."
                    ) : (
                            <form className="edit-title" onSubmit={event => {
                                event.preventDefault();
                                    updateImageTitle({
                                    variables: {
                                        title: this.state.title,
                                        id: this.props.id
                                    }
                                }).then(res => {
                                    this.props.finishEdit("Title");
                                })
                            }}>
                                <input className="edit-title-text" type="text" value={this.state.title} onChange={this.handleFormChange("title")}></input>
                                <span className="edit-save-or-cancel">
                                    <input type="submit" value="Save" className="confirm-btn-yes" name="Save" />
                                    <button onClick={this.props.cancelEdit} className="confirm-btn-no" name="Title">Cancel</button>
                                </span>
                            </form>
                        )}
                </Mutation>

            </div>
        )
    }
}

export default ImageTitleEdit;
*/
