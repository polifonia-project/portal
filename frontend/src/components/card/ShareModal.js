import React from "react";
import classes from "./ShareModal.module.css";
import { ShareSocial } from 'react-share-social'

function ShareModal(props) {

  const handleParentClick = event => {
    event.preventDefault();

    if (event.target === event.currentTarget) {
      props.changeDisplay(false)
    }
  };

  const style = {
    root: {
      backgroundColor: '#f4edec',
      borderRadius: '8px',
      border: 0,
      boxShadow: 'rgb(124 123 123 / 13%) -1px 5px 30px 1px',
      color: 'grey',
      width: '80vw',
      marginBottom: '30px',
      padding: '12px 20px 30px 30px'
    },
    copyContainer: {
      backgroundColor: 'rgb(217 214 214)',
      borderRadius: '8px',
      border: 0,
      boxShadow: 'rgb(124 123 123 / 13%) -1px 5px 30px 1px',
      color: 'black !important'
    }
  };



  return (
    <div className={classes.modalContainer} style={{ visibility: props.display ? "visible" : "hidden", opacity: props.display ? "1" : "0", }}
       onClick={handleParentClick}>
      <span>
      <button className={classes.closeButton} onClick={() => props.changeDisplay(false)}>╳</button>
      <ShareSocial
        url={props.url}
        socialTypes={['facebook', 'twitter', 'whatsapp', 'linkedin', 'telegram', 'reddit']}
        onSocialButtonClicked={data => console.log(data)}
        style={style}
      />
      </span>
    </div>
  );
}


export default ShareModal;