// Sidebar.jsx
import React from 'react';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul className="nav-buttons">
                <li>
                    <div className="tooltip-wrap">
                        <a
                            className="nav-link active"
                            href="/explore"
                            data-hover="false"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="28"
                                viewBox="0 0 28 28"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M6.841 21.4l9.659 2.587a2.75 2.75 0 003.368-1.945l3.236-12.074A2.75 2.75 0 0021.16 6.6L11.5 4.013a2.75 2.75 0 00-3.368 1.944L4.897 18.032A2.75 2.75 0 006.841 21.4zm4.604-13.461a.75.75 0 01.292.019l-.001.002L18.98 9.9a.749.749 0 01-.088 1.478.75.75 0 01-.299-.03l-7.245-1.94a.75.75 0 01.097-1.47zm-1.106 3.245a.75.75 0 01.557-.086l7.244 1.94a.75.75 0 01-.388 1.45l-7.245-1.942a.75.75 0 01-.168-1.362zm-.854 3.128a.75.75 0 00.181 1.374l4.83 1.294a.75.75 0 10.388-1.449l-4.83-1.294a.75.75 0 00-.569.075z"
                                    fill="#111"
                                />
                            </svg>
                        </a>
                    </div>
                </li>
                <li>
                    <div className="tooltip-wrap">
                        <button
                            className="nav-button"
                            data-style="light"
                            data-loading="false"
                        >
                            <div className="button-icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="28"
                                    height="28"
                                    viewBox="0 0 28 28"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M8.514 17.94C7.008 18.957 6.25 20.136 6.25 21c0 .224.11.508.469.843.36.335.916.668 1.651.96 1.467.583 3.495.947 5.63.947s4.163-.364 5.63-.947c.736-.292 1.292-.625 1.651-.96.358-.335.469-.619.469-.843 0-.863-.758-2.042-2.264-3.06-1.46-.989-3.44-1.69-5.486-1.69-2.047 0-4.027.701-5.486 1.69m-.841-1.243C9.359 15.556 11.628 14.75 14 14.75s4.641.806 6.327 1.947c1.64 1.11 2.923 2.68 2.923 4.303 0 .776-.4 1.43-.945 1.939-.543.508-1.284.925-2.121 1.258-1.679.667-3.901 1.053-6.184 1.053s-4.505-.386-6.184-1.053c-.837-.333-1.577-.75-2.121-1.258-.546-.51-.945-1.163-.945-1.939 0-1.622 1.283-3.194 2.923-4.303M13.75 4.75a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7m-5 3.5a5 5 0 1 1 10 0 5 5 0 0 1-10 0"
                                        fill="#555"
                                    />
                                </svg>
                            </div>
                        </button>
                    </div>
                </li>
                <li>
                    <div className="tooltip-wrap">
                        <button
                            className="nav-button"
                            data-style="light"
                            data-loading="false"
                        >
                            <div className="button-icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="28"
                                    height="28"
                                    viewBox="0 0 28 28"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M19.084 7.416a8.25 8.25 0 10-.555 12.174L21.94 23A.75.75 0 1023 21.94l-3.409-3.41a8.25 8.25 0 00-.506-11.114zM8.477 8.477a6.75 6.75 0 119.546 9.546 6.75 6.75 0 01-9.546-9.546z"
                                        fill="#555"
                                    />
                                </svg>
                            </div>
                        </button>
                    </div>
                </li>
                <li>
                    <div className="tooltip-wrap">
                        <button
                            className="nav-button"
                            data-style="light"
                            data-loading="false"
                        >
                            <div className="button-icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="28"
                                    height="28"
                                    viewBox="0 0 28 28"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M20.608 3.463c1.204-.794 2.798.126 2.711 1.565l-1.09 18.154c-.089 1.493-1.888 2.193-2.963 1.153l-5.667-5.48a.25.25 0 00-.105-.06l-7.58-2.168c-1.437-.412-1.73-2.32-.483-3.143l15.177-10.02zm1.214 1.476a.25.25 0 00-.387-.224L6.258 14.735a.25.25 0 00.069.45l7.58 2.168c.276.079.528.224.735.424l5.667 5.48a.25.25 0 00.423-.165l1.09-18.153z"
                                        fill="#555"
                                    />
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M20.19 7.317l-5.383 11.325-1.732-1L20.19 7.317z"
                                        fill="#555"
                                    />
                                </svg>
                            </div>
                        </button>
                    </div>
                </li>
                <li>
                    <div className="tooltip-wrap">
                        <button
                            className="nav-button"
                            data-style="light"
                            data-loading="false"
                        >
                            <div className="button-icon">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="28"
                                    height="28"
                                    viewBox="0 0 28 28"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M5.5 5.75A.75.75 0 016.25 5C15.5 5 23 12.5 23 21.75a.75.75 0 01-1.5 0c0-8.422-6.828-15.25-15.25-15.25a.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75C12.187 11 17 15.813 17 21.75a.75.75 0 01-1.5 0 9.25 9.25 0 00-9.25-9.25.75.75 0 01-.75-.75zm0 6a.75.75 0 01.75-.75A4.75 4.75 0 0111 21.75a.75.75 0 01-1.5 0 3.25 3.25 0 00-3.25-3.25.75.75 0 01-.75-.75z"
                                        fill="#555"
                                    />
                                </svg>
                            </div>
                        </button>
                    </div>
                </li>
                <li>
                    <div className="tooltip-wrap">
                        <a
                            className="nav-link"
                            href="/about"
                            data-hover="false"
                        >
                            <svg
                                width="28"
                                height="28"
                                viewBox="0 0 28 28"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M11.282 24.142c5.602 1.501 11.36-1.823 12.86-7.424s-1.823-11.36-7.424-12.86-11.36 1.823-12.86 7.424 1.823 11.36 7.424 12.86m3.342-1.161a9.01 9.01 0 0 0 7.845-5.935l-3.846-1.03c-.93 3.056-2.415 5.557-3.999 6.965M8.97 21.465a9.01 9.01 0 0 1-3.827-9.062l3.846 1.03c-.723 3.113-.686 6.021-.02 8.032m2.702 1.228c-.452-.12-1.177-.782-1.533-2.709-.302-1.638-.24-3.807.3-6.162l6.736 1.805c-.71 2.31-1.741 4.22-2.822 5.486-1.272 1.491-2.23 1.701-2.681 1.58m7.34-8.127 3.847 1.031a9.01 9.01 0 0 0-3.827-9.062c.667 2.011.703 4.919-.02 8.031m-2.682-9.26c.452.122 1.177.783 1.533 2.71.302 1.638.24 3.807-.3 6.162l-6.736-1.805c.71-2.31 1.74-4.219 2.822-5.486 1.271-1.491 2.23-1.701 2.681-1.58m-2.953-.287a9.01 9.01 0 0 0-7.846 5.935l3.847 1.03c.93-3.056 2.415-5.556 3.999-6.965m9.317 11.31-.017.065.034-.13z"
                                    fill="#555"
                                />
                            </svg>
                        </a>
                    </div>
                </li>
            </ul>

            <div className="profile-menu">
                <div className="posts-link">
                    <div className="tooltip-wrap">
                        <a
                            className="posts-button"
                            href="https://posts.cv"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-hover="false"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="28"
                                height="28"
                                viewBox="0 0 28 28"
                            >
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M11.68 22.696L6.84 21.399a2.75 2.75 0 01-1.944-3.368L8.132 5.957A2.75 2.75 0 0111.5 4.013L21.16 6.6a2.75 2.75 0 011.944 3.368l-1.944 7.253a5.25 5.25 0 01-2.446 3.188l-3.05 1.761a5.25 5.25 0 01-3.984.525zm-5.335-4.277a1.25 1.25 0 00.884 1.531l4.588 1.23.971-3.622a2.75 2.75 0 013.368-1.945l3.622.97 1.877-7.002a1.25 1.25 0 00-.884-1.531L11.11 5.46a1.25 1.25 0 00-1.53.884L6.345 18.42zm12.841-.441l-3.418-.916a1.25 1.25 0 00-1.531.884l-.916 3.418a3.75 3.75 0 001.592-.492l3.051-1.761a3.75 3.75 0 001.222-1.133z"
                                    fill="#555"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
