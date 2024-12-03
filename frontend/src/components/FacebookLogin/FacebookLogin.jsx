import React from 'react';
import FacebookLogin from 'react-facebook-login';
import btnFacebook from './fblogin.css' 

const LoginForm = (props) => {
  const handleFacebookCallback = (response) => {
    if (response?.status === "unknown") {
        console.error('Sorry!', 'Something went wrong with facebook Login.');
     return;
    }
    console.log(response);
   }

  return (
    <FacebookLogin 
      buttonStyle={{padding: "3px", height: "auto", width: "auto", minHeight: "0", minWidth: "0"}}  
      appId="1240499260516780"  
      autoLoad={false}  
      fields="name,email,picture"  
      cssClass="btnFacebook"
      callback={handleFacebookCallback}
      icon= "fa-facebook"
      textButton = "&nbsp;&nbsp;Sign In with Facebook"                                                                
      />
  );
};

export default LoginForm;