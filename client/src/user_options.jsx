import React, {useState} from 'react';
import mutation from './mutations/update_user_color_scheme';
import {graphql} from 'react-apollo';
import currentUser from './queries/current_user';

/**
 * Panel for selecting user preferences.
 *      mutate: Function, provided by graphql.dgdg
 * Future: Split into ColorMenu and other menus when other options become available.
 */

const UserOptions  = (props) => {
    const [colorScheme, changeColorScheme] = useState(props.colorScheme)

    const handleClick = (event) => {
        
        props.mutate({
            variables: { id: props.userId, colorScheme: event.target.getAttribute("name") },
            refetchQueries: [{ query: currentUser }]}).then( res => {
                changeColorScheme(res.data.updateUserColorScheme.colorScheme)
         })
    }
    return (
        <div className={`user-options user-options-${colorScheme}`}>
            <div className={`user-option user-option-${colorScheme}`}>
                <h4>Color Scheme</h4>
                <div onClick={handleClick} name="standard" className={colorScheme === "standard" ? "option option-selected" : "option option-unselected"}>Classic</div>
                <div onClick={handleClick} name="red" className={colorScheme === "red" ? "option option-selected" : "option option-unselected"}>Radical Red</div>
                <div onClick={handleClick} name="green" className={colorScheme === "green" ? "option option-selected" : "option option-unselected"}>Groovy Green</div>
                <div onClick={handleClick} name="bonetrousle" className={colorScheme === "bonetrousle" ? "option option-selected option-selected-bonetrousle" : "option option-unselected"}>Deep Dark</div>
            </div>

        </div>
    )
}

export default graphql(mutation)(UserOptions);