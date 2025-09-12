// src/pages/submit.js
import { useState } from 'react';
import Layout from '@/components/layout';
import SubmitForm from '@/components/submitForm';

export default function Submit() {
    return (
        <Layout>
            <div className="container">
                <main className="main-content">
                    <div className="hero-section">
                        <div className="hero-text">
                            <div className="hero-stats">
                                <p>50,000+ readers</p>
                                <span className="divider" />
                                <p>Backlink</p>
                                <span className="divider" />
                                <p>Weekly mentioned</p>
                            </div>

                            <h1 className="hero-title">Submit Your Idea — Featured Weekly to 50k+ Readers</h1>
                        </div>
                    </div>
                </main>
                <SubmitForm />
            </div>
        </Layout>
    );
}
