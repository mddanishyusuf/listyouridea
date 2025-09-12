import { Text } from '@geist-ui/core';
import Seo from './seo';
import { BookmarkLinear, BoxMinimalisticOutline, DoubleArrowRight, FireMinimalisticOutline, HomeSmileAngleOutline, Idea, NotificationUnreadLinear, UserLinear, UsersGroupRoundedOutline } from '@/lib/icons';
import firebase from '@/lib/firebase';
import { useAuth } from '@/contexts/authContext';
import Link from 'next/link';

const Layout = ({ children }) => {
    const { userObj } = useAuth();
    const loginWithTwitter = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();

        firebase
            .auth()
            .signInWithPopup(provider)
            .then((result) => {
                var credential = result.credential;

                // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
                // You can use these server side with your app's credentials to access the Twitter API.
                // var token = credential.accessToken;
                // var secret = credential.secret;

                // The signed-in user info.
                var user = result.user;
                console.log(user);
                // IdP data available in result.additionalUserInfo.profile.
                // ...
            })
            .catch((error) => {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
            });
    };

    return (
        <>
            <Seo />
            <div className="layout-container">
                <div className="header">
                    <div className="logo">
                        <Idea />
                        <h2>List your idea</h2>
                    </div>
                </div>
                <div className="feed-container">
                    <div className="feed-content">{children}</div>
                </div>
            </div>
        </>
    );
};

export default Layout;
