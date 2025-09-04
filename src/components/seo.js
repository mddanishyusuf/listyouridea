import Head from 'next/head';
import { useRouter } from 'next/router';

const Seo = ({ title, description, banner = '' }) => {
    const router = useRouter();
    return (
        <>
            <Head>
                <title>{title}</title>
                <meta
                    name="description"
                    content={description}
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link
                    rel="icon"
                    href="/uxuifeed.png"
                />
                <meta
                    property="og:title"
                    content={title}
                />
                <meta
                    property="og:description"
                    content={description}
                />
                <meta
                    property="og:image"
                    content={banner}
                />
                <meta
                    property="og:site_name"
                    content="Iconbuddy"
                />
                <meta
                    property="og:url"
                    content={`https://iconbuddy.com${router.asPath}`}
                />
                <meta
                    property="og:type"
                    content="website"
                />

                <meta
                    name="twitter:card"
                    content="summary_large_image"
                />
                <meta
                    name="twitter:site"
                    content="@iconbuddy_app"
                />
                <meta
                    property="twitter:title"
                    content={title}
                />
                <meta
                    property="twitter:description"
                    content={description}
                />
                <meta
                    property="twitter:image"
                    content={banner}
                />

                <link
                    rel="canonical"
                    href={`https://iconbuddy.com${router.asPath}`}
                />
            </Head>
        </>
    );
};

export default Seo;
