import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Redirect } from 'react-router-dom';
import gql from 'graphql-tag';
import moment from 'moment';
import axios from 'axios';

const ImageCreate = ({ colorScheme, history }) => {
    const [errors, setErrors] = useState(null);
    const [image, setImage] = useState(null);
    const [photoURL, setPhotoURL] = useState(null);
    const [fileTooBig, setFileTooBig] = useState(false);
    const [invalidType, setInvalidType] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const formatFilename = (filename) => {
        const date = moment().format('MMDDYYYY');
        const rando = Math.random().toString(36).substring(2, 7);
        const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const newFileName = `images/${date}-${rando}-${cleanFileName}`;
        return newFileName.substring(0, 60);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file.size > 1000000) {
            setFileTooBig(true);
            setImage(null);
            setPhotoURL(null);
            return;
        }

        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            setImage(file);
            setPhotoURL(fileReader.result);
            setFileTooBig(false);
            setInvalidType(false);
        };
        fileReader.readAsDataURL(file);
    };

    const handleFormChange = (setter) => (event) => setter(event.currentTarget.value);

    const [signS3] = useMutation(S3_SIGN);

    const uploadToS3 = async (file, signedRequest) => {
        const options = {
            headers: {
                'Content-Type': file.type,
                'Access-Control-Allow-Origin': '*',
                'X-Requested-With': 'XMLHttpRequest'
            }
        };
        try {
            await axios.put(signedRequest, file, options);
            console.log('TODO: Get a real logger');
        } catch (error) {
            setErrors(['Upload failed at the S3 bucket level, please reach out to the web master.']);
        }
    };

    const [postImage] = useMutation(POST_IMAGE, {
        onCompleted: (data) => {
            history.push(`/images/${data.createImagePost.id}`);
        }
    });

    const save = async (e) => {
        e.preventDefault();
        const response = await signS3({
            variables: {
                filename: formatFilename(image.name),
                filetype: image.type
            }
        });
        const { signedRequest, url } = response.data.signS3;
        await uploadToS3(image, signedRequest);
        postImage({ variables: { title, description, image: url } });
    };

    const { loading, data } = useQuery(CURRENT_USER);

    if (loading) return <p>Loading</p>;
    if (!data.currentUser) return <Redirect to="/login" />;

    return (
        <div className={`image-creation-page ${colorScheme}`}>
            <div className="image-input-container">
                {image ? (
                    <div className={`image-creation-preview ${colorScheme}`}>
                        <img src={photoURL} alt="Preview" />
                    </div>
                ) : (
                    <div className={`image-creation-placeholder ${colorScheme}`}>
                        <p>Your image will appear here in preview</p>
                    </div>
                )}
            </div>
            <form onSubmit={save} className={`image-creation-form ${colorScheme}`}>
                <h1>Post a New Image</h1>
                <label className="image-input">
                    <input
                        className={`image-input ${colorScheme}`}
                        type="file"
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/gif, image/bmp, image/jpg"
                    />
                </label>
                <input
                    className={`image-creation-title ${colorScheme}`}
                    type="text"
                    onChange={handleFormChange(setTitle)}
                    placeholder="Image Title"
                    value={title}
                />
                <input
                    className={`image-creation-desc ${colorScheme}`}
                    type="text"
                    onChange={handleFormChange(setDescription)}
                    placeholder="Description (optional)"
                    value={description}
                />
                <input type="submit" className={`submit ${colorScheme}`} value="Post Image" disabled={!image} />
            </form>
        </div>
    );
};

const CURRENT_USER = gql`
    query {
        currentUser {
            id
            username
        }
    }
`;

const S3_SIGN = gql`
    mutation SignS3($filename: String!, $filetype: String!) {
        signS3(filename: $filename, filetype: $filetype) {
            url
            signedRequest
        }
    }
`;

const POST_IMAGE = gql`
    mutation PostImage($title: String!, $description: String, $image: String!) {
        createImagePost(title: $title, description: $description, image: $image) {
            id
        }
    }
`;

export default ImageCreate;


