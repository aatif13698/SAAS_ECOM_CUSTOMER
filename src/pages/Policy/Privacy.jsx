import React, { useEffect, useState } from 'react';
import customerService from '../../services/customerService';
import Loading from '../../components/Loading/Loading';

function Privacy() {
    const [statement, setStatement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const type = 'Privacy';
        getStatement(type);
    }, []);

    async function getStatement(type) {
        try {
            const response = await customerService.getStatement(type);
            setStatement(response?.data?.data);
        } catch (error) {
            console.error('Error while getting the statement:', error);
            setError('Failed to load privacy statement. Please try again later.');
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div>
                <Loading />
            </div>)
    }

    if (error) {
        return <div>{error}</div>; // Error message
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Privacy Statement</h1>
            {statement ? (
                <>
                    <h2 className="text-xl font-semibold mb-2">{statement.title}</h2>
                    <div
                        className="prose prose-lg" // Optional: Use Tailwind's prose for better rich text styling
                        dangerouslySetInnerHTML={{ __html: statement.description }}
                    />
                </>
            ) : (
                <p>No privacy statement available.</p>
            )}
        </div>
    );
}

export default Privacy;