import { Text } from '@geist-ui/core';
import Seo from './seo';
import { BookmarkLinear, BoxMinimalisticOutline, DoubleArrowRight, FireMinimalisticOutline, HomeSmileAngleOutline, NotificationUnreadLinear, UserLinear, UsersGroupRoundedOutline } from '@/lib/icons';
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
                <div className="sidebar">
                    <div className="logo">
                        <img
                            src="/uxuifeed.png"
                            height={30}
                            width={30}
                            alt="UX UI feed"
                        />
                        <h2>List your idea</h2>
                    </div>

                    <div className="sidebar-nav">
                        <Link
                            href="/"
                            className="nav"
                        >
                            <HomeSmileAngleOutline />
                            <Text my={0}>Home</Text>
                        </Link>
                        <Link
                            href="/"
                            className="nav"
                        >
                            <NotificationUnreadLinear />
                            <Text my={0}>Notification</Text>
                        </Link>
                        <Link
                            href="/"
                            className="nav"
                        >
                            <FireMinimalisticOutline />
                            <Text my={0}>Trending</Text>
                        </Link>
                        <Link
                            href="/"
                            className="nav"
                        >
                            <BoxMinimalisticOutline />
                            <Text my={0}>Companies</Text>
                        </Link>
                        <Link
                            href="/"
                            className="nav"
                        >
                            <BookmarkLinear />
                            <Text my={0}>Bookmarks</Text>
                        </Link>
                        <Link
                            href="/"
                            className="nav"
                        >
                            <UserLinear />
                            <Text my={0}>Profile</Text>
                        </Link>
                    </div>
                    <Link href="/submit">
                        <button
                            className="button button--primary"
                            style={{ width: '100%' }}
                        >
                            <Text small>Post your idea</Text>
                            <DoubleArrowRight />
                        </button>
                    </Link>

                    <br />
                    <br />
                    {userObj ? (
                        <div className="user-button">
                            <img src={userObj?.photoURL} />
                            <div>
                                <Text small>{userObj?.name}</Text>
                                <br />
                                <Text
                                    small
                                    type="secondary"
                                >
                                    @{userObj?.username}
                                </Text>
                            </div>
                        </div>
                    ) : (
                        <button
                            className="button button--secondary"
                            style={{ width: '100%' }}
                            onClick={() => loginWithTwitter()}
                        >
                            <Text small>Login with twitter</Text>
                        </button>
                    )}
                </div>
                <div className="feed-container">{children}</div>
                <div className="left-sidebar">
                    <Text>Related</Text>
                </div>
            </div>
        </>
    );
};

export default Layout;