/**
import React, {Component} from 'react';
import postImage from './mutations/post_image';
import currentUser from './queries/current_user';
import {graphql} from 'react-apollo';
import * as compose from 'lodash.flowright';
import gql from 'graphql-tag';
import moment from 'moment';
import axios from 'axios';
import { Redirect } from 'react-router-dom';


class ImageCreate extends Component {
    constructor(props) {
        super(props)
        this.state = { 
            errors: null,
            image: null, 
            fileTooBig: false, 
            invalidType: false, 
            imageURL: null, 
            title: "", 
            description: ""}
        this.handleFileChange = this.handleFileChange.bind(this)
        this.handleFormChange = this.handleFormChange.bind(this)
        this.save = this.save.bind(this)
        this.formatFilename = this.formatFilename.bind(this)
        this.uploadToS3 = this.uploadToS3.bind(this)
    }

    handleFileChange(e) {
        const file = e.target.files[0];
      
        if (file.size > 1000000) {
            this.setState({ fileTooBig: true, image: null, photoURL: null })
            return false;
        }
        const fileReader = new FileReader();
        fileReader.onloadend = () => {
            this.setState({ image: file, photoURL: fileReader.result, fileTooBig: false, invalidType: false });
        }
        fileReader.readAsDataURL(file);
        
   }

    handleFormChange(field) {
        return event => this.setState({
            [field]: event.currentTarget.value,
        });
    }

  
    formatFilename(filename) {
        const date = moment().format("MMDDYYYY");
        const rando = Math.random()
            .toString(36)
            .substring(2, 7);
        const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, "-");
        const newFileName = `images/${date}-${rando}-${cleanFileName}`
        return newFileName.substring(0, 60);
    }

    async uploadToS3(file, signedRequest) {
        const options = {
            headers: {
                "Content-Type": file.type,
                "Access-Control-Allow-Origin": "*",
                'X-Requested-With': 'XMLHttpRequest'
            }
        }
        await axios.put(signedRequest, file, options)
            .then(res => {
               console.log("TODO: Get a real logger")
            }).catch(
                this.setState({errors: ["Upload failed at the S3 bucket level, pleaase reach out to the web master."] })     
                );
    }

   async save(e) {
       e.preventDefault();
       const image = this.state.image;
       const response = await this.props.s3Sign({
           variables: {
               filename: this.formatFilename(image.name),
               filetype: image.type
           }
       });
       const { signedRequest, url } = response.data.signS3;
       await this.uploadToS3(image, signedRequest)
       this.props.mutate({
           variables: {
               title: this.state.title,
               description: this.state.description,
               image: url
           }
       }).then(res =>{
           this.props.history.push(`/images/${res.data.createImagePost.id}`)
       })
   }

   render() {
       if (this.props.data.loading) {
           return<p>Loading</p>
       }
       if (!this.props.data.currentUser) {
           return <Redirect to="/login" />
       }
       return (
        <div className={`image-creation-page ${this.props.colorScheme}`}>
               <div className="image-input-container">
                   {this.state.image ? <div className={`image-creation-preview ${this.props.colorScheme}`}><img src={this.state.photoURL} alt="Preview"/></div> : <div className={`image-creation-placeholder ${this.props.colorScheme}`}><p>Your image will appear here in preview</p></div>}
               </div>
            <form onSubmit={this.save} className={`image-creation-form ${this.props.colorScheme}`}>
                   <h1>Post a New Image</h1>
               <label className="image-input">
                   <input className={`image-input ${this.props.colorScheme}`}
                       type="file"
                       onChange={this.handleFileChange}
                       accept="image/png, image/jpeg, image/gif, image/bmp, image/jpg"
                   />
                   </label>
             
                <input className={`image-creation-title ${this.props.colorScheme}`} type="text" onChange={this.handleFormChange("title")} placeholder="Image Title" value={this.state.title}/>
                <input className={`image-creation-desc ${this.props.colorScheme}`} type="text" onChange={this.handleFormChange("description")} placeholder="Description (optional)" value={this.state.description}/>
                   <input type="submit" className={`submit ${this.props.colorScheme}`} value="Post Image" disabled={!this.state.image}/>
               </form>
        </div>
      )
   }
}


// * AWS mojo. 
// * TODO: Write a better comment.
 
const s3Sign = gql`
  mutation($filename: String!, $filetype: String!) {
    signS3(filename: $filename, filetype: $filetype) {
        url
        signedRequest
    }
  }
`;

export default compose(
    graphql(s3Sign, { name: "s3Sign" }),
    graphql(currentUser)
)(
    graphql(postImage)(ImageCreate)
) 

*/
