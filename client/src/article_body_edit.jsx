/* eslint no-restricted-globals: 0 */  // --> OFF


import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import updateArticleBody from './mutations/update_article_body';
import article from './queries/article';

const ArticleBodyEdit = (props) => {
    const [body, setBody] = useState(props.body);

    const [updateBody] = useMutation(updateArticleBody, {
        refetchQueries: [{ query: article, variables: { id: props.id } }],
        onCompleted: () => {
            props.finishEdit("Body");
        }
    });

    const handleFormChange = (event) => {
        setBody(event.target.value);
        resizeTextArea();
    };

    const resizeTextArea = () => {
        // Resize logic here
    };

    return (
        <div className="edit-body">
            <form
                className="edit-body"
                onSubmit={(event) => {
                    event.preventDefault();
                    updateBody({
                        variables: {
                            body: body,
                            id: props.id
                        }
                    });
                }}
            >
                <textarea
                    id="body-edit"
                    type="textarea"
                    className="edit-body-textarea"
                    wrap="hard"
                    cols="40"
                    onChange={handleFormChange}
                    value={body}
                    style={{ height: `${props.bodyEditHeight}px` }}
                />
                <span className="edit-save-or-cancel">
                    <input
                        type="submit"
                        value="Save"
                        className="confirm-btn-yes"
                        name="Save"
                    />
                    <button
                        onClick={props.cancelEdit}
                        className="confirm-btn-no"
                    >
                        Cancel
                    </button>
                </span>
            </form>
        </div>
    );
};

export default ArticleBodyEdit;


/**
import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import updateArticleBody from './mutations/update_article_body'
import article from './queries/article';

class ArticleBodyEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            body: this.props.body,
            id: this.props.id
        }
        this.handleFormChange = this.handleFormChange.bind(this)
        this.bodyEditHeight = document.getElementById("article-body").offsetHeight;
        this.resizeTextArea = this.resizeTextArea.bind(this)
    }


    handleFormChange(field) {
        return event =>
          this.setState({
             [field]: event.currentTarget.value
          }, this.resizeTextArea);
    }


    resizeTextArea() {
      // const textArea = document.getElementById("body-edit");
      debugger;
    }

    render() {

        return (
          <div className="edit-body">
            <Mutation
              mutation={updateArticleBody}
              update={(cache, { data: { updateArticleBody } }) => {}}
              refetchQueries={[
                { query: article, variables: { id: this.props.id } }
              ]}
            >
              {(updateArticleBody, loading) =>
                !loading ? (
                  "..."
                ) : (
                  <form
                    className="edit-body"
                    onSubmit={event => {
                      event.preventDefault();
                      updateArticleBody({
                        variables: {
                          body: this.state.body,
                          id: this.props.id
                        }
                      }).then(res => {
                        this.props.finishEdit("Body");
                      });
                    }}
                  >
                    <textarea
                      id="body-edit"
                      type="textarea"
                      className="edit-body-textarea"
                      wrap="hard"
                      cols="40"
                      onChange={this.handleFormChange("body")}
                      value={this.state.body}
                      style={{ height: `${this.bodyEditHeight}px` }}
                    />
                    <span className="edit-save-or-cancel">
                      <input
                        type="submit"
                        value="Save"
                        className="confirm-btn-yes"
                        name="Save"
                      />
                      <button
                        onClick={this.props.cancelEdit}
                        className="confirm-btn-no"
                      >
                        Cancel
                      </button>
                    </span>
                  </form>
                )
              }
            </Mutation>
          </div>
        );
    }
}
                   
export default ArticleBodyEdit;

 
 */
