import { GeistProvider, CssBaseline } from '@geist-ui/core';
import '@/styles/globals.scss';
import { AuthProvider } from '@/contexts/authContext';

const App = ({ Component, pageProps }) => {
    return (
        <GeistProvider>
            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>
        </GeistProvider>
    );
};

export default App;
